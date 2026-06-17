# Dynamsoft Capture Vision (DCV)

Use Dynamsoft Capture Vision (DCV) as the unified foundation for modern vision workflows including barcode scanning, QR code reading, MRZ (Machine Readable Zone) parsing, document boundary detection, and document normalization.

**DCV vs DBR**: DCV is the full bundle (`dynamsoft-capture-vision-bundle`, v3.x) containing DBR (barcode) + DDN (Document Detection & Normalization) + DLR (MRZ/Label Recognition). For barcode-only workflows, the lightweight DBR package (`dynamsoft-barcode-reader`, v11.x) is also available and contains the same barcode engine. See `references/dbr.md`.

Official docs: https://www.dynamsoft.com/capture-vision/docs/
Primary sample index: `references/samples.md`

## Architecture & Core Concepts

The DCV architecture is highly modular and centered around the **`CaptureVisionRouter` (CVR)**:
1.  **`LicenseManager`**: Handles product licensing. Needs a valid product key.
2.  **`CaptureVisionRouter` (Brain)**: Coordinates inputs, recognition engines, and output results.
3.  **`CameraEnhancer` (Input)**: Manages camera access, resolution, zoom, focus, and binds to a UI `CameraView`.
4.  **`CapturedResultReceiver` / `IntermediateResultReceiver`**: Receives asynchronous capture results.
5.  **Preset Templates (Task Modes)**: Tells the router what scanning behavior is requested.

### Preset Templates (`EnumPresetTemplate`)
*   `PT_READ_BARCODES` ("ReadBarcodes_Default") — Default barcode scanning.
*   `PT_READ_SINGLE_BARCODE` ("ReadSingleBarcode") — Optimized for single barcode in view.
*   `PT_READ_BARCODES_SPEED_FIRST` ("ReadBarcodes_SpeedFirst") — Mobile-optimized high speed.
*   `PT_READ_BARCODES_READ_RATE_FIRST` ("ReadBarcodes_ReadRateFirst") — Thorough but slower scan of damaged/tiny barcodes.
*   `PT_DETECT_AND_NORMALIZE_DOCUMENT` ("DetectAndNormalizeDocument") — Locate document boundaries & correct perspective.
*   `PT_DETECT_DOCUMENT_BOUNDARIES` ("DetectDocumentBoundaries") — Only retrieve document quadrilateral corners.

---

## 1. Web JavaScript / TypeScript Implementation

To build a modern web barcode or document capture app, install the official bundle:
```bash
npm install dynamsoft-capture-vision-bundle
```

### Complete HTML + CDN Real-Time Barcode Scanner Example
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Real-Time Barcode Scanner</title>
  <!-- Load the unified Dynamsoft Capture Vision Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-bundle@3.4.2001/dist/dcv.bundle.min.js"></script>
  <style>
    #camera-container {
      width: 100%;
      max-width: 640px;
      height: 480px;
      margin: 10px auto;
      border: 2px solid #ccc;
      position: relative;
    }
    #results {
      text-align: center;
      font-family: monospace;
      font-size: 1.2rem;
      color: #333;
    }
  </style>
</head>
<body>
  <h2 style="text-align: center;">Dynamsoft Barcode Scanner</h2>
  <div id="camera-container"></div>
  <div id="results">Scanning for barcodes...</div>

  <script>
    (async () => {
      // Destructure core modules from the global namespace
      const { LicenseManager, CaptureVisionRouter, CameraEnhancer, CameraView } = Dynamsoft.CVR;

      try {
        // 1. Initialize License
        await LicenseManager.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9"); // Public trial key

        // 2. Create the camera view UI container and append to DOM
        const view = await CameraView.createInstance();
        document.getElementById("camera-container").appendChild(view.getUIElement());

        // 3. Instantiate the Camera Enhancer and bind it to the view
        const enhancer = await CameraEnhancer.createInstance(view);

        // 4. Create the CaptureVisionRouter
        const router = await CaptureVisionRouter.createInstance();
        router.setInput(enhancer); // Bind the camera as the input source

        // 5. Add result callback receiver
        router.addResultReceiver({
          onDecodedBarcodesReceived: (result) => {
            if (result.barcodeResultItems && result.barcodeResultItems.length > 0) {
              const display = result.barcodeResultItems.map(item => `[${item.formatString}] ${item.text}`).join("<br>");
              document.getElementById("results").innerHTML = display;
            }
          }
        });

        // 6. Start the Camera & Router Capturing
        await enhancer.open();
        await router.startCapturing("ReadBarcodes_Default"); // Preset template

      } catch (err) {
        console.error("Initialization error:", err);
        document.getElementById("results").innerText = "Error: " + (err.message || err);
      }
    })();
  </script>
</body>
</html>
```

### React Hooks (TypeScript) Real-Time Scanner Pattern
Because React in `StrictMode` mounts and unmounts components twice in development, camera SDKs can throw duplicate resource initialization errors. Use this structured `useEffect` with `useRef` and a disposal lock:

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { CoreModule, LicenseManager, CaptureVisionRouter, CameraEnhancer, CameraView } from 'dynamsoft-capture-vision-bundle';

// Optional: Set engine resource paths if loading local files from public folder
CoreModule.engineResourcePaths.root = "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-bundle@3.4.2001/dist/";

interface ScannerProps {
  onResultsFound: (results: string[]) => void;
}

export const BarcodeScannerComponent: React.FC<ScannerProps> = ({ onResultsFound }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const routerRef = useRef<CaptureVisionRouter | null>(null);
  const enhancerRef = useRef<CameraEnhancer | null>(null);
  const viewRef = useRef<CameraView | null>(null);
  const isInitializing = useRef<boolean>(false);

  useEffect(() => {
    let active = true;

    async function initScanner() {
      if (isInitializing.current) return;
      isInitializing.current = true;

      try {
        // Initialize License
        await LicenseManager.initLicense("YOUR_LICENSE_KEY_HERE");
        if (!active) return;

        // Create UI View
        const view = await CameraView.createInstance();
        if (!active || !containerRef.current) {
          view.dispose();
          return;
        }
        viewRef.current = view;
        containerRef.current.appendChild(view.getUIElement());

        // Create Enhancer
        const enhancer = await CameraEnhancer.createInstance(view);
        if (!active) {
          enhancer.dispose();
          return;
        }
        enhancerRef.current = enhancer;

        // Create Router
        const router = await CaptureVisionRouter.createInstance();
        if (!active) {
          router.dispose();
          return;
        }
        routerRef.current = router;
        router.setInput(enhancer);

        // Bind callback
        router.addResultReceiver({
          onDecodedBarcodesReceived: (result) => {
            if (result.barcodeResultItems && result.barcodeResultItems.length > 0) {
              const textArray = result.barcodeResultItems.map(item => item.text);
              onResultsFound(textArray);
            }
          }
        });

        // Start scanning
        await enhancer.open();
        await router.startCapturing("ReadBarcodes_Default");

      } catch (err) {
        console.error("React Scanner Init Error:", err);
      } finally {
        isInitializing.current = false;
      }
    }

    initScanner();

    // Clean up on component unmount
    return () => {
      active = false;
      if (routerRef.current) {
        routerRef.current.dispose();
        routerRef.current = null;
      }
      if (enhancerRef.current) {
        enhancerRef.current.dispose();
        enhancerRef.current = null;
      }
      if (viewRef.current) {
        viewRef.current.dispose();
        viewRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [onResultsFound]);

  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
```

---

## 2. Python / Server / Desktop Implementation

To decode barcodes, parse MRZ, or normalize document images programmatically in server environments, use Python.

```bash
pip install dynamsoft-capture-vision-bundle opencv-python
```

### Read Barcodes from Image File using `CaptureVisionRouter`
```python
import sys
from dynamsoft_capture_vision_bundle import *

def scan_image(file_path: str):
    # 1. Initialize License
    error_code, error_msg = LicenseManager.init_license("YOUR_LICENSE_KEY")
    if error_code != EnumErrorCode.EC_OK:
        print(f"License Error: {error_msg}")
        return

    # 2. Instantiate CaptureVisionRouter
    router = CaptureVisionRouter()

    # 3. Process/Capture image using a preset template
    result = router.capture(file_path, EnumPresetTemplate.PT_READ_BARCODES.value)

    # 4. Check error status
    if result.get_error_code() != EnumErrorCode.EC_OK:
        print(f"Processing failed: {result.get_error_string()}")
        return

    # 5. Extract and parse barcode items
    items = result.get_items()
    barcode_items = [item for item in items if item.get_type() == EnumCapturedResultItemType.CRIT_BARCODE]

    if not barcode_items:
        print("No barcodes found.")
        return

    print(f"Successfully found {len(barcode_items)} barcodes:")
    for index, item in enumerate(barcode_items):
        # Cast to specific BarcodeResultItem type
        barcode_item = BarcodeResultItem(item)
        print(f"  [{index + 1}] Format: {barcode_item.get_format_string()}")
        print(f"      Text: {barcode_item.get_text()}")
        # Corner coordinates
        points = barcode_item.get_location().points
        coords = [(p.x, p.y) for p in points]
        print(f"      Coordinates: {coords}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scan.py <path_to_image>")
    else:
        scan_image(sys.argv[1])
```

---

## 3. Flutter Implementation

To build high-performance mobile, web, and desktop scanning interfaces with Flutter, use `yushulx`'s packages:

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_barcode_sdk: ^2.2.0 # For barcode/QR scanner
```

### Basic Flutter Barcode Initialization & Decode Pattern
```dart
import 'package:flutter_barcode_sdk/flutter_barcode_sdk.dart';

class BarcodeScannerService {
  final FlutterBarcodeSdk _barcodeSdk = FlutterBarcodeSdk();

  Future<void> init() async {
    // Initialize the license key
    await _barcodeSdk.setLicense('YOUR_LICENSE_KEY_HERE');
    
    // Optionally configure scanning settings (e.g., enable certain format types)
    await _barcodeSdk.init();
  }

  // Scan from an image file path (Android, iOS, Windows, Linux, macOS)
  Future<List<BarcodeResult>> decodeFile(String filePath) async {
    List<BarcodeResult> results = await _barcodeSdk.decodeFile(filePath);
    return results;
  }

  // Parse result list
  void printResults(List<BarcodeResult> results) {
    if (results.isEmpty) {
      print('No barcodes found.');
      return;
    }
    for (var result in results) {
      print('Format: ${result.format}');
      print('Text: ${result.text}');
      print('Coordinates: ${result.x1}, ${result.y1} to ${result.x2}, ${result.y2}');
    }
  }
}
```

---

## Troubleshooting & Critical Checks

1.  **Missing WASM/Models**: If camera opens but results are never detected on Web, check the browser Console/Network tab. Set the proper `CoreModule.engineResourcePaths.root` to host workers and WASM files locally or use Dynamsoft's official CDN.
2.  **HTTPS vs. Localhost**: Modern browsers block camera access via `navigator.mediaDevices.getUserMedia` unless served under `https://` or `http://localhost`. Ensure your deployment environment has SSL setup.
3.  **Correct Casting**: In languages like Python/Java/C#, the items returned by `CaptureVisionRouter` are of a generic `CapturedResultItem` class. You must check their type (`EnumCapturedResultItemType`) and cast them explicitly to `BarcodeResultItem`, `NormalizedImageResultItem`, or other sub-classes to access specific attributes like text or coordinates.
