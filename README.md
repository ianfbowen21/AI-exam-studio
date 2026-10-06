# NotebookLM Exam Studio 🎓

An interactive, NotebookLM-style academic study workspace and exam preparation platform. Ground AI study chat, practice test creation, and interactive evaluations in your own class lecture notes, homework problem sets, and past model exams.

Generate authentic university-grade exams, test yourself interactively with immediate AI grading, and export pristine LaTeX source code or formatted printable PDFs.

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture & Data Privacy](#-architecture--data-privacy)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
- [Running Outside AI Studio on Chrome](#-running-outside-ai-studio-on-chrome)
- [Environment Variables](#-environment-variables)
- [User Guide & Workflows](#-user-guide--workflows)
  - [1. Creating Courses & Workspaces](#1-creating-courses--workspaces)
  - [2. Uploading & Classifying Files (Batch Upload)](#2-uploading--classifying-files-batch-upload)
  - [3. Grounded AI Study Chat](#3-grounded-ai-study-chat)
  - [4. Generating Practice Exams](#4-generating-practice-exams)
  - [5. Interactive Exam Taking & AI Grading](#5-interactive-exam-taking--ai-grading)
  - [6. LaTeX & PDF Export](#6-latex--pdf-export)
- [Available Scripts](#-available-scripts)
- [Deployment Options](#-deployment-options)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## ✨ Features

- **📚 Grounded Course Workspaces**: Organize materials by course or subject (e.g., Computer Science, History, Organic Chemistry).
- **📂 Batch Multi-File Upload & Classification**: Upload multiple `.txt` files simultaneously. Review each file and classify it as **Class Notes**, **Model Exam**, or **Class Problems & Exercises** before saving.
- **💬 Grounded AI Study Assistant**: Chat with an AI tutor that strictly references the documents you select in your workspace, preventing hallucinations and keeping answers on-syllabus.
- **📝 Intelligent Exam Generation**:
  - Automatically mimics the style, question types, and rigor of uploaded model exams.
  - Supports multiple formats: Authentic University Paper Exam (Markdown + LaTeX), Interactive Multiple Choice, or Mixed formats.
  - Configurable difficulty (Easy, Medium, Hard) and question counts.
- **⚡ Instant AI Grader**:
  - Interactive exam taking directly in the browser.
  - AI grading assistant assesses short-answer, proof, and multiple-choice questions.
  - Delivers percentage scores, comprehensive feedback narratives, and diagnostic guidance for improvement.
- **📄 LaTeX & PDF Export**:
  - Generates clean, ready-to-compile LaTeX source code compatible with Overleaf, TeX Live, and MacTeX.
  - Generates instant client-side PDF documents with student header placeholders, instructions, formatted questions, and solution sheets.
- **🌓 Dark / Light Mode**: Seamless dark and light theme switching.

---

## 🔒 Architecture & Data Privacy

### Where is your data stored?
- **Workspaces, Notes, & Generated Exams**: All course materials, uploaded text documents, and generated exams are stored **locally in your browser's `localStorage`** (`notebooklm_exam_buddy_workspaces`).
- **No external database required**: Your documents never leave your browser except when sent via the backend Express proxy to the Google Gemini API for generation, chat, and grading.
- **Offline workspace viewing**: You can view and edit existing notes and review previous exams even without an internet connection.

---

## 📋 Prerequisites

Before running the application locally, ensure you have the following installed:

1. **Node.js**: Version `18.x` or `20.x+` (LTS recommended).
   - Check version: `node -v`
2. **npm** (comes with Node.js) or **pnpm** / **bun**.
   - Check version: `npm -v`
3. **Google Gemini API Key**:
   - Obtain a free API key from [Google AI Studio](https://aistudio.google.com/).

---

## 🚀 Quick Start Guide

### 1. Clone or Extract the Project
Open your terminal and navigate to the project directory:
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies
Install the required npm packages:
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory by copying the provided `.env.example`:
```bash
cp .env.example .env
```

Open `.env` in your text editor and add your Gemini API key:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

*(Optional)* You can customize the server port:
```env
PORT=3000
```

### 4. Start the Development Server
Run the local development server:
```bash
npm run dev
```

### 5. Open in Your Browser
Open **Google Chrome** (or any modern web browser) and visit:
```
http://localhost:3000
```

The application is now running locally on your machine!

---

## 🌐 Running Outside AI Studio on Chrome

If you want to run this application completely standalone outside of the Google AI Studio preview frame:

1. **Local Standalone Mode**:
   - Follow the [Quick Start Guide](#-quick-start-guide) above.
   - Launch your terminal, run `npm run dev`, and open `http://localhost:3000` in Google Chrome.
   - For regular daily study use, you can keep the process running or launch it via terminal whenever needed.

2. **Standalone Production Build**:
   To run an optimized production build on your machine:
   ```bash
   # Build client assets and server bundle
   npm run build

   # Start the production server
   npm run start
   ```
   Navigate to `http://localhost:3000`.

3. **Bookmark or Install as Chrome Shortcut**:
   - Once open in Google Chrome at `http://localhost:3000`, click the three dots (`⋮`) in the top-right corner of Chrome.
   - Select **Cast, save, and share** -> **Install page as app...** (or **More tools** -> **Create shortcut...**).
   - Check **Open as window** for a standalone desktop app experience.

---

## ⚙️ Environment Variables

| Variable | Description | Required | Default |
|---|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key used for exam generation, chat, and grading. | **Yes** | None |
| `PORT` | Local port on which the Express server and Vite middleware listen. | No | `3000` |
| `NODE_ENV` | Environment mode (`development` or `production`). | No | `development` |
| `APP_URL` | Base URL of the deployed application (used for self-referential links). | No | `http://localhost:3000` |

---

## 📖 User Guide & Workflows

### 1. Creating Courses & Workspaces
- The left sidebar lists all your course workspaces (e.g., *CS 101: Data Structures*, *History 202*).
- Click **+ New Course** to create a new workspace with a title and description.
- To switch courses, click on any course in the sidebar.

### 2. Uploading & Classifying Files (Batch Upload)
- Click **+ Add Source** in the course materials section.
- **Multi-File Upload**:
  - Drag and drop multiple `.txt` files into the upload box or click to select multiple files at once.
  - The modal will transition into a **batch review stage**.
  - For each uploaded file, you can:
    - Edit the document title.
    - Set the document type:
      - 📝 **Class Notes**: Lecture notes, textbook excerpts, study summaries.
      - 🏆 **Model Exam**: Previous midterms, finals, or sample exams (teaches the AI the structure and question style).
      - 💡 **Class Problems & Exercises**: Homework sheets, discussion problems, tutorial exercises.
    - Click **Confirm and Add Documents** to import all files into your workspace.
- **Manual Input**: You can also paste text directly by filling in the title and text area.

### 3. Grounded AI Study Chat
- In the left panel, toggle the checkboxes next to the sources you want the AI to read.
- Open the **Chat** tab in the right panel.
- Ask questions, request explanations, or prompt the tutor to compare concepts.
- The assistant is instructed to ground its answers strictly in the selected source materials.

### 4. Generating Practice Exams
- Select the **Exam Studio** tab in the right panel.
- Ensure at least one source document is checked.
- Select your preferences:
  - **Difficulty**: Easy, Medium, or Hard.
  - **Format**:
    - **Multiple Choice**: Standard 4-option questions with pedagogical explanations.
    - **Authentic Paper Exam**: Mimics real paper test formats with multi-part questions, sections, and open-ended problems.
  - **Question Count**: Choose how many questions to generate (e.g., 3 to 10).
  - **Additional Instructions**: Provide custom prompts (e.g., *"Focus heavily on binary tree rotations and include a proof"*).
- Click **Generate Practice Exam**. Gemini will synthesize your materials and model exam format into a practice exam.

### 5. Interactive Exam Taking & AI Grading
- Switch to the **Practice Exam** view on the main canvas.
- Answer the questions:
  - Select radio buttons for multiple-choice questions.
  - Type detailed reasoning into text areas for short-answer and essay questions.
- Click **Submit Exam for AI Grading**.
- The AI Grader will return:
  - Overall performance summary and study recommendations.
  - Percentage score for each question.
  - Itemized pedagogical explanations detailing strengths and missed points.

### 6. LaTeX & PDF Export
- **LaTeX Source**:
  - Click the **LaTeX Source** tab on any generated exam.
  - Review the complete, compilable LaTeX code.
  - Click **Copy LaTeX Code** to paste directly into [Overleaf](https://www.overleaf.com/) or compile locally with `pdflatex`.
- **Direct PDF Export**:
  - Click **Export PDF** in the exam header.
  - A formatted academic PDF is generated directly in the browser, featuring student details placeholders, instructions, questions, and a detachable solution key.

---

## 🛠️ Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the Express server with Vite in development middleware mode (`http://localhost:3000`). |
| `npm run build` | Compiles frontend assets with Vite into `dist/` and bundles `server.ts` into `dist/server.cjs` via esbuild. |
| `npm run start` | Runs the compiled production server (`node dist/server.cjs`). |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`). |
| `npm run clean` | Removes the `dist/` build directory and temporary files. |

---

## 🚢 Deployment Options

### Docker Deployment
You can package the application into a Docker container:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and run:
```bash
docker build -t exam-studio .
docker run -p 3000:3000 -e GEMINI_API_KEY="your-key" exam-studio
```

### Cloud Run / Render / Railway / VPS
1. Set the build command to `npm run build`.
2. Set the start command to `npm run start`.
3. Add `GEMINI_API_KEY` to the service environment variables.
4. Set the container port to `3000`.

---

## ❓ Troubleshooting & FAQ

### 1. "Gemini API key is not configured"
- **Cause**: The `GEMINI_API_KEY` environment variable is missing or empty.
- **Fix**: Make sure you created a `.env` file containing `GEMINI_API_KEY="your_key"` in the root directory, and restart the server (`npm run dev`).

### 2. Port 3000 is already in use
- **Cause**: Another process (e.g., another Node app) is using port 3000.
- **Fix**: Change the port in `.env` (e.g., `PORT=3001`), or terminate the process using port 3000:
  ```bash
  # Linux/macOS:
  lsof -ti :3000 | xargs kill -9
  ```

### 3. How do I compile the exported LaTeX code?
- **Online**: Go to [Overleaf](https://www.overleaf.com/), create a **Blank Project**, select `main.tex`, delete the default template, paste your copied LaTeX code, and click **Recompile**.
- **Locally**: Save the code to `exam.tex` and run:
  ```bash
  pdflatex exam.tex
  ```

### 4. How do I reset the sample course data?
- Open your browser's Developer Tools (Press `F12` or `Ctrl+Shift+I` / `Cmd+Option+I`).
- Go to the **Application** tab -> **Local Storage** -> `http://localhost:3000`.
- Delete the key `notebooklm_exam_buddy_workspaces`.
- Refresh the page to restore initial seed data.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
