import useLearningHistory from '../hooks/useLearningHistory.js';
import useRecommendation from '../hooks/useRecommendation.js';

import CourseCard from '../components/dashboard/CourseCard.jsx';
import RecommendationCard from '../components/dashboard/RecommendationCard.jsx';
import RecentActivity from '../components/dashboard/RecentActivity.jsx';

import TransparencyFooter from '../components/shared/TransparencyFooter.jsx';
import PrototypeBadge from '../components/shared/PrototypeBadge.jsx';

/**
 * DashboardPage
 *
 * Main landing page for StudyLens.
 * Connects the learning history state and deterministic recommendation engine
 * to the dashboard UI.
 */
export default function DashboardPage() {
  const { history, recordRecommendationSnapshot } = useLearningHistory();
  const recommendation = useRecommendation(history, recordRecommendationSnapshot);

  return (
    <div className="page animate-fade-in">
      {/* Mobile badge — visible below sm */}
      <div className="mb-4 sm:hidden">
        <PrototypeBadge />
      </div>

      {/* Page Heading */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Welcome back, {history?.studentName || 'Student'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Your study overview and personalised learning recommendations.
          </p>
        </div>
      </div>

      {/* Cards Stack */}
      <div className="space-y-4">
        {/* 1. Course Overview & Progress */}
        <CourseCard topicProgress={history?.topicProgress} />

        {/* 2. Primary Recommendation Card */}
        <RecommendationCard recommendation={recommendation} />

        {/* 3. Recent Activity Log */}
        <RecentActivity activityLog={history?.activityLog} />
      </div>

      <TransparencyFooter />
    </div>
  );
}
