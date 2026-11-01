import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLearningHistory, { LS_KEY } from './useLearningHistory.js';
import useRecommendation from './useRecommendation.js';

describe('Recommendation Episode Identity & recommendationHistory Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates exactly one recommendation episode snapshot when a recommendation is computed', () => {
    const { result: historyResult } = renderHook(() => useLearningHistory());
    const { result: recResult } = renderHook(() =>
      useRecommendation(historyResult.current.history, historyResult.current.recordRecommendationSnapshot)
    );

    expect(recResult.current).not.toBeNull();
    const episodeId = recResult.current.recommendationId;
    expect(episodeId).toBeDefined();
    expect(episodeId.startsWith('rec-')).toBe(true);

    // Verify snapshot was added to recommendationHistory in learning history
    const stored = JSON.parse(localStorage.getItem(LS_KEY));
    expect(stored.recommendationHistory.length).toBe(1);
    expect(stored.recommendationHistory[0].recommendationId).toBe(episodeId);
    expect(stored.recommendationHistory[0].topicId).toBe(recResult.current.topicId);
    expect(stored.recommendationHistory[0].totalScore).toBe(recResult.current.totalScore);

    // Verify rec_generated event was also appended
    const genEvent = stored.recommendationInteractions.find((e) => e.eventType === 'rec_generated');
    expect(genEvent).toBeDefined();
    expect(genEvent.recommendationId).toBe(episodeId);
  });

  it('does not create duplicate snapshots or episodes on repeated re-renders', () => {
    const { result: historyResult, rerender: rerenderHistory } = renderHook(() => useLearningHistory());
    const { result: recResult, rerender: rerenderRec } = renderHook(() =>
      useRecommendation(historyResult.current.history, historyResult.current.recordRecommendationSnapshot)
    );

    const initialEpisodeId = recResult.current.recommendationId;

    // Rerender several times
    rerenderRec();
    rerenderHistory();
    rerenderRec();

    expect(recResult.current.recommendationId).toBe(initialEpisodeId);

    const stored = JSON.parse(localStorage.getItem(LS_KEY));
    expect(stored.recommendationHistory.length).toBe(1);
    const genEvents = stored.recommendationInteractions.filter((e) => e.eventType === 'rec_generated');
    expect(genEvents.length).toBe(1);
  });

  it('preserves the active episode across unmounts/remounts (simulating page navigation)', () => {
    const { result: historyResult } = renderHook(() => useLearningHistory());
    const { result: recResult1, unmount } = renderHook(() =>
      useRecommendation(historyResult.current.history, historyResult.current.recordRecommendationSnapshot)
    );

    const firstEpisodeId = recResult1.current.recommendationId;
    unmount(); // Simulate leaving Dashboard

    // Mount again (simulating returning to Dashboard or visiting RecommendationPage)
    const { result: recResult2 } = renderHook(() =>
      useRecommendation(historyResult.current.history, historyResult.current.recordRecommendationSnapshot)
    );

    expect(recResult2.current.recommendationId).toBe(firstEpisodeId);

    const stored = JSON.parse(localStorage.getItem(LS_KEY));
    expect(stored.recommendationHistory.length).toBe(1);
  });

  it('generates a genuinely new episode with a distinct ID when learning progress changes the recommendation', () => {
    const { result: historyResult } = renderHook(() => useLearningHistory());
    const { result: recResult, rerender } = renderHook(() =>
      useRecommendation(historyResult.current.history, historyResult.current.recordRecommendationSnapshot)
    );

    const firstEpisodeId = recResult.current.recommendationId;

    // Update learning history by completing the recommended quiz with a high score
    act(() => {
      historyResult.current.recordQuizResult('sql-joins', 3, 3, 'SQL JOINs');
    });

    rerender();

    const secondEpisodeId = recResult.current.recommendationId;
    expect(secondEpisodeId).toBeDefined();
    expect(secondEpisodeId).not.toBe(firstEpisodeId);

    const stored = JSON.parse(localStorage.getItem(LS_KEY));
    expect(stored.recommendationHistory.length).toBe(2);
    expect(stored.recommendationHistory[0].recommendationId).toBe(firstEpisodeId);
    expect(stored.recommendationHistory[1].recommendationId).toBe(secondEpisodeId);
  });

  it('preserves legacy interaction records that contain topic IDs as recommendationId', () => {
    // Seed with legacy interaction records
    const legacyHistory = {
      schemaVersion: 2,
      studentName: 'Alex',
      courseId: 'cs3200',
      topicProgress: {},
      quizAttempts: [],
      recommendationHistory: [],
      recommendationInteractions: [
        {
          id: 'legacy-evt-1',
          timestamp: '2026-10-25T10:00:00.000Z',
          eventType: 'rec_accepted',
          recommendationId: 'sql-joins',
          topicName: 'SQL JOINs',
        },
      ],
      reflections: [],
      activityLog: [],
    };
    localStorage.setItem(LS_KEY, JSON.stringify(legacyHistory));

    const { result } = renderHook(() => useLearningHistory());
    expect(result.current.history.recommendationInteractions.length).toBe(1);
    expect(result.current.history.recommendationInteractions[0].recommendationId).toBe('sql-joins');

    // Adding an episode snapshot does not overwrite or corrupt legacy events
    act(() => {
      result.current.recordRecommendationSnapshot({
        recommendationId: 'rec-new-123',
        topicId: 'relational-model',
        topicName: 'Relational Model',
        totalScore: 82,
        factors: [],
        primaryReason: 'New reason',
      });
    });

    const stored = JSON.parse(localStorage.getItem(LS_KEY));
    expect(stored.recommendationInteractions.length).toBe(2);
    expect(stored.recommendationInteractions[0].id).toBe('legacy-evt-1');
    expect(stored.recommendationInteractions[0].recommendationId).toBe('sql-joins');
    expect(stored.recommendationInteractions[1].recommendationId).toBe('rec-new-123');
  });
});
