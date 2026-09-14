import { useState, useCallback } from 'react';
import { defaultHistory } from '../data/mockHistory.js';

/**
 * useLearningHistory
 *
 * Manages the student's learning history state with localStorage persistence.
 *
 * - Initialises from localStorage (if valid), otherwise falls back to defaultHistory.
 * - Provides methods to record quiz results, which update topic progress
 *   and append to the activity log.
 * - Provides a reset function to restore the default history.
 *
 * ⚠️ Prototype hook. Uses localStorage only — no backend.
 */

const LS_KEY = 'studylens-learning-history';

// ─────────────────────────────────────────────────────────────────────────────
// LOCALSTORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Basic shape validation — must have topicProgress and activityLog
    if (
      parsed &&
      typeof parsed.topicProgress === 'object' &&
      Array.isArray(parsed.activityLog)
    ) {
      return parsed;
    }
    return null;
  } catch {
    // Corrupted data — fall back to default
    return null;
  }
}

function saveToStorage(history) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(history));
  } catch {
    // localStorage unavailable or full — fail silently
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE HELPER
// ─────────────────────────────────────────────────────────────────────────────

/** Returns today's date as a YYYY-MM-DD string. */
function todayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
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
   * @param {string} topicId     — e.g. "sql-joins"
   * @param {number} score       — correct answers (e.g. 2)
   * @param {number} maxScore    — total questions (e.g. 3)
   * @param {string} topicName   — human-readable name for the activity log
   */
  const recordQuizResult = useCallback((topicId, score, maxScore, topicName) => {
    setHistory((prev) => {
      const updated = structuredClone(prev);

      // ── Update topic progress ──────────────────────────────────────────
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
      existing.attempts += 1;

      // Status: >= 2/3 correct → "reviewed", otherwise → "in-progress"
      existing.status = score / maxScore >= 2 / 3 ? 'reviewed' : 'in-progress';

      updated.topicProgress[topicId] = existing;

      // ── Append activity log entry (most recent first) ──────────────────
      const pct = Math.round((score / maxScore) * 100);
      const verb = existing.status === 'reviewed' ? 'Completed' : 'Attempted';
      updated.activityLog.unshift({
        date: todayStr(),
        topicId,
        action: `${verb} ${topicName || topicId} quiz`,
        score: `${score}/${maxScore}`,
      });

      // Keep activity log to a reasonable size (last 20 entries)
      if (updated.activityLog.length > 20) {
        updated.activityLog = updated.activityLog.slice(0, 20);
      }

      saveToStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Reset learning history to the default mock data.
   * Useful for prototype demonstrations.
   */
  const resetHistory = useCallback(() => {
    const fresh = structuredClone(defaultHistory);
    saveToStorage(fresh);
    setHistory(fresh);
  }, []);

  return {
    history,
    recordQuizResult,
    resetHistory,
  };
}
