import { useState, useMemo, useEffect, useRef } from 'react';
import { generateRecommendation } from '../data/recommendationEngine.js';
import { course } from '../data/courseData.js';
import { generateId } from './useLearningHistory.js';

const ACTIVE_EPISODE_KEY = 'studylens-active-episode';

/**
 * useRecommendation
 *
 * Derives a study recommendation from the current learning history.
 * Manages stable recommendation episode IDs and persists snapshots to recommendationHistory.
 *
 * Requirements:
 * - One recommendation episode has one stable ID across re-renders and page navigation.
 * - Snapshots are persisted to recommendationHistory idempotently.
 * - When learning progress changes or a genuinely new recommendation is generated, a new episode ID is created.
 *
 * @param {Object} history — the full learning history object from useLearningHistory
 * @param {Function} [recordSnapshot] — optional callback to record snapshot to learning history
 * @returns {Object|null}  — the recommendation object with episodeId, or null if unable to compute
 */
export default function useRecommendation(history, recordSnapshot) {
  // 1. Calculate raw recommendation deterministically
  const computed = useMemo(() => {
    if (!history || !history.topicProgress) return null;
    return generateRecommendation(history.topicProgress, course.topics);
  }, [history?.topicProgress]);

  // Compute a content signature that changes only when the recommendation or score factors change
  const contentSignature = useMemo(() => {
    if (!computed) return null;
    return `${computed.topicId}-${computed.totalScore}-${computed.isAllCompleted}`;
  }, [computed]);

  // 2. Active episode state: { episodeId, signature, topicId, generatedAt }
  const [activeEpisode, setActiveEpisode] = useState(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_EPISODE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore localStorage parse errors
    }
    return null;
  });

  // Track the last recorded episodeId in a ref to avoid duplicate snapshots in StrictMode
  const recordedEpisodeIdRef = useRef(null);

  // 3. Coordinate episode creation and persistence
  useEffect(() => {
    if (!computed || !contentSignature) return;

    let currentEpisode = activeEpisode;

    // Check if the current episode matches the computed recommendation
    if (!currentEpisode || currentEpisode.signature !== contentSignature) {
      // Genuinely new recommendation episode
      const newEpisodeId = generateId('rec');
      const generatedAt = new Date().toISOString();

      currentEpisode = {
        episodeId: newEpisodeId,
        signature: contentSignature,
        topicId: computed.topicId,
        generatedAt,
      };

      try {
        localStorage.setItem(ACTIVE_EPISODE_KEY, JSON.stringify(currentEpisode));
      } catch {
        // Ignore localStorage error
      }

      setActiveEpisode(currentEpisode);
    }

    // Persist snapshot if not already recorded
    if (
      recordSnapshot &&
      currentEpisode?.episodeId &&
      recordedEpisodeIdRef.current !== currentEpisode.episodeId
    ) {
      recordedEpisodeIdRef.current = currentEpisode.episodeId;

      recordSnapshot({
        recommendationId: currentEpisode.episodeId,
        generatedAt: currentEpisode.generatedAt,
        topicId: computed.topicId,
        topicName: computed.topicName,
        totalScore: computed.totalScore,
        factors: computed.factors,
        primaryReason: computed.primaryReason,
        isAllCompleted: computed.isAllCompleted,
      });
    }
  }, [computed, contentSignature, activeEpisode, recordSnapshot]);

  // 4. Return recommendation enriched with stable episode ID
  const recommendation = useMemo(() => {
    if (!computed) return null;
    const episodeId = activeEpisode?.episodeId || computed.topicId;

    return {
      ...computed,
      recommendationId: episodeId,
      episodeId,
    };
  }, [computed, activeEpisode?.episodeId]);

  return recommendation;
}
