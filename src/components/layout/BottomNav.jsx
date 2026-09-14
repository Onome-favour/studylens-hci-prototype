import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Lightbulb, Info } from 'lucide-react';

/**
 * BottomNav
 *
 * Fixed mobile bottom navigation with 4 tabs.
 * Uses NavLink for active-state indication via React Router.
 * Hidden on desktop (lg+) where navigation moves to the header area.
 */

const NAV_ITEMS = [
  { to: '/',               icon: Home,      label: 'Home' },
  { to: '/course',         icon: BookOpen,   label: 'Course' },
  { to: '/recommendation', icon: Lightbulb,  label: 'For You' },
  { to: '/about',          icon: Info,       label: 'About' },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-200 bg-white/95 shadow-nav backdrop-blur-sm pb-safe lg:hidden"
      role="navigation"
      aria-label="Primary navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-1 py-2.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-brand-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? 'text-brand-600' : 'text-slate-400'
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
