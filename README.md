# Bizanolytics 

**Bizanolytics** is an AI-native commerce intelligence dashboard designed to empower Small and Medium Enterprises (SMEs) in emerging markets (starting with Bangladesh) to eliminate stockouts and maximize margins through real-time demand forecasting and automated inventory analytics.

Built for **The Infinity AI Buildfest 2026** (Track 4: Online Commerce, Category: AI-Driven Marketplace Optimization).

## 🚀 The Core Problem & Solution

**The Problem:** SMEs suffer from severe stock inefficiency, low margins, and poor analytics. Because they rely on intuition rather than data to manage inventory, they face massive revenue loss from stockouts and capital tied up in dead stock. As the digital economy scales, SMEs without access to predictive analytics cannot compete with large enterprises and desperately need an accessible, low-friction tool to democratize data intelligence.

**The Solution:** We built a serverless, real-time intelligence dashboard. SMEs simply upload their raw sales data (CSV) and the system instantly provides:
1. **Dynamic Demand Forecasting:** Mathematical modeling of future sales trends.
2. **Regional Analytics Map:** An interactive Bangladesh map detailing district and upazila-level demand hotspots.
3. **LPU-Powered AI Insights:** Integrated with Meta's **Llama 3** model (via Groq API) to act as a digital Chief Operating Officer, providing real-time, plain-English inventory and pricing recommendations.

## 🧠 AI Architecture (System Flow)

Our system utilizes a modern Edge-AI architecture to ensure lightning-fast speed and zero hosting costs:
* **Input Layer:** User uploads raw, unstructured CSV sales data.
* **Processing Layer (Zero-Latency):** A Next.js client-side engine parses the data, calculates moving averages, and aggregates metrics instantly in-memory.
* **AI Intelligence Layer:** A structured data summary is securely routed to the **Meta Llama 3 API via Groq** using a serverless endpoint. The LLM performs lightning-fast reasoning to generate high-value business insights.
* **Data Privacy:** Raw transaction data never leaves the user's browser. Only high-level, anonymized mathematical summaries are transmitted to the AI layer, ensuring full compliance with commercial privacy standards.

## 🛠️ Tech Stack

- **Frontend:** Next.js 16.2.6 (App Router), React, Tailwind CSS, Framer Motion
- **Visualizations:** Recharts, React-Leaflet
- **AI Intelligence:** Meta Llama 3 (via Groq SDK)
- **Deployment:** Vercel (Serverless Edge Architecture)

## 📦 Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Set up your environment variables by creating a `.env.local` file:
   ```env
   GROQ_API_KEY=gsk_your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deploying to Vercel

This project is perfectly optimized for Vercel edge deployment. 
1. Push this repository to GitHub.
2. Go to Vercel -> Add New Project -> Import your repo.
3. In the Environment Variables section, add your `GROQ_API_KEY`.
4. Click Deploy! 

## 📈 Scalability Roadmap

While our current BuildFest prototype uses edge-memory to ensure a flawless and blazing-fast demo, our architecture is designed for enterprise-scale evolution:
* **Phase 2 (Agentic Orchestration & Cloud Storage):** Integrating with Supabase to securely store historical data, while deploying autonomous agents that can automatically re-order inventory via API integrations with local suppliers when stock hits a critical threshold.
* **Phase 3 (Multimodal Ledger Digitization):** Allowing SME owners to simply take a smartphone photo of their traditional physical ledgers ("Khatas") or paper receipts. Using advanced OCR and Vision capabilities, the system will automatically extract handwriting/text into structured CSV data for instant dashboard analysis.
* **Phase 4 (Cross-Border Expansion):** Expanding the geographic JSON mapping to support SMEs in neighboring emerging markets across South Asia.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.