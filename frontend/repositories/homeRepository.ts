import type { HomepageContent } from "../types/home";

const homepageContent: HomepageContent = {
  hero: {
    eyebrow: "Full-stack starter kit",
    title: "Starter Kit",
    subtitle:
      "A clean full-stack starter kit powered by FastAPI, Next.js, SQLAlchemy, Alembic, and Docker Compose.",
    primaryAction: "Read README",
    secondaryAction: "Check API",
  },
  metrics: [
    {
      label: "Runtime",
      value: "Docker",
      detail: "Compose siap untuk backend, frontend, dan database.",
    },
    {
      label: "Backend",
      value: "FastAPI",
      detail: "API versi 1 dengan health check dan konfigurasi settings.",
    },
    {
      label: "Frontend",
      value: "Next.js",
      detail: "App Router, TypeScript, dan environment prefix API.",
    },
  ],
  features: [
    {
      title: "Documentation",
      description: "Open the project README to review setup, runtime options, and default endpoints.",
    },
    {
      title: "Backend API",
      description: "FastAPI is available through the configured API prefix and versioned routes.",
    },
    {
      title: "Frontend App",
      description: "Next.js App Router is ready for pages, layouts, and reusable components.",
    },
    {
      title: "Database Ready",
      description: "Use PostgreSQL, MySQL, or SQLite through environment configuration.",
    },
  ],
  steps: [
    {
      label: "01",
      title: "Siapkan environment",
      description:
        "Salin file `.env.example`, isi konfigurasi database, lalu pilih runtime lokal atau Docker Compose.",
    },
    {
      label: "02",
      title: "Bangun API stabil",
      description:
        "Tambahkan route FastAPI, schema, repository, service, dan migrasi Alembic sesuai modul.",
    },
    {
      label: "03",
      title: "Rilis antarmuka",
      description:
        "Kembangkan halaman Next.js dari komponen kecil agar mudah dites dan dirawat.",
    },
  ],
  stacks: [
    {
      title: "Backend layers",
      items: ["FastAPI router", "Pydantic schema", "Service", "Repository", "SQLAlchemy model"],
    },
    {
      title: "Frontend layers",
      items: ["App Router", "Page", "Service", "Repository", "Reusable components"],
    },
    {
      title: "Operations",
      items: ["Docker Compose", "Environment files", "Alembic migrations", "Health endpoint"],
    },
  ],
};

export function getHomepageContent(): HomepageContent {
  return homepageContent;
}
