import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, HelpCircle, ChevronDown, ChevronUp, ArrowRight, X, RotateCcw } from 'lucide-react';

/**
 * RecommendationCard
 *
 * Prominent recommendation card for the Dashboard.
 * Consumes the object returned by useRecommendation().
 *
 * Demonstrates the core HCI interaction:
 * Recommendation -> Progressive "Why?" Explanation -> Student Control.
 */
export default function RecommendationCard({ recommendation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Fallback state if no recommendation is returned
  if (!recommendation) {
    return (
      <div className="card border-slate-200 bg-white">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-100 text-slate-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-700">Study Recommendation</h2>
            <p className="mt-1 text-xs text-slate-500">
              No recommendation available at this time. Explore your course topics directly to begin studying.
            </p>
            <Link
              to="/course"
              className="mt-3 inline-block text-xs font-medium text-brand-600 hover:underline"
            >
              Browse Course Topics &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dismissed state
  if (isDismissed) {
    return (
      <div className="rounded-xl border border-surface-200 bg-surface-100 p-3 text-xs text-slate-500 flex items-center justify-between">
        <span>Recommendation for <strong>{recommendation.topicName}</strong> dismissed.</span>
        <button
          onClick={() => setIsDismissed(false)}
          className="inline-flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Restore
        </button>
      </div>
    );
  }

  return (
    <div className="card border-brand-200 bg-gradient-to-br from-brand-50/50 via-white to-white shadow-card">
      {/* Top Header & Badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Recommended for you
          </span>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="rounded p-1 text-slate-400 hover:bg-surface-100 hover:text-slate-600"
          title="Dismiss recommendation"
          aria-label="Dismiss recommendation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Recommendation Content */}
      <div className="mt-3">
        <h2 className="text-lg font-bold text-slate-800">
          {recommendation.topicName}
        </h2>

        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          {recommendation.primaryReason}
        </p>

        {/* Transparency Cue */}
        <p className="mt-2 text-[11px] font-medium text-slate-400">
          ⓘ Based on your recent study activity and quiz performance.
        </p>
      </div>

      {/* Progressive Explanation Trigger ("Why?") */}
      <div className="mt-4 border-t border-brand-100 pt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-xs font-medium text-brand-700 border border-brand-100 hover:bg-brand-50/50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-brand-600" />
            Why this recommendation?
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-brand-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-brand-600" />
          )}
        </button>

        {/* Progressive Disclosure Content (Level 1) */}
        {isExpanded && (
          <div className="mt-3 rounded-lg border border-brand-100 bg-white p-3 space-y-2 text-xs animate-fade-in">
            <p className="font-semibold text-slate-700">
              Key contributing factors:
            </p>

            <ul className="space-y-1.5 text-slate-600">
              {recommendation.factors.map((factor) => (
                <li key={factor.name} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                  <div>
                    <strong className="text-slate-700">{factor.name}:</strong>{' '}
                    {factor.explanation}
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                to="/recommendation"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline"
              >
                See full reasoning & breakdown
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Student Controls */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={`/course/topic/${recommendation.topicId}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
        >
          Start Review
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <Link
            to="/course"
            className="text-xs font-medium text-slate-500 hover:text-slate-700 hover:underline"
          >
            Choose another topic
          </Link>
        </div>
      </div>
    </div>
  );
}
