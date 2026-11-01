import { CheckCircle2, XCircle, Check, X, ArrowRight } from 'lucide-react';

/**
 * QuizQuestion
 *
 * Renders a single multiple-choice question with 4 options and a required 3-tier confidence rating.
 * Handles selection, submission, and displays evidence-based explanation feedback.
 *
 * Confidence Tiers:
 * - 'just-guessing': Just guessing (Low confidence)
 * - 'somewhat-sure': Somewhat sure (Medium confidence)
 * - 'certain': Certain (High confidence)
 */

export const CONFIDENCE_OPTIONS = [
  { id: 'just-guessing', label: 'Just guessing' },
  { id: 'somewhat-sure', label: 'Somewhat sure' },
  { id: 'certain', label: 'Certain' },
];

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  selectedConfidence,
  onSelectOption,
  onSelectConfidence,
  isSubmitted,
  onSubmitAnswer,
  onNextQuestion,
}) {
  const isCorrect = selectedOptionId === question.correctId;
  const canSubmit = Boolean(selectedOptionId && selectedConfidence && !isSubmitted);

  return (
    <div className="card space-y-4">
      {/* Progress & Header */}
      <div className="flex items-center justify-between border-b border-surface-200 pb-3 text-xs">
        <span className="font-semibold uppercase tracking-wider text-brand-600">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="text-slate-400">Select one option & your confidence</span>
      </div>

      {/* Question Text */}
      <h2 className="text-sm sm:text-base font-semibold leading-snug text-slate-800">
        {question.text}
      </h2>

      {/* Answer Options */}
      <div className="space-y-2.5 pt-1">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isOptionCorrect = option.id === question.correctId;

          // Determine visual styling for option card
          let cardStyle =
            'border-surface-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50/30';
          let badgeStyle = 'bg-surface-100 text-slate-500 border-surface-200';

          if (isSubmitted) {
            if (isOptionCorrect) {
              cardStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-medium';
              badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
            } else if (isSelected && !isCorrect) {
              cardStyle = 'border-rose-400 bg-rose-50/70 text-rose-900';
              badgeStyle = 'bg-rose-600 text-white border-rose-600';
            } else {
              cardStyle = 'border-surface-200 bg-surface-50 text-slate-400 opacity-60';
            }
          } else if (isSelected) {
            cardStyle = 'border-brand-500 bg-brand-50/60 text-brand-900 font-medium ring-1 ring-brand-500';
            badgeStyle = 'bg-brand-600 text-white border-brand-600';
          }

          return (
            <button
              key={option.id}
              onClick={() => !isSubmitted && onSelectOption(option.id)}
              disabled={isSubmitted}
              className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-xs transition-all ${cardStyle}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border text-[11px] font-bold uppercase transition-colors ${badgeStyle}`}
                >
                  {option.id}
                </span>
                <span className="leading-normal">{option.text}</span>
              </div>

              {isSubmitted && (
                <div className="ml-2 flex-shrink-0">
                  {isOptionCorrect && <Check className="h-4 w-4 text-emerald-600" />}
                  {isSelected && !isCorrect && <X className="h-4 w-4 text-rose-600" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Confidence Rating Selection (Required before submit) */}
      <div className="rounded-lg border border-surface-200 bg-surface-50/80 p-3 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-slate-700">
            How confident are you in this answer?
          </span>
          <span className="text-[11px] text-slate-400">Required</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {CONFIDENCE_OPTIONS.map((c) => {
            const isChosen = selectedConfidence === c.id;
            let btnStyle = 'border-surface-200 bg-white text-slate-600 hover:border-brand-300';
            if (isSubmitted) {
              btnStyle = isChosen
                ? 'border-brand-600 bg-brand-50 text-brand-800 font-semibold'
                : 'border-surface-200 bg-surface-100 text-slate-400 opacity-60';
            } else if (isChosen) {
              btnStyle = 'border-brand-600 bg-brand-600 text-white font-semibold shadow-sm';
            }

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => !isSubmitted && onSelectConfidence(c.id)}
                disabled={isSubmitted}
                className={`rounded-lg border py-2 px-2 text-center text-[11px] transition-all ${btnStyle}`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Feedback Card (Post-Submit) */}
      {isSubmitted && (
        <div
          className={`rounded-lg border p-3.5 text-xs animate-fade-in ${
            isCorrect
              ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
              : 'border-rose-200 bg-rose-50/80 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold mb-1">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-600" />
                <span>Incorrect</span>
              </>
            )}
          </div>
          <p className="mt-1 leading-relaxed text-slate-700">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex justify-end">
        {!isSubmitted ? (
          <button
            onClick={onSubmitAnswer}
            disabled={!canSubmit}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-all ${
              canSubmit
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'bg-surface-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={onNextQuestion}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-all"
          >
            {questionNumber === totalQuestions ? 'View Results' : 'Next Question'}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
