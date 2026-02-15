# Nexus AI Interview Prep

Nexus is a sophisticated mock technical interview simulator designed for elite software engineers. By autonomously researching your professional identity—including LinkedIn highlights and GitHub repositories—Nexus constructs personalized, high-stakes coding challenges that help you practice under production-like conditions.

## 🎯 Purpose
This platform is built for **candidates** to refine their technical communication, architectural thinking, and implementation speed. It acts as a high-fidelity "sparring partner" to help you identify logic gaps and communication friction before your real interview.

## 🚀 Key Features

- **Personalized Mock Sessions**: Nexus uses Grounding APIs to research your specific tech stack, ensuring challenges are relevant to your career level.
- **Low-Latency Dialogue**: Practice technical explanation through real-time, human-like voice interaction powered by Gemini 2.5 Flash.
- **Full Engineering Sandbox**: Implement solutions in a professional-grade workspace with an integrated code editor and runtime terminal.
- **Coaching & Logic Audits**: Receive a comprehensive post-session critique covering code efficiency, communication clarity, and alignment with industry standards.
- **Project-Specific Probing**: The AI coach asks deep-dive questions specifically about *your* past projects to simulate real-world seniority checks.

## 🛠 Preparation Workflow

```mermaid
graph TD
    A[Landing Page] --> B[Sync Professional Identity]
    B --> C[AI Research & Profile Analysis]
    C --> D{Mock Scenario Generated}
    D --> E[Interactive Mock Interview]
    E --> F[Live Coding & Voice Coaching]
    F --> G[Execute Logic & Test Cases]
    G --> H[Deep Coaching Synthesis]
    H --> I[Performance Analysis Report]
```

## ☁️ Deployment (Vercel)

1. **Push to GitHub**: Upload this directory to a new repository.
2. **Import to Vercel**: Choose the "Vite" framework preset.
3. **Environment Variables**: Add `API_KEY` in the Vercel project settings. Use a Gemini API key from a project with **billing enabled** to ensure Search Grounding features work.

## 💻 Local Development

1. **Install dependencies**: `npm install`
2. **Set Environment Variable**: `export API_KEY=your_key_here`
3. **Run dev server**: `npm run dev`

## 🎨 Design Language
- **Accent**: `#00A3FF` (Nexus Blue)
- **Background**: `#0d1117` (Cyber Noir)
- **Philosophy**: Minimalist, professional, and focus-driven.

## ⚖️ License
MIT License - Copyright (c) 2024 Nexus AI Prep.
