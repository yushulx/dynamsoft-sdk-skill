# Code quality and troubleshooting rules

## Before writing code

Confirm or infer these fields:

- Product: DWT, DDV, DBR, or DCV (see `references/dbr.md` for DBR vs DCV distinction)
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

- License initialization with the repository default 1-day trial key unless the user provides their own key.
- Resource path or model path configuration when needed.
- Async initialization and error handling.
- Cleanup/dispose/destroy behavior for UI components, camera sessions, scanner sessions, router instances, and listeners.
- Browser permission notes for camera/scanner workflows.
- Local HTTPS requirement if browser camera APIs are involved.
- Static asset copy instructions for wasm, worker, model, resources, or service files when relevant.

Default trial key:

`DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==`

30-day trial application:

https://www.dynamsoft.com/customer/license/trialLicense/?product=dcv&package=cross-platform

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

## Known error: `Uncaught SyntaxError: Unexpected token '<'` (web)

Symptom: A Dynamsoft web SDK (DCV/DBR/DDV) throws `Uncaught SyntaxError: Unexpected token '<'` — often when `LicenseManager.initLicense()` runs or when `router.capture()` first loads an engine, even though installation and license look correct.

Cause: The app uses a bundler (Vite, webpack, Rollup, Next.js, etc.). Bundlers prevent the SDK from inferring its own script URL, so the SDK requests `.wasm`/worker assets from the app's own origin. The dev/prod server answers those requests with the SPA `index.html`, and the leading `<` of that HTML is what the JS engine chokes on.

Fix: Set the engine resource path explicitly **before** initializing the license:

- DCV/DBR bundle: `CoreModule.engineResourcePaths.rootDirectory = "https://cdn.jsdelivr.net/npm/";` — the property is `rootDirectory` (NOT `root`), and the value is the npm CDN root (the SDK appends `<package>@<version>/dist/` itself).
- DDV: `Dynamsoft.DDV.Core.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-document-viewer@<version>/dist/engine";` before `Core.init()`.
- Alternatively self-host the SDK's `dist` assets and point the path at that local URL.

Plain `<script>`-tag usage (no bundler) auto-detects the path and usually does not need this. Verified against `dynamsoft-capture-vision-bundle` v3.4.x. See `references/dcv.md` and `references/ddv.md`.

## Known error: DWT `OnPostAllTransfers` event never fires (instance vs global registration)

Symptom: `OnPostAllTransfers` (or other transfer events like `OnPostTransfer`) is registered via `Dynamsoft.DWT.RegisterEvent("OnPostAllTransfers", ...)` but never fires after scanning completes. No images are rendered even though `AcquireImageAsync` succeeds.

Cause: DWT has two event registration APIs with different scopes:

| API | Scope | Valid events |
|---|---|---|
| `Dynamsoft.DWT.RegisterEvent(name, cb)` | **Global** — fires for any WebTwain instance | `OnWebTwainReady` only |
| `DWTObject.RegisterEvent(name, cb)` | **Instance** — fires only for that specific WebTwain instance | `OnPostAllTransfers`, `OnPostTransfer`, `OnPostLoad`, `OnGetFilePath`, etc. |

Using the global API for instance events silently fails — the callback is never invoked.

Fix:
- Always register transfer/buffer events on the `DWTObject` instance **after** it is obtained inside `OnWebTwainReady`:

```javascript
Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", function () {
  DWTObject = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer');
  DWTObject.RegisterEvent("OnPostAllTransfers", function () {
    // now this fires after each scan
  });
});
```

- As a belt-and-suspenders pattern, also call the image rendering logic inside the `.then()` of `AcquireImageAsync()`, since that promise resolves when acquisition finishes and does not depend on any event registration:

```javascript
DWTObject.AcquireImageAsync({ ... }).then(function () {
  renderImages(); // fallback in case event timing varies
});
```

## Output style

- Prefer minimal working examples over long explanations.
- Clearly separate install commands, code, and notes.
- Avoid mixing product APIs unless the user asks for a multi-SDK workflow.
- For React, use `useEffect`, `useRef`, cleanup function, and avoid global mutable state unless necessary.
- For TypeScript, annotate key SDK objects as `any` only when exact types are uncertain.
- For production, suggest moving license keys/configuration to environment variables or secure config where appropriate.
