import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizQuestion from './QuizQuestion.jsx';

describe('QuizQuestion component', () => {
  const mockQuestion = {
    id: 'q1',
    text: 'What is a Primary Key?',
    options: [
      { id: 'opt-a', text: 'A unique identifier for each record in a table' },
      { id: 'opt-b', text: 'A key that unlocks encrypted tables' },
      { id: 'opt-c', text: 'A foreign key pointing to another database' },
    ],
    correctId: 'opt-a',
    explanation: 'A primary key uniquely identifies each row.',
  };

  it('keeps Submit Answer button disabled until both option AND confidence are selected', () => {
    const handleSelectOption = vi.fn();
    const handleSelectConfidence = vi.fn();
    const handleSubmit = vi.fn();

    const { rerender } = render(
      <QuizQuestion
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={3}
        selectedOptionId={null}
        onSelectOption={handleSelectOption}
        selectedConfidence={null}
        onSelectConfidence={handleSelectConfidence}
        isSubmitted={false}
        onSubmitAnswer={handleSubmit}
        onNextQuestion={vi.fn()}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Submit Answer/i });
    expect(submitBtn).toBeDisabled();

    // Rerender with option selected but NO confidence
    rerender(
      <QuizQuestion
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={3}
        selectedOptionId="opt-a"
        onSelectOption={handleSelectOption}
        selectedConfidence={null}
        onSelectConfidence={handleSelectConfidence}
        isSubmitted={false}
        onSubmitAnswer={handleSubmit}
        onNextQuestion={vi.fn()}
      />
    );
    expect(submitBtn).toBeDisabled();

    // Rerender with confidence selected but NO option
    rerender(
      <QuizQuestion
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={3}
        selectedOptionId={null}
        onSelectOption={handleSelectOption}
        selectedConfidence="somewhat-sure"
        onSelectConfidence={handleSelectConfidence}
        isSubmitted={false}
        onSubmitAnswer={handleSubmit}
        onNextQuestion={vi.fn()}
      />
    );
    expect(submitBtn).toBeDisabled();

    // Rerender with BOTH option and confidence selected
    rerender(
      <QuizQuestion
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={3}
        selectedOptionId="opt-a"
        onSelectOption={handleSelectOption}
        selectedConfidence="somewhat-sure"
        onSelectConfidence={handleSelectConfidence}
        isSubmitted={false}
        onSubmitAnswer={handleSubmit}
        onNextQuestion={vi.fn()}
      />
    );
    expect(submitBtn).not.toBeDisabled();
  });

  it('renders all three confidence options and calls onSelectConfidence when clicked', () => {
    const handleSelectConfidence = vi.fn();

    render(
      <QuizQuestion
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={3}
        selectedOptionId="opt-a"
        onSelectOption={vi.fn()}
        selectedConfidence={null}
        onSelectConfidence={handleSelectConfidence}
        isSubmitted={false}
        onSubmitAnswer={vi.fn()}
        onNextQuestion={vi.fn()}
      />
    );

    const guessingBtn = screen.getByRole('button', { name: /Just guessing/i });
    const somewhatBtn = screen.getByRole('button', { name: /Somewhat sure/i });
    const certainBtn = screen.getByRole('button', { name: /Certain/i });

    expect(guessingBtn).toBeInTheDocument();
    expect(somewhatBtn).toBeInTheDocument();
    expect(certainBtn).toBeInTheDocument();

    fireEvent.click(certainBtn);
    expect(handleSelectConfidence).toHaveBeenCalledWith('certain');
  });

  it('disables option and confidence buttons once submitted (immutability)', () => {
    render(
      <QuizQuestion
        question={mockQuestion}
        questionNumber={1}
        totalQuestions={3}
        selectedOptionId="opt-a"
        onSelectOption={vi.fn()}
        selectedConfidence="certain"
        onSelectConfidence={vi.fn()}
        isSubmitted={true}
        onSubmitAnswer={vi.fn()}
        onNextQuestion={vi.fn()}
      />
    );

    const optionBtn = screen.getByText('A unique identifier for each record in a table').closest('button');
    expect(optionBtn).toBeDisabled();

    const certainBtn = screen.getByRole('button', { name: /Certain/i });
    expect(certainBtn).toBeDisabled();

    // Next question button should be visible
    expect(screen.getByRole('button', { name: /Next Question/i })).toBeInTheDocument();
  });
});
