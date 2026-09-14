import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Home, BookOpen } from 'lucide-react';

/**
 * QuizResults
 *
 * Renders the non-gamified completion screen after finishing a 3-question quiz.
 * Communicates the updated learning status and transparency notice.
 */
export default function QuizResults({
  topicName,
  score,
  maxScore = 3,
  onRetakeQuiz,
}) {
  const percentage = Math.round((score / maxScore) * 100);
  const isPassed = score / maxScore >= 2 / 3;

  return (
    <div className="card space-y-5 border-brand-200 bg-gradient-to-br from-brand-50/30 via-white to-white animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 mb-2">
          Quiz Completed
        </span>
        <h2 className="text-xl font-bold text-slate-800">{topicName}</h2>
        <p className="mt-1 text-xs text-slate-500">Review activity complete</p>
      </div>

      {/* Score Box */}
      <div className="mx-auto max-w-sm rounded-xl border border-surface-200 bg-white p-4 text-center shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Your Score
        </p>
        <div className="mt-1 text-3xl font-extrabold text-slate-800">
          {score} <span className="text-lg font-semibold text-slate-400">/ {maxScore}</span>
        </div>
        <p className="mt-1 text-xs font-semibold text-brand-600">{percentage}% Correct</p>

        <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-surface-100 pt-3 text-xs">
          {isPassed ? (
            <div className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700 font-semibold border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Topic Status: Reviewed
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-amber-700 font-semibold border border-amber-200">
              <AlertCircle className="h-3.5 w-3.5" />
              Topic Status: In Progress
            </div>
          )}
        </div>
      </div>

      {/* Encouraging Message */}
      <div className="rounded-lg bg-surface-50 p-3 text-center text-xs text-slate-600 leading-relaxed">
        {isPassed
          ? 'Great job! You demonstrated a solid understanding of this topic. Your progress has been updated.'
          : 'Good effort! Further practice will help reinforce your understanding of these concepts.'}
      </div>

      {/* Transparency Callout */}
      <div className="rounded-lg border border-brand-100 bg-brand-50/40 p-3 text-xs text-slate-600 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparency Note:</strong> Your score was recorded in your learning history. Your personalized AI study recommendation on the Dashboard will automatically update to reflect your new progress.
        </p>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          Return to Dashboard
        </Link>

        <Link
          to="/course"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface-100 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          Choose Another Topic
        </Link>

        <button
          onClick={onRetakeQuiz}
          className="inline-flex items-center justify-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline py-1"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retake Quiz
        </button>
      </div>
    </div>
  );
}
