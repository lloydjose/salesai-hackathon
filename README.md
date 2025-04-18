Please note: in live version some analysis might fail because of vercel timeout on my plan, please test locally if needed

# Scalaro - AI Sales Copilot 🚀 (Next.js Global Hackathon 2025 Submission)

![Scalaro Banner](https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/landing1.png)

**⚠️ Important Note:** Some features involving longer AI analysis (like Conversation Intelligence reports) might experience timeouts on the Vercel Hobby plan due to execution limits. For full testing, running the application locally is recommended.

Scalaro is an AI-powered copilot designed to help sales professionals research, train and close more deals, faster. Built for the Next.js Global Hackathon 2025, Scalaro integrates cutting-edge AI into every step of the sales workflow powered by AI SDK
---

## ✨ Core Features (Dashboard)

Our intuitive dashboard provides a central hub for all your sales activities:

*Main Dashboard View*
<img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/dashboardhome.png" alt="Scalaro Main Dashboard" width="600">

### 1. Prospect Research & Intelligence Hub 🎯

Understand your prospects deeply before you even reach out. Add linkedin url and analyze any prospect with AI to gain insights about them.

*   **AI-Powered Prospect Analysis:** Get insights into prospect needs, pain points, and potential fit based on available data (e.g., LinkedIn profiles, company info).
*   **Lead Qualification:** Quickly identify high potential leads worth pursuing.
*   **Centralized Prospect View:** Manage and track your key prospects in one place.

    *Prospect Management Page*
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/prospectpage.png" alt="Scalaro Prospect Research Page" width="600">

### 2. AI Cold Email Generator ✍️

Hyper-personalized cold emails that actually get replies for the saved prospects.

*   **Contextual Email Generation:** Input key details (prospect info, goal, context) and let AI generate tailored email drafts.
*   **Multiple Styles & Angles:** Choose from various psychological angles and writing styles (e.g., AIDA, PAS) to match your strategy.
*   **Personalization Suggestions:** AI identifies key personalization points based on prospect data.

    *Cold Email Home & Editor*
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/coldemailhome.png" alt="Scalaro Cold Email Home" width="600">
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/coldemailedit.png" alt="Scalaro Cold Email Editor" width="600">

### 3. Pre-Call Planner 📋

Enter every sales call prepared and confident.

*   **AI-Generated Briefs:** Automatically create structured call prep briefs based on prospect data and your objectives.
*   **Key Talking Points:** Identify crucial discussion topics, potential objections, and relevant questions.
*   **Customizable Templates:** Adapt prep plans to your specific sales methodology.

    *Generated Pre-Call Plan*
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/prospectbrief.png" alt="Scalaro Pre-Call Planner Brief" width="600">

### 4. Realtime Call Simulator & Training 💪

To practive your pitch and objection handling skills in realistic, AI-driven scenarios.

*   **Dynamic AI Personas:** Engage in simulated sales calls with AI personas that react dynamically based on the conversation.
*   **Objection Handling Practice:** Encounter common objections and practice your responses in a safe environment.
*   **Instant Feedback:** Receive detailed feedback on your performance, including metrics on talk ratio, sentiment, keywords hit, and areas for improvement.

    *Call Simulation Setup, Live Call & Feedback*
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/callsimulatorhome.png" alt="Scalaro Call Simulation Home" width="600">
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/livecall.png" alt="Scalaro Live Call Simulation" width="600">
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/callsimfeedback2.png" alt="Scalaro Call Simulation Feedback Example 2" width="600">

### 5. Conversation Intelligence 🧠

Upload call recordings and let AI dissect the conversation.

*   **Automated Transcription:** Get accurate transcripts of your sales calls.
*   **AI Call Analysis:** Uncover key moments, topic summaries, sentiment analysis, talk patterns, and actionable insights.
*   **Identify Winning Strategies:** Understand what works best in your successful calls and replicate it.

    *Conversation Intelligence Home & Report Example*
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/conversationintelligencehome.png" alt="Scalaro Conversation Intelligence Home" width="600">
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/conversationintelligencereport2.png" alt="Scalaro Conversation Intelligence Report Example 2" width="600">

### 6. Account Management ⚙️

Manage your user profile and billing details seamlessly.

*   **Profile Settings:** Update your sales role, company, and preferences.
*   **Billing & Subscription:** (If applicable) Manage your subscription plan.

    *Account & Billing Pages*
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/myaccount.png" alt="Scalaro My Account Page" width="600">
    <img src="https://pub-11879fc256c94418b7c449d197ff9615.r2.dev/previews/billing.png" alt="Scalaro Billing Page" width="600">

---

## 🛠️ Tech Stack

*   **Framework:** Next.js (App Router)
*   **Authentication:** Better Auth With One Tap, Stripe, Organization,
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **AI:** Vercel AI SDK, OpenAI, Google Generative AI, AssemblyAI, Vapi
*   **Deployment:** Vercel

---

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <repo-name>
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install # or npm install / yarn install
    ```
3.  **Set up environment variables:**
    *   Create a `.env` file.
    *   Fill in necessary API keys (OpenAI, AssemblyAI, Database URL, Auth secrets, Vapi etc.).
4.  **Set up the database:**
    ```bash
    npx prisma migrate dev
    # Optional: Seed the database if you have a seed script
    # npx prisma db seed
    ```
5.  **Run the development server:**
    ```bash
    pnpm dev # or npm run dev / yarn dev
    ```
6.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏆 Hackathon Submission

This project is submitted for the **Next.js Global Hackathon 2025**. My goal was to leverage the power of Next.js, Vercel, and AI to build a transformative tool for sales professionals.