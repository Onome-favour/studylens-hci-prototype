import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  BarChart2,
  Calendar,
  Layers,
  Link2,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import useLearningHistory from '../hooks/useLearningHistory.js';
import useRecommendation from '../hooks/useRecommendation.js';
import FactorBar from '../components/recommendation/FactorBar.jsx';
import TransparencyFooter from '../components/shared/TransparencyFooter.jsx';

/**
 * RecommendationPage
 *
 * Dedicated view for exploring the study recommendation in detail.
 * Implements progressive disclosure:
 * - Level 1 (Default): Concise natural-language evidence summary cards
 * - Level 2 (Toggle): Detailed factor scoring breakdown with weights & points
 */
export default function RecommendationPage() {
  const { history } = useLearningHistory();
  const recommendation = useRecommendation(history);
  const [showTechnicalBreakdown, setShowTechnicalBreakdown] = useState(false);

  // Fallback state if no recommendation exists
  if (!recommendation) {
    return (
      <div className="page animate-fade-in">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Dashboard
        </Link>

        <div className="card text-center py-8">
          <Lightbulb className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <h1 className="text-base font-semibold text-slate-800">
            No Recommendation Available
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Your learning history is currently empty or incomplete. Complete a course topic or quiz to generate recommendations.
          </p>
          <Link
            to="/course"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
          >
            Explore Course Topics &rarr;
          </Link>
        </div>
      </div>
    );
  }

  // Icons mapping for factor cards
  const getFactorIcon = (name) => {
    switch (name) {
      case 'Quiz performance':
        return BarChart2;
      case 'Time since last review':
        return Calendar;
      case 'Topic status':
        return Layers;
      case 'Prerequisite readiness':
        return Link2;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="page animate-fade-in">
      {/* Top Back Link */}
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>

      {/* Page Heading */}
      <div className="mb-5">
        <p className="label-muted mb-1 text-brand-600 font-semibold">For You</p>
        <h1 className="text-xl font-bold text-slate-800">
          Study Recommendation Detail
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Transparent explanation of why this topic was recommended for your next session.
        </p>
      </div>

      {/* Recommended Topic Card */}
      <div className="card border-brand-200 bg-gradient-to-br from-brand-50/40 via-white to-white mb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Lightbulb className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                Recommended Next Topic
              </span>
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                Priority Score: {recommendation.totalScore}/100
              </span>
            </div>

            <h2 className="mt-1 text-lg font-bold text-slate-800">
              {recommendation.topicName}
            </h2>

            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-medium">
              {recommendation.primaryReason}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-surface-200 flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/course/topic/${recommendation.topicId}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            Start Review
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/course"
              className="font-medium text-slate-600 hover:text-slate-800 hover:underline"
            >
              Choose another topic
            </Link>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-brand-600" />
              Why this was recommended
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evidence gathered from your learning history.
            </p>
          </div>

          <button
            onClick={() => setShowTechnicalBreakdown(!showTechnicalBreakdown)}
            className="inline-flex items-center gap-1 rounded-md border border-surface-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-surface-100 transition-colors"
          >
            <Sliders className="h-3 w-3 text-brand-600" />
            {showTechnicalBreakdown ? 'Hide technical scores' : 'Show technical scores'}
          </button>
        </div>

        {/* LEVEL 1: Concise Evidence Cards (Default View) */}
        {!showTechnicalBreakdown && (
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendation.factors.map((factor) => {
              const IconComponent = getFactorIcon(factor.name);
              return (
                <div
                  key={factor.name}
                  className="rounded-lg border border-surface-200 bg-white p-3.5 shadow-card"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-50 text-brand-600">
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {factor.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {factor.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* LEVEL 2: Detailed Technical Factors & Weights (Progressive Toggle) */}
        {showTechnicalBreakdown && (
          <div className="space-y-3 animate-fade-in">
            <div className="rounded-lg bg-surface-100 p-3 text-xs text-slate-600">
              <p className="font-medium text-slate-700">Scoring Formula Explanation:</p>
              <p className="mt-0.5 text-slate-500">
                The algorithm assigns points across 4 factors (total 100). Higher scores indicate higher study priority.
              </p>
            </div>

            {recommendation.factors.map((factor) => (
              <FactorBar key={factor.name} factor={factor} />
            ))}
          </div>
        )}
      </div>

      {/* Student Control Disclaimer */}
      <div className="mt-6 rounded-lg bg-brand-50/60 border border-brand-100 p-3 text-xs text-slate-600 flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-700">Student Choice</p>
          <p className="mt-0.5 text-slate-500">
            This recommendation is advisory guidance. You are always free to select any topic from the course syllabus to study next.
          </p>
        </div>
      </div>

      <TransparencyFooter />
    </div>
  );
}
