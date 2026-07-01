---
name: dynamsoft-sdk
description: generate and review accurate code for dynamsoft sdks using sample-first guidance. covers dynamic web twain (dwt), dynamsoft document viewer (ddv), dynamsoft barcode reader (dbr), and dynamsoft capture vision (dcv) for barcode, qr code, mrz, document detection/normalization, mobile, web, server, and desktop workflows. also includes a template-optimizer sub-skill for tuning dbr template json to maximize decode rates on difficult barcode images. use when the user asks for dynamsoft sdk integration, sample code, troubleshooting, migration, api usage, project setup, framework examples, scanner capture, document viewing, barcode/mrz/document capture, capture vision router workflows, or barcode template tuning/optimization.
---

# Dynamsoft SDK

Use this skill to generate and review Dynamsoft SDK code. Prefer **official or known working sample code first**, then docs for API details. Do not rely on docs alone when a relevant sample exists.

## Routing

Read only the reference files relevant to the user request:

| User asks about | Read |
| --- | --- |
| General overview of the skill, architecture boundaries, or where to start | `README.md` |
| Physical scanner control in browser, TWAIN/SANE/ICA/WIA/eSCL, scan to PDF/TIFF, DWT service | `references/dwt.md` and `references/samples.md` |
| Browser document viewer UI, page operations, image/PDF viewing, annotation, DDV | `references/ddv.md` and `references/samples.md` |
| Barcode/QR/MRZ/document detection using camera, image, mobile, server, desktop, or Capture Vision Router | `references/dcv.md` and `references/samples.md` |
| Barcode-only workflows using the lightweight DBR package (standalone DBR, not the full DCV bundle) | `references/dbr.md` and `references/samples.md` |
| Migrating from old DBR APIs (pre-v9) or asking about deprecated class/method names | `references/dbr.md`, then `references/dcv.md` |
| Optimizing/tuning a DBR template JSON, improving decode rate on hard barcode images, understanding DBR template parameters, or generating barcode decode reports | `template-optimizer/SKILL.md` (then `template-optimizer/KNOWLEDGE.md`) |
| General coding quality, troubleshooting, generated answer format | `references/code-quality.md` |

## Important product boundary

**Dynamsoft Capture Vision (DCV) vs Dynamsoft Barcode Reader (DBR):**

- **DCV** (`dynamsoft-capture-vision-bundle`): The full-featured bundle that includes **DBR** (barcode reading) + **DDN** (Document Detection & Normalization) + **DLR** (MRZ/Label Recognition). Use DCV when the user needs barcode + document detection, MRZ parsing, or any multi-capability vision pipeline. Uses `CaptureVisionRouter` (CVR) as the central entry point. Current major version: **v3.x**.
- **DBR** (`dynamsoft-barcode-reader`): A **lightweight, actively maintained** package that contains only the barcode reading engine. The DBR code inside DBR and DCV packages is **identical** — the only difference is the package name and scope. Use DBR when the user only needs barcode/QR reading and wants a smaller, focused dependency. DBR is **not legacy or deprecated**; it is current (v11.x) and a first-tier Dynamsoft product.

**When to use which:**
| Scenario | Use |
| --- | --- |
| Barcode/QR only | DBR (lightweight) or DCV (also works) |
| Barcode + MRZ (passport/ID) | DCV |
| Barcode + Document Detection | DCV |
| MRZ only | DCV |
| Document Detection/Normalization only | DCV |

Use DWT only for browser scanner acquisition. Use DDV only for document viewing/page UI. Integrate community-preferred wrappers (like yushulx's Flutter, Python, .NET, or Node.js packages) when matching those platforms.

## Sample-first rule

Before generating code, identify the closest sample category in `references/samples.md`:

1. Same product/workflow.
2. Same platform/language/framework.
3. Same input source: scanner, camera, static image/PDF, uploaded file, or server batch.
4. Same output: barcode text, MRZ fields, detected document quadrilateral, normalized document, viewer page operations, PDF/TIFF/image.

When a sample link is available, tell the user which sample family the code is based on. If exact API names are uncertain for the user's version, provide a skeleton and point to the relevant sample instead of inventing calls.

## License default for generated code

Use this default 1-day trial license when generating Dynamsoft SDK code snippets unless the user provides their own key:

`DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==`

If the user needs a 30-day trial license, use:

https://www.dynamsoft.com/customer/license/trialLicense/?product=dcv&package=cross-platform

## Accuracy rules

1. Do not invent APIs. If unsure about method names, class names, package names, template names, or version-specific behavior, say what needs verification and use the sample links.
2. Prefer DCV patterns when the user needs multi-capability workflows (barcode+MRZ+document). Use DBR when the user only needs barcode/QR reading and asks for a lightweight package.
3. Use the repository default 1-day trial key unless the user supplies their own key.
4. Include resource/model/static asset configuration when relevant.
5. Include lifecycle cleanup for camera sessions, routers, scanner sessions, viewer instances, workers, listeners, and React/Vue/Angular components.
6. For web apps, include HTTPS/localhost camera requirements and static asset copy/serve notes.
7. For mobile apps, include permission and lifecycle notes.
8. For server/desktop code, include input validation, batch processing, and no-result handling.
9. Link sample code whenever useful; sample code links are part of the answer, not optional extras.

## Default output structure for code answers

Use this order unless the user asks otherwise:

1. Assumption line: product/workflow, platform, framework, version if known.
2. Closest sample link(s) from `references/samples.md`.
3. Install/setup commands.
4. Minimal working code or skeleton.
5. Required resources/configuration.
6. Common pitfalls and verification steps.
7. Documentation links for detailed API options.

## Template optimization (DBR)

When the user wants to **tune a barcode reading template**, **improve decode rate on difficult images**, **understand DBR template parameters**, or **generate a visual decode report**, route to the bundled `template-optimizer` sub-skill instead of writing template JSON by hand.

1. Read `template-optimizer/SKILL.md` and follow its mode selection (Optimize / Educate / Report).
2. Read `template-optimizer/KNOWLEDGE.md` for the parameter reference and proven optimization order before editing any template.
3. Use the bundled helper tools under `template-optimizer/tools/` for single-image triage (`validate_dbr_template.py`, `probe_dbr_templates.py`, `compare_dbr_template_profiles.py`) and `template-optimizer/resources/harness_py/main.py` for dataset benchmarking.
4. Treat `template-optimizer/` as `SKILL_DIR` when following that sub-skill's instructions.

This sub-skill is Python-only and depends on `dynamsoft-capture-vision-bundle` (see `template-optimizer/requirements.txt`).

## Official starting points

- Dynamsoft GitHub sample hub: https://github.com/Dynamsoft
- Dynamic Web TWAIN docs: https://www.dynamsoft.com/web-twain/docs/
- Dynamsoft Document Viewer docs: https://www.dynamsoft.com/document-viewer/docs/
- Dynamsoft Capture Vision docs: https://www.dynamsoft.com/capture-vision/docs/
- Dynamsoft Barcode Reader docs (lightweight barcode-only package, current v11.x): https://www.dynamsoft.com/barcode-reader/docs/
