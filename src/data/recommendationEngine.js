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
 *   Prerequisite readiness  15 pts   All prereqs met (threshold >= 2/3) → eligible
 *
 * ⚠️ Academic prototype. This is simulated logic — not machine learning.
 *    All scores are illustrative and have NOT been scientifically validated.
 */

// ─────────────────────────────────────────────────────────────────────────────
// WEIGHTS
// ─────────────────────────────────────────────────────────────────────────────

export const WEIGHTS = {
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
 * and today. Returns null if dateStr is falsy, unparseable, or invalid.
 */
export function daysSince(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const past = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(past.getTime())) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today - past;
  if (Number.isNaN(diffMs)) return null;

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
export function scorePerformance(topicProgress) {
  if (!topicProgress || topicProgress.score === null || topicProgress.score === undefined) {
    return {
      score: 20,
      maxScore: WEIGHTS.performance,
      explanation: 'No quiz attempted yet for this topic.',
    };
  }

  const raw = Number(topicProgress.score);
  const max = Number(topicProgress.maxScore) || 3;
  if (Number.isNaN(raw) || Number.isNaN(max) || max <= 0) {
    return {
      score: 20,
      maxScore: WEIGHTS.performance,
      explanation: 'No valid quiz attempted yet for this topic.',
    };
  }

  const score10 = (raw / max) * 10;
  const points = Math.round(((10 - score10) * 4) * 100) / 100; // round to 2dp

  return {
    score: Math.max(0, Math.min(WEIGHTS.performance, points)),
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
 * If never reviewed or invalid date: 15 pts (moderate — never studied is less urgent
 * than something studied but forgotten).
 */
export function scoreRecency(topicProgress) {
  if (!topicProgress || !topicProgress.lastReviewed) {
    return {
      score: 15,
      maxScore: WEIGHTS.recency,
      explanation: 'You have not studied this topic yet.',
    };
  }

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
    score: Math.max(0, points),
    maxScore: WEIGHTS.recency,
    explanation: `You last reviewed this topic ${days} ${dayLabel} ago.`,
  };
}

/**
 * Completion-status factor (0–20 pts).
 *
 *   in-progress  → 20  (started but not mastered — highest priority)
 *   not-started  → 10  (should study, but less urgent than struggling)
 *   reviewed     → 5   (formative threshold met — lowest priority)
 */
export function scoreStatus(topicProgress) {
  const statusPoints = {
    'in-progress': 20,
    'not-started': 10,
    'reviewed': 5,
  };

  const statusLabels = {
    'in-progress': 'This topic is in progress — you started it but have not completed its review yet.',
    'not-started': 'You have not started this topic yet.',
    'reviewed': 'You have already met the review threshold for this topic.',
  };

  const status = topicProgress?.status || 'not-started';
  const points = statusPoints[status] ?? 10;

  return {
    score: points,
    maxScore: WEIGHTS.status,
    explanation: statusLabels[status] || `Topic status: ${status}.`,
  };
}

/**
 * Check whether a prerequisite topic has satisfied the readiness threshold.
 * Exact rule:
 * - score/maxScore >= 2/3 (or score >= 2 when maxScore is 3) -> READY
 * - score/maxScore < 2/3 (0/3 or 1/3) -> NOT READY (0 readiness points)
 * - not attempted -> NOT READY
 * Fallback for legacy records without score: status === 'reviewed'.
 */
export function isPrerequisiteReady(prereqProgress) {
  if (!prereqProgress) return false;
  if (prereqProgress.score !== null && prereqProgress.score !== undefined) {
    const raw = Number(prereqProgress.score);
    const max = Number(prereqProgress.maxScore) || 3;
    if (max > 0 && !Number.isNaN(raw)) {
      return (raw / max) >= (2 / 3);
    }
  }
  return prereqProgress.status === 'reviewed';
}

/**
 * Prerequisite-readiness factor (0–15 pts).
 *
 * If all prerequisites have satisfied the formative review threshold: 15 pts.
 * If any prerequisite is below threshold (0/3, 1/3, not started): 0 pts.
 * If the topic has no prerequisites: 15 pts.
 */
export function scorePrerequisites(topic, allTopicProgress) {
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
    const prereqProgress = allTopicProgress ? allTopicProgress[prereqId] : null;
    if (!isPrerequisiteReady(prereqProgress)) {
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
    explanation: `Prerequisites not yet ready: ${unmetPrereqs.join(', ')}.`,
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
 * @returns {Object|null} recommendation — { topicId, topicName, totalScore, factors, primaryReason, allScored, isAllCompleted }
 */
export function generateRecommendation(topicProgress, courseTopics) {
  if (!topicProgress || !courseTopics || courseTopics.length === 0) {
    return null;
  }

  // Check if every topic in the course has reached formative threshold (status === 'reviewed' or score >= 2/3)
  const allCompleted = courseTopics.every((topic) => {
    const p = topicProgress[topic.id];
    return isPrerequisiteReady(p);
  });

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

  // Primary factor selection: compare normalized factor contributions (score / maxScore)
  // excluding binary prerequisite readiness.
  const eligibleFactors = recommended.factors.filter((f) => f.name !== 'Prerequisite readiness');
  const primaryFactor = [...eligibleFactors].sort((a, b) => {
    const ratioA = a.maxScore > 0 ? a.score / a.maxScore : 0;
    const ratioB = b.maxScore > 0 ? b.score / b.maxScore : 0;
    if (ratioB !== ratioA) return ratioB - ratioA;
    // Tiebreaker among normalized ratios: fall back to raw score
    return b.score - a.score;
  })[0];

  const primaryReason = buildPrimaryReason(
    recommended.topicName,
    primaryFactor,
    topicProgress[recommended.topicId],
    allCompleted
  );

  return {
    topicId: recommended.topicId,
    topicName: recommended.topicName,
    totalScore: recommended.totalScore,
    factors: recommended.factors,
    primaryReason,
    allScored: scored,
    isAllCompleted: allCompleted,
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
export function buildPrimaryReason(topicName, primaryFactor, progress, isAllCompleted = false) {
  // If all topics have reached the formative review threshold, provide a refresher/comprehensive rationale
  if (isAllCompleted) {
    if (progress && progress.lastReviewed) {
      const days = daysSince(progress.lastReviewed);
      if (days !== null) {
        return (
          `You have met the review threshold for all topics. Suggested refresher on ${topicName}, ` +
          `which was reviewed ${days} day${days === 1 ? '' : 's'} ago.`
        );
      }
    }
    return `You have met the review threshold for all topics. ${topicName} is suggested for spaced recall.`;
  }

  if (!primaryFactor || !progress) {
    return `Based on your learning history, ${topicName} appears to be a good next topic to study.`;
  }

  const factorName = primaryFactor.name;

  if (factorName === 'Quiz performance' && progress.score !== null && progress.score !== undefined) {
    return (
      `You scored ${progress.score} out of ${progress.maxScore || 3} on your last ` +
      `${topicName} quiz, which suggests this topic may need more practice.`
    );
  }

  if (factorName === 'Time since last review' && progress.lastReviewed) {
    const days = daysSince(progress.lastReviewed);
    if (days !== null) {
      return (
        `It has been ${days} day${days === 1 ? '' : 's'} since you last reviewed ` +
        `${topicName}. Your recent activity suggests revisiting this topic.`
      );
    }
  }

  if (factorName === 'Topic status') {
    if (progress.status === 'in-progress') {
      return (
        `You started ${topicName} but have not completed its review yet. ` +
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
