import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText, 
  Download, 
  Code, 
  Send, 
  User, 
  Bot, 
  Settings, 
  GraduationCap, 
  CheckCircle2, 
  XSquare, 
  HelpCircle, 
  ChevronRight, 
  Layers, 
  UploadCloud, 
  BookOpenCheck,
  RotateCcw,
  Eye,
  FileSpreadsheet,
  AlertCircle,
  Sun,
  Moon
} from "lucide-react";
import { ClassWorkspace, Source, GeneratedExam, ChatMessage, GradedResult } from "./types";
import { exportExamToPDF } from "./utils/pdfExporter";

const STORAGE_KEY = "notebooklm_exam_buddy_workspaces";

// Default/Seed Data to make the app alive immediately
const SEED_WORKSPACES: ClassWorkspace[] = [
  {
    id: "cs101",
    name: "CS 101: Data Structures",
    description: "Fundamental data structures including Arrays, LinkedLists, Binary Trees, and Sorting algorithms.",
    sources: [
      {
        id: "src1",
        title: "Lecture 4 Notes: Binary Search Trees",
        type: "notes",
        content: `A Binary Search Tree (BST) is a node-based binary tree data structure.
Properties:
1. The left subtree of a node contains only nodes with keys lesser than the node's key.
2. The right subtree of a node contains only nodes with keys greater than the node's key.
3. The left and right subtree must each also be a binary search tree.
4. There must be no duplicate nodes.

Time Complexities:
- Search: O(log n) average, O(n) worst case
- Insertion: O(log n) average, O(n) worst case
- Deletion: O(log n) average, O(n) worst case
Worst case occurs when the tree becomes skewed (e.g., elements inserted in sorted order). Self-balancing trees (AVL, Red-Black Trees) solve this by maintaining a balance factor.`,
        wordCount: 160
      },
      {
        id: "src2",
        title: "Midterm 2024 Template Exam",
        type: "exam",
        content: `Midterm Exam - Structure Reference (Maximum 20 Points)

Section A: Multiple Choice (5 points)
Q1. Which data structure is used for Breadth-First Search (BFS) graph traversal?
A) Stack  B) Queue  C) Tree  D) Heap
Correct Answer: B

Section B: Practical Coding / Proofs (15 points)
Q2. Show that a skewed Binary Search Tree requires O(n) search time. Explain how a Tree Rotation can balance or correct the skewness factor. Provide a simple diagram representation if possible.`,
        wordCount: 88
      },
      {
        id: "src3",
        title: "Homework 2: Applied BST Rotations",
        type: "problems",
        content: `Applied Exercise Sheet: Red-Black Trees & Rotation Mechanics

Problem 1: Draw the BST after inserting [15, 10, 20, 8, 12, 17, 25].
Problem 2: Perform a left-rotation on the node with value 10 in the above tree. Prove that the in-order traversal remains unchanged.
Problem 3: Given a BST root, write a recursive helper function 'height(Node node)' that returns the depth of the tree. Compute its time and space complexity.`,
        wordCount: 78
      }
    ],
    exams: [
      {
        id: "exam_demo",
        title: "Mock Midterm: Binary Search Trees & BST Balance",
        instructions: "Solve all questions. Section A multiple-choice questions have single correct answers. Section B requires rigorous reasoning. Suggested total time: 45 Minutes.",
        difficulty: "Medium",
        format: "mixed",
        questionsCount: 2,
        createdDate: new Date().toISOString(),
        questions: [
          {
            id: "q1",
            type: "multiple-choice",
            questionText: "What is the worst-case space complexity of searching in a standard skewed Binary Search Tree (BST) due to recursive call stack depth?",
            options: [
              "O(1)",
              "O(log n)",
              "O(n)",
              "O(n log n)"
            ],
            correctAnswer: "O(n)",
            explanation: "In a severely skewed tree, searching traverses all 'n' elements linearly. Since each recursive call pushes a frame onto the system call stack, the worst-case extra space matches the depth, which is O(n).",
            points: 5
          },
          {
            id: "q2",
            type: "short-answer",
            questionText: "Based on the Lecture 4 notes, detail how an AVL tree balances itself during a skewed insertion of elements [1, 2, 3]. Specify the exact tree rotation required.",
            options: [],
            correctAnswer: "An AVL tree uses tree rotations to maintain balance because its balance factor must be in {-1, 0, 1}. Inserting [1, 2, 3] creates a right-right heavy chain. To self-correct this skewness, it executes a Single Left Rotation (also known as a Left Double Rotation depending on parent reference). Specifically, node 2 becomes the root, with node 1 as its left child and node 3 as its right child. This rotation operation restores balance and O(log n) search bounds.",
            explanation: "Rotating a right-right chain requires an anticlockwise single left rotation about the middle node. This reduces the height of the right subtree and balances the overall tree.",
            points: 15
          }
        ],
        latexCode: `% Compilable LaTeX mock exam
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{amsmath}

\\title{Mock Midterm: Binary Search Trees \\& BST Balance}
\\author{CS 101 Course Staff}
\\date{\\today}

\\begin{document}
\\maketitle

\\section*{General Instructions}
Solve all questions carefully. Total points: 20. Suggested timing: 45 minutes.

\\section*{Section A: Multiple Choice}
\\begin{enumerate}
    \\item What is the worst-case space complexity of searching in a standard skewed Binary Search Tree (BST) due to recursive call stack depth?
    \\\\
    \\boxed{\\text{A}} O(1) \\quad
    \\boxed{\\text{B}} O(\\log n) \\quad
    \\boxed{\\text{C}} O(n) \\quad
    \\boxed{\\text{D}} O(n \\log n)
\\end{enumerate}

\\section*{Section B: Written Response}
\\begin{enumerate}
    \\setcounter{enumi}{1}
    \\item Based on the Lecture 4 notes, detail how an AVL tree balances itself during a skewed insertion of elements [1, 2, 3]. Specify the exact tree rotation required.
    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
\\end{enumerate}

\\end{document}`
      }
    ]
  },
  {
    id: "hist202",
    name: "History 202: The Industrial Revolution",
    description: "The economic, technological, and social transitions of the late 18th and early 19th centuries.",
    sources: [
      {
        id: "src3",
        title: "Industrialization and Urbanization Notes",
        type: "notes",
        content: `The Industrial Revolution began in Great Britain during the high 1700s. Key drivers included:
- Abundant natural resources (coal, iron ore).
- Technological inventions (Steam Engine by James Watt, Spinning Jenny by Hargreaves).
- Agricultural breakthroughs releasing labor for factory work.
Inventions of machine tools and transition to steam power triggered monumental urbanization. Laborers migrated from agricultural villages into heavy industrial central hubs like Manchester and Leeds. This led to serious urban hazards: poor hygiene, layout overcrowding, and child labor controversies.`,
        wordCount: 92
      }
    ],
    exams: []
  }
];

export default function App() {
  const [workspaces, setWorkspaces] = useState<ClassWorkspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("");
  
  // UI Tabs & Views
  const [rightSidebarTab, setRightSidebarTab] = useState<"chat" | "generator" | "history">("chat");
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [addClassModalOpen, setAddClassModalOpen] = useState(false);
  
  // Create / Edit Source states
  const [newSourceTitle, setNewSourceTitle] = useState("");
  const [newSourceType, setNewSourceType] = useState<"notes" | "exam" | "problems">("notes");
  const [newSourceContent, setNewSourceContent] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<Source[]>([]);
  
  // New Class state
  const [newClassName, setNewClassName] = useState("");
  const [newClassDesc, setNewClassDesc] = useState("");
  const [classToDelete, setClassToDelete] = useState<{id: string, name: string} | null>(null);
  
  // Selection of sources for generator / chat
  const [selectedSourceIds, setSelectedSourceIds] = useState<Record<string, boolean>>({});

  // Chat States
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    global: [
      {
        id: "sys-welcome",
        role: "model",
        content: "Hi! I am your AI Workspace assistant. Select sources on the left panel (this mimics NotebookLM grounding) and ask me anything about your notes, or jump to the 'Exam Studio' tab to generate custom practice exams!",
        timestamp: new Date().toLocaleTimeString()
      }
    ]
  });
  const [chatInp, setChatInp] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Practice Exam Generation state
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [format, setFormat] = useState<"multiple-choice" | "authentic">("multiple-choice");
  const [questionsCount, setQuestionsCount] = useState<number>(3);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [generatingExam, setGeneratingExam] = useState(false);
  const [loaderMessageIndex, setLoaderMessageIndex] = useState(0);

  // Active taking exam state
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> answer string
  const [activeGradeResult, setActiveGradeResult] = useState<GradedResult | null>(null);
  const [gradingLoading, setGradingLoading] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<"exam" | "latex">("exam");
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  // LaTeX state
  const [copiedLatex, setCopiedLatex] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("notebooklm_darkmode") === "true";
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("notebooklm_darkmode", String(next));
      return next;
    });
  };

  // Ref for messages auto-scroll
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load and save localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWorkspaces(parsed);
        if (parsed.length > 0) {
          setActiveWorkspaceId(parsed[0].id);
        }
      } catch (e) {
        setWorkspaces(SEED_WORKSPACES);
        setActiveWorkspaceId(SEED_WORKSPACES[0].id);
      }
    } else {
      setWorkspaces(SEED_WORKSPACES);
      setActiveWorkspaceId(SEED_WORKSPACES[0].id);
    }
  }, []);

  const saveWorkspaces = (updated: ClassWorkspace[]) => {
    setWorkspaces(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  // Toggle selection for search grounding / generation
  useEffect(() => {
    if (activeWorkspace) {
      const initialMap: Record<string, boolean> = {};
      activeWorkspace.sources.forEach((src) => {
        initialMap[src.id] = true; // Select index by default like NotebookLM
      });
      setSelectedSourceIds(initialMap);

      // Clean answers/grades when changing class
      setAnswers({});
      setActiveGradeResult(null);
      setShowAnswerKey(false);
    }
  }, [activeWorkspaceId]);

  // Loading indicator sentences
  const loaders = [
    "Analyzing your uploaded notes for key concepts...",
    "Reviewing model exam formatting constraints...",
    "Structuring balanced pedagogical multiple-choice options...",
    "Drafting detailed scoring rubric & LaTeX code models...",
    "Perfecting practice exam templates... Almost ready!"
  ];

  useEffect(() => {
    let interval: any;
    if (generatingExam) {
      setLoaderMessageIndex(0);
      interval = setInterval(() => {
        setLoaderMessageIndex((prev) => (prev + 1) % loaders.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [generatingExam]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // Handle Create Class
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const newId = `class_${Date.now()}`;
    const newClass: ClassWorkspace = {
      id: newId,
      name: newClassName.trim(),
      description: newClassDesc.trim() || `Course study files and test training.`,
      sources: [],
      exams: []
    };
    const updated = [...workspaces, newClass];
    saveWorkspaces(updated);
    setActiveWorkspaceId(newId);
    setNewClassName("");
    setNewClassDesc("");
    setAddClassModalOpen(false);
  };

  // Handle Delete Class
  const handleDeleteClass = (id: string, name: string) => {
    setClassToDelete({ id, name });
  };

  const confirmDeleteClass = () => {
    if (!classToDelete) return;
    const updated = workspaces.filter((w) => w.id !== classToDelete.id);
    saveWorkspaces(updated);
    if (activeWorkspaceId === classToDelete.id) {
      setActiveWorkspaceId(updated.length > 0 ? updated[0].id : "");
    }
    setClassToDelete(null);
  };

  const cancelDeleteClass = () => {
    setClassToDelete(null);
  };

  // Read local .txt files and immediately add them to the workspace
  const handleTextFilesRead = async (files: FileList | File[]) => {
    if (!files || files.length === 0 || !activeWorkspace) return;

    const txtFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith(".txt"));
    if (txtFiles.length === 0) {
      alert("Only standard plain-text (.txt) documents are supported. Please convert your files and upload.");
      return;
    }

    const newSources: Source[] = [];
    for (const file of txtFiles) {
      const text = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.readAsText(file);
      });

      if (text.trim()) {
        const words = text.trim().split(/\s+/).length;
        newSources.push({
          id: `src_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: file.name.replace(/\.txt$/i, ""),
          type: "notes",
          content: text.trim(),
          wordCount: words
        });
      }
    }

    if (newSources.length > 0) {
      setPendingUploads((prev) => [...prev, ...newSources]);
    }
  };

  const updatePendingUpload = (id: string, updates: Partial<Source>) => {
    setPendingUploads(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removePendingUpload = (id: string) => {
    setPendingUploads(prev => prev.filter(s => s.id !== id));
  };

  const handleConfirmBatchUpload = () => {
    if (!activeWorkspace || pendingUploads.length === 0) return;

    const updated = workspaces.map((w) => {
      if (w.id === activeWorkspaceId) {
        return { ...w, sources: [...w.sources, ...pendingUploads] };
      }
      return w;
    });
    saveWorkspaces(updated);

    // Auto-select newly added sources
    const newSelectedSourceIds = { ...selectedSourceIds };
    pendingUploads.forEach((src) => {
      newSelectedSourceIds[src.id] = true;
    });
    setSelectedSourceIds(newSelectedSourceIds);

    // Close modal and reset
    setPendingUploads([]);
    setEditorModalOpen(false);
  };

  // Add Source
  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceTitle.trim() || !newSourceContent.trim() || !activeWorkspace) return;

    const words = newSourceContent.trim().split(/\s+/).length;
    const newSrc: Source = {
      id: `src_${Date.now()}`,
      title: newSourceTitle.trim(),
      type: newSourceType,
      content: newSourceContent.trim(),
      wordCount: words
    };

    const updated = workspaces.map((w) => {
      if (w.id === activeWorkspaceId) {
        return {
          ...w,
          sources: [...w.sources, newSrc]
        };
      }
      return w;
    });

    saveWorkspaces(updated);
    
    // Auto-select the newly added source
    setSelectedSourceIds(prev => ({ ...prev, [newSrc.id]: true }));

    setNewSourceTitle("");
    setNewSourceContent("");
    setEditorModalOpen(false);
  };

  // Remove Source
  const handleRemoveSource = (srcId: string, title: string) => {
    if (!activeWorkspace) return;
    if (confirm(`Delete the source Document "${title}"?`)) {
      const updated = workspaces.map((w) => {
        if (w.id === activeWorkspace.id) {
          return {
            ...w,
            sources: w.sources.filter((s) => s.id !== srcId)
          };
        }
        return w;
      });
      saveWorkspaces(updated);
      setSelectedSourceIds(prev => {
        const copy = { ...prev };
        delete copy[srcId];
        return copy;
      });
    }
  };

  // Toggle Source Check
  const handleToggleSourceCheck = (srcId: string) => {
    setSelectedSourceIds(prev => ({
      ...prev,
      [srcId]: !prev[srcId]
    }));
  };

  // Chat with sources
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInp.trim() || chatLoading || !activeWorkspace) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: chatInp.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    const currentWorkspaceHistory = chatMessages[activeWorkspaceId] || [];
    const updatedMessages = [...currentWorkspaceHistory, userMsg];
    
    setChatMessages(prev => ({
      ...prev,
      [activeWorkspaceId]: updatedMessages
    }));

    setChatInp("");
    setChatLoading(true);

    try {
      // Collect grounded sources checked
      const checkedSources = activeWorkspace.sources.filter(s => selectedSourceIds[s.id]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: checkedSources,
          messages: updatedMessages,
          currentTopic: activeWorkspace.name
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to communicate with AI model.");
      }

      const rawData = await response.json();
      const botMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "model",
        content: rawData.text,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => ({
        ...prev,
        [activeWorkspaceId]: [...updatedMessages, botMsg]
      }));
    } catch (e: any) {
      const errBotMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "model",
        content: `⚠️ Error: ${e.message}. Please configure your API credentials and ensure servers are operational.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => ({
        ...prev,
        [activeWorkspaceId]: [...updatedMessages, errBotMsg]
      }));
    } finally {
      setChatLoading(false);
    }
  };

  // Generate Exam Hook
  const handleGenerateExamSubmit = async () => {
    if (!activeWorkspace) return;

    const checkedSources = activeWorkspace.sources.filter(s => selectedSourceIds[s.id]);
    if (checkedSources.length === 0) {
      alert("Please check/select at least one source document in the NotebookLM panel. The generator requires source context to align exam scope!");
      return;
    }

    setGeneratingExam(true);

    try {
      const res = await fetch("/api/generate-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: checkedSources,
          difficulty,
          format,
          questionsCount,
          additionalNotes
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to generate exam from server.");
      }

      const examDoc = await res.json();
      
      const newGeneratedExam: GeneratedExam = {
        id: `exam_${Date.now()}`,
        title: examDoc.title || `Custom Practice Exam - ${activeWorkspace.name}`,
        instructions: examDoc.instructions || "Suggested duration 60 minutes. Read all instructions carefully.",
        questions: examDoc.questions || [],
        latexCode: examDoc.latexCode || "% Could not generate LaTeX model properly.",
        documentContent: examDoc.documentContent,
        documentAnswerKey: examDoc.documentAnswerKey,
        difficulty,
        format,
        questionsCount,
        createdDate: new Date().toISOString()
      };

      // Update workspace exams array
      const updated = workspaces.map((w) => {
        if (w.id === activeWorkspaceId) {
          return {
            ...w,
            exams: [newGeneratedExam, ...w.exams],
            activeExamId: newGeneratedExam.id
          };
        }
        return w;
      });

      saveWorkspaces(updated);
      alert(`Success! Generated practice exam with ${newGeneratedExam.questions.length} questions.`);
      setRightSidebarTab("history"); // Navigate to review generated exams list
      
      // Clear answers for the new active exam
      setAnswers({});
      setActiveGradeResult(null);
      setShowAnswerKey(false);
    } catch (err: any) {
      alert(`Error generating exam: ${err.message}`);
    } finally {
      setGeneratingExam(false);
    }
  };

  // Activating an old/existing Exam
  const handleSelectActiveExam = (examId: string) => {
    const updated = workspaces.map(w => {
      if (w.id === activeWorkspaceId) {
        return { ...w, activeExamId: examId };
      }
      return w;
    });
    saveWorkspaces(updated);
    setAnswers({});
    setActiveGradeResult(null);
    setShowAnswerKey(false);
  };

  // Delete an existing exam from history
  const handleDeleteExam = (examId: string, title: string) => {
    if (!activeWorkspace) return;
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      const updated = workspaces.map(w => {
        if (w.id === activeWorkspaceId) {
          const nextExams = w.exams.filter(e => e.id !== examId);
          const nextActiveId = w.activeExamId === examId ? (nextExams[0]?.id || "") : w.activeExamId;
          return {
            ...w,
            exams: nextExams,
            activeExamId: nextActiveId
          };
        }
        return w;
      });
      saveWorkspaces(updated);
      setAnswers({});
      setActiveGradeResult(null);
      setShowAnswerKey(false);
    }
  };

  const activeExam = activeWorkspace?.exams.find(e => e.id === activeWorkspace.activeExamId) || activeWorkspace?.exams[0];

  // Set radio answer
  const handleSetRadioAnswer = (qId: string, val: string) => {
    if (activeGradeResult) return; // Prevent editing once graded
    setAnswers(prev => ({
      ...prev,
      [qId]: val
    }));
  };

  // Set text input answer
  const handleSetTextAnswer = (qId: string, val: string) => {
    if (activeGradeResult) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: val
    }));
  };

  // Grader Action
  const handleGradeExamSubmit = async () => {
    if (!activeExam) return;

    setGradingLoading(true);

    try {
      const response = await fetch("/api/grade-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: activeExam.questions,
          answers: answers
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Grading request failed.");
      }

      const graded = await response.json();

      // Calc visual high-level percentage
      let scoredLocal = 0;
      graded.questionGrades.forEach((g: any) => {
        scoredLocal += g.gradePercent;
      });
      const avgScore = graded.questionGrades.length > 0 
        ? Math.round(scoredLocal / graded.questionGrades.length) 
        : 100;

      const finalResult: GradedResult = {
        scorePercent: avgScore,
        feedbackNarrative: graded.feedbackNarrative,
        questionGrades: graded.questionGrades,
        gradedDate: new Date().toISOString()
      };

      setActiveGradeResult(finalResult);
      
      // Anchor/Scroll up to view grade banner
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert(`Error during appraisal grading: ${err.message}`);
    } finally {
      setGradingLoading(false);
    }
  };

  // Toggle show manual answer solutions
  const toggleAnswerKey = () => {
    setShowAnswerKey(prev => !prev);
  };

  // Clear answers
  const resetPracticeSession = () => {
    setAnswers({});
    setActiveGradeResult(null);
    setShowAnswerKey(false);
  };

  // PDF Download Trigger
  const handlePdfDownload = (includeKey: boolean) => {
    if (!activeExam) return;
    exportExamToPDF(activeExam, includeKey);
  };

  const handleTexDownload = () => {
    if (!activeExam) return;
    const blob = new Blob([activeExam.latexCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = activeExam.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    link.download = `${sanitizedTitle}_exam.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy LaTeX
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  const activeChatList = activeWorkspaceId ? (chatMessages[activeWorkspaceId] || [
    {
      id: "sys-onboard",
      role: "model",
      content: `Welcome to the grounded study space for **${activeWorkspace?.name || "this course"}**. Connect notes, read reference structures, and ask questions manually, or compile tailored practice tests at will!`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]) : [];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Header Bar */}
      <header className={`border-b px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 transition-colors duration-150 ${
        darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-250 text-slate-900"
      }`}>
        <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3.5">
            <div className={`p-2.5 rounded-xl shadow-md flex items-center justify-center font-bold text-lg select-none transition-colors ${
              darkMode ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"
            }`}>
              E
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <span className={darkMode ? "text-slate-100" : "text-slate-900"}>NotebookLM Exam Studio</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border transition-colors ${
                  darkMode ? "bg-indigo-950/40 text-indigo-400 border-indigo-900/60" : "bg-indigo-50 text-indigo-700 border-indigo-150"
                }`}>
                  AI Agent Active
                </span>
              </h1>
              <p className={`text-xs transition-colors ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
                Personalized practice tests, detailed appraisals, and LaTeX export from notes
              </p>
            </div>
          </div>

          {/* Quick theme switcher for mobile layout */}
          <button
            onClick={toggleDarkMode}
            className={`md:hidden p-2.5 rounded-xl border transition-all cursor-pointer ${
              darkMode 
                ? "bg-slate-800 border-slate-700 text-yellow-400" 
                : "bg-slate-100 border-slate-200 text-slate-600"
            }`}
            title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Header Right elements */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Core desktop theme toggle */}
          <button
            onClick={toggleDarkMode}
            className={`hidden md:flex p-2.5 rounded-xl border transition-all cursor-pointer ${
              darkMode 
                ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700" 
                : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* Class tabs bar */}
      <section className={`border-b px-6 py-2.5 flex items-center justify-between shrink-0 transition-colors ${
        darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
      }`}>
        <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar p-1 rounded-xl border transition-colors ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200/50"
        }`}>
          {workspaces.map((tab) => (
            <button
              id={`tab-select-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveWorkspaceId(tab.id)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-2 shrink-0 ${
                activeWorkspaceId === tab.id
                  ? (darkMode ? "bg-slate-800 text-white shadow-sm border border-slate-700/80" : "bg-white text-slate-900 shadow-sm border border-slate-200/50")
                  : (darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800")
              }`}
            >
              <Layers className="w-3.5 h-3.5 opacity-60" />
              {tab.name}
            </button>
          ))}

          <button
            id="tab-add-class"
            onClick={() => setAddClassModalOpen(true)}
            className={`px-3 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1 shrink-0 ${
              darkMode ? "text-slate-300 hover:text-indigo-400" : "text-slate-600 hover:text-indigo-600"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Course
          </button>
        </div>

        {/* Delete Active Class button */}
        {activeWorkspace && (
          <button
            id="delete-class-btn"
            onClick={() => handleDeleteClass(activeWorkspace.id, activeWorkspace.name)}
            className={`text-xs flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition cursor-pointer font-medium ${
              darkMode ? "text-slate-400 hover:text-red-400 hover:bg-slate-900/60" : "text-slate-400 hover:text-red-600 hover:bg-red-50/50"
            }`}
            title="Delete active course workspace"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete Course</span>
          </button>
        )}
      </section>

      {activeWorkspace ? (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          
          {/* LEFT SIDEBAR: NotebookLM Sources (Grounding Context) */}
          <aside className={`w-full lg:w-80 border-b lg:border-b-0 lg:border-r flex flex-col h-auto lg:h-full overflow-y-auto shrink-0 p-5 transition-colors ${
            darkMode ? "bg-slate-900/50 border-slate-800/80" : "bg-slate-50 border-slate-200"
          }`}>
            <div className={`mb-4 border-b pb-3.5 transition-colors ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Sources & Grounding
                </h2>
              </div>
              
              {activeWorkspace.sources.length > 0 && (
                <div className={`flex flex-wrap items-center gap-1.5 text-[10px] font-bold p-1.5 rounded-lg border shadow-sm leading-none transition-colors ${
                  darkMode ? "bg-slate-950 border-slate-800 text-slate-500" : "bg-white/60 border-slate-150 text-slate-400"
                }`}>
                  <span className={`${darkMode ? "text-slate-500" : "text-slate-400"} mr-1 font-semibold uppercase text-[9px] tracking-wider select-none font-sans`}>Select:</span>
                  <button 
                    type="button"
                    onClick={() => {
                      const next = { ...selectedSourceIds };
                      activeWorkspace.sources.forEach(s => next[s.id] = true);
                      setSelectedSourceIds(next);
                    }}
                    className={`transition cursor-pointer hover:underline font-sans ${
                      darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"
                    }`}
                  >
                    All
                  </button>
                  <span className={`${darkMode ? "text-slate-800" : "text-slate-300"} font-normal`}>|</span>
                  <button 
                    type="button"
                    onClick={() => {
                      const next = { ...selectedSourceIds };
                      activeWorkspace.sources.forEach(s => {
                        next[s.id] = s.type === "notes";
                      });
                      setSelectedSourceIds(next);
                    }}
                    className={`transition cursor-pointer hover:underline font-sans ${
                      darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"
                    }`}
                    title="Select only lecture study notes"
                  >
                    Notes
                  </button>
                  <span className={`${darkMode ? "text-slate-800" : "text-slate-300"} font-normal`}>|</span>
                  <button 
                    type="button"
                    onClick={() => {
                      const next = { ...selectedSourceIds };
                      activeWorkspace.sources.forEach(s => {
                        next[s.id] = s.type === "exam";
                      });
                      setSelectedSourceIds(next);
                    }}
                    className={`transition cursor-pointer hover:underline font-sans ${
                      darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"
                    }`}
                    title="Select only previous mock exams"
                  >
                    Exams
                  </button>
                  <span className={`${darkMode ? "text-slate-800" : "text-slate-300"} font-normal`}>|</span>
                  <button 
                    type="button"
                    onClick={() => {
                      const next = { ...selectedSourceIds };
                      activeWorkspace.sources.forEach(s => {
                        next[s.id] = s.type === "problems";
                      });
                      setSelectedSourceIds(next);
                    }}
                    className={`transition cursor-pointer hover:underline font-sans ${
                      darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"
                    }`}
                    title="Select only practical class problems"
                  >
                    Problems
                  </button>
                  <span className={`${darkMode ? "text-slate-800" : "text-slate-300"} font-normal`}>|</span>
                  <button 
                    type="button"
                    onClick={() => {
                      const next = { ...selectedSourceIds };
                      activeWorkspace.sources.forEach(s => {
                        next[s.id] = false;
                      });
                      setSelectedSourceIds(next);
                    }}
                    className={`transition cursor-pointer hover:underline font-sans ${
                      darkMode ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    None
                  </button>
                </div>
              )}

              <p className="text-[11px] text-slate-400 mt-2">
                {activeWorkspace.sources.filter(s => selectedSourceIds[s.id]).length} of {activeWorkspace.sources.length} sources checked
              </p>
            </div>

            {/* Quick stats */}
            <div className={`border p-3.5 rounded-xl mb-4 text-xs shadow-sm transition-colors ${
              darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
            }`}>
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Class Workspace:</span>
                <span className={`truncate max-w-[140px] ${darkMode ? "text-slate-200" : "text-slate-800"}`} title={activeWorkspace.name}>
                  {activeWorkspace.name}
                </span>
              </div>
            </div>

            {/* Sources List */}
            <div className="flex-1 space-y-3 mb-4 max-h-[300px] lg:max-h-none overflow-y-auto pr-1">
              {activeWorkspace.sources.length === 0 ? (
                <div className={`text-center py-8 border-2 border-dashed rounded-xl px-4 transition-colors ${
                  darkMode ? "bg-slate-900/20 border-slate-800/80" : "bg-white/50 border-slate-200"
                }`}>
                  <UploadCloud className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className={`text-xs font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>No materials yet</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Upload class notes, mock exams, or practical class problems.
                  </p>
                </div>
              ) : (
                activeWorkspace.sources.map((src) => {
                  const isChecked = !!selectedSourceIds[src.id];
                  return (
                    <div 
                      id={`source-item-${src.id}`}
                      key={src.id} 
                      onClick={() => handleToggleSourceCheck(src.id)}
                      className={`group p-3.5 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 cursor-pointer ${
                        darkMode 
                          ? isChecked 
                            ? "bg-slate-900/80 border-indigo-500/60 ring-1 ring-indigo-950 text-slate-100" 
                            : "bg-slate-900/30 border-slate-800/80 text-slate-305 hover:border-slate-700 hover:bg-slate-900/60 opacity-60 hover:opacity-100"
                          : isChecked 
                            ? "border-slate-350 bg-slate-50/25 ring-1 ring-slate-100 text-slate-900" 
                            : "bg-white border-slate-200 text-slate-800 opacity-60 hover:opacity-100 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleSourceCheck(src.id);
                          }}
                          className={`mt-1 w-3.5 h-3.5 rounded focus:ring-slate-900 cursor-pointer ${
                            darkMode ? "text-slate-100 bg-slate-950 border-slate-800" : "text-slate-900 border-slate-300"
                          }`}
                          title="Ground AI outputs on this source"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className={`text-[9.5px]/none uppercase font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                              src.type === "exam" 
                                ? (darkMode ? "bg-amber-950/40 text-amber-300 border-amber-900/60" : "bg-amber-50 text-amber-800 border-amber-100") 
                                : src.type === "problems"
                                  ? (darkMode ? "bg-emerald-950/40 text-emerald-300 border-emerald-900/60" : "bg-emerald-50 text-emerald-700 border-emerald-100")
                                  : (darkMode ? "bg-indigo-950/40 text-indigo-300 border-indigo-900/60" : "bg-indigo-50 text-indigo-700 border-indigo-100")
                            }`}>
                              {src.type === "exam" ? "Model Exam" : src.type === "problems" ? "Class Problems" : "Note"}
                            </span>
                            <span className="text-[9.5px] text-slate-400 font-mono">
                              {src.wordCount || 0} words
                            </span>
                          </div>
                          <h3 className={`text-xs font-semibold break-words leading-tight transition-colors ${
                            darkMode ? "text-slate-200" : "text-slate-800"
                          }`}>
                            {src.title}
                          </h3>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSource(src.id, src.title);
                          }}
                          className="text-slate-300 hover:text-red-500 transition p-0.5 opacity-0 group-hover:opacity-100"
                          title="Remove source"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Excerpt panel */}
                      <div className={`mt-2 rounded p-2 text-[10px] border max-h-12 overflow-hidden truncate whitespace-pre-wrap leading-relaxed transition-colors ${
                        darkMode ? "bg-slate-950/60 border-slate-800/80 text-slate-400" : "bg-slate-55/60 border-slate-150 text-slate-505"
                      }`}>
                        {src.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              id="btn-add-source"
              onClick={() => setEditorModalOpen(true)}
              className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                darkMode 
                  ? "border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40" 
                  : "border-slate-300 hover:border-slate-400 text-slate-550 hover:text-slate-800 hover:bg-white"
              }`}
            >
              <Plus className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold">Add Source Document</span>
            </button>
          </aside>

          {/* CENTER PANEL: Practice Exam Workspace */}
          <main className={`flex-1 flex flex-col min-w-0 h-auto lg:h-full overflow-y-auto transition-colors ${
            darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50/40 text-slate-900 border-b lg:border-b-0 border-slate-250"
          }`}>
            {activeExam ? (
              <div className="p-4 md:p-8 flex-1 flex flex-col items-center overflow-y-auto">
                
                {/* Visual scorecard feedback banner if graded */}
                {activeGradeResult && (
                  <div className={`w-full max-w-3xl mb-6 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${
                    darkMode ? "bg-slate-900 border border-slate-805 text-white" : "bg-slate-900 text-white"
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <BookOpenCheck className="w-5 h-5 text-indigo-400 animate-pulse" />
                        <span className="uppercase text-[10px] font-bold tracking-widest text-slate-400 font-sans">
                          AI Appraisal Completed
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mt-1 font-sans">Study Score: {activeGradeResult.scorePercent}%</h3>
                      <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                        {activeGradeResult.feedbackNarrative}
                      </p>
                    </div>
                    <div className="bg-white/10 hover:bg-white/15 px-4 py-3 rounded-xl border border-white/20 flex flex-col items-center shrink-0 min-w-[125px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-sans">Grade Letter</span>
                      <span className="text-3xl font-extrabold tracking-tight mt-0.5">
                        {activeGradeResult.scorePercent >= 90 ? "A" : activeGradeResult.scorePercent >= 80 ? "B" : activeGradeResult.scorePercent >= 70 ? "C" : activeGradeResult.scorePercent >= 60 ? "D" : "F"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Main Print-Style Worksheet container */}
                <div className={`w-full max-w-3xl p-6 md:p-10 shadow-sm border rounded-xl space-y-6 transition-colors ${
                  darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
                }`}>
                  {/* Exam Header */}
                  <div className={`text-center pb-6 border-b transition-colors ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                    <h1 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-1.5 font-sans">Practice Examination</h1>
                    <h2 className={`textxl font-bold font-serif leading-tight transition-colors ${
                      darkMode ? "text-slate-100" : "text-slate-900"
                    }`}>
                      {activeExam.title}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-3 flex-wrap text-xs text-slate-500">
                      <span className={`font-medium px-2.5 py-0.5 rounded-full text-[11px] border transition-colors ${
                        darkMode ? "bg-slate-800 text-slate-300 border-slate-700/80" : "bg-slate-100 text-slate-700 border-slate-200/50"
                      }`}>
                        {activeExam.difficulty}
                      </span>
                      <span>&bull;</span>
                      <span className={`font-medium px-2.5 py-0.5 rounded-full text-[11px] border transition-colors ${
                        darkMode ? "bg-slate-800 text-slate-300 border-slate-700/80" : "bg-slate-100 text-slate-700 border-slate-200/50"
                      }`}>
                        {activeExam.format === "mixed" ? "Mixed Q & A" : activeExam.format === "multiple-choice" ? "Multiple Choice" : "Written Short Answer"}
                      </span>
                      <span>&bull;</span>
                      <span className={`font-mono text-[11px] px-2 py-0.5 rounded border transition-colors ${
                        darkMode ? "bg-slate-950 text-slate-500 border-slate-800/80" : "text-slate-400 bg-slate-50 border-slate-200/50"
                      }`}>ID: {activeExam.id}</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-5 text-xs transition-colors ${
                    darkMode ? "border-slate-800" : "border-slate-100"
                  }`}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTexDownload}
                        className={`px-3.5 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm transition-all ${
                          darkMode 
                            ? "bg-slate-800 border-slate-705 text-slate-300 hover:text-white" 
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-909"
                        }`}
                        title="Download raw LaTeX source (.tex)"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                        Export .TeX
                      </button>
                      <button
                        onClick={() => handlePdfDownload(false)}
                        className={`px-3.5 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm transition-all ${
                          darkMode 
                            ? "bg-slate-800 border-slate-705 text-slate-300 hover:text-white" 
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-909"
                        }`}
                        title="Download clean simple PDF version"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                        Export Simple PDF
                      </button>
                      <button
                        onClick={() => handlePdfDownload(true)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all ${
                          darkMode 
                            ? "bg-indigo-950/40 text-indigo-300 border border-indigo-900/60 hover:bg-slate-800" 
                            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        }`}
                        title="Download PDF version complete with solutions and explanations"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF + Answer Key
                      </button>
                    </div>

                    <button
                      onClick={toggleAnswerKey}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 border transition-all ${
                        showAnswerKey 
                          ? (darkMode ? "bg-amber-950/40 border-amber-900/60 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-750") 
                          : (darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50")
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {showAnswerKey ? "Hide Solutions" : "Reveal Answer Key"}
                    </button>
                  </div>

                  {/* Tab layout: Interactive testing vs LaTeX Raw Viewer */}
                  <div className={`flex border-b transition-colors ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                    <button
                      onClick={() => setActiveTabSection("exam")}
                      className={`pb-2.5 px-4 text-xs font-bold cursor-pointer border-b-2 transition-all ${
                        activeTabSection === "exam" 
                          ? (darkMode ? "border-slate-200 text-slate-105 font-extrabold" : "border-slate-950 text-slate-950 font-extrabold") 
                          : (darkMode ? "border-transparent text-slate-500 hover:text-slate-300" : "border-transparent text-slate-400 hover:text-slate-700")
                      }`}
                    >
                      Interactive Practice Mode
                    </button>
                    <button
                      onClick={() => setActiveTabSection("latex")}
                      className={`pb-2.5 px-4 text-xs font-bold cursor-pointer border-b-2 transition-all ${
                        activeTabSection === "latex"
                          ? (darkMode ? "border-slate-200 text-slate-105 font-extrabold" : "border-slate-950 text-slate-950 font-extrabold") 
                          : (darkMode ? "border-transparent text-slate-500 hover:text-slate-300" : "border-transparent text-slate-400 hover:text-slate-700")
                      }`}
                    >
                      LaTeX Source Code
                      <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] uppercase tracking-wide font-extrabold rounded-full border transition-colors ${
                        darkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-250"
                      }`}>
                        Typeset
                      </span>
                    </button>
                  </div>

                  {activeTabSection === "exam" ? (
                    <div className="space-y-6">
                      {/* General test directions card */}
                      <div className={`p-4 rounded-xl text-xs flex flex-col gap-2 border transition-colors ${
                        darkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}>
                        <span className="font-bold text-slate-500 uppercase tracking-widest text-[9.5px] font-sans">Test Instructions</span>
                        <p className={`leading-relaxed break-words transition-colors ${
                          darkMode ? "text-slate-300" : "text-slate-600"
                        }`}>{activeExam.instructions}</p>
                      </div>

                      {/* Question items or Document */}
                      {activeExam.format === "authentic" ? (
                        <div className={`p-8 rounded-xl font-serif text-sm leading-relaxed border transition-colors ${
                          darkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.02)]"
                        }`}>
                          <div className="markdown-body">
                            <Markdown>{activeExam.documentContent || "Authentic exam document was perfectly generated but is currently empty..."}</Markdown>
                          </div>
                          
                          {showAnswerKey && activeExam.documentAnswerKey && (
                            <div className={`mt-10 pt-10 border-t ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                              <h3 className="font-bold font-sans text-[10.5px] uppercase tracking-widest mb-6 text-indigo-500">Official Solution Blueprint Key</h3>
                              <div className="markdown-body">
                                <Markdown>{activeExam.documentAnswerKey}</Markdown>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                        <div className={`space-y-8 divide-y transition-colors ${darkMode ? "divide-slate-800" : "divide-slate-100"}`}>
                          {activeExam.questions.map((q, index) => {
                          const gradeDetails = activeGradeResult?.questionGrades.find(g => g.questionId === q.id);
                          return (
                            <div
                              id={`question-card-${q.id}`}
                              key={q.id}
                              className={`pt-6 first:pt-0 transition-all ${
                                gradeDetails 
                                  ? gradeDetails.correct 
                                    ? (darkMode ? "bg-emerald-950/20 p-5 rounded-xl border border-emerald-900/40 my-1 first:my-0" : "bg-emerald-50/20 p-5 rounded-xl border border-emerald-150 my-1 first:my-0") 
                                    : (darkMode ? "bg-amber-950/20 p-5 rounded-xl border border-amber-900/40 my-1 first:my-0" : "bg-amber-50/20 p-5 rounded-xl border border-amber-150 my-1 first:my-0")
                                  : ""
                              }`}
                            >
                              {/* Question Title Line */}
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <h3 className="font-semibold text-slate-900 leading-snug">
                                  <span className="text-xs font-bold uppercase font-sans tracking-wide text-slate-400 mr-2">Question {index + 1}</span>
                                  <span className={`font-serif text-sm block mt-1.5 font-medium transition-colors ${
                                    darkMode ? "text-slate-100" : "text-slate-950"
                                  }`}>{q.questionText}</span>
                                </h3>
                                <span className={`shrink-0 text-[10px] font-bold border px-2 py-0.5 rounded-md font-mono transition-colors ${
                                  darkMode ? "bg-slate-950 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200"
                                }`}>
                                  {q.points} Pts
                                </span>
                              </div>

                              {/* Inputs / Choices */}
                              {q.type === "multiple-choice" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4">
                                  {q.options.map((opt, oIdx) => {
                                    const optionPrefix = String.fromCharCode(65 + oIdx);
                                    const isChecked = answers[q.id] === opt;
                                    return (
                                      <button
                                        key={oIdx}
                                        disabled={!!activeGradeResult}
                                        onClick={() => handleSetRadioAnswer(q.id, opt)}
                                        className={`p-3 text-left rounded-lg text-xs font-medium flex items-center gap-3 border transition-all cursor-pointer ${
                                          isChecked
                                            ? (darkMode ? "bg-indigo-600 text-white border-indigo-650 shadow-sm" : "bg-slate-900 text-white border-slate-900 shadow-sm")
                                            : (darkMode ? "bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-800" : "bg-slate-50/60 hover:bg-slate-100 text-slate-707 border-slate-250")
                                        }`}
                                      >
                                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 border transition-all ${
                                          isChecked 
                                            ? "bg-white/20 text-white border-white/40" 
                                            : (darkMode ? "bg-slate-900 text-slate-400 border-slate-850 font-sans" : "bg-white text-slate-504 border-slate-350 font-sans")
                                        }`}>
                                          {optionPrefix}
                                        </span>
                                        <span className="flex-1 break-words font-sans">{opt}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="mt-4">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Your Written Solution:
                                  </label>
                                  <textarea
                                    disabled={!!activeGradeResult}
                                    value={answers[q.id] || ""}
                                    onChange={(e) => handleSetTextAnswer(q.id, e.target.value)}
                                    placeholder="Formulate your detailed pedagogical answer here. Show logical proof steps or critical historical dates..."
                                    className={`w-full min-h-[100px] p-3 text-xs rounded-lg border focus:outline-none focus:ring-1 disabled:opacity-75 transition-all font-sans ${
                                      darkMode
                                        ? "bg-slate-950 text-slate-200 border-slate-800 placeholder-slate-600 focus:bg-slate-950 focus:ring-indigo-500" 
                                        : "bg-slate-50 text-slate-800 border-slate-200 focus:bg-white focus:ring-slate-900"
                                    }`}
                                  />
                                </div>
                              )}
 
                              {/* Question Grading appraised feedback */}
                              {gradeDetails && (
                                <div className={`mt-4 p-4 rounded-xl text-xs border transition-colors ${
                                  darkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200"
                                }`}>
                                  <div className="flex items-center gap-2 mb-2">
                                    {gradeDetails.correct ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                      <XSquare className="w-4 h-4 text-amber-500" />
                                    )}
                                    <span className={`font-bold transition-colors ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                                      AI score check: {gradeDetails.gradePercent}% Match
                                    </span>
                                  </div>
                                  <p className={`leading-relaxed italic break-words transition-colors ${darkMode ? "text-slate-350" : "text-slate-600"}`}>
                                    "{gradeDetails.detailedFeedback}"
                                  </p>
                                </div>
                              )}
 
                              {/* Manual solution fallback review */}
                              {(showAnswerKey || (gradeDetails && showAnswerKey)) && (
                                <div className={`mt-4 p-4 rounded-xl text-xs border transition-colors ${
                                  darkMode ? "bg-indigo-950/20 border-indigo-900/40" : "bg-indigo-50/40 border-indigo-150"
                                }`}>
                                  <h4 className={`font-bold transition-colors ${darkMode ? "text-indigo-300" : "text-indigo-900"}`}>Reference Solution Key:</h4>
                                  <p className={`mt-1 pb-2 border-b break-words font-medium transition-colors ${
                                    darkMode ? "text-slate-200 border-indigo-950/80" : "text-slate-805 border-indigo-100/40"
                                  }`}>
                                    Correct target: {q.correctAnswer}
                                  </p>
                                  <p className={`mt-2 italic leading-relaxed break-words transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                    <strong>Derivation logic:</strong> {q.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer Submit Practice Controls */}
                      <div className={`pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 transition-colors ${
                        darkMode ? "border-slate-805" : "border-slate-200"
                      }`}>
                        <button
                          onClick={resetPracticeSession}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition flex items-center gap-2 border transition-all ${
                            darkMode 
                              ? "bg-slate-800 hover:bg-slate-755 text-slate-300 hover:text-white border-slate-700/85" 
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-808 border-slate-200"
                          }`}
                          title="Clear answers and take exam again"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset Answers
                        </button>

                        <button
                          disabled={gradingLoading || !!activeGradeResult}
                          onClick={handleGradeExamSubmit}
                          className={`px-6 py-2.5 rounded-lg text-xs font-bold shadow disabled:opacity-50 transition cursor-pointer flex items-center gap-2 transition-all ${
                            darkMode 
                              ? "bg-indigo-600 hover:bg-indigo-500 text-white" 
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                          }`}
                        >
                          {gradingLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Grading answers...
                            </>
                          ) : activeGradeResult ? (
                            "Appraised & Scored"
                          ) : (
                            <>
                              <BookOpenCheck className="w-4 h-4" />
                              Submit Practice Exam for AI Review
                            </>
                          )}
                        </button>
                      </div>
                      </>
                      )}
                    </div>
                  ) : (
                    // LaTeX code pane view
                    <div className="space-y-4">
                      <div className="bg-slate-900 rounded-xl text-white p-4 overflow-hidden shadow-inner font-mono text-xs border border-slate-800">
                        <div className="flex border-b border-white/10 pb-2 mb-3 justify-between items-center">
                          <span className="text-slate-400">compilable_exam.tex</span>
                          <button
                            onClick={() => handleCopyToClipboard(activeExam.latexCode)}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[11px] rounded transition cursor-pointer flex items-center gap-1"
                          >
                            <Code className="w-3.5 h-3.5" />
                            {copiedLatex ? "Copied!" : "Copy LaTeX"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto max-h-[600px] leading-relaxed select-text whitespace-pre-wrap font-mono">
                          {activeExam.latexCode}
                        </pre>
                      </div>
                      <p className="text-xs text-slate-500 italic">
                        💡 LaTeX source files are compilable immediately on online editors like Overleaf, using standard math packages like amsmath.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Empty generated exam view state
              <div className={`flex-1 flex flex-col items-center justify-center p-12 text-center transition-colors ${
                darkMode ? "bg-slate-950/20" : "bg-slate-50/10"
              }`}>
                <div className={`p-5 rounded-full mb-4 border transition-colors ${
                  darkMode ? "bg-slate-900 text-slate-300 border-slate-800/80" : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  <BookOpenCheck className="w-12 h-12" id="canvas-empty-state-icon" />
                </div>
                <h3 className={`text-lg font-bold transition-colors ${darkMode ? "text-slate-200" : "text-slate-900"}`}>Workspace Active but Exam Offline</h3>
                <p className={`text-xs max-w-sm mt-1.5 leading-relaxed transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  In order to generate your custom exam, select your grounded note sources in the left panel and click over to the <strong>Exam Studio</strong> configurations panel to command Gemini!
                </p>
                <div className="mt-6 flex gap-3 block">
                  <button
                    onClick={() => setRightSidebarTab("generator")}
                    className={`px-5 py-2 text-xs font-semibold rounded-lg cursor-pointer transition shadow transition-all ${
                      darkMode 
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40" 
                        : "bg-slate-900 hover:bg-slate-800 text-white shadow-indigo-150"
                    }`}
                  >
                    Go to Exam Studio
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* RIGHT SIDEBAR: Studio Tabs & Chats */}
          <aside className={`w-full lg:w-96 border-t lg:border-t-0 lg:border-l flex flex-col h-[500px] lg:h-full shrink-0 overflow-hidden transition-colors ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-950"
          }`}>
            
            {/* Tab switch buttons */}
            <div className={`flex border-b shrink-0 text-xs transition-style ${
              darkMode ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"
            }`}>
              <button
                onClick={() => setRightSidebarTab("chat")}
                className={`flex-1 py-3 px-2 text-center font-bold cursor-pointer border-b-2 transition-all ${
                  rightSidebarTab === "chat" 
                    ? (darkMode ? "border-indigo-500 text-indigo-400 bg-slate-900" : "border-slate-900 text-slate-900 bg-white") 
                    : (darkMode ? "border-transparent text-slate-550 hover:text-slate-300" : "border-transparent text-slate-400 hover:text-slate-700")
                }`}
              >
                AI Study Chat
              </button>
              <button
                id="tab-generator-select"
                onClick={() => setRightSidebarTab("generator")}
                className={`flex-1 py-3 px-2 text-center font-bold cursor-pointer border-b-2 transition-all ${
                  rightSidebarTab === "generator" 
                    ? (darkMode ? "border-indigo-500 text-indigo-400 bg-slate-900" : "border-slate-900 text-slate-900 bg-white") 
                    : (darkMode ? "border-transparent text-slate-550 hover:text-slate-300" : "border-transparent text-slate-400 hover:text-slate-700")
                }`}
              >
                Exam Generator
              </button>
              <button
                onClick={() => setRightSidebarTab("history")}
                className={`flex-1 py-3 px-2 text-center font-bold cursor-pointer border-b-2 transition-all ${
                  rightSidebarTab === "history" 
                    ? (darkMode ? "border-indigo-500 text-indigo-400 bg-slate-900" : "border-slate-900 text-slate-900 bg-white") 
                    : (darkMode ? "border-transparent text-slate-550 hover:text-slate-300" : "border-transparent text-slate-400 hover:text-slate-700")
                }`}
              >
                Exam History ({activeWorkspace.exams.length})
              </button>
            </div>

            {/* TAB CONTAINER BODY */}
            <div className={`flex-1 overflow-y-auto p-4 min-h-0 transition-colors ${
              darkMode ? "bg-slate-950/40" : "bg-slate-50/20"
            }`}>
              
              {/* CHAT PANEL */}
              {rightSidebarTab === "chat" && (
                <div className="h-full flex flex-col justify-between">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                    {activeChatList.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role !== "user" && (
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold shadow-sm transition-colors ${
                            darkMode ? "bg-slate-805 text-indigo-400 border border-slate-700" : "bg-slate-900 text-white"
                          }`}>
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] break-words transition-all ${
                          msg.role === "user"
                            ? (darkMode ? "bg-indigo-600 text-white rounded-tr-none shadow-sm shadow-indigo-950/40" : "bg-slate-900 text-white rounded-tr-none")
                            : (darkMode ? "bg-slate-900 text-slate-205 border border-slate-800 shadow-sm rounded-tl-none whitespace-pre-wrap" : "bg-white text-slate-800 shadow-sm border border-slate-200 rounded-tl-none whitespace-pre-wrap")
                        }`}>
                          <p>{msg.content}</p>
                          <span className={`text-[8px] block mt-1 text-right transition-colors ${
                            msg.role === "user" ? (darkMode ? "text-indigo-200" : "text-slate-300") : "text-slate-400"
                          }`}>
                            {msg.timestamp}
                          </span>
                        </div>
                        {msg.role === "user" && (
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                            darkMode ? "bg-slate-800 text-slate-300 border border-slate-705" : "bg-slate-200 text-slate-707/90"
                          }`}>
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-2.5 justify-start">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 animate-pulse transition-colors ${
                          darkMode ? "bg-slate-805 text-indigo-400" : "bg-slate-900 text-white animate-pulse"
                        }`}>
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <div className={`p-3 rounded-xl shadow-sm border rounded-tl-none flex items-center gap-1.5 transition-colors ${
                          darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200"
                        }`}>
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleSendChat} className="flex gap-1.5 shrink-0">
                    <input
                      type="text"
                      value={chatInp}
                      onChange={(e) => setChatInp(e.target.value)}
                      placeholder="Ask the AI about your active files..."
                      className={`flex-1 p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 transition-all ${
                        darkMode 
                          ? "bg-slate-900 border border-slate-800 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-600" 
                          : "bg-white border border-slate-200 text-slate-900 focus:ring-slate-950 focus:border-slate-950 placeholder-slate-400"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInp.trim()}
                      className={`disabled:opacity-50 p-2.5 rounded-xl cursor-pointer transition flex items-center justify-center transition-all ${
                        darkMode 
                          ? "bg-indigo-650 hover:bg-indigo-550 text-white" 
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {/* GENERATOR WIZARD DETAILS */}
              {rightSidebarTab === "generator" && (
                <div className="space-y-4">
                  <div className={`border-b pb-2 transition-colors ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                    <h3 className={`text-xs font-bold uppercase tracking-wider transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Exam Blueprint</h3>
                    <p className={`text-[11.5px] mt-1 transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Configure practice parameters then instruct the synthetic compiler.</p>
                  </div>

                  {generatingExam ? (
                    <div className={`p-6 rounded-2xl text-center space-y-4 shadow-sm border transition-colors ${
                      darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                    }`}>
                      <div className="relative w-10 h-10 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
                        <div className={`absolute inset-0 rounded-full border-2 border-t-transparent animate-spin ${
                          darkMode ? "border-indigo-500" : "border-slate-900"
                        }`} />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold transition-colors ${darkMode ? "text-slate-205" : "text-slate-800"}`}>Compiling Exam Worksheet</h4>
                        <p className="text-[11px] text-slate-400 italic mt-1.5 animate-pulse min-h-[36px] px-2 leading-relaxed">
                          "{loaders[loaderMessageIndex]}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-4.5 rounded-xl space-y-4 shadow-sm border transition-colors ${
                      darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                    }`}>
                      {/* Difficulty Selection */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                          Test Difficulty:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(["Easy", "Medium", "Hard"] as const).map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() => setDifficulty(lvl)}
                              className={`p-1.5 text-center text-xs font-semibold rounded-lg border transition cursor-pointer ${
                                difficulty === lvl
                                  ? (darkMode ? "bg-indigo-600 border-indigo-650 text-white" : "bg-slate-900 border-slate-900 text-white")
                                  : (darkMode ? "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850" : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100/55")
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Format selection */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                          Question Formats:
                        </label>
                        <select
                          value={format}
                          onChange={(e) => setFormat(e.target.value as any)}
                          className={`w-full text-xs p-2 rounded-lg focus:outline-none focus:ring-1 cursor-pointer font-sans transition-all ${
                            darkMode 
                              ? "bg-slate-950 border border-slate-800 text-slate-200 focus:ring-indigo-500" 
                              : "bg-slate-50 border border-slate-200 text-slate-800 focus:ring-slate-950 focus:bg-white"
                          }`}
                        >
                          <option value="multiple-choice" className={darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>Interactive Multiple-Choice Format</option>
                          <option value="authentic" className={darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>Authentic Document (Model Exam Structure)</option>
                        </select>
                      </div>

                      {/* Questions count */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex justify-between">
                          <span>Total Questions count:</span>
                          <span className={`font-mono font-extrabold transition-colors ${darkMode ? "text-indigo-400" : "text-slate-808"}`}>{questionsCount} Questions</span>
                        </label>
                        <input
                          type="range"
                          min="2"
                          max="10"
                          value={questionsCount}
                          onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
                          className={`w-full h-1 rounded-lg appearance-none cursor-pointer transition-colors ${
                            darkMode ? "bg-slate-800 accent-indigo-500" : "bg-slate-200 accent-slate-900"
                          }`}
                        />
                      </div>

                      {/* Custom instructions notes */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                          Special Instructions (Optional):
                        </label>
                        <textarea
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          placeholder="e.g. Include questions on dynamic programming, or model of actual formula equations..."
                          className={`w-full min-h-[70px] p-2.5 text-xs rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                            darkMode 
                              ? "bg-slate-950 border border-slate-800 text-slate-200 focus:ring-indigo-500 placeholder-slate-600 focus:bg-slate-950" 
                              : "bg-slate-50 border border-slate-200 text-slate-800 focus:ring-slate-950 focus:bg-white"
                          }`}
                        />
                      </div>

                      <button
                        id="generate-exam-btn"
                        onClick={handleGenerateExamSubmit}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow transition-all ${
                          darkMode 
                            ? "bg-indigo-600 hover:bg-indigo-550 text-white shadow-indigo-950/40" 
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                        Generate Custom Exam
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* GENERATED EXAMS HISTORY LIST */}
              {rightSidebarTab === "history" && (
                <div className="space-y-3">
                  <div className={`border-b pb-2 transition-colors ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                    <h3 className={`text-xs font-bold uppercase tracking-wider transition-colors ${darkMode ? "text-slate-400" : "text-slate-505"}`}>Exams Registry</h3>
                    <p className={`text-[11.5px] mt-1 transition-colors ${darkMode ? "text-slate-500" : "text-slate-400"}`}>View or toggle previous practice tests generated for this class.</p>
                  </div>

                  {activeWorkspace.exams.length === 0 ? (
                    <div className={`text-center py-6 border rounded-xl px-4 text-xs transition-colors ${
                      darkMode ? "bg-slate-900/50 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-405"
                    }`}>
                      Empty history. No exams have been generated yet for this course.
                    </div>
                  ) : (
                    activeWorkspace.exams.map((ex) => {
                      const isActive = activeWorkspace.activeExamId === ex.id || (!activeWorkspace.activeExamId && activeWorkspace.exams[0]?.id === ex.id);
                      return (
                        <div
                          id={`history-item-${ex.id}`}
                          key={ex.id}
                          onClick={() => handleSelectActiveExam(ex.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left block w-full relative ${
                            isActive
                              ? (darkMode ? "bg-slate-850 border-indigo-500 shadow-sm ring-1 ring-indigo-500" : "bg-white border-slate-900 shadow-sm ring-1 ring-slate-900")
                              : (darkMode ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300")
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h4 className={`text-xs font-semibold break-words leading-snug pr-4 transition-colors ${
                              darkMode ? "text-slate-100" : "text-slate-900"
                            }`}>
                              {ex.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteExam(ex.id, ex.title);
                              }}
                              className="text-slate-300 hover:text-red-650 p-0.5 absolute top-3.5 right-3.5"
                              title="Delete model exam"
                            >
                              <Trash2 className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase transition-colors ${
                              darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                            }`}>
                              {ex.questions.length} Items &bull; {ex.difficulty}
                            </span>
                            <span className="text-[9px] text-slate-400">
                              {new Date(ex.createdDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

            </div>
          </aside>

        </div>
      ) : (
         <div className={`flex-1 flex flex-col items-center justify-center p-12 text-center border-b transition-colors ${
          darkMode ? "bg-slate-950/25 border-slate-805 text-slate-100" : "bg-white border-b border-slate-200"
        }`}>
          <BookOpen className="w-14 h-14 text-slate-300 mb-3" />
          <h3 className={`text-base font-bold transition-colors ${darkMode ? "text-slate-200" : "text-slate-800"}`}>No Course Created</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Initiate a tabbed academic classroom space to proceed formatting exam templates with the compiler.
          </p>
        </div>
      )}

      {/* FOOTER METADATA BAR */}
      <footer className={`text-slate-400 border-t text-[10.5px] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 font-sans transition-colors ${
        darkMode ? "bg-slate-950 border-slate-805 text-slate-405" : "bg-slate-900 text-slate-400 border-slate-800"
      }`}>
        <div className="flex items-center gap-1 font-mono text-[10.5px]">
          <span>Applet State: Ready &bull; Practice Companion Grounded</span>
        </div>
        <p className="text-[10.5px] text-slate-500 font-medium font-sans">
          NotebookLM Mock Exam Engine &copy; 2026. Strictly aligned with course guides.
        </p>
      </footer>

      {/* MODAL: DELETE COURSE */}
      {classToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 border transition-colors ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="flex justify-between items-center pb-1">
              <h3 className={`text-sm font-bold uppercase tracking-wide transition-colors ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Delete Workspace</h3>
              <button 
                onClick={cancelDeleteClass}
                className={`text-xs font-bold transition-colors ${darkMode ? "text-slate-500 hover:text-slate-350" : "text-slate-400 hover:text-slate-600"}`}
              >
                Close
              </button>
            </div>
            <p className={`text-xs transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              Are you sure you want to delete the course workspace <strong>"{classToDelete.name}"</strong>? This will permanently remove all uploaded notes and generated practice exams aligned with this course.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={cancelDeleteClass}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteClass}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white tracking-wide transition-all bg-red-600 hover:bg-red-700"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD COURSE */}
      {addClassModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 border transition-colors ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-100 animate-none" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="flex justify-between items-center pb-1">
              <h3 className={`text-sm font-bold uppercase tracking-wide transition-colors ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Add New Course Workspace</h3>
              <button 
                onClick={() => setAddClassModalOpen(false)}
                className={`text-xs font-bold transition-colors ${darkMode ? "text-slate-500 hover:text-slate-350" : "text-slate-400 hover:text-slate-600"}`}
              >
                Close
              </button>
            </div>
            
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Course / Class Name:
                </label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. CS 101: Data Structures"
                  className={`w-full text-xs p-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                    darkMode 
                      ? "bg-slate-950 border-slate-800 text-slate-100 focus:ring-indigo-505 placeholder-slate-600" 
                      : "bg-white border-slate-200 focus:ring-slate-950 text-slate-905 placeholder-slate-400"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Description / Topic Scope:
                </label>
                <input
                  type="text"
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  placeholder="e.g. Arrays, linked lists, binary trees, sorting..."
                  className={`w-full text-xs p-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                    darkMode 
                      ? "bg-slate-950 border-slate-800 text-slate-105 focus:ring-indigo-505 placeholder-slate-600" 
                      : "bg-white border-slate-200 focus:ring-slate-950 text-slate-905 placeholder-slate-400"
                  }`}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2 rounded-lg text-xs font-bold shadow cursor-pointer transition-all ${
                  darkMode 
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white" 
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                Create Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD SOURCE DOC */}
      {editorModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 border transition-colors max-h-[90vh] overflow-y-auto ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className={`flex justify-between items-center pb-2 sticky top-0 z-10 pt-1 -mt-1 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
              <h3 className={`text-sm font-bold flex items-center gap-1.5 uppercase tracking-wide transition-colors ${
                darkMode ? "text-slate-100" : "text-slate-950"
              }`}>
                <UploadCloud className="w-5 h-5 text-slate-400" />
                {pendingUploads.length > 0 ? "Classify Imported Files" : "Upload Grounding Document"}
              </h3>
              <button 
                onClick={() => {
                  setEditorModalOpen(false);
                  setPendingUploads([]);
                }}
                className={`text-xs font-bold transition-colors ${darkMode ? "text-slate-500 hover:text-slate-350" : "text-slate-400 hover:text-slate-600"}`}
              >
                Cancel
              </button>
            </div>

            {pendingUploads.length > 0 ? (
              <div className="space-y-4">
                <p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Please verify the document titles and categories for the files you just imported.
                </p>
                <div className="space-y-3">
                  {pendingUploads.map((src) => (
                    <div key={src.id} className={`p-3 rounded-xl border space-y-3 ${
                      darkMode ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex justify-between gap-3 items-center">
                        <input
                          type="text"
                          required
                          value={src.title}
                          onChange={(e) => updatePendingUpload(src.id, { title: e.target.value })}
                          className={`flex-1 text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                            darkMode 
                              ? "bg-slate-900 border-slate-700 text-slate-200 focus:ring-indigo-505 placeholder-slate-600" 
                              : "bg-white border-slate-300 focus:ring-slate-950 text-slate-905 placeholder-slate-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => removePendingUpload(src.id)}
                          className={`text-xs font-bold px-1 transition-colors ${darkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-400"}`}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {(["notes", "exam", "problems"] as const).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => updatePendingUpload(src.id, { type: t })}
                            className={`p-1.5 rounded-lg text-[10px] font-semibold cursor-pointer border text-center transition-all ${
                              src.type === t
                                ? (darkMode ? "bg-indigo-600 border-indigo-650 text-white shadow" : "bg-slate-900 border-slate-900 text-white shadow")
                                : (darkMode ? "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100")
                            }`}
                          >
                            {t === "notes" ? "Class Notes" : t === "exam" ? "Model Exam" : "Class Problems"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleConfirmBatchUpload}
                  className={`w-full py-2.5 rounded-lg text-[12px] font-bold shadow transition-all duration-150 cursor-pointer ${
                    darkMode 
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40" 
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  Confirm & Add to Workspace
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddSource} className="space-y-4">
              {/* Drag & Drop .txt Zone */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 animate-neutral">
                  Quick Import .txt Document File (Optional):
                </label>
                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleTextFilesRead(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => {
                    document.getElementById("txt-file-input")?.click();
                  }}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    dragActive 
                      ? (darkMode ? "border-indigo-500 bg-indigo-950/25" : "border-indigo-650 bg-indigo-50/50")
                      : (darkMode ? "border-slate-800 hover:border-slate-700 bg-slate-950/20" : "border-slate-200 hover:border-slate-350 bg-slate-50/20")
                  }`}
                >
                  <input 
                    id="txt-file-input"
                    type="file"
                    multiple
                    accept=".txt"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleTextFilesRead(e.target.files);
                      }
                    }}
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    <UploadCloud className={`w-6 h-6 animate-pulse ${darkMode ? "text-slate-505" : "text-slate-400"}`} />
                    <p className={`text-xs ${darkMode ? "text-slate-200" : "text-slate-705"}`}>
                      Drop your <span className="font-semibold font-mono text-[10.5px]">.txt</span> files here or <span className="text-indigo-500 hover:text-indigo-400 underline font-semibold transition-colors">browse files</span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Imports multiple plain text files directly into your workspace.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Document Title:
                </label>
                <input
                  type="text"
                  required
                  value={newSourceTitle}
                  onChange={(e) => setNewSourceTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 lecture summary, or Practice Midterm 2024"
                  className={`w-full text-xs p-2.5 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                    darkMode 
                      ? "bg-slate-950 border-slate-800 text-slate-105 focus:ring-indigo-505 placeholder-slate-600" 
                      : "bg-white border-slate-200 focus:ring-slate-950 text-slate-905 placeholder-slate-400"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Document Type / Workspace Category:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSourceType("notes")}
                    className={`p-1.5 rounded-lg text-[11px] font-semibold cursor-pointer border text-center transition-all ${
                      newSourceType === "notes"
                        ? (darkMode ? "bg-indigo-600 border-indigo-650 text-white shadow" : "bg-slate-900 border-slate-900 text-white shadow")
                        : (darkMode ? "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50")
                    }`}
                  >
                    Class Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSourceType("exam")}
                    className={`p-1.5 rounded-lg text-[11px] font-semibold cursor-pointer border text-center transition-all ${
                      newSourceType === "exam"
                        ? (darkMode ? "bg-indigo-600 border-indigo-650 text-white shadow" : "bg-slate-900 border-slate-900 text-white shadow")
                        : (darkMode ? "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50")
                    }`}
                  >
                    Model Exam
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSourceType("problems")}
                    className={`p-1.5 rounded-lg text-[11px] font-semibold cursor-pointer border text-center transition-all ${
                      newSourceType === "problems"
                        ? (darkMode ? "bg-indigo-600 border-indigo-650 text-white shadow" : "bg-slate-900 border-slate-900 text-white shadow")
                        : (darkMode ? "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50")
                    }`}
                  >
                    Class Problems
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Paste Study Text / Document Contents:
                </label>
                <textarea
                  required
                  value={newSourceContent}
                  onChange={(e) => setNewSourceContent(e.target.value)}
                  placeholder="Paste lecture logs, syllabus outlines, slides transcriptions, homework assignments, or existing practical class problems & guides..."
                  className={`w-full min-h-[150px] p-2.5 text-xs rounded-lg border focus:outline-none focus:ring-1 transition-all font-sans ${
                    darkMode 
                      ? "bg-slate-950 border-slate-800 text-slate-200 focus:ring-indigo-505 placeholder-slate-600 focus:bg-slate-950" 
                      : "bg-slate-50 border-slate-200 text-slate-805 focus:bg-white focus:ring-slate-900"
                  }`}
                />
              </div>

              <div className={`rounded-lg p-3 border text-[10.5px] leading-relaxed font-sans transition-colors ${
                darkMode ? "bg-slate-950/60 border-slate-805 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}>
                ℹ️ Class Problems directly instruct the exam generator on the practical, numerical, coding, or mathematical elements of the curriculum!
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-lg text-[12px] font-bold shadow transition-all duration-150 cursor-pointer ${
                  darkMode 
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40" 
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                Ground Document to Active Class
              </button>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
