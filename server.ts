import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const ROOT_DIR = process.cwd();
const APP_DATA_DIR = path.join(ROOT_DIR, "ARKITEKT_FS");

async function bootstrap() {
  const dirs = [
    "00__DOCUMENTATION",
    "01__FRONTEND",
    "02__BACKEND",
    "03__ASSETS",
    "04__INFRASTRUCTURE",
    "05__AGENTS/_ORCHESTRATOR",
    "05__AGENTS/_CRITIC",
    "05__AGENTS/_MEMORY_KEEPER",
    "06__KNOWLEDGE_VAULT",
    "07__MEMORY_SYSTEM",
    "08__PROMPTS",
    "09__RESEARCH",
    "10__SCRIPTS",
    "11__TOKENS",
    "12__CLI_HARNESSES",
    "13__MISC",
    "14__ARCHIVE"
  ];

  for (const dir of dirs) {
    const fullPath = path.join(APP_DATA_DIR, dir);
    await fs.mkdir(fullPath, { recursive: true });
    
    // Create placeholder files for agents
    if (dir.startsWith("05__AGENTS/")) {
      const sacredFiles = ["IDENTITY.md", "SOUL.md", "SKILLS.md", "MEMORY.md", "SCRATCHPAD.md", "KANBAN.md", "HEARTBEAT.md"];
      for (const file of sacredFiles) {
        const filePath = path.join(fullPath, file);
        try {
          await fs.access(filePath);
        } catch {
          const name = dir.split("/").pop()?.replace("_", "") || "Agent";
          await fs.writeFile(filePath, `# ${file.replace(".md", "")} - ${name}\n\nInitialized at ${new Date().toISOString()}`);
        }
      }
    }
  }
  console.log("Arkitekt FS Bootstrapped at", APP_DATA_DIR);
}

async function startServer() {
  await bootstrap();
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/files", async (req, res) => {
    try {
      const relPath = (req.query.path as string) || "";
      const targetDir = path.join(APP_DATA_DIR, relPath);
      
      // Safety check
      if (!targetDir.startsWith(APP_DATA_DIR)) {
        return res.status(403).json({ error: "Access denied" });
      }

      const entries = await fs.readdir(targetDir, { withFileTypes: true });
      const files = entries.map(entry => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        path: path.join(relPath, entry.name)
      }));

      res.json(files);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.get("/api/file-content", async (req, res) => {
    try {
      const relPath = req.query.path as string;
      if (!relPath) return res.status(400).json({ error: "Path required" });
      
      const targetPath = path.join(APP_DATA_DIR, relPath);
      if (!targetPath.startsWith(APP_DATA_DIR)) {
        return res.status(403).json({ error: "Access denied" });
      }

      const content = await fs.readFile(targetPath, "utf-8");
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.post("/api/file-content", async (req, res) => {
    try {
      const { path: relPath, content } = req.body;
      if (!relPath || content === undefined) return res.status(400).json({ error: "Path and content required" });

      const targetPath = path.join(APP_DATA_DIR, relPath);
      if (!targetPath.startsWith(APP_DATA_DIR)) {
        return res.status(403).json({ error: "Access denied" });
      }

      await fs.writeFile(targetPath, content, "utf-8");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.get("/api/telemetry", (req, res) => {
    // Generate some mock telemetry data
    const data = Array.from({ length: 10 }, (_, i) => ({
      time: new Date(Date.now() - (9 - i) * 1000 * 60).toLocaleTimeString(),
      tokens: Math.floor(Math.random() * 5000) + 1000,
      heartbeat: Math.random() > 0.1 ? "active" : "standby"
    }));
    res.json(data);
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(ROOT_DIR, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Arkitekt Server running on http://localhost:${PORT}`);
  });
}

startServer();
