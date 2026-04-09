# CloserAI — AI Voice Sales Assistant

CloserAI is a premium SaaS platform designed for freelancers to automate their outbound sales calls using Bolna Voice AI.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Bolna AI Account (API Key & Agent ID)
- Twilio Account (Optional, for custom telephony)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```
3. Configure environment variables in `.env.local`:
   ```env
   BOLNA_API_KEY=your_key
   BOLNA_AGENT_ID=your_agent_id
   # Optional
   BOLNA_FROM_PHONE_NUMBER=your_twilio_number
   BOLNA_TELEPHONY_PROVIDER=twilio
   ```

### Running the App
1. Start the backend:
   ```bash
   cd server && npm start
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000`

## 🛠 Tech Stack
- **Frontend:** Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express
- **AI Engine:** Bolna Voice AI
- **Telephony:** Twilio (Integrated via Bolna)
