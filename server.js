import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { extname, join } from "node:path"

const PORT = Number(process.env.PORT) || 3000
const HOST = "0.0.0.0"
const DIST = join(process.cwd(), "dist")

const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers)
  res.end(body)
}

async function serveFile(res, filePath, fallbackToIndex = false) {
  try {
    const data = await readFile(filePath)
    const type = TYPES[extname(filePath)] || "application/octet-stream"
    send(res, 200, data, { "Content-Type": type })
  } catch {
    if (fallbackToIndex) {
      const index = await readFile(join(DIST, "index.html"))
      send(res, 200, index, { "Content-Type": "text/html; charset=utf-8" })
      return
    }
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" })
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`)

  if (url.pathname === "/api/health") {
    send(res, 200, JSON.stringify({ ok: true }), {
      "Content-Type": "application/json; charset=utf-8",
    })
    return
  }

  if (url.pathname.startsWith("/api/")) {
    send(res, 404, JSON.stringify({ error: "Not found" }), {
      "Content-Type": "application/json; charset=utf-8",
    })
    return
  }

  const safePath = url.pathname === "/" ? "/index.html" : url.pathname
  const filePath = join(DIST, safePath)
  await serveFile(res, filePath, !extname(safePath))
})

server.listen(PORT, HOST, () => {
  console.log(`Alianza listening on http://${HOST}:${PORT}`)
})
