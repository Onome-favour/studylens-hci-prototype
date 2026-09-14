import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, Clock, Circle } from 'lucide-react';
import { course } from '../../data/courseData.js';

/**
 * CourseCard
 *
 * Displays the course overview and calculates overall course progress
 * dynamically from student topicProgress data.
 *
 * PROGRESS CALCULATION RULE:
 * - 'reviewed': 1.0 weight (100% complete)
 * - 'in-progress': 0.5 weight (50% complete)
 * - 'not-started': 0.0 weight (0% complete)
 * Overall % = Math.round((sum of weights / total topics) * 100)
 */
export default function CourseCard({ topicProgress = {} }) {
  const topics = course.topics || [];
  const totalTopics = topics.length;

  let reviewedCount = 0;
  let inProgressCount = 0;
  let notStartedCount = 0;
  let weightedSum = 0;

  topics.forEach((topic) => {
    const status = topicProgress[topic.id]?.status || 'not-started';
    if (status === 'reviewed') {
      reviewedCount += 1;
      weightedSum += 1.0;
    } else if (status === 'in-progress') {
      inProgressCount += 1;
      weightedSum += 0.5;
    } else {
      notStartedCount += 1;
    }
  });

  const progressPct = totalTopics > 0 ? Math.round((weightedSum / totalTopics) * 100) : 0;

  return (
    <div className="card">
      {/* Course Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {course.name}
            </h2>
            <p className="text-xs text-slate-500">
              {course.code} · {course.semester}
            </p>
          </div>
        </div>

        <Link
          to="/course"
          className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline"
        >
          View Course &rarr;
        </Link>
      </div>

      {/* Progress Bar & Summary */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">Course Progress</span>
          <span className="font-semibold text-brand-700">{progressPct}%</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-200">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Status Breakdown Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              <strong className="text-slate-700">{reviewedCount}</strong> reviewed
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span>
              <strong className="text-slate-700">{inProgressCount}</strong> in progress
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Circle className="h-3.5 w-3.5 text-slate-300" />
            <span>
              <strong className="text-slate-700">{notStartedCount}</strong> not started
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
