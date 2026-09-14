import { Info } from 'lucide-react';

/**
 * PrototypeBadge
 *
 * A subtle badge indicating this is a research prototype.
 * Used in the Header and can be placed anywhere context is needed.
 */
export default function PrototypeBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-brand-700 ${className}`}
    >
      <Info className="h-3 w-3" />
      Research Prototype
    </span>
  );
}
