# 📊 AI Feedback Analyzer

A modern web application designed for intelligent customer feedback analysis.
The system leverages Artificial Intelligence to perform sentiment analysis, identify key topics, and visualize insights in real-time.

## ✨ Features

- AI-Powered Sentiment Analysis — Automatically categorizes reviews into Positive, Negative, or Neutral.
- Topic Extraction — Identifies primary themes mentioned by users (e.g., Quality, Pricing, Service).
- Interactive Dashboards — Data visualization using line charts, bar charts, and doughnut charts.
- Trend Tracking — Monitors changes in user sentiment over time with a monthly timeline.
- Professional PDF Export — Generates high-quality analytical reports in a single click.
- Full Responsiveness — Optimized UI for desktops, tablets, and smartphones.

## 🛠 Tech Stack

- Frontend: Next.js 15+ (App Router, TypeScript)
- Styling: Tailwind CSS v4
- Visualizations: Chart.js & react-chartjs-2
- PDF Generation: jsPDF & html-to-image
- AI Engine: LLM Integration via Next.js API Routes

## 🚀 Getting Started

1. Clone the repository

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

2. Install dependencies

npm install

3. Configure Environment Variables

Create a .env.local file in the root directory and add your API key:

OPENAI_API_KEY=your_api_key_here

4. Run the development server

npm run dev

Open http://localhost:3000 in your browser to see the result.

📱 Mobile Optimization

The project follows a mobile-first design approach:

- KPI Cards — Adaptive grid (1 column on mobile, 3 columns on desktop)
- Charts — Responsive scaling with optimized font sizes and touch-friendly tooltips
- Review Table — Automatically transforms into a card-based layout on small screens
- Pagination — Includes a Show More feature for large datasets on mobile devices

📂 Project Structure

/app        — Next.js pages and API routes
/components — Reusable React components (Charts, ReviewTable, KPICard)
/lib        — Helper functions (PDF export logic, analysis utilities)
/types      — TypeScript interfaces and type definitions

📄 Exporting Reports

PDF export is powered by html-to-image, ensuring full compatibility with modern CSS features such as oklch and oklab provided by Tailwind CSS v4.
