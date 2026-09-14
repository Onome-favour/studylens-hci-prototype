import { Link } from 'react-router-dom';
import { BookOpen, FileText, CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';
import { course } from '../data/courseData.js';
import useLearningHistory from '../hooks/useLearningHistory.js';
import TransparencyFooter from '../components/shared/TransparencyFooter.jsx';

/**
 * CoursePage
 *
 * Displays the complete Database Management course syllabus (all 7 topics),
 * with live topic progress statuses from student history and mock course materials.
 */
export default function CoursePage() {
  const { history } = useLearningHistory();
  const topicProgress = history?.topicProgress || {};

  return (
    <div className="page animate-fade-in">
      {/* Course Header */}
      <div className="mb-6">
        <p className="label-muted mb-1 text-brand-600 font-semibold">Course Syllabus</p>
        <h1 className="text-xl font-bold text-slate-800">{course.name}</h1>
        <p className="mt-1 text-xs text-slate-500">
          {course.code} · {course.semester} · {course.topics.length} Syllabus Topics
        </p>
      </div>

      {/* Topics List */}
      <div className="card mb-4">
        <div className="mb-4 flex items-center justify-between border-b border-surface-200 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-800">Course Topics</h2>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            Select any topic to study
          </span>
        </div>

        <ul className="space-y-3">
          {course.topics.map((topic) => {
            const progress = topicProgress[topic.id] || {
              status: 'not-started',
              score: null,
              maxScore: 3,
              lastReviewed: null,
              attempts: 0,
            };

            return (
              <li
                key={topic.id}
                className="rounded-lg border border-surface-200 bg-white p-3.5 shadow-card transition-all hover:border-brand-300"
              >
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  {/* Topic Title & Status */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        0{topic.order}.
                      </span>
                      <h3 className="text-sm font-semibold text-slate-800">
                        {topic.name}
                      </h3>

                      {/* Difficulty Badge */}
                      <span className="rounded bg-surface-100 px-1.5 py-0.5 text-[10px] font-medium capitalize text-slate-500">
                        {topic.difficulty}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {progress.status === 'reviewed' && (
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Reviewed ({progress.score}/{progress.maxScore})
                        </span>
                      )}
                      {progress.status === 'in-progress' && (
                        <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                          In Progress ({progress.score}/{progress.maxScore})
                        </span>
                      )}
                      {progress.status === 'not-started' && (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-400">
                          <Circle className="h-3.5 w-3.5" />
                          Not Started
                        </span>
                      )}

                      {progress.lastReviewed && (
                        <span className="text-[11px] text-slate-400">
                          Last: {progress.lastReviewed}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="flex-shrink-0 pt-1 sm:pt-0">
                    <Link
                      to={`/course/topic/${topic.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 hover:text-brand-800 transition-colors"
                    >
                      Practice Quiz
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Materials Section */}
      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Course Materials
            </h2>
          </div>
          <span className="text-[10px] font-medium text-slate-400">
            Visual reference only
          </span>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {course.materials.map((mat) => (
            <li
              key={mat.id}
              className="flex items-center gap-2.5 rounded-lg border border-surface-200 bg-surface-50 p-2.5 text-xs text-slate-700"
            >
              <span className="text-base">{mat.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-800">{mat.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{mat.type.replace('-', ' ')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <TransparencyFooter />
    </div>
  );
}
