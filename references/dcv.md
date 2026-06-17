# Dynamsoft Capture Vision (DCV)

Use DCV as the default architecture for barcode, QR code, MRZ, document detection, document normalization, and multi-module capture workflows. Modern DBR-style barcode reading should usually be explained as a DCV/Capture Vision workflow unless the user explicitly asks for legacy DBR.

Official docs: https://www.dynamsoft.com/capture-vision/docs/
Primary sample index: `references/samples.md`

## First sample choices

- Web combined barcode + MRZ + document detection: https://github.com/yushulx/javascript-barcode-qr-code-scanner/tree/main/examples/barcode_mrz_document
- Python DCV official examples: https://github.com/yushulx/python-barcode-qrcode-sdk/tree/main/examples/official/dcv
- Dynamsoft GitHub sample hub: https://github.com/Dynamsoft

Use these before writing code when the request is about barcode, MRZ, or document detection.

## Product boundary

- Use DCV when the user mentions barcode, QR, MRZ, document detection, document normalization, Capture Vision Router, templates, camera/image capture, or multi-result capture pipelines.
- Use DWT only when the user needs physical scanner acquisition in a browser.
- Use DDV only when the user needs a document viewer/page UI.
- Use legacy DBR references only when the user explicitly asks for an older DBR API or an existing DBR-only project.

## Core concepts

- License initialization.
- Engine/resource/model/wasm/worker path configuration.
- Capture Vision Router or current platform equivalent.
- Templates or preset names.
- Input source: image file, camera frame, video stream, scanner output, PDF/image buffer, server file path.
- Result types: barcode/QR, MRZ, detected document bounds, normalized document image, text zones, parsed document fields.

## Web guidance

Use the JS combined example as the main architectural reference for browser workflows:

- Camera access requires HTTPS or localhost.
- Static assets/models/workers/wasm must be served from the configured path.
- Initialize license and runtime resources before opening camera or decoding.
- Separate camera/view state from result parsing state.
- For React, initialize in `useEffect`, store SDK objects in `useRef`, guard duplicate initialization in strict mode, and dispose on unmount.
- Parse results by type. Do not assume the workflow returns only barcodes.

## Python / server / desktop guidance

Use the Python DCV examples as the primary reference for server/desktop workflows:

- Validate file paths and supported extensions before decoding.
- Reuse router/engine instances for batches when supported.
- Configure templates explicitly for consistent barcode/MRZ/document results.
- Return or log no-result cases distinctly from errors.
- Include result count, confidence/format/text/coordinates when available.

## Mobile guidance

- Include camera permission declarations and runtime permission requests.
- Respect activity/view-controller/screen lifecycle.
- Stop camera and release router/session when leaving the screen.
- Use the Dynamsoft mobile samples and sample hub for exact native APIs.

## Common pitfalls

- Treating modern barcode reading as isolated DBR when the sample/API is DCV based.
- Mixing legacy DBR-only APIs with DCV router APIs without migration notes.
- Missing wasm/worker/model/resource files after deployment.
- Using a template name that is not bundled, copied, or loaded.
- Parsing only barcode results when the workflow returns MRZ or document results too.
- Not checking per-item error/result status.
- Forgetting cleanup for camera and router/session objects.

## Safe code-generation guidance

DCV APIs are version- and platform-specific. If the target version is unknown, provide a router-based skeleton with placeholders and link to the closest sample. Generate exact runnable code only when the platform/version is clear or when adapting directly from a known sample.
