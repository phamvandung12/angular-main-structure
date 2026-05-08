# Security

## Block CSRF attack

- Decrease login session time, depend on the app
- Server side have a private key
- Client request login
- Server generate a random (called "nouce")
- Server encrypt { nouce + user-id + timestamp} and format as Token (base64)
- Server return Token to Client
- Client stored and may try to hidden token
- When Client call a request, the app get Token and send in header
- Server decrypt token, check timestamp has not expired

## Encrypt Data transfer
