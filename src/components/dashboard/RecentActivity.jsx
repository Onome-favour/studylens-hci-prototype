import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * RecentActivity
 *
 * Displays the student's recent activity feed from learning history.
 */
export default function RecentActivity({ activityLog = [] }) {
  const recentItems = activityLog.slice(0, 4);

  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="section-heading">Recent Activity</h2>
        <span className="text-xs text-slate-400">Latest 4 items</span>
      </div>

      {recentItems.length === 0 ? (
        <div className="rounded-lg bg-surface-100 p-3 text-xs text-slate-500">
          No recent activity recorded yet. Complete a study activity to build your learning history.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {recentItems.map((item, index) => (
            <li
              key={`${item.date}-${item.topicId}-${index}`}
              className="flex items-center justify-between rounded-lg bg-surface-50 p-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700">{item.action}</p>
                  <p className="text-[11px] text-slate-400">{item.date}</p>
                </div>
              </div>

              {item.score && (
                <span className="rounded-md bg-surface-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {item.score}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
