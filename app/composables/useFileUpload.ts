import { useDropZone, useFileDialog } from '@vueuse/core'
import { toast } from 'vue-sonner'

interface BlobResult {
  pathname: string
  url?: string
  contentType?: string
  size: number
}

function createObjectUrl(file: File): string {
  return URL.createObjectURL(file)
}

async function uploadFile(url: string, file: File, method: 'PUT' | 'POST' = 'PUT'): Promise<BlobResult> {
  const formData = new FormData()
  formData.append('files', file)

  return await $fetch<BlobResult>(url, {
    method,
    body: formData
  })
}

export function useFileUploadWithStatus(chatId: string) {
  const files = ref<FileWithStatus[]>([])
  const { loggedIn } = useUserSession()

  async function uploadFiles(newFiles: File[]) {
    if (!loggedIn.value) {
      return
    }

    const filesWithStatus: FileWithStatus[] = newFiles.map(file => ({
      file,
      id: crypto.randomUUID(),
      previewUrl: createObjectUrl(file),
      status: 'uploading' as const
    }))

    files.value = [...files.value, ...filesWithStatus]

    const uploadPromises = filesWithStatus.map(async (fileWithStatus) => {
      const index = files.value.findIndex(f => f.id === fileWithStatus.id)
      if (index === -1) return

      try {
        const result = await uploadFile(`/api/upload/${chatId}`, fileWithStatus.file)

        if (!result) {
          throw new Error('Upload failed')
        }

        files.value[index] = {
          ...files.value[index]!,
          status: 'uploaded',
          uploadedUrl: result.url,
          uploadedPathname: result.pathname
        }
      } catch (error) {
        const errorMessage = (error as { data?: { message?: string } }).data?.message
          || (error as Error).message
          || 'Upload failed'
        toast.error('Upload failed', {
          description: errorMessage
        })
        files.value[index] = {
          ...files.value[index]!,
          status: 'error',
          error: errorMessage
        }
      }
    })

    await Promise.allSettled(uploadPromises)
  }

  const dropzoneRef = ref<HTMLElement>()
  const { isOverDropZone: isDragging } = useDropZone(dropzoneRef, {
    onDrop: (droppedFiles) => {
      if (droppedFiles) {
        uploadFiles(Array.from(droppedFiles))
      }
    }
  })

  const { open, onChange } = useFileDialog({
    accept: FILE_UPLOAD_CONFIG.acceptPattern,
    multiple: true
  })

  onChange((fileList) => {
    if (fileList) {
      uploadFiles(Array.from(fileList))
    }
  })

  const isUploading = computed(() =>
    files.value.some(f => f.status === 'uploading')
  )

  const uploadedFiles = computed(() =>
    files.value
      .filter(f => f.status === 'uploaded' && f.uploadedUrl)
      .map(f => ({
        type: 'file' as const,
        mediaType: f.file.type,
        url: f.uploadedUrl!
      }))
  )

  function removeFile(id: string) {
    const file = files.value.find(f => f.id === id)
    if (!file) return

    URL.revokeObjectURL(file.previewUrl)
    files.value = files.value.filter(f => f.id !== id)

    if (file.status === 'uploaded' && file.uploadedPathname) {
      fetch(`/api/upload/${file.uploadedPathname}`, {
        method: 'DELETE'
      }).catch((error) => {
        console.error('Failed to delete file from blob:', error)
      })
    }
  }

  function clearFiles() {
    if (files.value.length === 0) return
    files.value.forEach(fileWithStatus => URL.revokeObjectURL(fileWithStatus.previewUrl))
    files.value = []
  }

  onUnmounted(() => {
    clearFiles()
  })

  return {
    dropzoneRef,
    isDragging,
    open,
    files,
    isUploading,
    uploadedFiles,
    addFiles: uploadFiles,
    removeFile,
    clearFiles
  }
}
