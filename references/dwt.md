# Dynamic Web TWAIN (DWT)

Use DWT for browser-based document scanning and image acquisition from scanners and capture devices. It is appropriate for TWAIN/SANE/ICA/WIA/eSCL scanner control, scan-to-PDF/TIFF workflows, image buffer operations, upload, and browser scanner integration.

Official docs: https://www.dynamsoft.com/web-twain/docs/
Official samples: https://github.com/Dynamsoft/web-twain-samples
Additional sample index: `references/samples.md`

## Sample-first links

- Web TWAIN samples: https://github.com/Dynamsoft/web-twain-samples
- Dynamic Web TWAIN package/repo: https://github.com/Dynamsoft/Dynamic-Web-TWAIN
- React advanced: https://github.com/Dynamsoft/web-twain-react-advanced
- React advanced mode: https://github.com/Dynamsoft/web-twain-react-advanced-mode
- Angular advanced: https://github.com/Dynamsoft/web-twain-angular-advanced
- Angular CLI: https://github.com/Dynamsoft/web-twain-angular-cli-application
- Vue advanced: https://github.com/Dynamsoft/web-twain-vue-advanced
- DWT REST .NET: https://github.com/Dynamsoft/Dynamic-Web-TWAIN-REST-dotnet

When generating DWT code, pick the closest framework sample first, then adapt it.

## Route DWT requests by setup style

- CDN prototype: use CDN script and `Dynamsoft.DWT.Load()`.
- Local resources / intranet / production: host DWT Resources locally and load `dynamsoft.webtwain.initiate.js` plus `dynamsoft.webtwain.config.js`.
- npm / framework app: install `dwt`, copy static resources from `node_modules/dwt/dist` to the app public folder, set `ResourcesPath`, then call `Load()`.

## Core concepts

- `Dynamsoft.DWT.ProductKey`: license placeholder.
- `Dynamsoft.DWT.ResourcesPath`: path to static DWT resources.
- `Dynamsoft.DWT.Containers`: viewer/container configuration.
- `Dynamsoft.DWT.Load()`: initialize DWT.
- `OnWebTwainReady`: event fired when an instance can be retrieved.
- `Dynamsoft.DWT.GetWebTwain(containerIdOrWebTwainId)`: get the `WebTwain` object.
- `SelectSourceAsync()` / `SelectDeviceAsync(...)`: select scanner or device.
- `AcquireImageAsync({...})`: scan/acquire image.
- Buffer operations use `HowManyImagesInBuffer`, `CurrentImageIndexInBuffer`, and page indexes.
- Upload/save operations depend on image type enums such as PNG/PDF/TIFF and upload format enums.

## Minimal browser scanning pattern

```html
<script src="https://cdn.jsdelivr.net/npm/dwt/dist/dynamsoft.webtwain.min.js"></script>
<div id="dwtcontrolContainer"></div>
<button onclick="scan()">Scan</button>
<script>
  Dynamsoft.DWT.ProductKey = "YOUR-PRODUCT-KEY";
  Dynamsoft.DWT.ResourcesPath = "https://cdn.jsdelivr.net/npm/dwt/dist";
  Dynamsoft.DWT.Containers = [{ ContainerId: "dwtcontrolContainer", Width: "360px", Height: "480px" }];

  let dwtObject;
  Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", function () {
    dwtObject = Dynamsoft.DWT.GetWebTwain("dwtcontrolContainer");
  });
  Dynamsoft.DWT.Load();

  async function scan() {
    if (!dwtObject) return;
    try {
      await dwtObject.SelectSourceAsync();
      await dwtObject.AcquireImageAsync({
        IfShowUI: false,
        IfCloseSourceAfterAcquire: true,
        Resolution: 200,
        PixelType: Dynamsoft.DWT.EnumDWT_PixelType.TWPT_GRAY,
        IfFeederEnabled: true,
        IfDuplexEnabled: false
      });
    } catch (e) {
      console.error(e);
      alert(e.message || e);
    }
  }
</script>
```

## React pattern

- Initialize once in `useEffect`.
- Store the WebTwain object in `useRef`.
- Call `Unload()` or SDK cleanup when unmounting if an instance exists.
- Copy `node_modules/dwt/dist` into `public/dwt-resources` or equivalent.
- Set `ResourcesPath` to the served public URL, not the source filesystem path.

## Common DWT pitfalls

- `ResourcesPath` points to a filesystem path instead of a served URL.
- CDN script is loaded but service installer path or resources are misconfigured.
- Local `dynamsoft.webtwain.config.js` already sets config; duplicate page-level config causes confusion.
- Scanner service is not installed/running.
- Browser security or OS permissions block scanner/camera access.
- The scanner UI is hidden with `IfShowUI: false` but the device requires vendor UI for some settings.
- Index operations use zero-based image indexes.
- **`GetImageURL()` returns URLs tied to the internal buffer — they become invalid after `RemoveAllImages()`.** Use `ConvertToBlob()` instead when you need images to persist beyond buffer operations (see "Extracting images without the DWT viewer" below).

## Extracting images without the DWT viewer

When you want to hide the DWT viewer and display scanned images as custom `<img>` elements, **never** use `GetImageURL()` then `RemoveAllImages()`. The URL from `GetImageURL()` is served by the DWT service and invalidated when the buffer is cleared.

Instead, use `ConvertToBlob()` to extract each image as a standalone `Blob`, then create an independent `ObjectURL`:

```javascript
function convertToBlobAsync(indices) {
  return new Promise(function (resolve, reject) {
    DWObject.ConvertToBlob(
      indices,
      Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG,
      function (blob) { resolve(blob); },
      function (ec, es) { reject(new Error(es)); }
    );
  });
}

// After AcquireImageAsync resolves:
for (let i = 0; i < count; i++) {
  const blob = await convertToBlobAsync([i]);
  const url = URL.createObjectURL(blob);
  const img = document.createElement('img');
  img.src = url;
  container.appendChild(img);
}
// Now it is safe to clear the buffer
DWObject.RemoveAllImages();
```

`ConvertToBlob` API reference: https://www.dynamsoft.com/web-twain/docs/info/api/WebTwain_Buffer.html

## Good default answer behavior

When generating DWT code, include:

1. Setup style: CDN, local resources, or npm.
2. License placeholder.
3. Resource path note.
4. Scanner selection and `AcquireImageAsync` example.
5. Upload/save example only if requested.
6. Service installation note for end users.
