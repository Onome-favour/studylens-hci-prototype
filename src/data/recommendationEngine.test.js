import { describe, it, expect } from 'vitest';
import {
  daysSince,
  scorePerformance,
  scoreRecency,
  scoreStatus,
  scorePrerequisites,
  isPrerequisiteReady,
  generateRecommendation,
  buildPrimaryReason,
} from './recommendationEngine.js';

describe('recommendationEngine unit tests', () => {
  describe('daysSince and date handling', () => {
    it('returns null for falsy dates', () => {
      expect(daysSince(null)).toBeNull();
      expect(daysSince('')).toBeNull();
      expect(daysSince(undefined)).toBeNull();
    });

    it('returns null for malformed or non-date strings without NaN', () => {
      expect(daysSince('invalid-date')).toBeNull();
      expect(daysSince('not-a-date')).toBeNull();
      expect(daysSince(123)).toBeNull();
    });

    it('returns a non-negative whole number for valid YYYY-MM-DD dates', () => {
      const past = '2026-08-01';
      const days = daysSince(past);
      expect(typeof days).toBe('number');
      expect(days).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(days)).toBe(true);
    });
  });

  describe('scorePerformance', () => {
    it('awards 20 points for unattempted topic', () => {
      expect(scorePerformance({ score: null }).score).toBe(20);
      expect(scorePerformance({ score: undefined }).score).toBe(20);
      expect(scorePerformance(null).score).toBe(20);
    });

    it('handles 0/3 as 40 points (maximum urgency)', () => {
      expect(scorePerformance({ score: 0, maxScore: 3 }).score).toBe(40);
    });

    it('handles 1/3 as 26.67 points', () => {
      expect(scorePerformance({ score: 1, maxScore: 3 }).score).toBe(26.67);
    });

    it('handles 2/3 as 13.33 points', () => {
      expect(scorePerformance({ score: 2, maxScore: 3 }).score).toBe(13.33);
    });

    it('handles 3/3 as 0 points (minimum urgency)', () => {
      expect(scorePerformance({ score: 3, maxScore: 3 }).score).toBe(0);
    });
  });

  describe('scoreRecency', () => {
    it('awards 15 points if never reviewed or invalid date', () => {
      expect(scoreRecency({ lastReviewed: null }).score).toBe(15);
      expect(scoreRecency({ lastReviewed: 'invalid-date' }).score).toBe(15);
      expect(scoreRecency(null).score).toBe(15);
    });

    it('caps recency score at 25 points', () => {
      // 100 days ago should cap at 25
      expect(scoreRecency({ lastReviewed: '2020-01-01' }).score).toBe(25);
    });
  });

  describe('scoreStatus', () => {
    it('awards 20 for in-progress, 10 for not-started, 5 for reviewed', () => {
      expect(scoreStatus({ status: 'in-progress' }).score).toBe(20);
      expect(scoreStatus({ status: 'not-started' }).score).toBe(10);
      expect(scoreStatus({ status: 'reviewed' }).score).toBe(5);
      expect(scoreStatus({}).score).toBe(10);
    });
  });

  describe('isPrerequisiteReady & scorePrerequisites', () => {
    it('marks not attempted as unready', () => {
      expect(isPrerequisiteReady(null)).toBe(false);
      expect(isPrerequisiteReady({ status: 'not-started', score: null })).toBe(false);
    });

    it('marks 0/3 as unready (0 readiness points)', () => {
      expect(isPrerequisiteReady({ status: 'in-progress', score: 0, maxScore: 3 })).toBe(false);
    });

    it('marks 1/3 as unready (0 readiness points)', () => {
      expect(isPrerequisiteReady({ status: 'in-progress', score: 1, maxScore: 3 })).toBe(false);
    });

    it('marks 2/3 as ready (15 readiness points)', () => {
      expect(isPrerequisiteReady({ status: 'reviewed', score: 2, maxScore: 3 })).toBe(true);
    });

    it('marks 3/3 as ready (15 readiness points)', () => {
      expect(isPrerequisiteReady({ status: 'reviewed', score: 3, maxScore: 3 })).toBe(true);
    });

    it('scores prerequisites correctly for a topic', () => {
      const topicNoPrereq = { id: 'intro', prerequisites: [] };
      expect(scorePrerequisites(topicNoPrereq, {}).score).toBe(15);

      const topicWithPrereq = { id: 'er', prerequisites: ['intro'] };

      // Prereq not started -> 0
      expect(scorePrerequisites(topicWithPrereq, { intro: { status: 'not-started', score: null } }).score).toBe(0);

      // Prereq in-progress but score 0/3 -> 0 (loophole closed!)
      expect(scorePrerequisites(topicWithPrereq, { intro: { status: 'in-progress', score: 0, maxScore: 3 } }).score).toBe(0);

      // Prereq in-progress but score 1/3 -> 0
      expect(scorePrerequisites(topicWithPrereq, { intro: { status: 'in-progress', score: 1, maxScore: 3 } }).score).toBe(0);

      // Prereq scored 2/3 -> 15
      expect(scorePrerequisites(topicWithPrereq, { intro: { status: 'reviewed', score: 2, maxScore: 3 } }).score).toBe(15);

      // Prereq scored 3/3 -> 15
      expect(scorePrerequisites(topicWithPrereq, { intro: { status: 'reviewed', score: 3, maxScore: 3 } }).score).toBe(15);
    });
  });

  describe('generateRecommendation - Normalized Reason & All Completed', () => {
    const courseTopics = [
      { id: 't1', name: 'Topic 1', order: 1, prerequisites: [] },
      { id: 't2', name: 'Topic 2', order: 2, prerequisites: ['t1'] },
    ];

    it('normalizes primary reason selection by comparing factor.score / factor.maxScore', () => {
      // Setup a case where recency ratio (25/25 = 1.0) is higher than performance ratio (26.67/40 = 0.667),
      // even though performance raw score (26.67) > recency raw score (25.0)
      const topicProgress = {
        t1: {
          status: 'reviewed',
          score: 1,
          maxScore: 3, // perf = 26.67 / 40 (ratio 0.667)
          lastReviewed: '2020-01-01', // recency = 25 / 25 (ratio 1.0)
          attempts: 1,
        },
        t2: { status: 'not-started', score: null, maxScore: 3, lastReviewed: null, attempts: 0 },
      };

      const rec = generateRecommendation(topicProgress, courseTopics);
      expect(rec).not.toBeNull();
      // Since recency has 100% of max score vs performance 66.7%, recency should be chosen as primary reason
      expect(rec.primaryReason).toContain('last reviewed');
    });

    it('detects all-completed course state and provides refresher rationale', () => {
      const topicProgress = {
        t1: { status: 'reviewed', score: 3, maxScore: 3, lastReviewed: '2026-08-01', attempts: 2 },
        t2: { status: 'reviewed', score: 2, maxScore: 3, lastReviewed: '2026-08-15', attempts: 1 },
      };

      const rec = generateRecommendation(topicProgress, courseTopics);
      expect(rec.isAllCompleted).toBe(true);
      expect(rec.primaryReason).toContain('You have met the review threshold for all topics');
    });

    it('breaks ties deterministically using higher topic order', () => {
      const topicProgress = {
        t1: { status: 'not-started', score: null, maxScore: 3, lastReviewed: null, attempts: 0 },
        t2: { status: 'not-started', score: null, maxScore: 3, lastReviewed: null, attempts: 0 },
      };
      // t1 and t2 have same scores (perf 20, recency 15, status 10, but t2 has prereq t1 unready -> 0, t1 prereq -> 15)
      // Let's create two topics with no prereqs and identical progress
      const independentTopics = [
        { id: 'a', name: 'Alpha', order: 1, prerequisites: [] },
        { id: 'b', name: 'Beta', order: 2, prerequisites: [] },
      ];
      const prog = {
        a: { status: 'not-started', score: null, maxScore: 3, lastReviewed: null, attempts: 0 },
        b: { status: 'not-started', score: null, maxScore: 3, lastReviewed: null, attempts: 0 },
      };

      const rec = generateRecommendation(prog, independentTopics);
      expect(rec.topicId).toBe('b'); // higher order 2 > 1
    });
  });
});
