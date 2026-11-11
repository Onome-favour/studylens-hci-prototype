# StudyLens — Explainable Learning Recommendation Prototype

StudyLens is an HCI research prototype exploring how explainable, rule-based personalized learning recommendations can support learner understanding, engagement, and agency.

The prototype uses learning history, quiz performance, topic progress, and review recency to identify areas that may require attention. Rather than presenting recommendations as unexplained outputs, StudyLens provides a "Why?" interaction that allows learners to examine the factors behind each suggestion.

---

## Core Features

- **Personalized topic recommendations** using deterministic rule-based logic.
- **Recommendation explanations** showing the factors behind each suggestion.
- **Learning progress and course completion tracking**.
- **Quiz performance and learning history**.
- **Topic summaries and short diagnostic quizzes**.
- **Learner control** through accepting, overriding, dismissing, and restoring recommendations.
- **Reflection and recommendation interaction tracking**.
- **JSON data export** for research and inspection.

---

## Research Focus

StudyLens explores:

- **Explainable recommendation systems**: Communicating algorithmic reasoning through progressive disclosure.
- **Personalized learning technologies**: Adapting study guidance to student activity and performance.
- **Learner agency and control**: Empowering students to inspect, accept, override, or dismiss recommendations.
- **Human-computer interaction in educational technology**: Designing transparent, non-intrusive learning interfaces.
- **Transparency in algorithmic decision-making**: Calibrating appropriate trust without opaque "black-box" outputs.

---

## Technical Implementation

- **Framework**: React 18
- **Language**: JavaScript (ES modules)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Persistence**: Browser `localStorage` (Schema Version 2)
- **Logic**: Deterministic, rule-based recommendation logic (multi-factor priority scoring)
- **Testing**: Vitest and React Testing Library

---

## Prototype Status and Limitations

StudyLens is an early-stage research and demonstration prototype. Its recommendation engine uses predefined rules rather than a trained machine learning model or external AI service.

It has not yet been validated through a formal study involving real learners. Its recommendations should therefore be understood as prototype outputs, not evidence of proven improvements in learning outcomes.

- **Live Demo**: [https://studylens-hci-prototype.vercel.app/](https://studylens-hci-prototype.vercel.app/)
- **GitHub Repository**: [https://github.com/Onome-favour/studylens-hci-prototype](https://github.com/Onome-favour/studylens-hci-prototype)

---

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Onome-favour/studylens-hci-prototype.git
   cd studylens-hci-prototype
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. Run tests:
   ```bash
   npm test
   ```

5. Build for production:
   ```bash
   npm run build
   ```
