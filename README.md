# Dynamsoft SDK Skill

[![skills.sh](https://skills.sh/b/yushulx/dynamsoft-sdk-skill)](https://skills.sh/yushulx/dynamsoft-sdk-skill)

An expert-grade AI Agent Skill for generating and reviewing accurate, high-performance code for Dynamsoft SDKs. This skill is optimized to use a **sample-first, modern-architecture workflow**, drawing on official and community samples from `yushulx` and `dynamsoft` to eliminate hallucinations and outdated API usage.

## Purpose

Dynamsoft SDKs (Capture Vision, Barcode Reader, Web TWAIN, Document Viewer) undergo rapid evolution. This skill ensures that AI assistants generate up-to-date, version-safe code, specifically focusing on the unified **Dynamsoft Capture Vision (DCV)** framework and the lightweight **Dynamsoft Barcode Reader (DBR)** package for barcode-only workflows.

## Trial License for Generated Code

When this skill generates Dynamsoft SDK code, it always uses the user's own license key when provided. No license key is hardcoded in this repository.

For a trial license, apply here:

https://www.dynamsoft.com/customer/license/trialLicense/?product=dcv&package=cross-platform

## Folder Structure

The repository is structured as a modular knowledge base for easy indexing and routing:

```text
dynamsoft-sdk-skill/
├── SKILL.md                 # Main agent routing and behavior mandates
├── README.md                # Skill overview and developer guide
├── references/
│   ├── samples.md           # Unified index of official and yushulx sample repos
│   ├── dcv.md               # Unified Capture Vision (Barcode, QR, MRZ, Doc Detection)
│   ├── dbr.md               # Lightweight DBR package (barcode-only, not legacy)
│   ├── dwt.md               # Dynamic Web TWAIN (Browser scanner acquisition)
│   ├── ddv.md               # Dynamsoft Document Viewer (Web viewing & page UI)
│   ├── code-quality.md      # Code quality rules & validation checklist
│   ├── migration.md         # ZXing / ML Kit / Scandit → Dynamsoft migration playbooks
│   ├── dbr-web.md           # DBR web-specific redirect
│   ├── dbr-mobile.md        # DBR mobile-specific redirect
│   └── dbr-server-desktop.md # DBR server/desktop-specific redirect
└── template-optimizer/      # DBR template tuning sub-skill (Python-only)
    ├── SKILL.md             # Optimize / Educate / Report workflow
    ├── PROMPT.md            # Portable copyable prompt for any coding agent
    ├── KNOWLEDGE.md         # DBR template parameter knowledge base
    ├── requirements.txt     # Python dependencies (capture-vision-bundle)
    ├── tools/               # Single-image triage & validation scripts
    ├── resources/           # Batch harness + HTML report template
    └── templates/           # Example template + version-specific parameter refs
```

## Supported Product Boundaries

To build apps conveniently and avoid architectural confusion, developers and AI agents must follow these product boundaries:

*   **Dynamic Web TWAIN (DWT)**: Used **strictly** for physical document scanning (TWAIN/SANE/ICA/WIA/eSCL) inside browser environments.
*   **Dynamsoft Document Viewer (DDV)**: Used for browser-based document viewing, PDF rendering, annotations, and page manipulation.
*   **Dynamsoft Capture Vision (DCV)**: The full unified architecture for camera/video capture, barcode/QR code reading, MRZ (passport) parsing, document boundary detection, and document normalization. Includes DBR + DDN + DLR. The core API entry point is `CaptureVisionRouter` (CVR), which orchestrates inputs, recognition engines, and output results.
*   **Dynamsoft Barcode Reader (DBR)**: A **lightweight, actively maintained** package (v11.x) that is a **submodule of DCV**. It contains only the barcode reading engine — the same engine that runs inside DCV. Use DBR when you only need barcode/QR reading and prefer a smaller dependency. **DBR is not legacy or deprecated.**

### DCV Core API vs RTU (Ready-to-Use) — Architectural Guidance

Dynamsoft provides **RTU (ready-to-use)** wrapper components (e.g., `BarcodeScanner`, `BarcodeReader`, `DocumentScanner`, `MRZScanner`) that bundle a UI, camera, and recognition pipeline into a single high-level object. All RTU components are built **on top of** the DCV core APIs (`CaptureVisionRouter`, `CameraEnhancer`, `CameraView`, etc.).

**RTU has poor programmability and flexibility**, making it only suitable for very simple use cases where the default UI and pipeline behavior is acceptable. For any real-world or complex scenario, developers **must** use the DCV core APIs directly:

| Approach | Entry Point | Programmability | When to Use |
|---------|-----------|-----------------|------------|
| **DCV core API (recommended)** | `CaptureVisionRouter` + `CameraEnhancer` + `CameraView` + `CapturedResultReceiver` | Full control over pipeline, templates, ROI, multi-task, result handling | Any production, complex, or customized scenario |
| **RTU wrapper (limited)** | `BarcodeScanner.createInstance()` / `BarcodeReader.createInstance()` / `DocumentScanner` etc. | Minimal — preset UI and pipeline, little customization | Quick prototypes or demos only |

This skill always generates code using DCV core APIs. RTU wrappers are only mentioned as a quick-prototyping option with an explicit caveat about their limitations.

> **Note**: On server/desktop platforms (Python, C++, .NET, Java, Node.js), there are no RTU wrappers — `CaptureVisionRouter` is used directly. The RTU wrappers exist only on web and mobile platforms.

## DBR Template Optimizer (Sub-Skill)

The bundled `template-optimizer/` sub-skill iteratively tunes a Dynamsoft Barcode Reader **template JSON** to maximize decode success on difficult barcode images. It operates in three modes:

*   **Optimize**: Iteratively tune a template against a single hard image (triage) or a directory of images (dataset optimization with score-based iteration and regression detection).
*   **Educate**: Explain DBR template structure, the Section/Stage hierarchy, and parameter families (DeblurModes, GrayscaleEnhancementModes, LocalizationModes, etc.).
*   **Report**: Generate an interactive visual HTML report showing per-image decode results, confidence, and barcode location overlays.

It is **Python-only** (depends on `dynamsoft-capture-vision-bundle`) and ships with helper scripts under `template-optimizer/tools/` for single-image triage, a batch harness under `template-optimizer/resources/harness_py/`, and an accumulated parameter knowledge base in `template-optimizer/KNOWLEDGE.md`. See `template-optimizer/SKILL.md` for the full workflow.

## Sample-First Code Generation

Before generating any code, the skill identifies the closest sample from `references/samples.md` across these categories:
1.  **Product/Workflow**: Same product (DCV, DBR, DWT, DDV).
2.  **Platform/Language**: Web (JS/React/Vue/Angular), Mobile (Kotlin, Swift, Flutter, React Native), or Server/Desktop (Python, C#, C++, Node.js).
3.  **Input Source**: Camera, static image/PDF, file upload, or physical scanner.
4.  **Output**: Decoded data (barcodes, MRZ), coordinates, cropped/normalized document image, viewer UI.

## Installation

Install this skill via `npx skills add`:

```bash
npx skills add https://github.com/yushulx/dynamsoft-sdk-skill
```

This fetches the skill from GitHub and registers it with your AI coding agent (VS Code Copilot, Cursor, Claude Code, etc.).

## Getting Started

To use this skill effectively in an AI-assisted development workflow (e.g., Cursor, Claude Desktop, Trae, or Gemini CLI), ask queries such as:
- *"Help me build a real-time web barcode scanner using Dynamsoft Capture Vision core APIs (CaptureVisionRouter)."*
- *"How do I scan a document from a physical scanner in Angular using Dynamic Web TWAIN?"*
- *"Write a Python script to scan MRZ from a passport image using Dynamsoft Capture Vision."*
- *"How can I combine Dynamic Web TWAIN (DWT) and Dynamsoft Document Viewer (DDV) to scan and edit pages in a browser?"*
- *"Optimize my DBR template to improve the decode rate on these difficult barcode images."*
- *"Explain which DBR template parameters help with blurry barcodes."*
