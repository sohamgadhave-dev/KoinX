# KoinX - Tax Loss Harvesting Tool

[![Live Demo](https://img.shields.io/badge/demo-Live%20View-blue.svg)](https://koinx-lyart-iota.vercel.app/)
[![React](https://img.shields.io/badge/react-19.1.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-7.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

A modern, highly optimized web application built for **KoinX** to help users visualize and optimize their crypto taxes through strategic tax loss harvesting. 

This project simulates a real-world dashboard that computes a user's pre-harvesting and post-harvesting capital gains, showcasing exactly how much they can save by offsetting their short-term and long-term capital gains against their losses.

## 🚀 Key Features

- **Tax Optimization Engine:** Dynamically calculates realized vs. effective capital gains and visualizes potential tax savings.
- **Interactive Holdings Data:** 
  - **Sortable Columns:** Users can sort assets based on Short-term or Long-term gains.
  - **Smart Formatting:** Large numbers are beautifully abbreviated (e.g., `$104.39K`) with precision tooltips revealing exact values on hover.
  - **Stateful Selection:** Checkbox states are preserved even when the table is sorted or paginated.
- **Theming & Responsiveness:** 
  - Flawless **Light and Dark mode** compatibility integrated via CSS variables.
  - **Fully Responsive:** Layout flawlessly adapts from large 4K monitors down to mobile devices using CSS Grid and Flexbox.
- **Polished UI/UX:** Features custom CSS tooltips, smooth hover states, dynamic skeleton loaders for simulated API delays, and precise typography matching modern FinTech standards.

## 🛠️ Technology Stack & Architecture

- **Core:** React 19, JavaScript (ES6+), HTML5.
- **Build Tool:** Vite (chosen for lightning-fast HMR and optimized production bundling).
- **Styling:** Vanilla **CSS Modules**. 
  - *Why CSS Modules?* They provide local scoping, preventing global namespace collisions, while keeping the application lightweight without relying on heavy external styling libraries (like Tailwind or MUI). A robust `index.css` acts as the design system token registry (colors, typography, spacing).
- **State Management:** React Context API (`HarvestingContext`) combined with custom hooks for predictable, centralized state architecture.

## 📂 Project Structure

```text
src/
├── api/                   # Mock API simulation and data fetching logic
├── components/            # Isolated, reusable UI components
│   ├── CapitalGainsCards/ # Top-level summary cards (Pre & Post Harvesting)
│   ├── HoldingsTable/     # Sortable data grid for individual crypto assets
│   ├── Disclaimer/        # Sticky informational footer
│   └── Header/            # Application header with theme toggle
├── context/               # React Context providers (Harvesting, Theme)
├── utils/                 # Pure helper functions (number formatters, currency logic)
├── index.css              # Global design tokens (CSS Variables)
└── main.jsx               # Application entry point
```

## 💻 Local Setup & Installation

Follow these instructions to run the project in your local development environment:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sohamgadhave-dev/KoinX.git
   cd koinX-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`.*

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🧠 Technical Decisions & Challenges Solved

- **Precision vs. Readability:** Displaying large financial numbers can clutter the UI. I built a custom formatting utility (`formatAbbreviated`) that rounds large numbers into clean `$K` or `$M` suffixes while retaining absolute precision via custom CSS tooltips on hover.
- **Sorting with Preserved State:** Implementing table sorting required abstracting the original array indices so that React's state management wouldn't lose track of which specific rows the user had selected when the sort order changed.
- **Vercel Compatibility:** Resolved Node binary path execution discrepancies between local Windows environments and Vercel's Linux runners by strictly standardizing the `package.json` build scripts.

---
*Developed by Soham Gadhave
*
