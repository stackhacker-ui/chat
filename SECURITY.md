# Security Policy

## Supported Versions

We currently provide security updates for the latest code on the `main` branch.
Tagged releases are not managed yet, so please use the latest commit on `main`
for the most up-to-date fixes.

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| older   | :x:                |

## Reporting a Vulnerability

Please report vulnerabilities privately via GitHub Security Advisories:

- Go to: `https://github.com/stackhacker-ui/chat/security/advisories/new`
- Include reproduction steps, impact, and affected files/routes if known
- Do not open public issues for suspected vulnerabilities

Response targets:

- Initial triage response: within 72 hours
- Status update cadence: at least once every 7 days until resolution
- If accepted, we will prepare and ship a fix, then coordinate disclosure
- If declined, we will share a short rationale

Dependency security posture:

- We use Dependabot alerts and regular dependency updates
- We validate fixes with `pnpm audit`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`
