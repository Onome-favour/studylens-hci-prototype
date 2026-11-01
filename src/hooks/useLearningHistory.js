import { useState, useCallback } from 'react';
import { defaultHistory } from '../data/mockHistory.js';

/**
 * useLearningHistory
 *
 * Manages the student's learning history state with versioned localStorage persistence (Schema Version 2).
 *
 * Features:
 * - Schema version 2 with backward-compatible migration from version 1 / unversioned records.
 * - Append-only immutable quiz attempt history (`quizAttempts`).
 * - Separate latest topic progress summary for lightweight UI consumption (`topicProgress`).
 * - Full attempt recording with question IDs, selected options, correctness, and confidence ratings.
 * - Recommendation history, recommendation interaction logging, and reflections support.
 * - Complete demo reset to fresh Schema Version 2 initial state.
 *
 * ⚠️ Prototype hook. Uses localStorage only — no backend.
 */

export const LS_KEY = 'studylens-learning-history';

// ─────────────────────────────────────────────────────────────────────────────
// LOCALSTORAGE & MIGRATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates and migrates legacy / unversioned storage payloads into Schema Version 2.
 * Does NOT reconstruct or fabricate historical attempts from legacy summaries.
 */
export function migrateToV2(rawParsed) {
  if (!rawParsed || typeof rawParsed !== 'object') {
    return structuredClone(defaultHistory);
  }

  // If already schemaVersion 2, ensure all expected collections exist
  if (rawParsed.schemaVersion === 2) {
    return {
      schemaVersion: 2,
      studentName: rawParsed.studentName || defaultHistory.studentName,
      courseId: rawParsed.courseId || defaultHistory.courseId,
      topicProgress: typeof rawParsed.topicProgress === 'object' && rawParsed.topicProgress !== null
        ? rawParsed.topicProgress
        : structuredClone(defaultHistory.topicProgress),
      quizAttempts: Array.isArray(rawParsed.quizAttempts) ? rawParsed.quizAttempts : [],
      recommendationHistory: Array.isArray(rawParsed.recommendationHistory) ? rawParsed.recommendationHistory : [],
      recommendationInteractions: Array.isArray(rawParsed.recommendationInteractions) ? rawParsed.recommendationInteractions : [],
      reflections: Array.isArray(rawParsed.reflections) ? rawParsed.reflections : [],
      activityLog: Array.isArray(rawParsed.activityLog) ? rawParsed.activityLog : [],
    };
  }

  // Migration from unversioned / Schema v1:
  // Preserve student identity, existing topicProgress, and existing activityLog
  const migrated = {
    schemaVersion: 2,
    studentName: rawParsed.studentName || defaultHistory.studentName,
    courseId: rawParsed.courseId || defaultHistory.courseId,
    topicProgress: typeof rawParsed.topicProgress === 'object' && rawParsed.topicProgress !== null
      ? rawParsed.topicProgress
      : structuredClone(defaultHistory.topicProgress),
    // Initialize new historical collections as empty arrays — never fabricate historical attempts
    quizAttempts: [],
    recommendationHistory: [],
    recommendationInteractions: [],
    reflections: [],
    activityLog: Array.isArray(rawParsed.activityLog) ? rawParsed.activityLog : [],
  };

  return migrated;
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return migrateToV2(parsed);
  } catch (err) {
    console.warn('[StudyLens] Corrupted localStorage data encountered. Initializing default state.', err);
    return null;
  }
}

export function saveToStorage(history) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('[StudyLens] Failed to save state to localStorage:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE & ID HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Returns today's date as a YYYY-MM-DD string. */
export function todayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export default function useLearningHistory() {
  const [history, setHistory] = useState(() => {
    return loadFromStorage() || structuredClone(defaultHistory);
  });

  /**
   * Record a quiz result for a topic.
   *
   * @param {string} topicId      — e.g. "sql-joins"
   * @param {number} score        — correct answers (e.g. 2)
   * @param {number} maxScore     — total questions (e.g. 3)
   * @param {string} topicName    — human-readable name for the activity log
   * @param {Array}  responses    — optional question-level response telemetry
   *                                [{ questionId, selectedOptionId, correctOptionId, isCorrect, confidence }]
   * @param {string} startTimestamp — ISO string timestamp when quiz started
   * @returns {string} attemptId  — unique ID of the created attempt record
   */
  const recordQuizResult = useCallback((topicId, score, maxScore, topicName, responses = [], startTimestamp = null) => {
    const completionTimestamp = new Date().toISOString();
    const attemptId = generateId('att');

    setHistory((prev) => {
      const updated = structuredClone(prev);

      // ── 1. Create immutable historical attempt record ───────────────────
      const attemptRecord = {
        attemptId,
        topicId,
        topicName: topicName || topicId,
        score,
        maxScore,
        startTimestamp: startTimestamp || completionTimestamp,
        completionTimestamp,
        responses: Array.isArray(responses) ? structuredClone(responses) : [],
      };

      if (!Array.isArray(updated.quizAttempts)) {
        updated.quizAttempts = [];
      }
      updated.quizAttempts.push(attemptRecord);

      // ── 2. Update latest topic progress summary ─────────────────────────
      if (!updated.topicProgress) {
        updated.topicProgress = {};
      }

      const existing = updated.topicProgress[topicId] || {
        status: 'not-started',
        score: null,
        maxScore,
        lastReviewed: null,
        attempts: 0,
      };

      existing.score = score;
      existing.maxScore = maxScore;
      existing.lastReviewed = todayStr();
      existing.attempts = (existing.attempts || 0) + 1;

      // Status rule: >= 2/3 correct -> "reviewed", otherwise -> "in-progress"
      existing.status = (score / maxScore) >= (2 / 3) ? 'reviewed' : 'in-progress';
      updated.topicProgress[topicId] = existing;

      // ── 3. Append to activity log ───────────────────────────────────────
      if (!Array.isArray(updated.activityLog)) {
        updated.activityLog = [];
      }
      const verb = existing.status === 'reviewed' ? 'Completed' : 'Attempted';
      updated.activityLog.unshift({
        date: todayStr(),
        topicId,
        action: `${verb} ${topicName || topicId} quiz`,
        score: `${score}/${maxScore}`,
        attemptId,
      });

      if (updated.activityLog.length > 30) {
        updated.activityLog = updated.activityLog.slice(0, 30);
      }

      saveToStorage(updated);
      return updated;
    });

    return attemptId;
  }, []);

  /**
   * Record a snapshot of a newly generated recommendation episode (Milestone 4 Completion).
   * Ensures idempotency: will not record if the snapshot with the same recommendationId already exists.
   *
   * @param {Object} snapshot — { recommendationId, generatedAt, topicId, topicName, totalScore, factors, primaryReason, isAllCompleted }
   */
  const recordRecommendationSnapshot = useCallback((snapshot) => {
    if (!snapshot || !snapshot.recommendationId) return;

    setHistory((prev) => {
      const updated = structuredClone(prev);
      if (!Array.isArray(updated.recommendationHistory)) {
        updated.recommendationHistory = [];
      }

      // Check for existing snapshot to guarantee idempotency across StrictMode / re-renders
      const exists = updated.recommendationHistory.some(
        (rec) => rec.recommendationId === snapshot.recommendationId
      );
      if (exists) {
        return prev;
      }

      updated.recommendationHistory.push({
        recommendationId: snapshot.recommendationId,
        generatedAt: snapshot.generatedAt || new Date().toISOString(),
        topicId: snapshot.topicId,
        topicName: snapshot.topicName,
        totalScore: snapshot.totalScore,
        factors: Array.isArray(snapshot.factors) ? structuredClone(snapshot.factors) : [],
        primaryReason: snapshot.primaryReason,
        isAllCompleted: Boolean(snapshot.isAllCompleted),
      });

      // Also append the 'rec_generated' interaction event linked to this episode
      if (!Array.isArray(updated.recommendationInteractions)) {
        updated.recommendationInteractions = [];
      }
      updated.recommendationInteractions.push({
        id: generateId('evt'),
        timestamp: snapshot.generatedAt || new Date().toISOString(),
        eventType: 'rec_generated',
        recommendationId: snapshot.recommendationId,
        topicId: snapshot.topicId,
        topicName: snapshot.topicName,
        totalScore: snapshot.totalScore,
      });

      saveToStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Log an event interaction with recommendations (Milestone 4).
   */
  const logRecommendationInteraction = useCallback((eventData) => {
    setHistory((prev) => {
      const updated = structuredClone(prev);
      if (!Array.isArray(updated.recommendationInteractions)) {
        updated.recommendationInteractions = [];
      }

      const newEvent = {
        id: generateId('evt'),
        timestamp: new Date().toISOString(),
        ...eventData,
      };

      updated.recommendationInteractions.push(newEvent);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Record a post-quiz reflection (Milestone 4).
   */
  const recordReflection = useCallback((reflectionData) => {
    setHistory((prev) => {
      const updated = structuredClone(prev);
      if (!Array.isArray(updated.reflections)) {
        updated.reflections = [];
      }

      const newReflection = {
        id: generateId('ref'),
        timestamp: new Date().toISOString(),
        ...reflectionData,
      };

      updated.reflections.push(newReflection);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Reset learning history to the default mock data (Schema Version 2).
   */
  const resetHistory = useCallback(() => {
    const fresh = structuredClone(defaultHistory);
    saveToStorage(fresh);
    setHistory(fresh);
  }, []);

  return {
    history,
    recordQuizResult,
    recordRecommendationSnapshot,
    logRecommendationInteraction,
    recordReflection,
    resetHistory,
  };
}
