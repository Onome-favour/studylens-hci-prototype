import { useMemo } from 'react';
import { generateRecommendation } from '../data/recommendationEngine.js';
import { course } from '../data/courseData.js';

/**
 * useRecommendation
 *
 * Derives a study recommendation from the current learning history.
 * The recommendation is computed (not stored) — it automatically
 * recalculates whenever the history changes.
 *
 * @param {Object} history — the full learning history object from useLearningHistory
 * @returns {Object|null}  — the recommendation object, or null if unable to compute
 */
export default function useRecommendation(history) {
  const recommendation = useMemo(() => {
    if (!history || !history.topicProgress) return null;
    return generateRecommendation(history.topicProgress, course.topics);
  }, [history]);

  return recommendation;
}
