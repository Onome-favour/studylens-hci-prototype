import { NavLink, Outlet } from 'react-router-dom';
import { Home, BookOpen, Lightbulb, Info } from 'lucide-react';
import Header from './Header.jsx';
import BottomNav from './BottomNav.jsx';

/**
 * AppShell
 *
 * The root layout wrapper providing:
 * - Sticky header
 * - Desktop horizontal nav (lg+)
 * - Mobile bottom nav (< lg)
 * - Content area with proper spacing to avoid fixed-nav overlap
 *
 * Renders <Outlet /> for React Router nested routes.
 */

const DESKTOP_NAV_ITEMS = [
  { to: '/',               icon: Home,      label: 'Home' },
  { to: '/course',         icon: BookOpen,   label: 'Course' },
  { to: '/recommendation', icon: Lightbulb,  label: 'For You' },
  { to: '/about',          icon: Info,       label: 'About' },
];

export default function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      {/* Header */}
      <Header />

      {/* Desktop horizontal nav — visible lg+ */}
      <nav
        className="hidden border-b border-surface-200 bg-white lg:block"
        role="navigation"
        aria-label="Primary navigation"
      >
        <ul className="mx-auto flex max-w-5xl items-center gap-1 px-6">
          {DESKTOP_NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-slate-500 hover:border-surface-300 hover:text-slate-700'
                  }`
                }
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Mobile bottom nav — visible < lg */}
      <BottomNav />
    </div>
  );
}
