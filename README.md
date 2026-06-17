# Dynamsoft SDK Skill

An expert-grade AI Agent Skill for generating and reviewing accurate, high-performance code for Dynamsoft SDKs. This skill is optimized to use a **sample-first, modern-architecture workflow**, drawing on official and community samples from `yushulx` and `dynamsoft` to eliminate hallucinations and outdated API usage.

## Purpose

Dynamsoft SDKs (Capture Vision, Barcode Reader, Web TWAIN, Document Viewer) undergo rapid evolution. This skill ensures that AI assistants generate up-to-date, version-safe code, specifically focusing on the unified **Dynamsoft Capture Vision (DCV)** framework and the lightweight **Dynamsoft Barcode Reader (DBR)** package for barcode-only workflows.

## Folder Structure

The repository is structured as a modular knowledge base for easy indexing and routing:

```text
D:\code\dynamsoft-sdk-skill\
├── SKILL.md                 # Main agent routing and behavior mandates
├── README.md                # Skill overview and developer guide
└── references/
    ├── samples.md           # Unified index of official and yushulx sample repos
    ├── dcv.md               # Unified Capture Vision (Barcode, QR, MRZ, Doc Detection)
    ├── dbr.md               # Lightweight DBR package (barcode-only, not legacy)
    ├── dwt.md               # Dynamic Web TWAIN (Browser scanner acquisition)
    ├── ddv.md               # Dynamsoft Document Viewer (Web viewing & page UI)
    ├── code-quality.md      # Code quality rules & validation checklist
    ├── dbr-web.md           # DBR web-specific redirect
    ├── dbr-mobile.md        # DBR mobile-specific redirect
    └── dbr-server-desktop.md # DBR server/desktop-specific redirect
```

## Supported Product Boundaries

To build apps conveniently and avoid architectural confusion, developers and AI agents must follow these product boundaries:

*   **Dynamic Web TWAIN (DWT)**: Used **strictly** for physical document scanning (TWAIN/SANE/ICA/WIA/eSCL) inside browser environments.
*   **Dynamsoft Document Viewer (DDV)**: Used for browser-based document viewing, PDF rendering, annotations, and page manipulation.
*   **Dynamsoft Capture Vision (DCV)**: The full unified architecture for camera/video capture, barcode/QR code reading, MRZ (passport) parsing, document boundary detection, and document normalization. Includes DBR + DDN + DLR.
*   **Dynamsoft Barcode Reader (DBR)**: A **lightweight, actively maintained** package (v11.x) that contains only the barcode reading engine. The DBR code inside DBR and DCV is identical. Use DBR when you only need barcode/QR reading and prefer a smaller dependency. **DBR is not legacy or deprecated.**

## Sample-First Code Generation

Before generating any code, the skill identifies the closest sample from `references/samples.md` across these categories:
1.  **Product/Workflow**: Same product (DCV, DBR, DWT, DDV).
2.  **Platform/Language**: Web (JS/React/Vue/Angular), Mobile (Kotlin, Swift, Flutter, React Native), or Server/Desktop (Python, C#, C++, Node.js).
3.  **Input Source**: Camera, static image/PDF, file upload, or physical scanner.
4.  **Output**: Decoded data (barcodes, MRZ), coordinates, cropped/normalized document image, viewer UI.

## Getting Started

To use this skill effectively in an AI-assisted development workflow (e.g., Cursor, Claude Desktop, Trae, or Gemini CLI), ask queries such as:
- *"Help me build a real-time web barcode scanner using Dynamsoft Capture Vision React wrapper."*
- *"How do I scan a document from a physical scanner in Angular using Dynamic Web TWAIN?"*
- *"Write a Python script to scan MRZ from a passport image using Dynamsoft Capture Vision."*
- *"How can I combine Dynamic Web TWAIN (DWT) and Dynamsoft Document Viewer (DDV) to scan and edit pages in a browser?"*
