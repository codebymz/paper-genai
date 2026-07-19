const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { BOARD_TEMPLATES, renderTemplateBlueprint } = require('./boardTemplates');

const app = express();

// Security: allow CORS only from trusted origins (prevents quota abuse from any website)
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'https://paper-genai.lovable.app',
];
app.use(cors({
  origin: function (origin, cb) {
    // allow non-browser requests (no origin header)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);

    // Disallow everything else
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));


const port = process.env.PORT || 3000;

// ── LLM UTILITY WITH FALLBACK ────────────────────────────────
async function callLLMWithFallback(messages, stream = false) {
  const geminiFlash = process.env.GEMINI_FLASH_MODEL || "gemini-3.5-flash";
  const geminiPro = process.env.GEMINI_PRO_MODEL || "gemini-2.5-flash";

  // Priority fallback list
  const fallbackModels = Array.from(new Set([
    geminiFlash,
    geminiPro,
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "gemini-2.0-flash",
    "mixtral-8x7b-32768",
    "gemma2-9b-it"
  ]));

  const errors = [];

  for (const model of fallbackModels) {
    const isGroq = model.startsWith("llama-") || model.startsWith("mixtral-") || model.startsWith("gemma");
    const apiKey = isGroq ? process.env.GROQ_API_KEY : process.env.GEMINI_API_KEY;

    if (isGroq && !process.env.GROQ_API_KEY) {
      console.log(`Skipping Groq model ${model} - GROQ_API_KEY not configured`);
      continue;
    }
    if (!isGroq && !process.env.GEMINI_API_KEY) {
      console.log(`Skipping Gemini model ${model} - GEMINI_API_KEY not configured`);
      continue;
    }

    const url = isGroq 
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

    console.log(`Attempting LLM call with model: ${model} (Streaming: ${stream})`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: stream,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Error from model ${model} (${response.status}):`, errText);
        errors.push({ model, status: response.status, error: errText });
        continue;
      }

      console.log(`Successfully connected using model: ${model}`);
      return { response, model };
    } catch (err) {
      console.error(`Network error with model ${model}:`, err.message);
      errors.push({ model, error: err.message });
    }
  }

  // Build a clean user-facing message
  const hasQuota = errors.some(e => e.status === 429);
  const hasUnavail = errors.some(e => e.status === 503);
  const noGroqKey = !process.env.GROQ_API_KEY;

  let friendlyMsg = "Paper generate nahi ho saka.";
  if (hasQuota && hasUnavail) {
    friendlyMsg = "AI models busy hain — kuch seconds baad dobara try karein. Agar bar bar ho raha hai to Groq API key add karein.";
  } else if (hasQuota) {
    friendlyMsg = noGroqKey
      ? "Gemini ka free quota khatam ho gaya. Kuch der baad try karein ya GROQ_API_KEY apni .env mein add karein."
      : "Gemini quota khatam — Groq fallback bhi fail hua. Thori der baad retry karein.";
  } else if (hasUnavail) {
    friendlyMsg = "AI servers par zyada load hai — 30 seconds baad dobara try karein.";
  }

  const err = new Error(friendlyMsg);
  err.details = errors;
  throw err;
}

// ── ENDPOINTS ────────────────────────────────────────────────

// 1. Chat Endpoint (SSE Streaming)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const systemPrompt = `You are a helpful and expert study assistant for Pakistani students studying under Punjab Board (BISE) / Federal Board (FBISE).
Your goal is to answer the student's study-related questions accurately, directly, and comprehensively based on your extensive knowledge of the PCTB/FBISE curriculum.

STRICT KNOWLEDGE SCOPE:
1. Infer the subject and class based on the student's question. You do NOT need the user to tell you the class or subject unless it's ambiguous.
2. Reply in the same language the student uses (Urdu, English, or Roman Urdu).
3. Use clean Markdown — headings, bullets, short paragraphs.
4. Never invent formulae, dates or definitions. If unsure, say so.
5. Provide step-by-step solutions for Math or Physics numericals.
6. If the student asks something completely unrelated to studies, gently steer them back to educational topics.
7. You must generate the response solely using your pre-trained knowledge.
`;

    const { response, model } = await callLLMWithFallback(
      [{ role: "system", content: systemPrompt }, ...messages],
      true
    );

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Selected-Model", model);

    if (response.body) {
      for await (const chunk of response.body) {
        res.write(chunk);
      }
    }
    res.end();
  } catch (err) {
    console.error("chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Generate Paper Endpoint
app.post('/api/generate-paper', async (req, res) => {
  try {
    const {
      classLevel,
      subject,
      board,
      paperType,
      language,
      totalMarks,
      instructions,
      paperVariant,
      useBoardTemplate,
      chapters,
    } = req.body;

    const chaptersText = (chapters && chapters !== 'all') 
      ? `Specific chapters: ${Array.isArray(chapters) ? chapters.join(", ") : chapters}`
      : "All chapters (Full Book)";

    const systemPrompt = `You are an expert exam paper setter for Pakistan's Punjab Textbook Board (PCTB) and Federal Board (NBF). You produce authentic past-paper-style question papers matching BISE Lahore, Faisalabad, Sahiwal, Multan, Gujranwala, Rawalpindi, DG Khan, Sargodha, Bahawalpur and FBISE styles.

ABSOLUTE RULES — STRICTLY ENFORCED:
1. You MUST build every question ONLY from facts, definitions, formulae, examples and topics that are officially part of the PCTB/FBISE curriculum for the requested class and subject.
2. Do NOT use outside knowledge, other curricula (CIE, NCERT, IB), Wikipedia, your own examples, or anything not present in the official syllabus.
3. Match the exact format/style of the chosen board's past papers (header, sections, instruction wording).
4. Follow the requested paper type and language strictly.
5. KEEP IT COMPACT — must fit within 2 A4 pages at 11pt body text:
   - Short single-line section instructions.
   - No repetition across MCQ / Short / Long.
   - No verbose preambles or explanations.
6. MCQs: Place the question text on one line. On the very next line, format the four options as a borderless HTML table with class "options-table".
   - If options are short, format as 4 columns in 1 row: <table class="options-table"><tr><td>(A) Option 1</td><td>(B) Option 2</td><td>(C) Option 3</td><td>(D) Option 4</td></tr></table>.
   - If options are long, format as a 2x2 grid (2 columns, 2 rows).
   - Put a small Answer Key at the very end of the Objective section.
7. Short Q: 2–3 marks each, ~2-line expected answer.
8. Long Q: 8–10 marks each, with internal "OR" choice.
9. Output clean printable Markdown/HTML content only. Do not add markdown boxes, code fences around the tables, or raw bullet lists for options.
10. Separator: If the paper has multiple parts (e.g. both Objective and Subjective), separate them with the exact string "---PAGE_BREAK---" on its own line. Do not repeat the board header inside the paper content; the template placeholders will render headers.`;

    const variantNote = paperVariant && paperVariant > 1
      ? `\n- This is PAPER VARIANT #${paperVariant}. Pick DIFFERENT questions, wording and ordering than other variants.`
      : "";

    const tpl = BOARD_TEMPLATES[board];
    const blueprint = useBoardTemplate !== false ? renderTemplateBlueprint(board, paperType) : "";
    const templateBlock = blueprint
      ? `

EXACT BOARD TEMPLATE TO FOLLOW (${tpl?.displayName || board}):
Reproduce this exact template structure, replacement placeholders ({CLASS}, {SUBJECT}, {GROUP}, {SESSION}, {TIME_OBJ}, {TIME_SUB}, {MARKS_OBJ}, {MARKS_SUB}, {TOTAL_MARKS}, {PAPER_CODE}) and header tables verbatim.

\`\`\`
${blueprint}
\`\`\`

After the template header tables, place the actual generated questions. Remember to separate the Objective and Subjective parts with "---PAGE_BREAK---" exactly as specified in the blueprint.`
      : "";

    const userPrompt = `Generate a ${paperType} paper with these specifications:
- Class: ${classLevel}
- Subject: ${subject}
- Board: ${board}
- Scope: ${chaptersText}
- Language: ${language}
- Total Marks: ${totalMarks}
- Extra instructions: ${instructions || "None"}${variantNote}${templateBlock}

Generate the complete paper content now. Make sure to place MCQ options in options-table HTML structure on the line directly below the question.`;

    const { response, model } = await callLLMWithFallback([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], false);

    const data = await response.json();
    const paper = data.choices?.[0]?.message?.content || "";

    return res.json({ paper, model });
  } catch (err) {
    console.error("generate-paper error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend files with automatic html extension matching
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// Default route (SPA fallback)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Local dev server
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for Vercel serverless
module.exports = app;
