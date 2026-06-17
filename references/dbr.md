# Dynamsoft Barcode Reader (DBR)

Dynamsoft Barcode Reader (DBR) is a **lightweight, actively maintained** barcode-reading SDK. It is **not legacy or deprecated** — it is a first-tier Dynamsoft product at v11.x.

## DBR vs DCV: Key distinction

DBR and DCV share the **same barcode reading engine**. The difference is scope:

| Package | NPM/Pip package | Contains | Use case |
| --- | --- | --- | --- |
| **DBR** | `dynamsoft-barcode-reader` | Barcode/QR reading only | Barcode-only projects, smaller footprint |
| **DCV** | `dynamsoft-capture-vision-bundle` | DBR + DDN (Document Detection/Normalization) + DLR (MRZ/Label Recognition) | Multi-capability vision pipelines |

Both packages use the same DBR APIs for barcode reading. Code written for DBR barcode reading works identically in DCV.

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

## Web (JavaScript / TypeScript)

```bash
npm install dynamsoft-barcode-reader
```

DBR web usage uses `BarcodeReader.createInstance()` or `BarcodeScanner.createInstance()` as the entry point, without `CaptureVisionRouter`. The core barcode decoding APIs (`decodeFile`, `decodeBitmap`, etc.) are available on `BarcodeReader` instances.

Refer to official samples for the latest DBR web patterns:
- DBR JavaScript samples: https://github.com/Dynamsoft/barcode-reader-javascript-samples
- DBR docs: https://www.dynamsoft.com/barcode-reader/docs/

## Server / Desktop (Python, C++, .NET, Java, Node.js)

```bash
pip install dynamsoft-barcode-reader  # Python example
```

DBR server/desktop packages provide direct barcode decoding APIs without the CaptureVisionRouter layer. The APIs are version-specific; always cross-reference with official samples.

- Python samples: https://github.com/Dynamsoft/barcode-reader-python-samples
- DBR docs (server): https://www.dynamsoft.com/barcode-reader/docs/server/

## Mobile (Android, iOS, Flutter, React Native)

DBR mobile SDKs provide camera-based and image-based barcode scanning for native and cross-platform apps.

- Mobile samples: https://github.com/Dynamsoft/barcode-reader-mobile-samples
- DBR docs (mobile): https://www.dynamsoft.com/barcode-reader/docs/mobile/

## Migration: DBR to DCV

When the user has an existing DBR-only project but wants to add MRZ or document detection capabilities:

1. Switch the package from `dynamsoft-barcode-reader` to `dynamsoft-capture-vision-bundle`.
2. Replace `BarcodeReader`/`BarcodeScanner` usage with `CaptureVisionRouter` + preset templates.
3. The barcode decoding behavior is preserved; only the API entry point changes.
4. For exact API mapping, consult `references/dcv.md` and official DCV docs.

## Legacy / old DBR APIs

If the user asks about pre-v9 DBR APIs, deprecated class names, or old method signatures:
- Point them to the sample links above and the official DBR docs.
- Do not invent old API names; use the official docs or samples as the source of truth.
- Recommend upgrading to the current DBR v11.x or migrating to DCV for new development.
