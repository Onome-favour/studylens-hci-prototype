import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Home, BookOpen, MessageSquare, Send } from 'lucide-react';
import useLearningHistory from '../../hooks/useLearningHistory.js';

const REFLECTION_CATEGORIES = [
  'I did not understand the concept',
  'I confused two related concepts',
  'I misunderstood the question',
  'I need to review a prerequisite topic',
  'Other',
];

/**
 * QuizResults
 *
 * Renders the non-gamified completion screen after finishing a 3-question quiz.
 * Communicates the updated learning status, metacognitive reflection prompt (if score < 3),
 * and transparency notice.
 */
export default function QuizResults({
  topicId,
  topicName,
  score,
  maxScore = 3,
  attemptId,
  onRetakeQuiz,
}) {
  const { recordReflection } = useLearningHistory();
  const percentage = Math.round((score / maxScore) * 100);
  const isPassed = score / maxScore >= 2 / 3;

  // Reflection state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);
  const [reflectionSkipped, setReflectionSkipped] = useState(false);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSaveReflection = (e) => {
    e?.preventDefault();
    if (selectedCategories.length === 0 && !reflectionNotes.trim()) return;

    recordReflection({
      attemptId: attemptId || null,
      topicId: topicId || null,
      topicName,
      score,
      maxScore,
      categories: selectedCategories,
      notes: reflectionNotes.trim(),
    });

    setReflectionSubmitted(true);
  };

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

      {/* Optional Post-Quiz Reflection Card (Score < 3) */}
      {score < maxScore && !reflectionSkipped && (
        <div className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm space-y-3 animate-fade-in">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-brand-600" />
                Optional Metacognitive Reflection
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Reflecting on why a question was missed helps reinforce deeper conceptual retention.
              </p>
            </div>
            {!reflectionSubmitted && (
              <button
                type="button"
                onClick={() => setReflectionSkipped(true)}
                className="text-[11px] text-slate-400 hover:text-slate-600 hover:underline"
              >
                Skip
              </button>
            )}
          </div>

          {reflectionSubmitted ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Reflection saved to your learning records. Thank you!</span>
            </div>
          ) : (
            <form onSubmit={handleSaveReflection} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1.5">
                  What contributed to any errors on this quiz? (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {REFLECTION_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`rounded-md px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                          isSelected
                            ? 'bg-brand-50 border-brand-500 text-brand-700'
                            : 'bg-surface-50 border-surface-200 text-slate-600 hover:bg-surface-100'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="reflection-notes"
                  className="text-[11px] font-medium text-slate-600 block mb-1"
                >
                  Notes or thoughts for next review (optional):
                </label>
                <textarea
                  id="reflection-notes"
                  rows={2}
                  value={reflectionNotes}
                  onChange={(e) => setReflectionNotes(e.target.value)}
                  placeholder="e.g., Focus more on distinguishing candidate keys from super keys..."
                  className="w-full rounded-md border border-surface-300 p-2 text-xs text-slate-700 placeholder-slate-400 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setReflectionSkipped(true)}
                  className="rounded px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Skip Reflection
                </button>
                <button
                  type="submit"
                  disabled={selectedCategories.length === 0 && !reflectionNotes.trim()}
                  className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-3 w-3" />
                  Save Reflection
                </button>
              </div>
            </form>
          )}
        </div>
      )}

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
