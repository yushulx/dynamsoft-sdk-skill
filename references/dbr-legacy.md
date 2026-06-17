# Legacy DBR guidance

Use this file only when the user explicitly asks for legacy Dynamsoft Barcode Reader APIs, older DBR-only samples, or migration from DBR to DCV.

Modern guidance: barcode and QR code workflows should normally be routed to `references/dcv.md`.

## Legacy/sample links

- DBR docs: https://www.dynamsoft.com/barcode-reader/docs/
- JavaScript barcode samples: https://github.com/Dynamsoft/barcode-reader-javascript-samples
- Python barcode samples: https://github.com/Dynamsoft/barcode-reader-python-samples
- Mobile barcode samples: https://github.com/Dynamsoft/barcode-reader-mobile-samples
- Dynamsoft GitHub sample hub: https://github.com/Dynamsoft

## Migration behavior

When helping with legacy DBR code:

1. Identify the user's current DBR version and platform if possible.
2. Do not silently rewrite to DCV if they need to maintain existing legacy code.
3. If the user asks for new development, recommend DCV and explain that barcode is now part of the broader Capture Vision workflow.
4. When converting legacy DBR code to DCV, preserve input/output behavior, barcode format settings, region-of-interest settings, and batch-processing behavior.

## Safe code-generation guidance

Legacy DBR APIs differ across major versions. If the version is unknown, use sample links and migration notes rather than inventing exact class/method names.
