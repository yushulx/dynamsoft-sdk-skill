# Sample code index

Use this file before writing code. Prefer sample repositories and example folders over general docs whenever the user asks for runnable code.

## Dynamsoft sample hub

- Dynamsoft GitHub organization and sample hub: https://github.com/Dynamsoft

The Dynamsoft GitHub hub groups samples by use case, including document scanning, barcode reading, batch barcode scanning, and MRZ scanning. Use it to discover additional platform-specific repositories when the direct links below are not enough.

## DCV / Capture Vision samples

Use DCV samples for modern barcode, QR, MRZ, document detection, document normalization, and multi-capture workflows.

### JavaScript / TypeScript / Web

- Combined barcode + MRZ + document detection example: https://github.com/yushulx/javascript-barcode-qr-code-scanner/tree/main/examples/barcode_mrz_document
  - Use this first when the user asks for browser/web code that combines barcode, MRZ, and document detection.
  - Good source for DCV-style multi-result parsing and camera-based web workflow.
- Official/known JS barcode samples: https://github.com/Dynamsoft/barcode-reader-javascript-samples
  - Use for barcode/QR scanning examples and migration clues. Prefer DCV-style patterns for new code when available.
- MRZ scanner JavaScript sample: https://github.com/Dynamsoft/mrz-scanner-javascript
  - Use for browser MRZ scanning workflows.
- Document scanner JavaScript sample: https://github.com/Dynamsoft/document-scanner-javascript
  - Use for camera-based document detection/capture workflows, edge detection, and document capture UI.

### Python / server / desktop

- DCV Python examples: https://github.com/yushulx/python-barcode-qrcode-sdk/tree/main/examples/official/dcv
  - Use this first for Python DCV, server/desktop image decoding, barcode/QR, document/MRZ related Capture Vision workflows.
- Official/known Python barcode samples: https://github.com/Dynamsoft/barcode-reader-python-samples
  - Use for legacy DBR-style Python barcode decoding or migration reference.

### Mobile / cross-platform

- Barcode mobile samples: https://github.com/Dynamsoft/barcode-reader-mobile-samples
  - Use for Android/iOS barcode scanning, permission handling, camera lifecycle, and native result callbacks.
- For MRZ mobile samples, use the Dynamsoft GitHub hub and search `mrz`, `android`, `ios`, `flutter`, `react native`, or `maui` inside https://github.com/Dynamsoft.

## Dynamic Web TWAIN (DWT) samples

Use DWT samples when the user needs browser-based physical scanner acquisition.

- Web TWAIN samples: https://github.com/Dynamsoft/web-twain-samples
- Dynamic Web TWAIN package/repo: https://github.com/Dynamsoft/Dynamic-Web-TWAIN
- React advanced DWT sample: https://github.com/Dynamsoft/web-twain-react-advanced
- React advanced mode DWT sample: https://github.com/Dynamsoft/web-twain-react-advanced-mode
- Angular advanced DWT sample: https://github.com/Dynamsoft/web-twain-angular-advanced
- Angular CLI DWT sample: https://github.com/Dynamsoft/web-twain-angular-cli-application
- Vue advanced DWT sample: https://github.com/Dynamsoft/web-twain-vue-advanced
- DWT REST .NET sample: https://github.com/Dynamsoft/Dynamic-Web-TWAIN-REST-dotnet

## Dynamsoft Document Viewer (DDV) samples

Use DDV samples when the user asks for browser document viewer UI, page operations, image/PDF viewing, or annotation workflows.

- DDV sample repository: https://github.com/Dynamsoft/document-viewer-samples
- DDV docs: https://www.dynamsoft.com/document-viewer/docs/

If a specific framework sample is needed and not listed here, search the Dynamsoft GitHub organization for `document viewer`, `ddv`, `react`, `vue`, or `angular`.

## Choosing samples

- If the user asks for code, always include the closest sample link before or after the code.
- If the sample uses a different framework but the same SDK workflow, adapt the architecture while preserving SDK initialization, resource path, template, and result parsing patterns.
- If the sample appears legacy but the user wants new code, state that it is a migration/reference sample and prefer DCV concepts.
- For exact runnable code, match the user's SDK version. Without a version, avoid overly specific API names that may vary by major version.
