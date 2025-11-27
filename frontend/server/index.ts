import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.use("/api/treatments", async (req, res) => {
    const base = "http://localhost:8002";
    const suffix = req.originalUrl.replace(/^\/api\/treatments/, "/treatments");
    const target = base + suffix;
    try {
      const response = await fetch(target, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
        },
        body: ["POST", "PUT", "PATCH"].includes(req.method)
          ? JSON.stringify(req.body)
          : undefined,
      });
      const contentType = response.headers.get("content-type") || "application/json";
      res.status(response.status);
      if (response.status === 204) {
        res.end();
        return;
      }
      if (contentType.includes("application/json")) {
        const data = await response.json();
        res.json(data);
      } else {
        const text = await response.text();
        res.send(text);
      }
    } catch (e) {
      res.status(502).json({ message: "Bad gateway", details: String(e) });
    }
  });

  app.use("/api/profiles", async (req, res) => {
    const base = process.env.PROFILES_URL ?? "http://localhost:3000/api";
    const suffix = req.originalUrl.replace(/^\/api\/profiles/, "/profiles");
    const target = base + suffix;
    try {
      const response = await fetch(target, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
        },
        body: ["POST", "PUT", "PATCH"].includes(req.method)
          ? JSON.stringify(req.body)
          : undefined,
      });
      const contentType = response.headers.get("content-type") || "application/json";
      res.status(response.status);
      if (response.status === 204) {
        res.end();
        return;
      }
      if (contentType.includes("application/json")) {
        const data = await response.json();
        res.json(data);
      } else {
        const text = await response.text();
        res.send(text);
      }
    } catch (e) {
      res.status(502).json({ message: "Bad gateway", details: String(e) });
    }
  });

  return app;
}
