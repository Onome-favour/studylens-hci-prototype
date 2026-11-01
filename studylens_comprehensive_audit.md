# StudyLens: Comprehensive Codebase, Product, and Research-Readiness Audit

**Document Title:** StudyLens Comprehensive Codebase, Product, and Research-Readiness Audit  
**Target Repository:** `D:\xampp_new\htdocs\HCI LEARNING PROJECT` (`https://github.com/Onome-favour/studylens-hci-prototype.git`)  
**Audit Date:** October 30, 2026  
**Auditor:** Antigravity AI (Google DeepMind Advanced Agentic Coding)  
**Scope:** Architecture, Source Code, Learning Analytics, Metacognition/SRL, Recommendation Engine, Data Models, Testing, Security, and Research Alignment.

---

## 1. Executive Summary

StudyLens is an early-stage, client-side Human-Computer Interaction (HCI) research prototype developed for an MSc HCI dissertation. Its stated purpose is to investigate how interface design, explainability, and transparency can support students in understanding their learning progress and deciding what to study next, while preserving learner agency and appropriate trust.

### Key Verified Findings
1. **Interactive Prototype Scope:** StudyLens is implemented as a standalone React 18 single-page application (SPA) built with Vite and Tailwind CSS. It has **no backend server**, **no database**, **no external APIs**, and **no authentication**.
2. **Transparent Deterministic Recommendation Engine:** The current recommendation system is 100% deterministic arithmetic logic (`src/data/recommendationEngine.js`), combining four weighted factors (Performance: 40%, Recency: 25%, Status: 20%, Prerequisites: 15%) on a 100-point scale. It contains **no machine learning models, no neural networks, and no external LLM APIs**.
3. **Exemplary Human-AI Interaction (XAI) Design:** The application excels in progressive disclosure and transparent communication. It provides a multi-level explanation ("Why this recommendation?"), transparent scoring weights, natural-language rationales, and explicit user control ("Choose another topic", "Dismiss"). The prototype maintains strict academic honesty through persistent disclaimers (`TransparencyFooter.jsx`, `PrototypeBadge.jsx`, `AboutPage.jsx`).
4. **Learning Analytics & Persistence Limitations:** All student state is stored in browser `localStorage` (`studylens-learning-history`). Crucially, the system **overwrites** previous quiz attempt scores with the latest attempt. It does not record historical time-series data, response latencies, item-level distractor selections, or student study patterns.
5. **Educational & SRL Readiness:** While the prototype successfully demonstrates the interface loop of recommendation $\rightarrow$ explanation $\rightarrow$ quiz activity $\rightarrow$ updated recommendation, it currently lacks essential Self-Regulated Learning (SRL) capabilities such as goal-setting (Forethought), confidence monitoring during study (Performance), and structured mistake analysis/reflection prompts (Self-Reflection).
6. **Suitability for Research:** The existing foundation is **exceptionally well-suited as a front-end testbed for HCI user studies** evaluating transparency, user agency, and interface trust. However, to evolve into a genuine Learning Analytics (LA) and Adaptive Learning research platform, it requires a persistent relational schema preserving historical learning traces, item-level diagnostic telemetry, and formal validation.

---

## 2. Existing Technology Stack & Architecture

### 2.1 Technology Stack Inventory

| Component Layer | Technology / Package | Version | Purpose in Codebase |
| :--- | :--- | :--- | :--- |
| **Language** | JavaScript (ESM) | ES2022+ | Core logic and UI components |
| **Runtime / Build Tool** | Vite | 6.0.7 | Fast HMR dev server and production bundling (`vite.config.js`) |
| **Frontend Framework** | React | 18.3.1 | Component-based reactive user interface (`src/main.jsx`) |
| **DOM Renderer** | React DOM | 18.3.1 | DOM mounting to `#root` (`index.html`) |
| **Routing** | React Router DOM | 6.28.0 | Declarative client-side routing (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `NavLink`, `Link`) |
| **Styling Engine** | Tailwind CSS | 3.4.17 | Utility-first CSS framework with custom theme extensions (`tailwind.config.js`) |
| **CSS Preprocessor** | PostCSS + Autoprefixer | 8.4.49 / 10.4.20 | CSS parsing and vendor prefixing (`postcss.config.js`) |
| **Iconography** | Lucide React | 0.469.0 | Accessible vector UI icons (`BookOpen`, `Sparkles`, `Clock`, etc.) |
| **Typography** | Inter (Google Fonts) | Variable | Clean academic sans-serif typography (`index.html`) |
| **Data Persistence** | Web Storage API (`localStorage`) | Native | Client-side serialization (`studylens-learning-history`) |
| **Backend / API** | *None* | N/A | Fully decoupled static client; no server-side execution |
| **Database** | *None* | N/A | In-memory JavaScript objects initialized from static fixtures |
| **Testing Framework** | *None* | N/A | No test runner (`vitest`, `jest`) or test suites configured |

### 2.2 Architectural Topology

```
+-----------------------------------------------------------------------------------+
|                                  BROWSER CLIENT                                    |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                       React Router (App.jsx)                              |   |
|   |         +-------------------------------------------------------+         |   |
|   |         |             Layout Wrapper: AppShell.jsx              |         |   |
|   |         |   - Header.jsx (Desktop Brand & PrototypeBadge.jsx)   |         |   |
|   |         |   - Desktop Nav (Home, Course, For You, About)        |         |   |
|   |         |   - BottomNav.jsx (Mobile < lg Navigation Bar)        |         |   |
|   |         +-------------------------------------------------------+         |   |
|   +---------------------------------------------------------------------------+   |
|                                         |                                         |
|                 +-----------------------+-----------------------+                 |
|                 |                       |                       |                 |
|                 v                       v                       v                 |
|        [ DashboardPage ]          [ CoursePage ]        [ TopicPage ]             |
|        - CourseCard.jsx           - Syllabus list       - Topic summary           |
|        - RecommendationCard.jsx   - Mock materials      - QuizQuestion.jsx        |
|        - RecentActivity.jsx                             - QuizResults.jsx         |
|                 |                       |                       |                 |
|                 +-----------------------+-----------------------+                 |
|                                         |                                         |
|                                         v                                         |
|                              [ RecommendationPage ]                               |
|                              - FactorBar.jsx                                      |
|                              - Progressive disclosure (L1 / L2)                   |
|                                         |                                         |
|       +---------------------------------+---------------------------------+       |
|       |                                                                   |       |
|       v                                                                   v       |
|  [ Custom Hook: useLearningHistory ]                 [ Custom Hook: useRecommendation ] 
|  - localStorage ('studylens-learning-history')        - Computes on history state changes |
|  - recordQuizResult()                                 - Calls recommendationEngine.js   |
|  - resetHistory()                                                                 |
|       |                                                                   |       |
|       +---------------------------------+---------------------------------+       |
|                                         |                                         |
|                                         v                                         |
|                       [ Static Fixtures & Engine Core ]                           |
|                       - courseData.js (CS3200 syllabus, 7 topics)                 |
|                       - quizData.js (21 multiple choice questions)                |
|                       - mockHistory.js (Default fixture data for 'Alex')          |
|                       - recommendationEngine.js (4-factor scoring)                |
+-----------------------------------------------------------------------------------+
```

### 2.3 File and Directory Structure
```
D:\xampp_new\htdocs\HCI LEARNING PROJECT\
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src\
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components\
    │   ├── dashboard\
    │   │   ├── CourseCard.jsx
    │   │   ├── RecentActivity.jsx
    │   │   └── RecommendationCard.jsx
    │   ├── layout\
    │   │   ├── AppShell.jsx
    │   │   ├── BottomNav.jsx
    │   │   └── Header.jsx
    │   ├── recommendation\
    │   │   └── FactorBar.jsx
    │   ├── shared\
    │   │   ├── PrototypeBadge.jsx
    │   │   └── TransparencyFooter.jsx
    │   └── topic\
    │       ├── QuizQuestion.jsx
    │       └── QuizResults.jsx
    ├── data\
    │   ├── courseData.js
    │   ├── mockHistory.js
    │   ├── quizData.js
    │   └── recommendationEngine.js
    ├── hooks\
    │   ├── useLearningHistory.js
    │   └── useRecommendation.js
    └── pages\
        ├── AboutPage.jsx
        ├── CoursePage.jsx
        ├── DashboardPage.jsx
        ├── RecommendationPage.jsx
        └── TopicPage.jsx
```

---

## 3. Complete Feature Inventory & Verification

Every feature in the application was traced directly to its implementation files. The table below classifies each feature's operational status and its educational contribution.

| Feature Name | Implementation File(s) | Data Consumed / Produced | Operational Status | Educational & HCI Contribution |
| :--- | :--- | :--- | :--- | :--- |
| **Student Dashboard** | `pages/DashboardPage.jsx` | `history`, `recommendation` | **Fully Functional** | Primary entry point; aggregates progress, recommendation, and recent history. |
| **Course Syllabus View** | `pages/CoursePage.jsx`, `data/courseData.js` | `course.topics`, `topicProgress` | **Fully Functional** | Visualizes 7 syllabus topics in order with difficulty badges and live statuses. |
| **Mock Course Materials** | `pages/CoursePage.jsx` (L119–L146) | `course.materials` | **Visual Placeholder** | Displays 4 mock PDFs with icons; explicitly labeled *"Visual reference only"*. No download/reading capability. |
| **Course Progress Tracking** | `components/dashboard/CourseCard.jsx` | `topicProgress` map | **Fully Functional** | Calculates weighted completion: Reviewed = 1.0, In-Progress = 0.5, Not-Started = 0.0. Displays percentage and status counts. |
| **Study Recommendation Card** | `components/dashboard/RecommendationCard.jsx` | `useRecommendation()` | **Fully Functional** | High-visibility card highlighting next recommended topic, primary reason, and quick start action. |
| **Dismiss / Restore Recommendation** | `components/dashboard/RecommendationCard.jsx` (L15, L44) | Local component state `isDismissed` | **Partially Functional** | Student can dismiss or restore card. State is in-memory only; resets on page reload. |
| **Progressive Disclosure ("Why?")** | `RecommendationCard.jsx` (L97–L143), `RecommendationPage.jsx` | `recommendation.factors` | **Fully Functional** | Level 1: Expandable list of contributing factors with natural-language text. Level 2: Numeric scores and factor weights. |
| **Full Recommendation Detail View** | `pages/RecommendationPage.jsx`, `components/recommendation/FactorBar.jsx` | `recommendation.factors`, `totalScore` | **Fully Functional** | Deep explainability page allowing students to inspect individual score contributions and toggle technical scoring bars. |
| **Student Agency / Override** | `RecommendationCard.jsx`, `RecommendationPage.jsx`, `CoursePage.jsx` | Static navigation | **Fully Functional** | Always offers alternative actions: *"Choose another topic"*, *"Browse Course Topics"*. Preserves student autonomy. |
| **Topic Concept Summary** | `pages/TopicPage.jsx` (L176–L203), `data/courseData.js` | `topic.summary`, `topic.keyConcepts` | **Fully Functional** | Explains foundational knowledge and displays tag list of key concepts prior to quiz. |
| **Interactive Practice Quiz** | `pages/TopicPage.jsx`, `components/topic/QuizQuestion.jsx` | `quizData.js` | **Fully Functional** | 3-question multiple choice assessment with radio options, validation, and submission controls. |
| **Immediate Formative Feedback** | `components/topic/QuizQuestion.jsx` (L89–L115) | Question `explanation`, `correctId` | **Fully Functional** | Immediate color-coded correctness feedback (green/red) with detailed conceptual explanations per question. |
| **Quiz Results Screen** | `components/topic/QuizResults.jsx` | `score`, `maxScore`, `topicName` | **Fully Functional** | Displays percentage score, status outcome (Reviewed if $\ge 67\%$, else In-Progress), and transparency note. |
| **Quiz Retake Action** | `components/topic/QuizResults.jsx` (L88–L94), `TopicPage.jsx` | Component state reset | **Fully Functional** | Allows students to immediately retake the quiz to improve score. |
| **Learning History Persistence** | `hooks/useLearningHistory.js` | `localStorage` key `'studylens-learning-history'` | **Partially Functional** | Persists current topic status, score, attempts, and latest 20 activity entries. **Overwrites previous scores**. |
| **Recommendation Closed Loop** | `TopicPage.jsx` (L116) $\rightarrow$ `useLearningHistory` $\rightarrow$ `useRecommendation` | Reactive state update | **Fully Functional** | Completing a quiz immediately updates progress, which automatically recalculates recommendation scores upon return to Dashboard. |
| **Recent Activity Feed** | `components/dashboard/RecentActivity.jsx` | `history.activityLog` | **Fully Functional** | Displays up to 4 most recent learning events with date, description, and score badge. |
| **Research Honesty Disclaimers** | `components/shared/TransparencyFooter.jsx`, `PrototypeBadge.jsx`, `AboutPage.jsx` | Static content | **Fully Functional** | Transparently discloses simulated logic, lack of clinical/ML claims, and provides *"Reset Demo Data"* button. |

---

## 4. Learning Analytics Audit

To determine whether StudyLens possesses an authentic Learning Analytics foundation, twelve key analytical dimensions were evaluated against the source code.

```
+-------------------------------------------------------------------------------------+
|                          LEARNING ANALYTICS CAPABILITY MATRIX                       |
|                                                                                     |
|  Dimension                                 Status          Current Implementation   |
|  ----------------------------------------  --------------  -----------------------  |
|  1. Quiz Scores & Performance Trends       B. Partial      Latest score only        |
|  2. Topic-Level Mastery Estimates          B. Partial      Binary >=67% rule        |
|  3. Course Completion Patterns             B. Partial      Weighted topic sum       |
|  4. Learning Activity Frequency            C. Unanalyzed   Log entries present      |
|  5. Time Between Study Sessions            C. Unanalyzed   Dates logged; not parsed |
|  6. Topic Revision Frequency               B. Partial      Integer attempt count    |
|  7. Repeated Misconceptions / Distractors  D. Unimplemented Option IDs discarded    |
|  8. Changes in Performance Over Time       D. Unimplemented Overwrites prior score  |
|  9. Chronically Struggling Topics          C. Unanalyzed   Score/attempt uncoupled  |
|  10. Student Engagement Patterns           D. Unimplemented No telemetry or latency |
|  11. Learning Consistency & Habits         D. Unimplemented No streak/cadence model |
|  12. Progress Towards Learning Goals       D. Unimplemented No goal-setting model   |
+-------------------------------------------------------------------------------------+
```

### Detailed Evaluation by Dimension

#### 1. Quiz Scores and Performance Trends: [B. Partially Implemented]
- **Current Mechanism:** `useLearningHistory.js` (lines 94–97) stores `existing.score = score` and `existing.maxScore = maxScore`.
- **Limitation:** Every quiz retake overwrites the existing score. If a student scored 1/3 initially and later scored 3/3, the record of the initial 1/3 is destroyed. The system cannot compute trajectory, learning velocity, or recovery curves.

#### 2. Topic-Level Mastery Estimates: [B. Partially Implemented]
- **Current Mechanism:** `useLearningHistory.js` (line 100) applies a hardcoded rule:
  $$\text{status} = \left(\frac{\text{score}}{\text{maxScore}} \ge \frac{2}{3}\right) \;?\; \text{'reviewed'} : \text{'in-progress'}$$
- **Limitation:** This is a coarse binary threshold based on 3 questions. It does not implement psychometric or knowledge-tracing models such as Item Response Theory (IRT), Bayesian Knowledge Tracing (BKT), or Elo rating.

#### 3. Course Completion Patterns: [B. Partially Implemented]
- **Current Mechanism:** `CourseCard.jsx` (lines 26–39) calculates:
  $$\text{progressPct} = \text{round}\left(\frac{\sum \text{weights}}{\text{totalTopics}} \times 100\right), \quad \text{where } w \in \{1.0, 0.5, 0.0\}$$
- **Limitation:** Treats all topics with equal weight regardless of difficulty. Does not track time to completion, syllabus dropout, or non-linear navigation pathways.

#### 4. Learning Activity Frequency: [C. Data Exists But Is Not Meaningfully Analyzed]
- **Current Mechanism:** `history.activityLog` stores up to 20 chronological activity entries with date strings (`YYYY-MM-DD`).
- **Limitation:** No analytical aggregation exists. The system does not compute study events per week, active days per month, or session density.

#### 5. Time Between Study Sessions: [C. Data Exists But Is Not Meaningfully Analyzed]
- **Current Mechanism:** `recommendationEngine.js` has a `daysSince(dateStr)` helper (lines 39–47) that calculates elapsed days between `lastReviewed` and `today`.
- **Limitation:** Used exclusively for recency scoring. The system does not evaluate inter-session spacing intervals, cramming behavior, or forgetting decay.

#### 6. Topic Revision Frequency: [B. Partially Implemented]
- **Current Mechanism:** `useLearningHistory.js` (line 97) increments `existing.attempts += 1` on each quiz completion.
- **Limitation:** The integer counter records quantity but lacks temporal distribution. An attempt taken 5 minutes after a failed quiz is treated identically to an attempt taken 14 days later.

#### 7. Repeated Incorrect Answers & Misconceptions: [D. Not Implemented]
- **Current Mechanism:** `TopicPage.jsx` holds `selectedOptionId` in ephemeral component state (line 30).
- **Limitation:** Upon submitting or finishing the quiz, only the aggregated scalar integer `finalScore` is passed to `recordQuizResult()`. The specific question IDs, selected distractor keys (`'a'`, `'b'`, `'c'`, `'d'`), and specific conceptual errors are discarded immediately.

#### 8. Changes in Performance Over Time: [D. Not Implemented]
- **Current Mechanism:** None.
- **Limitation:** Because historical attempts are not stored as distinct records, the application cannot plot performance over time.

#### 9. Topics Consistently Requiring Additional Attention: [C. Data Exists But Is Not Meaningfully Analyzed]
- **Current Mechanism:** A topic with `attempts: 4` and `score: 1` indicates chronic difficulty.
- **Limitation:** The recommendation engine treats this topic identically to a topic with `attempts: 1` and `score: 1`. It does not detect repeated failure patterns or frustration plateaus.

#### 10. Student Engagement Patterns: [D. Not Implemented]
- **Current Mechanism:** None.
- **Limitation:** No event listeners or telemetry capture page dwell time, time spent per quiz question, reading time on topic summaries, or hesitation before answer submission.

#### 11. Learning Consistency: [D. Not Implemented]
- **Current Mechanism:** None.
- **Limitation:** No calculation of study regularity, weekly routines, or streak metrics.

#### 12. Progress Towards Learning Goals: [D. Not Implemented]
- **Current Mechanism:** None.
- **Limitation:** The application has no data structure or interface allowing students to define target mastery scores, planned study dates, or target deadlines.

---

## 5. Metacognition & Self-Regulated Learning (SRL) Audit

Self-Regulated Learning (SRL) theory (e.g., Zimmerman, 2000; Winne & Hadwin, 1998) models learning as a cyclical, three-phase feedback loop. The StudyLens prototype was evaluated against these three core phases:

```
                      +----------------------------------+
                      |         1. FORETHOUGHT           |
                      |  - Goal-setting                  |
                      |  - Study planning                |
                      |  - Strategic selection           |
                      +-----------------+----------------+
                                        |
                                        v
+----------------------------------+    |    +----------------------------------+
|        3. SELF-REFLECTION        |<---+--->|          2. PERFORMANCE          |
|  - Self-evaluation               |         |  - Self-monitoring               |
|  - Attribution & error analysis  |         |  - Strategy execution            |
|  - Adaptive adjustments          |         |  - Metacognitive monitoring      |
+----------------------------------+         +----------------------------------+
```

### 5.1 Phase 1: Forethought (Planning & Goal-Setting)
* **What Exists:**
  - Course syllabus view (`CoursePage.jsx`) provides structural orientation across 7 topics and specifies prerequisites.
  - The recommendation card (`RecommendationCard.jsx`) proposes an initial priority.
  - Student autonomy is preserved by allowing the student to override the recommendation and choose any topic.
* **Missing Educational Capabilities:**
  - **No Goal Setting:** Students cannot set target grades, mastery thresholds, or target completion dates.
  - **No Study Planning:** Students cannot schedule upcoming sessions, estimate required study time, or commit to weekly study targets.
  - **No Prior-Knowledge Self-Assessment:** Before opening a topic, students are not asked to rate their current familiarity or confidence (e.g., *"How confident do you feel about ER Modeling on a 1–5 scale?"*).

### 5.2 Phase 2: Performance (Monitoring & Strategy Execution)
* **What Exists:**
  - Topic summaries (`TopicPage.jsx`) provide introductory reading material and key concept chips before testing.
  - Formative practice quiz provides immediate explanations after each question.
* **Missing Educational Capabilities:**
  - **No Metacognitive Monitoring Prompts:** During the quiz, students are not asked to assess their confidence before answering (*"How confident are you in this answer: Guessing / Somewhat Sure / Certain?"*). Calibrating confidence against accuracy is a primary pillar of metacognitive monitoring.
  - **No Note-Taking or Elaboration:** Students cannot annotate summaries, write explanations in their own words, or flag difficult concepts for later review.
  - **No Strategy Guidance:** The interface does not offer evidence-based learning strategies (e.g., retrieval practice tips, Feynman technique, spaced recall reminders).

### 5.3 Phase 3: Self-Reflection (Evaluation & Adaptive Reaction)
* **What Exists:**
  - Quiz results screen (`QuizResults.jsx`) presents the quantitative score ($X/3$), status classification, and an encouraging formative statement.
  - Explanatory feedback cards on `RecommendationPage.jsx` allow the student to inspect why the recommendation shifted.
* **Missing Educational Capabilities:**
  - **No Error Attribution / Diagnostic Reflection:** When a student misses a question, the system does not ask *why* they missed it (e.g., *"Was this a careless misread, vocabulary confusion, or missing prerequisite knowledge?"*).
  - **No Error Diary:** Incorrect questions cannot be saved to a personal "Difficult Concepts" review bank.
  - **No Feedback on Recommendation Utility:** Students cannot evaluate the recommendation itself (*"Did reviewing this topic actually help you understand it better?"*).

---

## 6. Recommendation Engine Audit

The recommendation engine (`src/data/recommendationEngine.js`) is the core algorithmic component of StudyLens.

### 6.1 Formula Breakdown

The engine scores every topic in the syllabus on a scale from 0 to 100 points:

$$\text{TotalScore} = \text{Score}_{\text{performance}} + \text{Score}_{\text{recency}} + \text{Score}_{\text{status}} + \text{Score}_{\text{prerequisite}}$$

```
+---------------------------------------------------------------------------------+
|                        RECOMMENDATION SCORING FORMULA                           |
|                                                                                 |
|  Factor                 Weight  Formula / Logic                                 |
|  ---------------------  ------  ----------------------------------------------  |
|  Performance            40 pts  points = (10 - (rawScore / maxScore) * 10) * 4  |
|                                 (Unattempted = 20 pts)                          |
|  Recency                25 pts  points = min(daysSinceLastReview * 2.5, 25)     |
|                                 (Never reviewed = 15 pts)                       |
|  Completion Status      20 pts  in-progress = 20 pts                            |
|                                 not-started = 10 pts                            |
|                                 reviewed = 5 pts                                |
|  Prerequisite Readiness 15 pts  All prereqs reviewed/in-progress = 15 pts       |
|                                 Any prereq not-started = 0 pts                  |
+---------------------------------------------------------------------------------+
```

### 6.2 Step-by-Step Factor Trace

#### Factor 1: Quiz Performance (0–40 points)
Implemented in `scorePerformance(topicProgress)` (lines 63–82):
- **Unattempted Topic:** Returns `20` points (neutral).
- **Attempted Topic:**
  $$\text{score10} = \left(\frac{\text{rawScore}}{\text{maxScore}}\right) \times 10$$
  $$\text{points} = \text{round}\left((10 - \text{score10}) \times 4\right)$$
- **Numerical Distribution (for 3-question quiz):**
  - $0/3 \rightarrow \text{score10} = 0.0 \rightarrow \mathbf{40.00\text{ pts}}$ (Maximum urgency)
  - $1/3 \rightarrow \text{score10} = 3.33 \rightarrow \mathbf{26.68\text{ pts}}$
  - $2/3 \rightarrow \text{score10} = 6.67 \rightarrow \mathbf{13.32\text{ pts}}$
  - $3/3 \rightarrow \text{score10} = 10.0 \rightarrow \mathbf{0.00\text{ pts}}$ (Minimum urgency)

#### Factor 2: Recency / Time Since Review (0–25 points)
Implemented in `scoreRecency(topicProgress)` (lines 93–112):
- **Never Reviewed:** Returns `15` points (lines 96–102).
- **Reviewed Previously:**
  $$\text{points} = \min(\text{daysSinceReview} \times 2.5, \; 25)$$
- **Behavior:**
  - Increases linearly at $2.5\text{ pts/day}$.
  - Reaches the 25-point cap at exactly **10 days**.
  - A topic reviewed 10 days ago receives identical recency points to a topic reviewed 120 days ago.

#### Factor 3: Completion Status (0–20 points)
Implemented in `scoreStatus(topicProgress)` (lines 121–142):
- `'in-progress'` $\rightarrow \mathbf{20\text{ pts}}$ (Started but not mastered; highest priority).
- `'not-started'` $\rightarrow \mathbf{10\text{ pts}}$ (Ready to learn; moderate priority).
- `'reviewed'` $\rightarrow \mathbf{5\text{ pts}}$ (Previously completed; lowest priority).

#### Factor 4: Prerequisite Readiness (0–15 points)
Implemented in `scorePrerequisites(topic, allTopicProgress)` (lines 151–186):
- If `topic.prerequisites` is empty $\rightarrow \mathbf{15\text{ pts}}$.
- Evaluates each prerequisite topic in `allTopicProgress`:
  - If any prerequisite is missing or has status `'not-started'`, prerequisites are unmet $\rightarrow \mathbf{0\text{ pts}}$.
  - If all prerequisites have status `'reviewed'` OR `'in-progress'` $\rightarrow \mathbf{15\text{ pts}}$.
- **Critical Architectural Flaw:** A prerequisite that is `'in-progress'` with a score of $0/3$ satisfies the prerequisite check! A student who failed the prerequisite quiz is permitted to advance with full prerequisite points.

### 6.3 Ranking and Tiebreaking Logic
Implemented in `generateRecommendation(topicProgress, courseTopics)` (lines 241–244):
```javascript
scored.sort((a, b) => {
  if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
  return b.topicOrder - a.topicOrder; // Tiebreaker
});
```
- Topics are sorted descending by `totalScore`.
- **Tiebreaker:** If two topics have identical total scores, the engine selects the topic with the higher `topicOrder` (later in the syllabus). The assumption is that later topics represent more advanced or recent curriculum requirements.

### 6.4 Primary Reason Construction
Implemented in `buildPrimaryReason()` (lines 282–321):
- Filters out `'Prerequisite readiness'` (because it is binary).
- Sorts remaining factors by raw points descending:
  ```javascript
  const primaryFactor = recommended.factors
    .filter((f) => f.name !== 'Prerequisite readiness')
    .sort((a, b) => b.score - a.score)[0];
  ```
- **Flaw in Reason Selection:** It compares absolute scores across factors with different maximums! For example, `Recency` scoring $20/25$ ($80\%$ of its max) will lose to `Performance` scoring $21/40$ ($52.5\%$ of its max), even though recency is significantly more acute relative to its scale.

### 6.5 Congruence Between Algorithm and Explanations
* **Major Strength:** Unlike black-box machine-learning systems where explanations are post-hoc approximations (e.g., LIME, SHAP), StudyLens achieves **100% fidelity between calculation and explanation**. The variables displayed to the student in `FactorBar.jsx` are the exact values computed by the scoring function.

---

## 7. Research Alignment Assessment

The application was audited against seven prominent subfields of Educational Technology and Human-Computer Interaction.

| Research Field | Alignment Level | Existing Supporting Code | Missing Capabilities | Development Type |
| :--- | :--- | :--- | :--- | :--- |
| **1. Learning Analytics** | **Low-Medium** | Basic descriptive counters (`attempts`, `score`, `progressPct`, `activityLog`). | Time-series progress, item-level telemetry, decay curves, session frequency analytics. | Both (Technical schema + Research analytics) |
| **2. Self-Regulated Learning (SRL)** | **Low** | Student autonomy controls, syllabus overview, performance status indicators. | Goal-setting, study scheduling, confidence monitoring, metacognitive prompts. | Educational design + UI capability |
| **3. Metacognition & Reflection** | **Low** | Immediate question feedback with conceptual rationales. | Confidence calibration, error attribution prompts, student evaluation of recommendations. | Research capability |
| **4. Personalized Learning** | **Medium** | Deterministic ranking responsive to individual quiz performance and elapsed days. | Learning style adaptation, difficulty adaptation, flexible pacing, custom topic pathways. | Technical & algorithmic |
| **5. Adaptive Learning Environments** | **Low-Medium** | Adapts recommended topic order based on student score updates. | Adaptive testing (CAT), dynamic question selection, adaptive content scaffolding. | Algorithmic model |
| **6. Explainable AI (XAI) in Education** | **High** | Multi-level progressive disclosure, factor bars, natural-language rationales, user overrides. | Interactive counterfactual explanations (*"What if I score 3/3 on SQL JOINs?"*), sensitivity controls. | Primary HCI research strength |
| **7. Student Engagement & Behavior** | **Low** | Activity log captures completion events. | Behavioral telemetry: dwell time, reading time, clickstream, hesitation, session intervals. | Data architecture & instrumentation |

---

## 8. AI Readiness Assessment

StudyLens currently operates without artificial intelligence. The table below evaluates the feasibility, data prerequisites, risks, and educational necessity of introducing AI/ML features.

```
+---------------------------------------------------------------------------------------------+
|                                AI OPPORTUNITY FEASIBILITY MATRIX                            |
|                                                                                             |
|  Feature Opportunity       Data Prerequisite       Feasibility  Risk Profile   ML Necessary?|
|  ------------------------  ----------------------  -----------  -------------  ------------ |
|  1. Misconception Feedback Item-level choices      Medium       Hallucination  No (Rules 1st|
|  2. Adaptive Questioning   Item difficulty/IRT     High         Cold start     Yes (Stat ML)|
|  3. Conversational Socratic Session context        Low-Medium   Drift/Distract Yes (LLM)    |
|  4. Concept Summarization  Static syllabus text    High         Low            No (Static)  |
|  5. Study Schedule Planner Student goals & calendar Medium      Constraint fail No (Heuristic|
|  6. Natural Language Rationale Factor scores       High (Done)  None           No (Template)|
+---------------------------------------------------------------------------------------------+
```

### Detailed AI Feature Assessment

#### 1. AI-Assisted Formative Feedback on Misconceptions
- **Description:** Instead of generic explanations, the system analyzes the specific wrong option selected and explains the underlying misconception.
- **Data Required:** `questionId`, `selectedOptionId`, `correctOptionId`, question stem.
- **Database Readiness:** Existing schema does not store `selectedOptionId`. Requires database migration.
- **Recommendation:** Can be implemented initially via **deterministic rule-based distractor annotations** in `quizData.js` (e.g., each distractor has a `misconceptionExplanation`). An LLM is not required and would introduce hallucination risks in technical disciplines like database theory.

#### 2. Adaptive Study Recommendations (Bayesian Knowledge Tracing / Elo)
- **Description:** Replace fixed 4-factor scoring with a statistical knowledge-tracing model that estimates latent mastery probabilities $P(L_t)$ for each concept.
- **Data Required:** Historical attempt sequence across all students, item difficulty parameters.
- **Database Readiness:** Not supported by client-side `localStorage`. Requires centralized database tracking multi-student interaction logs.
- **Recommendation:** High educational value; statistical machine learning (not generative AI) is the appropriate technology.

#### 3. Conversational Metacognitive Reflection Prompts
- **Description:** A guided conversational agent that prompts the student after a session: *"You took two attempts on SQL JOINs today. What part of the syntax felt confusing?"*
- **Data Required:** Session activity log, score delta, student text responses.
- **Database Readiness:** Requires conversational state storage and reflection history tables.
- **Recommendation:** High research interest for Human-AI Interaction studies, but must have strict boundary guardrails to prevent generic chatbot digression.

---

## 9. Data Architecture and Database Audit

### 9.1 Current Data Storage: `localStorage`
The entire application state is stored in a single JSON document under the key `studylens-learning-history`:

```json
{
  "studentName": "Alex",
  "courseId": "cs3200",
  "topicProgress": {
    "intro-to-databases": {
      "status": "reviewed",
      "score": 3,
      "maxScore": 3,
      "lastReviewed": "2026-08-25",
      "attempts": 2
    }
  },
  "activityLog": [
    {
      "date": "2026-09-05",
      "topicId": "sql-fundamentals",
      "action": "Completed SQL Fundamentals quiz",
      "score": "2/3"
    }
  ]
}
```

### 9.2 Critical Structural Weaknesses in Current Storage
1. **Destructive Updates:** `topicProgress[topicId].score` stores only the latest score. Historical attempts are completely lost.
2. **Missing Granularity:** No item-level records (which specific questions were answered, which options were chosen, whether hints were viewed).
3. **Storage Volatility:** `localStorage` is device-specific, cleared on browser cache wipe, inaccessible across devices, and vulnerable to cross-site scripting (XSS).
4. **No Multi-Tenancy:** Single hardcoded student identity (`Alex`). No cohort analysis, class comparisons, or instructor dashboards are possible.
5. **No Telemetry Storage:** Time spent per question, dwell time, and interaction timestamps are not captured.

### 9.3 Recommended Relational Database Schema (PostgreSQL)

To support learning analytics and educational research, the system should migrate to the following normalized relational schema:

```
+------------------+       +-------------------+       +-----------------------+
|     students     |       |      courses      |       |        topics         |
+------------------+       +-------------------+       +-----------------------+
| id (PK, UUID)    |       | id (PK, VARCHAR)  |       | id (PK, VARCHAR)      |
| email (VARCHAR)  |       | code (VARCHAR)    |       | course_id (FK)        |
| name (VARCHAR)   |       | name (VARCHAR)    |       | name (VARCHAR)        |
| created_at (TS)  |       | semester (VARCHAR)|       | order_index (INT)     |
+--------+---------+       +---------+---------+       | difficulty (VARCHAR)  |
         |                           |                 +-----------+-----------+
         |                           +-----------+                 |
         |                                       |                 |
         +-------------------+                   v                 |
                             |         +-------------------+       |
                             |         | topic_prereqs     |       |
                             |         +-------------------+       |
                             |         | topic_id (FK)     |       |
                             |         | prereq_topic_id(FK)       |
                             |         +-------------------+       |
                             v                                     v
                 +-----------------------+             +-----------------------+
                 |    learning_goals     |             |    quiz_questions     |
                 +-----------------------+             +-----------------------+
                 | id (PK, UUID)         |             | id (PK, VARCHAR)      |
                 | student_id (FK)       |             | topic_id (FK)         |
                 | topic_id (FK)         |             | question_text (TEXT)  |
                 | target_score (INT)    |             | correct_option_id     |
                 | target_date (DATE)    |             | explanation (TEXT)    |
                 | status (VARCHAR)      |             +-----------+-----------+
                 +-----------------------+                         |
                             |                                     |
                             v                                     v
                 +-----------------------+             +-----------------------+
                 |     quiz_attempts     |             |     quiz_answers      |
                 +-----------------------+             +-----------------------+
                 | id (PK, UUID)         |<------------| attempt_id (FK)       |
                 | student_id (FK)       |             | question_id (FK)      |
                 | topic_id (FK)         |             | selected_option_id    |
                 | total_score (INT)     |             | is_correct (BOOLEAN)  |
                 | max_score (INT)       |             | latency_seconds (INT) |
                 | started_at (TS)       |             +-----------------------+
                 | completed_at (TS)     |
                 +-----------+-----------+
                             |
                             v
                 +-----------------------+
                 | recommendation_logs   |
                 +-----------------------+
                 | id (PK, UUID)         |
                 | student_id (FK)       |
                 | recommended_topic (FK)|
                 | total_priority_score  |
                 | factor_breakdown (JSON|
                 | was_accepted (BOOLEAN)|
                 | generated_at (TS)     |
                 +-----------------------+
```

---

## 10. Student Experience & Interface Audit

### 10.1 UX Strengths
- **Aesthetic Consistency:** Calibrated academic palette (slate grays, brand blues, emerald success, amber warning) using Tailwind CSS.
- **Low Cognitive Load:** The interface avoids visual clutter. Important information is chunked into distinct `.card` containers.
- **Mobile-First Responsiveness:** Clear transition between desktop horizontal navigation (`Header.jsx` + `AppShell.jsx`) and mobile fixed bottom navigation (`BottomNav.jsx`).
- **Clear Information Scent:** Buttons use directional iconography (`ArrowRight`, `ArrowLeft`) and explicit verbs (*"Start Review"*, *"Browse Course Topics"*).

### 10.2 UX Deficiencies & Friction Points
- **Lack of Longitudinal Visualizations:** All progress is represented as single progress bars (`CourseCard.jsx`) or discrete pill counts. There are no visual trend charts, score distributions, or timeline views to show progress over weeks.
- **Static Materials Section:** The "Course Materials" section on `CoursePage.jsx` shows mock document icons that cannot be opened or interacted with. This frustrates user expectations.
- **Navigation Loop Disconnect:** On `QuizResults.jsx`, clicking *"Return to Dashboard"* takes the student back to `/`, but there is no celebratory micro-interaction or visual highlight showing that the recommendation card has updated its target topic.
- **Dismissal Ephemerality:** Dismissing a recommendation on `RecommendationCard.jsx` sets local React state `isDismissed = true`. Reloading the page immediately restores the card, making the dismissal feature feel broken.

---

## 11. Testing, Reliability, and Security Audit

### 11.1 Test Coverage: Zero Automated Tests
* **Finding:** There are **0 unit tests, 0 integration tests, and 0 end-to-end tests** in the entire codebase.
* **Missing Test Suites:**
  - `recommendationEngine.test.js`: Untested scoring calculations, boundary conditions, edge cases, and tiebreakers.
  - `useLearningHistory.test.js`: Untested `localStorage` serialization, corrupted data recovery, and duplicate execution guards.
  - `QuizFlow.test.jsx`: Untested user flows for question selection, scoring accuracy, and completion events.

### 11.2 Edge Cases and Algorithmic Vulnerabilities
1. **Timezone Discrepancy in `daysSince()`:**
   - In `recommendationEngine.js` (lines 41–46):
     ```javascript
     const past = new Date(dateStr + 'T00:00:00');
     const now = new Date();
     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
     const diffMs = today - past;
     ```
   - If `dateStr` is in an invalid format or undefined, `past` becomes `Invalid Date`, and `diffMs` evaluates to `NaN`. While protected by `if (!dateStr) return null;`, malformed strings would cause `NaN` to propagate into total priority scores.
2. **All Topics Completed State:**
   - When all topics reach status `'reviewed'` with scores of $3/3$, performance points drop to 0 for all topics. The engine will recommend whichever topic was reviewed least recently, potentially recommending foundational Topic 1 repeatedly even if the student is preparing for an advanced final exam.
3. **`todayStr()` Date Formatting:**
   - In `useLearningHistory.js` (lines 56–62), `todayStr()` relies on local machine clock. Altering the client clock manipulates all recency calculations.

### 11.3 Security & Data Privacy
- **Client-Side Data Exposure:** All history is in unencrypted `localStorage`. Any script running on the origin has read/write access.
- **Input Sanitization:** While React automatically escapes JSX expressions, rendering dynamic strings from localStorage without strict schema validation poses security risks if malicious scripts inject payloads into `localStorage`.
- **Readiness Verdict:** Suitable **only as an exploratory lab prototype** under supervised observation. Not production-ready or deployable to actual classrooms.

---

## 12. Prioritized Improvement Roadmap

```
+-----------------------------------------------------------------------------------------+
|                                    PROJECT ROADMAP                                      |
|                                                                                         |
|  [ Phase A: Foundation ]          [ Phase B: Analytics ]        [ Phase C: SRL ]        |
|  - Vitest test suite              - Non-destructive history     - Goal setting          |
|  - Fix prereq 0/3 loophole        - Item-level telemetry        - Confidence ratings    |
|  - Normalized reason builder      - Time-series tracking        - Error diary           |
|                                                                                         |
|             |                                   |                              |        |
|             +-----------------------------------+------------------------------+        |
|                                                 |                                       |
|                                                 v                                       |
|                              [ Phase D: Personalization ]                               |
|                              - Spaced repetition (Leitner/SM2)                          |
|                              - Dynamic difficulty scaling                               |
|                                                 |                                       |
|                                                 v                                       |
|                              [ Phase E: Research & AI ]                                 |
|                              - Diagnostic misconception feedback                        |
|                              - Interactive counterfactual XAI                           |
+-----------------------------------------------------------------------------------------+
```

### Phase A: Foundation (Correctness, Robustness & Integrity)
1. **Automated Unit & Integration Test Suite**
   - *Problem:* 0% test coverage creates high regression risk.
   - *Solution:* Install `vitest` and `@testing-library/react`. Implement comprehensive test suites for `recommendationEngine.js` and `useLearningHistory.js`.
   - *Complexity:* Low | *DB Change:* No | *Timing:* Immediate.
2. **Fix Prerequisite Failure Loophole**
   - *Problem:* A topic with status `'in-progress'` and score $0/3$ satisfies prerequisites for advanced topics.
   - *Solution:* Require that prerequisites achieve status `'reviewed'` ($\ge 67\%$) to award the 15 prerequisite points.
   - *Complexity:* Low | *DB Change:* No | *Timing:* Immediate.
3. **Normalize Factor Comparison for Primary Reason**
   - *Problem:* Primary reason selects highest raw points, favoring Performance (max 40) over Recency (max 25).
   - *Solution:* Select primary factor based on highest percentage of max score: $\frac{\text{factor.score}}{\text{factor.maxScore}}$.
   - *Complexity:* Low | *DB Change:* No | *Timing:* Immediate.

### Phase B: Learning Analytics Foundation
4. **Non-Destructive Historical Attempt Tracking**
   - *Problem:* Overwriting scores prevents any longitudinal trend analysis.
   - *Solution:* Update data schema to append each quiz attempt as an immutable event object with timestamp, score, and duration.
   - *Complexity:* Medium | *DB Change:* Yes | *Timing:* Near-term.
5. **Item-Level Question & Distractor Telemetry**
   - *Problem:* Specific question choices are discarded, making misconception analysis impossible.
   - *Solution:* Record an array of `{ questionId, selectedOptionId, isCorrect, latencyMs }` per attempt.
   - *Complexity:* Medium | *DB Change:* Yes | *Timing:* Near-term.
6. **Progress Over Time Visualization**
   - *Problem:* Students only see current snapshot progress bars.
   - *Solution:* Introduce an SVG/Canvas trendline component on the Dashboard showing score trajectories across attempts.
   - *Complexity:* Medium | *DB Change:* No | *Timing:* Near-term.

### Phase C: Metacognition & Self-Regulated Learning (SRL)
7. **Forethought: Student Learning Goals**
   - *Problem:* No support for Zimmerman's planning/goal-setting phase.
   - *Solution:* Add a "Target Mastery" goal setter where students select weekly study targets or target scores.
   - *Complexity:* Medium | *DB Change:* Yes | *Timing:* Mid-term.
8. **Performance: Confidence Calibration Prompts**
   - *Problem:* Metacognitive monitoring is unsupported during quizzes.
   - *Solution:* Add a simple 3-tier confidence selector (*"Just Guessing"*, *"Somewhat Sure"*, *"Certain"*) before submitting each answer.
   - *Complexity:* Low | *DB Change:* Yes | *Timing:* Mid-term.
9. **Self-Reflection: Mistake Attribution & Error Diary**
   - *Problem:* No structured reflection on incorrect answers.
   - *Solution:* After completing a quiz, present missed questions with a reflection prompt (*"Why do you think you missed this?"*).
   - *Complexity:* Medium | *DB Change:* Yes | *Timing:* Mid-term.

### Phase D: Advanced Personalization
10. **Spaced Repetition Decay Model**
    - *Problem:* Linear recency capping at 10 days ignores memory retention science.
    - *Solution:* Implement an Ebbinghaus forgetting curve or simplified Leitner interval algorithm to compute retention decay.
    - *Complexity:* High | *DB Change:* Yes | *Timing:* Future.
11. **Student Sensitivity Preferences for Recommendations**
    - *Problem:* Static weights (40/25/20/15) assume identical study strategies for all learners.
    - *Solution:* Allow students to adjust weighting preferences (e.g., slider between *"Review Older Topics"* vs *"Fix Weakest Scores"*).
    - *Complexity:* Medium | *DB Change:* No | *Timing:* Future.

### Phase E: Research & AI Exploration
12. **Rule-Based Misconception Diagnostics (Pre-AI Stage)**
    - *Problem:* Generic feedback explains the right answer but not the error.
    - *Solution:* Author specific diagnostic explanations for each distractor option in `quizData.js`.
    - *Complexity:* Medium | *DB Change:* No | *Timing:* Future.
13. **Counterfactual "What-If" Explanation Explorer**
    - *Problem:* Students see why a topic is recommended, but cannot see what would change the recommendation.
    - *Solution:* Add an interactive simulator: *"If I score 3/3 on SQL JOINs, what will be recommended next?"*
    - *Complexity:* Medium | *DB Change:* No | *Timing:* Future.

---

## 13. Risks, Limitations, and Technical Boundaries

1. **Client-Side Storage Ceilings:** `localStorage` is restricted to ~5MB. Storing rich item-level telemetry and multi-attempt logs will eventually hit storage limits and fail silently.
2. **Absence of Server-Side State:** A client-side prototype cannot support collaborative learning, teacher oversight, or controlled A/B research conditions across cohorts.
3. **Curricular Narrowness:** Designed around a single 7-topic course (Database Management CS 3200). Generalizing to multi-course or unstructured domains requires dynamic syllabus ingestion.
4. **Assessment Validity:** 3 multiple-choice questions per topic is insufficient for psychometric validity. A lucky guess changes the score by 33.3%, disproportionately altering the recommendation.

---

## 14. Recommended Research Directions

For an MSc dissertation or academic publication, StudyLens should focus on its distinctive strengths rather than attempting to duplicate standard LMS functionality:

1. **Evaluating the Effect of Explainable Recommendations on Learner Agency:**
   - *Research Question:* Does providing progressive factor-level explanations ("Why this recommendation?") increase students' confidence in their study choices compared to a baseline "Recommended for you" interface?
   - *Method:* A between-subjects user study comparing the Level 0 baseline against the Level 1 and Level 2 progressive disclosure interfaces.
2. **Calibrating Appropriate Trust in AI Learning Assistants:**
   - *Research Question:* Does transparently disclosing algorithm limitations and providing user override options prevent over-reliance on automated study recommendations?
   - *Metrics:* Adherence rate to recommendations, frequency of manual syllabus overrides, self-reported trust (Likert scales).
3. **Metacognitive Calibration Through Confidence-Accuracy Tracking:**
   - *Research Question:* How does prompting learners to rate confidence before answering affect their post-quiz reflection and topic selection?

---

## 15. Impacted Files for Future Development

When development resumes, future enhancements will touch the following specific files:

```
+-----------------------------------------------------------------------------------+
|                        FUTURE MODIFICATION TARGETS                                |
|                                                                                   |
|  Target Component / File              Anticipated Enhancement                     |
|  ----------------------------------   ------------------------------------------  |
|  src/data/recommendationEngine.js      Fix prereq check, normalize reason weights, |
|                                       add spaced repetition decay curve.          |
|  src/hooks/useLearningHistory.js      Preserve historical attempts array, record  |
|                                       item-level question responses.              |
|  src/data/quizData.js                 Add distractor-level misconception notes,   |
|                                       expand question pool beyond 3 items/topic.  |
|  src/pages/TopicPage.jsx              Capture selectedOptionId array & duration,  |
|                                       add pre-quiz confidence rating.             |
|  src/components/topic/QuizResults.jsx Add error reflection dialog & mistake diary.|
|  src/components/dashboard/CourseCard  Add historical score trend chart.           |
|  src/pages/RecommendationPage.jsx     Add counterfactual "What-If" simulator.     |
+-----------------------------------------------------------------------------------+
```

---

## 16. Audit Conclusion & Readiness Verdict

StudyLens is a **high-quality, focused, and academically honest HCI interaction prototype**. It demonstrates thoughtful design principles, clean React architecture, and outstanding explainability patterns.

While it is **not yet a fully realized Learning Analytics engine** due to client-side storage constraints and destructive data updates, its current architecture provides an **exceptional frontend testbed for HCI user research on transparent AI and learner decision-making**. Evolving it into a comprehensive educational platform requires non-destructive time-series data modeling, psychometric assessment depth, and structured metacognitive scaffolding.
