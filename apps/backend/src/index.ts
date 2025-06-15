import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { join } from "path";
import fs from "fs";

const STATIC_PATH = join(process.cwd(), "../../apps/frontend/dist");

const app = new Elysia({ aot: false })
  .get("/api", () => "Hello Elysia")

  .use(
    staticPlugin({
      assets: STATIC_PATH,
      prefix: "/",
      alwaysStatic: true,
      indexHTML: false,
    })
  )

  .get("*", ({ request, set }) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/api" || pathname.startsWith("/api/")) {
      set.status = 404;
      return { error: "API not found" };
    }

    const indexFile = join(STATIC_PATH, "index.html");
    set.headers["Content-Type"] = "text/html";
    return fs.readFileSync(indexFile, "utf-8");
  })

  .listen(3000);

console.log(`🦊 Elysia is running at http://localhost:${app.server?.port}`);
