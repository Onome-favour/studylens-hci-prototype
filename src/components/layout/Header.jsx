import { Search } from 'lucide-react';
import PrototypeBadge from '../shared/PrototypeBadge.jsx';

/**
 * Header
 *
 * Top bar with the StudyLens wordmark and research-prototype badge.
 * Deliberately minimal — no profile avatars, notifications, or account controls.
 * On desktop, the horizontal navigation tabs appear alongside the wordmark
 * via the AppShell layout; the Header itself only handles branding.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Search className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-slate-800">
              StudyLens
            </span>
          </div>
        </div>

        {/* Badge */}
        <PrototypeBadge className="hidden sm:inline-flex" />
      </div>
    </header>
  );
}
