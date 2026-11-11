// Web smoke test: decode the QR fixture with the browser bundle in headless Chrome.
//
//   node tests/sdk-smoke/web/run.mjs <image>
//
// Serves the package's own dist tree from a loopback origin (no CDN), then drives
// Chrome over the DevTools protocol and asks the page to decode the image.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const PACKAGE = "dynamsoft-barcode-reader-bundle";
const ENTRY = "dbr.bundle.esm.js";
const image = process.argv[2];
const key = process.env.DYNAMSOFT_LICENSE_KEY;

if (!image) { console.error("usage: node run.mjs <image>"); process.exit(2); }
if (!key) { console.error("no DYNAMSOFT_LICENSE_KEY"); process.exit(2); }

const pkgDir = resolve(here, "node_modules", PACKAGE);
if (!existsSync(pkgDir)) {
  console.error(`missing ${PACKAGE}: run "npm install" in ${here}`);
  process.exit(2);
}
const version = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")).version;

const root = mkdtempSync(join(tmpdir(), "dynamsoft-web-smoke-"));
const publicDir = join(root, "public");
const assetDir = join(publicDir, "dynamsoft", `${PACKAGE}@${version}`, "dist");
mkdirSync(assetDir, { recursive: true });
cpSync(join(pkgDir, "dist"), assetDir, { recursive: true });

writeFileSync(join(publicDir, "index.html"), readFileSync(join(here, "page.template.html"), "utf8")
  .replaceAll("__PKG__", PACKAGE)
  .replaceAll("__VER__", version)
  .replaceAll("__ENTRY__", ENTRY));
cpSync(image, join(publicDir, "test.png"));

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".wasm": "application/wasm", ".json": "application/json", ".png": "image/png",
  ".data": "application/octet-stream", ".xml": "application/xml"
};

const server = createServer((req, res) => {
  const path = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const file = join(publicDir, path === "/" ? "index.html" : path);
  if (!file.startsWith(publicDir) || !existsSync(file)) { res.writeHead(404).end("not found"); return; }
  res.writeHead(200, {
    "content-type": MIME[extname(file)] ?? "application/octet-stream",
    // The pthread wasm build needs cross-origin isolation.
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-embedder-policy": "require-corp",
    "cross-origin-resource-policy": "cross-origin"
  });
  res.end(readFileSync(file));
});

await new Promise((done) => server.listen(0, "127.0.0.1", done));
const pageUrl = `http://127.0.0.1:${server.address().port}/`;

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe") : null,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser"
  ].filter(Boolean);
  for (const candidate of candidates) if (existsSync(candidate)) return candidate;
  return null;
}

const chrome = findChrome();
if (!chrome) { console.error("no Chrome/Chromium found; set CHROME_PATH"); server.close(); process.exit(2); }

const profile = join(root, "profile");
const child = spawn(chrome, [
  "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "--disable-gpu",
  "--window-size=1280,900", pageUrl
], { stdio: "ignore" });

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function readDevToolsPort(deadline) {
  const file = join(profile, "DevToolsActivePort");
  while (Date.now() < deadline) {
    if (existsSync(file)) {
      const [port, wsPath] = readFileSync(file, "utf8").trim().split("\n");
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(1500) });
        if (res.ok) return { port: Number(port), wsPath: wsPath.trim() };
      } catch { /* not ready */ }
    }
    await sleep(250);
  }
  return null;
}

const devtools = await readDevToolsPort(Date.now() + 30000);
if (!devtools) { console.error("chrome never exposed a debugging port"); child.kill(); server.close(); process.exit(1); }

const ws = new WebSocket(`ws://127.0.0.1:${devtools.port}${devtools.wsPath}`);
await new Promise((done, fail) => {
  ws.addEventListener("open", done, { once: true });
  ws.addEventListener("error", () => fail(new Error("devtools websocket failed")), { once: true });
});

let nextId = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data.toString());
  const waiter = message.id !== undefined ? pending.get(message.id) : undefined;
  if (!waiter) return;
  pending.delete(message.id);
  message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result);
});
const send = (method, params = {}, sessionId) => new Promise((done, fail) => {
  const id = ++nextId;
  pending.set(id, { resolve: done, reject: fail });
  ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
  setTimeout(() => { if (pending.delete(id)) fail(new Error(`timeout ${method}`)); }, 120000);
});

let exitCode = 1;
try {
  const targets = await send("Target.getTargets");
  const page = targets.targetInfos.find((t) => t.type === "page" && t.url.startsWith(pageUrl));
  if (!page) throw new Error("page target not found");

  const { sessionId } = await send("Target.attachToTarget", { targetId: page.targetId, flatten: true });
  await send("Runtime.enable", {}, sessionId);

  let ready = false;
  for (let i = 0; i < 120 && !ready; i++) {
    const probe = await send("Runtime.evaluate", { expression: "Boolean(window.__ready)", returnByValue: true }, sessionId);
    ready = probe.result.value === true;
    if (!ready) await sleep(500);
  }
  if (!ready) throw new Error("page module never became ready");

  const run = await send("Runtime.evaluate", {
    expression: `window.__run(${JSON.stringify(key)})`,
    awaitPromise: true,
    returnByValue: true
  }, sessionId);
  if (run.exceptionDetails) {
    throw new Error(run.exceptionDetails.exception?.description ?? run.exceptionDetails.text ?? "page exception");
  }

  const value = run.result.value ?? {};
  for (const text of value.texts ?? []) console.log(`text: ${text}`);
  console.log(`items: ${(value.texts ?? []).length}`);
  if ((value.texts ?? []).length === 0) {
    console.error(`no barcode decoded (errorCode=${value.errorCode} ${value.errorString ?? ""})`);
  } else {
    exitCode = 0;
  }
} catch (error) {
  console.error(`FAILED: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  await send("Browser.close").catch(() => {});
  ws.close();
  child.kill();
  server.close();
  // Chrome flushes its profile after closing; on Linux and Windows the directory is
  // still busy for a moment. Cleanup is best effort and must never change the result.
  await sleep(1000);
  try { rmSync(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch { /* leave it to the runner */ }
}

process.exit(exitCode);
