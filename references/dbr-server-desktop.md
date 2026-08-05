# DBR server/desktop redirect

Barcode and QR code decoding in server/desktop apps can use either **DCV** (`references/dcv.md`) or the lightweight **DBR** (`references/dbr.md`). Both share the same barcode engine and both use `CaptureVisionRouter` as the core entry point.

Use DCV when the user also needs MRZ or document detection. Use DBR when the user only needs barcode/QR reading and prefers a smaller dependency.

## No RTU on server/desktop

On server/desktop platforms (Python, C++, .NET, Java, Node.js), there are **no RTU (ready-to-use) wrappers** — `CaptureVisionRouter` is used directly. This is the DCV core API and it provides full programmatic control over the capture pipeline:

- `LicenseManager.init_license()` — license initialization
- `CaptureVisionRouter()` — create the router instance
- `router.capture(file_path, template_name)` — process an image with a preset template
- `result.get_decoded_barcodes_result().get_items()` — extract barcode results

The Python barcode scanning pattern in `references/dcv.md` applies equally to DBR — just change the import from `dynamsoft-capture-vision-bundle` to `dynamsoft-barcode-reader`.

For sample code, always check `references/samples.md` first.
