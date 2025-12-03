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

  // Special redirect: old path to patients list should hit Profiles service
  app.use("/api/treatments/patients", async (req, res) => {
    const base = process.env.PROFILES_URL ?? "http://localhost:3000/api";
    const target = base + "/profiles/public/patients";
    try {
      const response = await fetch(target, { method: "GET" });
      const bodyText = await response.text();
      res.status(response.status);
      if (response.status === 204 || bodyText.length === 0) {
        res.end();
        return;
      }
      res.send(bodyText);
    } catch (e) {
      res.status(502).json({ message: "Bad gateway", details: String(e) });
    }
  });

  app.use("/api/treatments", async (req, res) => {
    const base = process.env.TREATMENTS_URL ?? "http://localhost:8002";
    const suffix = req.originalUrl.replace(/^\/api\/treatments/, "/treatments");
    const target = base + suffix;
    try {
      const hasBody = ["POST", "PUT", "PATCH"].includes(req.method);
      const headers: Record<string, string> = {
        ...(req.headers.authorization ? { Authorization: String(req.headers.authorization) } : {}),
      };
      if (hasBody) headers["Content-Type"] = "application/json";
      if (req.headers.accept && typeof req.headers.accept === "string") headers["Accept"] = req.headers.accept;
      const response = await fetch(target, {
        method: req.method,
        headers,
        body: hasBody ? JSON.stringify(req.body) : undefined,
      });
      const contentType = response.headers.get("content-type") || "";
      const bodyText = await response.text();
      res.status(response.status);
      if (response.status === 204 || bodyText.length === 0) {
        res.end();
        return;
      }
      res.send(bodyText);
    } catch (e) {
      res.status(502).json({ message: "Bad gateway", details: String(e) });
    }
  });

  app.use("/api/profiles", async (req, res) => {
    const base = process.env.PROFILES_URL ?? "http://localhost:3000/api";
    const suffix = req.originalUrl.replace(/^\/api\/profiles/, "/profiles");
    const target = base + suffix;
    try {
      const hasBody = ["POST", "PUT", "PATCH"].includes(req.method);
      const headers: Record<string, string> = {
        ...(req.headers.authorization ? { Authorization: String(req.headers.authorization) } : {}),
      };
      if (hasBody) headers["Content-Type"] = "application/json";
      if (req.headers.accept && typeof req.headers.accept === "string") headers["Accept"] = req.headers.accept;
      const response = await fetch(target, {
        method: req.method,
        headers,
        body: hasBody ? JSON.stringify(req.body) : undefined,
      });
      const contentType = response.headers.get("content-type") || "";
      const bodyText = await response.text();
      res.status(response.status);
      if (response.status === 204 || bodyText.length === 0) {
        res.end();
        return;
      }
      res.send(bodyText);
    } catch (e) {
      res.status(502).json({ message: "Bad gateway", details: String(e) });
    }
  });


  app.use("/api/device", async (req, res) => {
    const base = process.env.DEVICES_URL ?? "http://localhost:3000/api";
    const suffix = req.originalUrl.replace(/^\/api\/device/, "/device");
    const target = base + suffix;
	console.log(target);
    try {
      const hasBody = ["POST", "PUT", "PATCH"].includes(req.method);
      const headers: Record<string, string> = {
        ...(req.headers.authorization ? { Authorization: String(req.headers.authorization) } : {}),
      };
      if (hasBody) headers["Content-Type"] = "application/json";
      if (req.headers.accept && typeof req.headers.accept === "string") headers["Accept"] = req.headers.accept;
      const response = await fetch(target, {
        method: req.method,
        headers,
        body: hasBody ? JSON.stringify(req.body) : undefined,
      });
      const contentType = response.headers.get("content-type") || "";
      const bodyText = await response.text();
      res.status(response.status);
      if (response.status === 204 || bodyText.length === 0) {
        res.end();
        return;
      }
      res.send(bodyText);
    } catch (e) {
      res.status(502).json({ message: "Bad gateway", details: String(e) });
    }
  });
  app.use("/api/appointments", async (req, res) => {
    const base = process.env.APPOINTMENTS_URL ?? "http://localhost:3000/api";
    const suffix = req.originalUrl.replace(/^\/api\/appointments/, "/appointments");
    const target = base + suffix;
	console.log(target);
    try {
      const hasBody = ["POST", "PUT", "PATCH"].includes(req.method);
      const headers: Record<string, string> = {
        ...(req.headers.authorization ? { Authorization: String(req.headers.authorization) } : {}),
      };
      if (hasBody) headers["Content-Type"] = "application/json";
      if (req.headers.accept && typeof req.headers.accept === "string") headers["Accept"] = req.headers.accept;
      const response = await fetch(target, {
        method: req.method,
        headers,
        body: hasBody ? JSON.stringify(req.body) : undefined,
      });
      const contentType = response.headers.get("content-type") || "";
      const bodyText = await response.text();
      res.status(response.status);
      if (response.status === 204 || bodyText.length === 0) {
        res.end();
        return;
      }
      res.send(bodyText);
    } catch (e) {
      res.status(502).json({ message: "Bad gateway", details: String(e) });
    }
  });

  return app;
}
