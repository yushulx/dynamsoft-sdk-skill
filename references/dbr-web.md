# DBR web redirect

Barcode and QR code scanning in web apps can use either **DCV** (`references/dcv.md`) or the lightweight **DBR** (`references/dbr.md`). Both share the same barcode engine and both use `CaptureVisionRouter` as the core entry point.

Use DCV when the user also needs MRZ or document detection. Use DBR when the user only needs barcode/QR reading and prefers a smaller dependency.

## RTU vs DCV core API on web

**Do not use RTU (ready-to-use) wrappers** (`BarcodeScanner.createInstance()`, `BarcodeReader.createInstance()`) for production code. These are high-level wrappers with **poor programmability and flexibility** — they bundle a preset UI and pipeline that cannot be customized for complex scenarios.

Instead, always use the DCV core API directly:
- `CaptureVisionRouter` — central orchestrator
- `CameraEnhancer` + `CameraView` — camera input and UI
- `CapturedResultReceiver` — async result callbacks
- Preset template strings (e.g., `"ReadBarcodes_Default"`) — pipeline configuration

The full web patterns (HTML+CDN, React hooks, TypeScript) are in `references/dcv.md`. They apply equally to DBR — just change the import from `dynamsoft-capture-vision-bundle` to `dynamsoft-barcode-reader-bundle`.

For sample code, always check `references/samples.md` first.
