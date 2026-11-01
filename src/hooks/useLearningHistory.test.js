import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLearningHistory, { migrateToV2, LS_KEY } from './useLearningHistory.js';
import { defaultHistory } from '../data/mockHistory.js';

describe('useLearningHistory hook & Schema v2 persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('migrateToV2', () => {
    it('returns fresh defaultHistory with schemaVersion 2 when input is null or corrupted', () => {
      const result = migrateToV2(null);
      expect(result.schemaVersion).toBe(2);
      expect(result.studentName).toBe('Alex');
      expect(Array.isArray(result.quizAttempts)).toBe(true);
      expect(result.quizAttempts.length).toBe(0);
    });

    it('safely migrates unversioned/v1 data preserving studentName, courseId, topicProgress, and activityLog without fabricating historical attempts', () => {
      const v1Data = {
        studentName: 'Jordan',
        courseId: 'cs3200',
        topicProgress: {
          'sql-joins': { status: 'in-progress', score: 1, maxScore: 3, lastReviewed: '2026-09-02', attempts: 1 },
        },
        activityLog: [
          { date: '2026-09-02', topicId: 'sql-joins', action: 'Attempted SQL JOINs quiz', score: '1/3' },
        ],
      };

      const migrated = migrateToV2(v1Data);
      expect(migrated.schemaVersion).toBe(2);
      expect(migrated.studentName).toBe('Jordan');
      expect(migrated.topicProgress['sql-joins'].score).toBe(1);
      expect(migrated.activityLog.length).toBe(1);
      // Collections must be initialized empty without fabricating attempts
      expect(migrated.quizAttempts).toEqual([]);
      expect(migrated.recommendationHistory).toEqual([]);
      expect(migrated.recommendationInteractions).toEqual([]);
      expect(migrated.reflections).toEqual([]);
    });

    it('preserves existing v2 records intact', () => {
      const v2Data = {
        schemaVersion: 2,
        studentName: 'Alex',
        courseId: 'cs3200',
        topicProgress: {},
        quizAttempts: [{ attemptId: 'att-1', topicId: 'intro', score: 3 }],
        recommendationHistory: [],
        recommendationInteractions: [],
        reflections: [],
        activityLog: [],
      };
      const result = migrateToV2(v2Data);
      expect(result.quizAttempts.length).toBe(1);
      expect(result.quizAttempts[0].attemptId).toBe('att-1');
    });
  });

  describe('useLearningHistory operations', () => {
    it('initializes with default Schema v2 state', () => {
      const { result } = renderHook(() => useLearningHistory());
      expect(result.current.history.schemaVersion).toBe(2);
      expect(result.current.history.studentName).toBe('Alex');
      expect(result.current.history.quizAttempts).toEqual([]);
    });

    it('creates distinct immutable historical attempt records when taking and retaking the same quiz', () => {
      const { result } = renderHook(() => useLearningHistory());

      // Attempt 1: score 1/3
      act(() => {
        result.current.recordQuizResult(
          'sql-joins',
          1,
          3,
          'SQL JOINs',
          [
            { questionId: 'q1', selectedOptionId: 'b', correctOptionId: 'b', isCorrect: true, confidence: 'certain' },
            { questionId: 'q2', selectedOptionId: 'a', correctOptionId: 'c', isCorrect: false, confidence: 'just-guessing' },
            { questionId: 'q3', selectedOptionId: 'd', correctOptionId: 'a', isCorrect: false, confidence: 'somewhat-sure' },
          ],
          '2026-10-30T10:00:00.000Z'
        );
      });

      expect(result.current.history.quizAttempts.length).toBe(1);
      const firstAttempt = result.current.history.quizAttempts[0];
      expect(firstAttempt.topicId).toBe('sql-joins');
      expect(firstAttempt.score).toBe(1);
      expect(firstAttempt.responses.length).toBe(3);
      expect(result.current.history.topicProgress['sql-joins'].score).toBe(1);
      expect(result.current.history.topicProgress['sql-joins'].attempts).toBe(2); // Initial fixture had 1, now +1 = 2

      // Attempt 2 (retake): score 3/3
      act(() => {
        result.current.recordQuizResult(
          'sql-joins',
          3,
          3,
          'SQL JOINs',
          [
            { questionId: 'q1', selectedOptionId: 'b', correctOptionId: 'b', isCorrect: true, confidence: 'certain' },
            { questionId: 'q2', selectedOptionId: 'c', correctOptionId: 'c', isCorrect: true, confidence: 'certain' },
            { questionId: 'q3', selectedOptionId: 'a', correctOptionId: 'a', isCorrect: true, confidence: 'certain' },
          ],
          '2026-10-30T10:05:00.000Z'
        );
      });

      // Both attempts must be preserved!
      expect(result.current.history.quizAttempts.length).toBe(2);
      expect(result.current.history.quizAttempts[0].score).toBe(1);
      expect(result.current.history.quizAttempts[1].score).toBe(3);

      // Latest summary reflects latest attempt
      expect(result.current.history.topicProgress['sql-joins'].score).toBe(3);
      expect(result.current.history.topicProgress['sql-joins'].status).toBe('reviewed');
      expect(result.current.history.topicProgress['sql-joins'].attempts).toBe(3);

      // Verify localStorage was updated with v2 payload
      const stored = JSON.parse(localStorage.getItem(LS_KEY));
      expect(stored.schemaVersion).toBe(2);
      expect(stored.quizAttempts.length).toBe(2);
    });

    it('resetHistory restores default v2 state and clears attempt history', () => {
      const { result } = renderHook(() => useLearningHistory());

      act(() => {
        result.current.recordQuizResult('sql-joins', 3, 3, 'SQL JOINs');
      });
      expect(result.current.history.quizAttempts.length).toBe(1);

      act(() => {
        result.current.resetHistory();
      });

      expect(result.current.history.schemaVersion).toBe(2);
      expect(result.current.history.quizAttempts).toEqual([]);
      expect(result.current.history.topicProgress['sql-joins'].score).toBe(1); // Default fixture score
    });
  });
});
