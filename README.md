# 📝 Paper GenAI - PCTB & FBISE Exam Paper Generator

Welcome to **Paper GenAI**, a specialized AI-powered application designed exclusively for Pakistani students and educators. It automatically generates authentic, past-paper-style exam papers tailored to the Punjab Textbook Board (PCTB) and Federal Board (FBISE) syllabus, and features an integrated AI study assistant.

## 🚀 Key Features

* **Intelligent Paper Generation:** Creates perfectly formatted Objective (MCQs) and Subjective (Short/Long questions) exam papers for various Punjab boards (Lahore, Faisalabad, Multan, etc.) and FBISE.
* **Strict Syllabus Adherence:** The AI is strictly prompted to use ONLY facts, formulas, and topics from the official PCTB/FBISE curriculum—no out-of-syllabus content!
* **Multiple AI Model Fallback System:** Built-in resilience with robust API fallbacks between Google Gemini (Pro/Flash) and Groq (Llama 3, Mixtral, Gemma) to ensure 100% uptime even during rate limits.
* **AI Study Assistant:** A dedicated Chat feature for students to ask questions, solve physics/math numericals step-by-step, or clarify concepts in English, Urdu, or Roman Urdu.
* **Vercel Ready:** Seamless deployment support with an Express.js backend serving a static frontend.

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript (Vanilla SPA)
* **Backend:** Node.js with Express
* **AI Integration:** Google Gemini API & Groq API
* **Deployment:** Vercel

## ⚙️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd paper-genai-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 🤝 Contribution

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

---
*Built to assist and elevate the educational ecosystem of Pakistan. 🇵🇰*
