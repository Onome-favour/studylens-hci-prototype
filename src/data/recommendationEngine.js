/**
 * StudyLens — Recommendation Engine
 *
 * Deterministic, frontend-only scoring algorithm that analyses a student's
 * learning history to recommend the highest-priority topic for review.
 *
 * SCORING FACTORS (total 100 points — higher = higher priority):
 *
 *   Factor                  Weight   Description
 *   ────────────────────────────────────────────────────────
 *   Performance             40 pts   Lower quiz score → higher priority
 *   Recency                 25 pts   More days since review → higher priority
 *   Completion status       20 pts   in-progress > not-started > reviewed
 *   Prerequisite readiness  15 pts   All prereqs met → eligible
 *
 * ⚠️ Academic prototype. This is simulated logic — not machine learning.
 *    All scores are illustrative and have NOT been scientifically validated.
 */

// ─────────────────────────────────────────────────────────────────────────────
// WEIGHTS
// ─────────────────────────────────────────────────────────────────────────────

const WEIGHTS = {
  performance: 40,
  recency: 25,
  status: 20,
  prerequisite: 15,
};

// ─────────────────────────────────────────────────────────────────────────────
// DATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the number of whole days between a date string (YYYY-MM-DD)
 * and today. Returns null if dateStr is falsy.
 */
function daysSince(dateStr) {
  if (!dateStr) return null;
  const past = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  // Zero-out time portion for a clean day diff
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today - past;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

// ─────────────────────────────────────────────────────────────────────────────
// INDIVIDUAL FACTOR SCORERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Performance factor (0–40 pts).
 * Lower quiz performance → higher recommendation priority.
 *
 * Converts raw score (e.g. 1/3) to a 0–10 scale, then:
 *   score10 = (rawScore / maxScore) × 10
 *   performancePoints = (10 − score10) × 4
 *
 * If no quiz has been taken: 20 pts (neutral).
 */
function scorePerformance(topicProgress) {
  if (topicProgress.score === null || topicProgress.score === undefined) {
    return {
      score: 20,
      maxScore: WEIGHTS.performance,
      explanation: 'No quiz attempted yet for this topic.',
    };
  }

  const raw = topicProgress.score;
  const max = topicProgress.maxScore || 3;
  const score10 = (raw / max) * 10;
  const points = Math.round(((10 - score10) * 4) * 100) / 100; // round to 2dp

  return {
    score: points,
    maxScore: WEIGHTS.performance,
    explanation: `You scored ${raw} out of ${max} on your last attempt.`,
  };
}

/**
 * Recency factor (0–25 pts).
 * More days since last review → higher priority.
 *
 *   points = min(daysSinceReview × 2.5, 25)
 *
 * If never reviewed: 15 pts (moderate — never studied is less urgent
 * than something studied but forgotten).
 */
function scoreRecency(topicProgress) {
  const days = daysSince(topicProgress.lastReviewed);

  if (days === null) {
    return {
      score: 15,
      maxScore: WEIGHTS.recency,
      explanation: 'You have not studied this topic yet.',
    };
  }

  const points = Math.min(Math.round(days * 2.5 * 100) / 100, WEIGHTS.recency);
  const dayLabel = days === 1 ? 'day' : 'days';

  return {
    score: points,
    maxScore: WEIGHTS.recency,
    explanation: `You last reviewed this topic ${days} ${dayLabel} ago.`,
  };
}

/**
 * Completion-status factor (0–20 pts).
 *
 *   in-progress  → 20  (started but not mastered — highest priority)
 *   not-started  → 10  (should study, but less urgent than struggling)
 *   reviewed     → 5   (already reviewed — lowest priority)
 */
function scoreStatus(topicProgress) {
  const statusPoints = {
    'in-progress': 20,
    'not-started': 10,
    'reviewed': 5,
  };

  const statusLabels = {
    'in-progress': 'This topic is in progress — you started it but have not mastered it yet.',
    'not-started': 'You have not started this topic yet.',
    'reviewed': 'You have already reviewed this topic.',
  };

  const status = topicProgress.status || 'not-started';
  const points = statusPoints[status] ?? 10;

  return {
    score: points,
    maxScore: WEIGHTS.status,
    explanation: statusLabels[status] || `Topic status: ${status}.`,
  };
}

/**
 * Prerequisite-readiness factor (0–15 pts).
 *
 * If all prerequisites have status "reviewed" or "in-progress": 15 pts.
 * If any prerequisite is "not-started": 0 pts (not ready).
 * If the topic has no prerequisites: 15 pts.
 */
function scorePrerequisites(topic, allTopicProgress) {
  if (!topic.prerequisites || topic.prerequisites.length === 0) {
    return {
      score: WEIGHTS.prerequisite,
      maxScore: WEIGHTS.prerequisite,
      explanation: 'This topic has no prerequisites.',
      met: true,
    };
  }

  const unmetPrereqs = [];
  for (const prereqId of topic.prerequisites) {
    const prereqProgress = allTopicProgress[prereqId];
    if (!prereqProgress || prereqProgress.status === 'not-started') {
      // Find a readable name — fall back to ID
      unmetPrereqs.push(prereqId);
    }
  }

  if (unmetPrereqs.length === 0) {
    const prereqNames = topic.prerequisites.join(', ');
    return {
      score: WEIGHTS.prerequisite,
      maxScore: WEIGHTS.prerequisite,
      explanation: `Prerequisites met: ${prereqNames}.`,
      met: true,
    };
  }

  return {
    score: 0,
    maxScore: WEIGHTS.prerequisite,
    explanation: `Prerequisites not met: ${unmetPrereqs.join(', ')}.`,
    met: false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN RECOMMENDATION FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a study recommendation based on the student's learning history.
 *
 * @param {Object} topicProgress — map of topicId → { status, score, maxScore, lastReviewed, attempts }
 * @param {Array}  courseTopics  — array of topic objects from courseData.js
 * @returns {Object} recommendation — { topicId, topicName, totalScore, factors, primaryReason, allScored }
 */
export function generateRecommendation(topicProgress, courseTopics) {
  if (!topicProgress || !courseTopics || courseTopics.length === 0) {
    return null;
  }

  // Score every topic
  const scored = courseTopics.map((topic) => {
    const progress = topicProgress[topic.id] || {
      status: 'not-started',
      score: null,
      maxScore: 3,
      lastReviewed: null,
      attempts: 0,
    };

    const perfFactor = scorePerformance(progress);
    const recencyFactor = scoreRecency(progress);
    const statusFactor = scoreStatus(progress);
    const prereqFactor = scorePrerequisites(topic, topicProgress);

    const factors = [
      { name: 'Quiz performance',       weight: WEIGHTS.performance,  ...perfFactor },
      { name: 'Time since last review', weight: WEIGHTS.recency,      ...recencyFactor },
      { name: 'Topic status',           weight: WEIGHTS.status,       ...statusFactor },
      { name: 'Prerequisite readiness', weight: WEIGHTS.prerequisite, ...prereqFactor },
    ];

    const totalScore = Math.round(
      (perfFactor.score + recencyFactor.score + statusFactor.score + prereqFactor.score) * 100
    ) / 100;

    return {
      topicId: topic.id,
      topicName: topic.name,
      topicOrder: topic.order,
      totalScore,
      factors,
    };
  });

  // Sort by totalScore descending, then by topic order descending (tiebreaker:
  // later topics in the syllabus represent more advanced/recent material)
  scored.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return b.topicOrder - a.topicOrder;
  });

  const recommended = scored[0];

  if (!recommended) return null;

  // Determine the primary reason — the factor with the highest individual
  // contribution relative to its maximum, excluding prerequisite (binary).
  const primaryFactor = recommended.factors
    .filter((f) => f.name !== 'Prerequisite readiness')
    .sort((a, b) => b.score - a.score)[0];

  const primaryReason = buildPrimaryReason(
    recommended.topicName,
    primaryFactor,
    topicProgress[recommended.topicId]
  );

  return {
    topicId: recommended.topicId,
    topicName: recommended.topicName,
    totalScore: recommended.totalScore,
    factors: recommended.factors,
    primaryReason,
    allScored: scored,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMARY REASON BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a human-readable sentence explaining the single most important
 * reason for the recommendation.
 *
 * Uses evidence-based language — no unsupported claims.
 */
function buildPrimaryReason(topicName, primaryFactor, progress) {
  if (!primaryFactor || !progress) {
    return `Based on your learning history, ${topicName} appears to be a good next topic to study.`;
  }

  const factorName = primaryFactor.name;

  if (factorName === 'Quiz performance' && progress.score !== null) {
    return (
      `You scored ${progress.score} out of ${progress.maxScore} on your last ` +
      `${topicName} quiz, which suggests this topic may need more practice.`
    );
  }

  if (factorName === 'Time since last review' && progress.lastReviewed) {
    const days = daysSince(progress.lastReviewed);
    return (
      `It has been ${days} day${days === 1 ? '' : 's'} since you last reviewed ` +
      `${topicName}. Your recent activity suggests revisiting this topic.`
    );
  }

  if (factorName === 'Topic status') {
    if (progress.status === 'in-progress') {
      return (
        `You started ${topicName} but have not completed it yet. ` +
        `Continuing where you left off may help reinforce your understanding.`
      );
    }
    if (progress.status === 'not-started') {
      return (
        `You have not started ${topicName} yet. Based on your current progress, ` +
        `this topic appears ready to begin.`
      );
    }
  }

  // Fallback
  return `Based on your learning history, ${topicName} appears to be a good next topic to review.`;
}
