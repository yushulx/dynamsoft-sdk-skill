# Code quality and troubleshooting rules

## Before writing code

Confirm or infer these fields:

- Product: DWT, DDV, DBR, or DCV
- Platform: web, mobile, server, desktop, or hybrid
- Language/framework: JavaScript, TypeScript, React, Vue, Angular, Android/Kotlin, iOS/Swift, Flutter, React Native, C#, Python, Java, C++, Node.js
- SDK version if provided
- Input source: scanner, camera, image file, PDF, video stream, remote URL, or buffer
- Output: barcode text, scanned image, PDF/TIFF, viewer UI, annotations, parsed result, or uploaded file

## Do not hallucinate

When uncertain, prefer one of these safe patterns:

- Provide a minimal skeleton with placeholders and say which API name should be verified in official docs.
- Link the official docs/sample repository and explain how to adapt it.
- State that exact method names can differ by major SDK version.

## Code answer checklist

For SDK setup code, include:

- License key placeholder, never invent a real key.
- Resource path or model path configuration when needed.
- Async initialization and error handling.
- Cleanup/dispose/destroy behavior for UI components, camera sessions, scanner sessions, router instances, and listeners.
- Browser permission notes for camera/scanner workflows.
- Local HTTPS requirement if browser camera APIs are involved.
- Static asset copy instructions for wasm, worker, model, resources, or service files when relevant.

## Troubleshooting checklist

Use this order when debugging:

1. Check product and major version mismatch.
2. Check package installation and imported symbol names.
3. Check license initialization.
4. Check static resource/model path.
5. Check browser console/network errors for missing wasm/worker/model files.
6. Check permissions: camera, scanner service, file access, network, mobile runtime permissions.
7. Check lifecycle: duplicate init, missing dispose, unmounted React component, repeated camera open.
8. Check input quality: blur, low contrast, rotation, tiny barcode, glare, unsupported symbology.
9. Check deployment path: CDN vs local resource path, public base URL, reverse proxy, CORS.

## Output style

- Prefer minimal working examples over long explanations.
- Clearly separate install commands, code, and notes.
- Avoid mixing product APIs unless the user asks for a multi-SDK workflow.
- For React, use `useEffect`, `useRef`, cleanup function, and avoid global mutable state unless necessary.
- For TypeScript, annotate key SDK objects as `any` only when exact types are uncertain.
- For production, suggest moving license keys/configuration to environment variables or secure config where appropriate.
