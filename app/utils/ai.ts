import type { UIMessage } from 'ai'

export function getTextFromMessage(message: UIMessage): string {
  return message.parts.filter(p => p.type === 'text').map(p => p.text).join('')
}
