import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for long class notes and model exams
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini Client
// We use a helper function to avoid crashing on launch if missing GEMINI_API_KEY
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("[Warning] GEMINI_API_KEY environment variable is not set. AI features will fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Endpoint: Generate Exam
app.post("/api/generate-exam", async (req, res) => {
  try {
    const { sources, difficulty, format, questionsCount, additionalNotes } = req.body;

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      return res.status(400).json({ error: "Please upload or provide at least one source document to generate the exam." });
    }

    const ai = getAi();
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured. Please add the GEMINI_API_KEY in the Secrets tab." });
    }

    // Build the query instructions
    let sourcesContext = "";
    sources.forEach((src: any, index: number) => {
      let typeLabel = "Class Notes";
      if (src.type === "exam") {
        typeLabel = "Model Exam";
      } else if (src.type === "problems") {
        typeLabel = "Class Problems & Exercises";
      }
      sourcesContext += `--- Source #${index + 1}: ${src.title} (${typeLabel}) ---\n${src.content}\n\n`;
    });

    const prompt = `
Generate a practice exam based on the provided class materials, model exams, and practical class problems. 

${sourcesContext}

--- EXAM REQUIREMENTS ---
Difficulty Level: ${difficulty || "Medium"}
Format: ${format || "mixed"} (multiple-choice or authentic model structure)
Target number of questions: ${questionsCount || 5}
Additional instructions/requirements: ${additionalNotes || "None"}

Please strictly respect the factual content inside the sources. 
- If a model exam is provided, look at its style, tone, difficulty, and question type to align the generated questions with that pattern.
- If 'Class Problems & Exercises' sources are provided, prioritize modeling the practical side of the course.
- IMPORTANT FORMAT REQUIREMENT: If the format is NOT 'multiple-choice', you MUST prioritize outputting the exam as a highly authentic Markdown document under 'documentContent'. This should mirror the structure of a real paper test (e.g., sections, multi-part open-ended questions like 1a/1b/1c, explicit spaces designated for writing, figures). You must provide a corresponding 'documentAnswerKey' with the solutions formatted professionally.
- If the format is purely 'multiple-choice', rely entirely on the 'questions' array and you can omit 'documentContent'.

Provide the response matching the specified JSON schema exactly. The output should include:
- A relevant educational title based on the topics discussed.
- General test-taking instructions with suggested timing.
- A list of matching structured 'questions' (if creating an interactive list or if format is multiple-choice).
- A fully compilable LaTeX code string.
- documentContent and documentAnswerKey Markdown strings if the exam is structured as a non-interactive authentic exam.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert curriculum designer and college professor. You generate high-quality academic exams, rubrics, and detailed LaTeX typeset files that perfectly match course outlines and previous model exams.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the exam" },
            instructions: { type: Type.STRING, description: "General instructions for the student (timing, rules, grading overview)" },
            documentContent: { type: Type.STRING, description: "If format is not purely multiple choice, provide the entire exam as a beautifully formatted Markdown document faithful to the original model exams." },
            documentAnswerKey: { type: Type.STRING, description: "If documentContent is provided, provide the beautifully formatted corresponding answer key." },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "e.g. 'q1', 'q2'" },
                  type: { type: Type.STRING, description: "Must be 'multiple-choice', 'short-answer', or 'essay'" },
                  questionText: { type: Type.STRING, description: "The content of the question" },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "If multiple-choice, provide precisely 4 options. Else, leave empty array."
                  },
                  correctAnswer: { type: Type.STRING, description: "For multiple choice, EXACTLY match the correct option. For short-answer/essay, give a detailed correct reference answer." },
                  explanation: { type: Type.STRING, description: "Pedagogical explanation of the correct answer and details why it is correct" },
                  points: { type: Type.INTEGER, description: "Points for this question" }
                },
                required: ["id", "type", "questionText", "options", "correctAnswer", "explanation", "points"]
              }
            },
            latexCode: {
              type: Type.STRING,
              description: "A complete, compilable, clean, beautifully typeset LaTeX source code for the exam. Use packages like geometry, hyperref, or titlesec. Include placeholders like 'Name: _____________' and 'Student ID: ___________', clear section dividers, and standard lists (enumerate, itemize) representing the questions."
            }
          },
          required: ["title", "instructions", "questions", "latexCode"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Generate Exam Error:", err);
    res.status(500).json({ error: err.message || "An error occurred while generating the exam." });
  }
});

// Endpoint: Grader
app.post("/api/grade-exam", async (req, res) => {
  try {
    const { questions, answers } = req.body;

    if (!questions || !answers) {
      return res.status(400).json({ error: "Missing required questions or student answers." });
    }

    const ai = getAi();
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    const prompt = `
You are a senior academic grader. Evaluate the student's exam answers against the list of exam questions and correct reference answers.

--- EXAM QUESTIONS & CORRECT SOLUTIONS ---
${JSON.stringify(questions, null, 2)}

--- STUDENT ANSWERS ---
${JSON.stringify(answers, null, 2)}

Provide feedback on how well the student did. Give encouraging but rigorous evaluations of any short-answer or essay questions. Evaluate Multiple Choice matches exactly (if the student answer option strings do not match, mark as incorrect).

Provide an overall summary narrative and question-by-question scoring and feedback.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an objective and constructive university grading assistant. You assess student answers fairly and provide highly clear explanations of gaps, partial credit logic, and direct actions to improve.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedbackNarrative: { type: Type.STRING, description: "A high-level encouraging performance summary, outline of strengths, and constructive advice for future studying." },
            questionGrades: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: { type: Type.STRING, description: "Matching the question ID (e.g. q1)" },
                  correct: { type: Type.BOOLEAN, description: "Whether the answer is mostly or fully correct" },
                  gradePercent: { type: Type.INTEGER, description: "Score percentage from 0 to 100 given to this answer" },
                  detailedFeedback: { type: Type.STRING, description: "Specific comments explaining what was excellent, what was missed, and the grading justification." }
                },
                required: ["questionId", "correct", "gradePercent", "detailedFeedback"]
              }
            }
          },
          required: ["feedbackNarrative", "questionGrades"]
        }
      }
    });

    const gradedResults = JSON.parse(response.text || "{}");
    res.json(gradedResults);
  } catch (err: any) {
    console.error("Grading Exam Error:", err);
    res.status(500).json({ error: err.message || "An error occurred while grading the student exam." });
  }
});

// Endpoint: NotebookLM Style AI Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { sources, messages, currentTopic } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing chat session messages." });
    }

    const ai = getAi();
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    // Ground the chatbot in source context
    let sourceContentForModel = "You represent NotebookLM's Study companion inside a student workspace. Below are the class materials uploaded by the user. Use them strictly as factual guidelines first. If the information is not in the sources, you can state this, but help them using standard academic logic.\n\n";

    if (sources && Array.isArray(sources) && sources.length > 0) {
      sources.forEach((src: any, index: number) => {
        let typeLabel = src.type;
        if (src.type === "notes") typeLabel = "Class Study Notes";
        if (src.type === "exam") typeLabel = "Model Exam Template";
        if (src.type === "problems") typeLabel = "Class Practical Problems & Exercises";
        sourceContentForModel += `SOURCE #${index + 1}: [Title: ${src.title}] [Type: ${typeLabel}]\nContent:\n${src.content}\n\n`;
      });
    } else {
      sourceContentForModel += "No sources uploaded yet. Advise the student to paste notes or upload a model exam to ground this study workspace!\n\n";
    }

    if (currentTopic) {
      sourceContentForModel += `Current focus active topic in workspace: ${currentTopic}\n\n`;
    }

    // Format chat messages
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Send context to chat or direct generation
    // Since ai.chats in @google/genai accepts models and we want custom history, let's start a chat:
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: sourceContentForModel,
      },
      history: history
    });

    const response = await chat.sendMessage({
      message: lastUserMessage
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Workspace Chat Error:", err);
    res.status(500).json({ error: err.message || "An error occurred during your AI chat session." });
  }
});

async function startServer() {
  // Vite integration middleware for dev environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Notice] Root started Vite in dev middleware mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Success] Server is running as full-stack app on http://0.0.0.0:${PORT}`);
  });
}

startServer();
