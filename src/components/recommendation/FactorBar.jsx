import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * FactorBar
 *
 * Renders an individual factor breakdown bar for the Recommendation Detail page.
 * Translates numeric scores and weights into clear visual and natural-language representations.
 */
export default function FactorBar({ factor }) {
  const pct = Math.round((factor.score / factor.maxScore) * 100);

  // Determine indicator color based on score ratio
  let barColor = 'bg-brand-500';
  let badgeColor = 'bg-brand-50 text-brand-700 border-brand-200';

  if (factor.name === 'Prerequisite readiness') {
    if (factor.met === false) {
      barColor = 'bg-rose-500';
      badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
    } else {
      barColor = 'bg-emerald-500';
      badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  }

  return (
    <div className="rounded-lg border border-surface-200 bg-white p-3.5 space-y-2">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">{factor.name}</span>
          <span className="text-[10px] font-medium text-slate-400">
            (Weight: {factor.weight}%)
          </span>
        </div>

        <span
          className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${badgeColor}`}
        >
          {factor.score} / {factor.maxScore} pts
        </span>
      </div>

      {/* Progress / Score Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Explanation */}
      <p className="text-xs text-slate-600 leading-relaxed">
        {factor.explanation}
      </p>
    </div>
  );
}
