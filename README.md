# 🎯 AI Resume Analyzer

> Upload your resume + paste a job description → get your **ATS match score**, keyword gap analysis, bullet rewrites, and a tailored cover letter — all in seconds.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fai-resume-analyzer)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

| Feature | Description |
|---|---|
| **ATS Score (0–100)** | Calibrated score showing how well your resume matches the job |
| **Score Breakdown** | Keyword match · Formatting · Experience · Skills |
| **Keyword Gap Analysis** | See exactly which critical/important keywords are missing |
| **Bullet Rewrites** | AI rewrites your weakest bullets with action verbs and metrics |
| **Cover Letter Generator** | Tailored cover letter referencing specific JD requirements |
| **File Support** | Upload `.pdf`, `.docx`, or `.txt` resumes |

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **AI:** Groq API (Llama 3.3 70B) — free tier, ultra-fast inference
- **Parsing:** `pdf-parse` for PDFs, `mammoth` for DOCX
- **Deployment:** Vercel (zero-config)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Get your **free** Groq API key at [console.groq.com](https://console.groq.com) and add it to `.env.local`:

```
GROQ_API_KEY=your_key_here
LLM_PROVIDER=groq
```

> **Optional:** You can also use Anthropic Claude by setting `LLM_PROVIDER=anthropic` and adding `ANTHROPIC_API_KEY`.

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy to Vercel (Free)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Add your environment variables in the Vercel dashboard
4. Click **Deploy** — live in ~60 seconds

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/route.ts   # Main API endpoint
│   ├── layout.tsx              # Root layout + fonts
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   ├── DropZone.tsx            # File upload component
│   ├── ResultsPanel.tsx        # Full analysis display
│   └── ScoreRing.tsx           # Animated SVG score ring
├── lib/
│   ├── llm.ts                  # Groq/Anthropic LLM calls
│   ├── parser.ts               # PDF/DOCX text extraction
│   └── types.ts                # TypeScript interfaces
├── .env.example                # Environment variables template
└── README.md
```

---

## 🔑 API Keys

| Key | Required | Where to get |
|---|---|---|
| `GROQ_API_KEY` | Yes (if using Groq) | [console.groq.com](https://console.groq.com) — **Free** |
| `ANTHROPIC_API_KEY` | Optional | [console.anthropic.com](https://console.anthropic.com) |

---

## 🤝 Contributing

Pull requests welcome! Open an issue first for major changes.

---

## 📄 License

MIT © [Your Name](https://github.com/YOUR_USERNAME)
