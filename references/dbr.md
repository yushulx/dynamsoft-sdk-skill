# Dynamsoft Barcode Reader (DBR)

Dynamsoft Barcode Reader (DBR) is a **lightweight, actively maintained** barcode-reading SDK. It is **not legacy or deprecated** — it is a first-tier Dynamsoft product at v11.x.

## DBR is a submodule of DCV

DBR is a **submodule of Dynamsoft Capture Vision (DCV)**. The standalone DBR package contains the same barcode engine that runs inside the DCV bundle — the only difference is scope:

| Package | NPM/Pip package | Contains | Use case |
| --- | --- | --- | --- |
| **DBR** | `dynamsoft-barcode-reader` | Barcode/QR reading only (excludes DDN and DLR) | Barcode-only projects, smaller footprint |
| **DCV** | `dynamsoft-capture-vision-bundle` | DBR + DDN (Document Detection/Normalization) + DLR (MRZ/Label Recognition) | Multi-capability vision pipelines |

Both packages use the same `CaptureVisionRouter` core API for barcode reading. Code written for DCV barcode reading works identically with the DBR package (just change the import/package name).

## When to use DBR

Use DBR when:
- The user only needs barcode/QR code reading
- The user wants a smaller dependency / faster download
- The user explicitly asks for Dynamsoft Barcode Reader or DBR
- The user has an existing DBR project

Use DCV when:
- The user needs MRZ (passport) parsing
- The user needs document detection/normalization
- The user needs multiple capture capabilities combined

## DBR uses CaptureVisionRouter — not RTU wrappers

**Critical**: DBR uses `CaptureVisionRouter` as its core entry point, the same as DCV. Do **not** use the RTU (ready-to-use) wrapper components (`BarcodeScanner.createInstance()`, `BarcodeReader.createInstance()`) as the primary API — these are high-level wrappers built on top of the DCV core APIs and have **poor programmability and flexibility**. They are only suitable for very simple use cases (quick prototypes or demos).

| Approach | Entry Point | Programmability | When to Use |
| --- | --- | --- | --- |
| **DCV/DBR core API (recommended)** | `CaptureVisionRouter` + `CameraEnhancer` + `CameraView` + `CapturedResultReceiver` | Full control over pipeline, templates, ROI, multi-task, result handling | Any production, complex, or customized scenario |
| **RTU wrapper (limited)** | `BarcodeScanner.createInstance()` / `BarcodeReader.createInstance()` | Minimal — preset UI and pipeline, little customization | Quick prototypes or demos only |

For the full DCV core API patterns (web HTML, React, Python, Flutter), see `references/dcv.md`. The code patterns there apply equally to DBR — just change the package import from `dynamsoft-capture-vision-bundle` to `dynamsoft-barcode-reader` (where applicable on web/mobile).

## Web (JavaScript / TypeScript)

```bash
npm install dynamsoft-barcode-reader
```

The web DBR package exposes `CaptureVisionRouter`, `CameraEnhancer`, `CameraView`, and `LicenseManager` — the same core classes as the DCV bundle. Use the same patterns documented in `references/dcv.md` (HTML+CDN scanner, React hooks, etc.). Just import from `dynamsoft-barcode-reader` instead of `dynamsoft-capture-vision-bundle`.

> **Do not default to `BarcodeScanner.createInstance()` or `BarcodeReader.createInstance()`** — these are RTU wrappers with limited customization. Use `CaptureVisionRouter` directly for any production code.

Refer to official samples for the latest DBR web patterns:
- DBR JavaScript samples: https://github.com/Dynamsoft/barcode-reader-javascript-samples
- DBR docs: https://www.dynamsoft.com/barcode-reader/docs/

## Server / Desktop (Python, C++, .NET, Java, Node.js)

```bash
pip install dynamsoft-barcode-reader  # Python example
```

On server/desktop platforms, there are **no RTU wrappers** — `CaptureVisionRouter` is used directly. The Python DBR package provides `CaptureVisionRouter.capture()` with the same API as the DCV bundle. See `references/dcv.md` for the Python barcode scanning pattern.

- Python samples: https://github.com/Dynamsoft/barcode-reader-python-samples
- DBR docs (server): https://www.dynamsoft.com/barcode-reader/docs/server/

## Mobile (Android, iOS, Flutter, React Native)

DBR mobile SDKs provide camera-based and image-based barcode scanning for native and cross-platform apps. On mobile, prefer the DCV core API (`CaptureVisionRouter` + `CameraEnhancer` + `CameraView`) over RTU components. Community wrappers like `flutter_barcode_sdk` (by yushulx) wrap the core API for Flutter.

- Mobile samples: https://github.com/Dynamsoft/barcode-reader-mobile-samples
- DBR docs (mobile): https://www.dynamsoft.com/barcode-reader/docs/mobile/

## Migration: RTU to DCV Core API

If the user has an existing project using RTU wrappers (`BarcodeScanner`, `BarcodeReader`) and wants more control or needs to handle complex scenarios:

1. Replace `BarcodeScanner.createInstance()` / `BarcodeReader.createInstance()` with `CaptureVisionRouter.createInstance()`.
2. Add `CameraEnhancer` + `CameraView` for camera input (these were previously hidden inside the RTU wrapper).
3. Use `router.addResultReceiver({ onDecodedBarcodesReceived: ... })` for result callbacks.
4. Use preset template strings (e.g., `"ReadBarcodes_Default"`) with `router.startCapturing()` or `router.capture()`.
5. The barcode decoding behavior is preserved — only the API entry point changes from a limited wrapper to the full core API.

For the full DCV core API patterns, see `references/dcv.md`.

## Legacy / old DBR APIs

If the user asks about pre-v9 DBR APIs, deprecated class names, or old method signatures:
- Point them to the sample links above and the official DBR docs.
- Do not invent old API names; use the official docs or samples as the source of truth.
- Recommend upgrading to the current DBR v11.x or migrating to DCV for new development.

## Template tuning / optimization

When the user wants to **improve the decode rate** on hard barcode images, **tune a DBR template JSON**, **understand template parameters** (DeblurModes, LocalizationModes, GrayscaleEnhancementModes, etc.), or **generate a visual decode report**, use the bundled `template-optimizer/` sub-skill rather than hand-editing template JSON.

- Start with `template-optimizer/SKILL.md` and pick a mode: Optimize, Educate, or Report.
- Read `template-optimizer/KNOWLEDGE.md` for the parameter reference and proven optimization order.
- Use `template-optimizer/tools/` scripts for single-image triage and `template-optimizer/resources/harness_py/main.py` for dataset benchmarking.

This sub-skill is Python-only and depends on `dynamsoft-capture-vision-bundle`.
