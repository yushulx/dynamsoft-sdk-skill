# DBR server/desktop redirect

Barcode and QR code decoding in server/desktop apps can use either **DCV** (`references/dcv.md`) or the lightweight **DBR** (`references/dbr.md`). Both share the same barcode engine.

Use DCV when the user also needs MRZ or document detection. Use DBR when the user only needs barcode/QR reading and prefers a smaller dependency.

For sample code, always check `references/samples.md` first.
