import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecommendationCard from './RecommendationCard.jsx';
import QuizResults from '../topic/QuizResults.jsx';
import useLearningHistory, { LS_KEY } from '../../hooks/useLearningHistory.js';

describe('Milestone 4 — Interaction Logging, Persistent Dismissal, Reflection, & JSON Export', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockRecommendation = {
    topicId: 'joins',
    topicName: 'SQL JOIN Operations',
    primaryReason: 'Recommended due to low recent quiz performance.',
    totalScore: 78,
    factors: [
      {
        name: 'Quiz performance',
        score: 30,
        maxScore: 35,
        explanation: 'Recent quiz score was 1/3.',
      },
    ],
  };

  it('persists recommendation dismissal for active topic and restores properly', () => {
    const { unmount } = render(
      <BrowserRouter>
        <RecommendationCard recommendation={mockRecommendation} />
      </BrowserRouter>
    );

    // Initial state: recommendation visible
    expect(screen.getByText('SQL JOIN Operations')).toBeInTheDocument();
    const dismissBtn = screen.getByTitle('Dismiss recommendation');

    // Click dismiss
    fireEvent.click(dismissBtn);

    // Should show dismissed placeholder
    expect(screen.getByText(/Recommendation for/i)).toBeInTheDocument();
    expect(localStorage.getItem('studylens-dismissed-rec')).toBe('joins');

    unmount();

    // Re-mount: should still be dismissed
    const { unmount: unmount2 } = render(
      <BrowserRouter>
        <RecommendationCard recommendation={mockRecommendation} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Recommendation for/i)).toBeInTheDocument();

    // Click Restore
    const restoreBtn = screen.getByRole('button', { name: /Restore/i });
    fireEvent.click(restoreBtn);

    expect(screen.getByText('SQL JOIN Operations')).toBeInTheDocument();
    expect(localStorage.getItem('studylens-dismissed-rec')).toBeNull();

    unmount2();
  });

  it('clears dismissal when recommendation topic changes', () => {
    // Set dismissed item to 'joins'
    localStorage.setItem('studylens-dismissed-rec', 'joins');

    // Render with a different recommendation
    const newRecommendation = {
      ...mockRecommendation,
      topicId: 'normalization',
      topicName: 'Database Normalization',
    };

    render(
      <BrowserRouter>
        <RecommendationCard recommendation={newRecommendation} />
      </BrowserRouter>
    );

    // New recommendation should be visible, NOT dismissed
    expect(screen.getByText('Database Normalization')).toBeInTheDocument();
  });

  it('allows student to save optional post-quiz reflection when score < maxScore', () => {
    const { result } = renderHook(() => useLearningHistory());

    render(
      <BrowserRouter>
        <QuizResults
          topicId="joins"
          topicName="SQL JOIN Operations"
          score={1}
          maxScore={3}
          attemptId="att-test-123"
          onRetakeQuiz={vi.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/Optional Metacognitive Reflection/i)).toBeInTheDocument();

    // Select category button
    const catBtn = screen.getByText('I confused two related concepts');
    fireEvent.click(catBtn);

    // Fill notes
    const textarea = screen.getByPlaceholderText(/Focus more on distinguishing/i);
    fireEvent.change(textarea, { target: { value: 'Review LEFT vs FULL OUTER join' } });

    // Click Save Reflection
    const saveBtn = screen.getByRole('button', { name: /Save Reflection/i });
    fireEvent.click(saveBtn);

    expect(screen.getByText(/Reflection saved to your learning records/i)).toBeInTheDocument();

    // Verify stored reflection in hook/localStorage
    const rawStored = JSON.parse(localStorage.getItem(LS_KEY));
    expect(rawStored.reflections.length).toBeGreaterThan(0);
    const lastReflection = rawStored.reflections[rawStored.reflections.length - 1];
    expect(lastReflection.attemptId).toBe('att-test-123');
    expect(lastReflection.topicId).toBe('joins');
    expect(lastReflection.categories).toContain('I confused two related concepts');
    expect(lastReflection.notes).toBe('Review LEFT vs FULL OUTER join');
  });

  it('exports structured JSON including schemaVersion, quizAttempts, reflections, and interactions', () => {
    const { result } = renderHook(() => useLearningHistory());

    // Record an attempt, an interaction, and a reflection
    act(() => {
      result.current.recordQuizResult('joins', 2, 3, 'SQL JOIN Operations', [
        { questionId: 'q1', isCorrect: true, confidence: 'certain' },
      ]);
      result.current.logRecommendationInteraction({
        eventType: 'rec_accepted',
        recommendationId: 'joins',
      });
      result.current.recordReflection({
        attemptId: 'att-export-test',
        topicId: 'joins',
        categories: ['Other'],
        notes: 'Export verification',
      });
    });

    const exportData = JSON.parse(localStorage.getItem(LS_KEY));
    expect(exportData.schemaVersion).toBe(2);
    expect(exportData.quizAttempts.length).toBeGreaterThan(0);
    expect(exportData.recommendationInteractions.length).toBeGreaterThan(0);
    expect(exportData.reflections.length).toBeGreaterThan(0);
  });
});
