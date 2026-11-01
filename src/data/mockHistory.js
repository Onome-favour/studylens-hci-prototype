/**
 * StudyLens — Mock Learning History (Schema Version 2)
 *
 * Pre-populated student learning history so that the recommendation
 * engine has meaningful data from the first load.
 *
 * The dates are historical fixtures representing past student activity.
 * The recommendation engine compares them against the current date
 * when calculating recency.
 *
 * ⚠️ Academic prototype. This data is illustrative, not from a real student.
 */

export const defaultHistory = {
  schemaVersion: 2,
  studentName: 'Alex',
  courseId: 'cs3200',

  // ── Per-topic latest progress summary ──────────────────────────────────
  topicProgress: {
    'intro-to-databases': {
      status: 'reviewed',       // formative review threshold met (>= 2/3)
      score: 3,                 // latest score
      maxScore: 3,              // total questions
      lastReviewed: '2026-08-25',
      attempts: 2,
    },
    'er-modeling': {
      status: 'reviewed',
      score: 2,
      maxScore: 3,
      lastReviewed: '2026-08-30',
      attempts: 1,
    },
    'relational-model': {
      status: 'in-progress',
      score: 1,
      maxScore: 3,
      lastReviewed: '2026-09-02',
      attempts: 1,
    },
    'sql-fundamentals': {
      status: 'reviewed',
      score: 2,
      maxScore: 3,
      lastReviewed: '2026-09-05',
      attempts: 2,
    },
    'sql-joins': {
      status: 'in-progress',
      score: 1,
      maxScore: 3,
      lastReviewed: '2026-09-02',
      attempts: 1,
    },
    'database-normalization': {
      status: 'not-started',
      score: null,
      maxScore: 3,
      lastReviewed: null,
      attempts: 0,
    },
    'functional-dependencies': {
      status: 'not-started',
      score: null,
      maxScore: 3,
      lastReviewed: null,
      attempts: 0,
    },
  },

  // ── Append-only historical collections (new in Schema v2) ─────────────
  // Initialized empty for initial state — new attempts/events append here
  quizAttempts: [],
  recommendationHistory: [],
  recommendationInteractions: [],
  reflections: [],

  // ── Recent activity log (most recent first) ────────────────────────────
  activityLog: [
    {
      date: '2026-09-05',
      topicId: 'sql-fundamentals',
      action: 'Completed SQL Fundamentals quiz',
      score: '2/3',
    },
    {
      date: '2026-09-02',
      topicId: 'sql-joins',
      action: 'Attempted SQL JOINs quiz',
      score: '1/3',
    },
    {
      date: '2026-09-02',
      topicId: 'relational-model',
      action: 'Studied Relational Model',
      score: '1/3',
    },
    {
      date: '2026-08-30',
      topicId: 'er-modeling',
      action: 'Completed ER Modeling quiz',
      score: '2/3',
    },
  ],
};
