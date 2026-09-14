import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileQuestion, CheckCircle2, Clock, Circle, HelpCircle } from 'lucide-react';

import { getTopicById, course } from '../data/courseData.js';
import { getQuizByTopicId } from '../data/quizData.js';
import useLearningHistory from '../hooks/useLearningHistory.js';

import QuizQuestion from '../components/topic/QuizQuestion.jsx';
import QuizResults from '../components/topic/QuizResults.jsx';
import TransparencyFooter from '../components/shared/TransparencyFooter.jsx';

/**
 * TopicPage
 *
 * Interactive topic review and quiz experience.
 * Dynamically loads topic summary, key concepts, and quiz questions based on :topicId.
 * Updates student learning history upon completion and prevents duplicate submissions.
 */
export default function TopicPage() {
  const { topicId } = useParams();
  const { history, recordQuizResult } = useLearningHistory();

  const topic = getTopicById(topicId);
  const quiz = getQuizByTopicId(topicId);

  // State for quiz interaction
  const [mode, setMode] = useState('overview'); // 'overview' | 'quiz' | 'results'
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Ref to guarantee recordQuizResult is called EXACTLY ONCE per attempt
  const hasRecordedRef = useRef(false);

  // Reset quiz state when topicId changes
  useEffect(() => {
    setMode('overview');
    setCurrentQIndex(0);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setScore(0);
    hasRecordedRef.current = false;
  }, [topicId]);

  // Fallback state if topic or quiz is missing
  if (!topic || !quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="page animate-fade-in">
        <Link
          to="/course"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Course
        </Link>

        <div className="card text-center py-8 space-y-3">
          <FileQuestion className="mx-auto h-8 w-8 text-slate-400" />
          <h1 className="text-base font-semibold text-slate-800">
            Topic or Quiz Not Found
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The topic "{topicId}" does not exist in the course syllabus or does not have available quiz questions.
          </p>
          <Link
            to="/course"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
          >
            Browse Available Topics &rarr;
          </Link>
        </div>
      </div>
    );
  }

  // Get student's previous progress for this topic
  const topicProgress = history?.topicProgress?.[topic.id] || {
    status: 'not-started',
    score: null,
    maxScore: 3,
    lastReviewed: null,
    attempts: 0,
  };

  const currentQuestion = quiz.questions[currentQIndex];
  const totalQuestions = quiz.questions.length;

  // Handlers
  const handleSelectOption = (optionId) => {
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isSubmitted) return;
    setIsSubmitted(true);

    if (selectedOptionId === currentQuestion.correctId) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < totalQuestions) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
    } else {
      // Reached end of quiz -> record results exactly once
      const finalScore =
        selectedOptionId === currentQuestion.correctId ? score + 1 : score;

      if (!hasRecordedRef.current) {
        hasRecordedRef.current = true;
        recordQuizResult(topic.id, finalScore, totalQuestions, topic.name);
      }

      setMode('results');
    }
  };

  const handleRetakeQuiz = () => {
    setMode('quiz');
    setCurrentQIndex(0);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setScore(0);
    hasRecordedRef.current = false;
  };

  return (
    <div className="page animate-fade-in">
      {/* Back link */}
      <Link
        to="/course"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Course Syllabus
      </Link>

      {/* Topic Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-2">
          <p className="label-muted text-brand-600 font-semibold">
            {course.name} ({course.code})
          </p>

          {/* Status Badge */}
          {topicProgress.status === 'reviewed' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" /> Reviewed
            </span>
          )}
          {topicProgress.status === 'in-progress' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
              <Clock className="h-3 w-3" /> In Progress
            </span>
          )}
          {topicProgress.status === 'not-started' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
              <Circle className="h-3 w-3" /> Not Started
            </span>
          )}
        </div>

        <h1 className="mt-1 text-xl font-bold text-slate-800">
          {topic.name}
        </h1>
      </div>

      {/* Mode 1: Overview */}
      {mode === 'overview' && (
        <div className="space-y-4">
          {/* Topic Summary Card */}
          <div className="card">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">
              Topic Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-600">
              {topic.summary}
            </p>

            {/* Key Concepts */}
            {topic.keyConcepts && topic.keyConcepts.length > 0 && (
              <div className="mt-4 border-t border-surface-200 pt-3">
                <h3 className="text-xs font-semibold text-slate-700 mb-2">
                  Key Concepts:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {topic.keyConcepts.map((concept) => (
                    <span
                      key={concept}
                      className="rounded-md bg-surface-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 border border-surface-200"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Previous History Card (if attempted) */}
          {topicProgress.attempts > 0 && (
            <div className="card bg-surface-50 border-surface-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Previous Performance:</span>
                <span className="font-bold text-brand-700">
                  {topicProgress.score}/{topicProgress.maxScore}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Last reviewed: {topicProgress.lastReviewed || 'N/A'} · Attempts: {topicProgress.attempts}
              </p>
            </div>
          )}

          {/* Start Quiz Card */}
          <div className="card border-brand-200 bg-gradient-to-br from-brand-50/40 via-white to-white text-center py-6">
            <FileQuestion className="mx-auto h-8 w-8 text-brand-600 mb-2" />
            <h3 className="text-base font-bold text-slate-800">
              Practice Quiz ({totalQuestions} Questions)
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Test your knowledge on {topic.name}. Completing this activity will update your learning history and AI recommendations.
            </p>

            <button
              onClick={() => setMode('quiz')}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-all"
            >
              Start Practice Quiz
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Active Quiz */}
      {mode === 'quiz' && (
        <div className="space-y-4">
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentQIndex + 1}
            totalQuestions={totalQuestions}
            selectedOptionId={selectedOptionId}
            onSelectOption={handleSelectOption}
            isSubmitted={isSubmitted}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
          />
        </div>
      )}

      {/* Mode 3: Quiz Results */}
      {mode === 'results' && (
        <QuizResults
          topicName={topic.name}
          score={score}
          maxScore={totalQuestions}
          onRetakeQuiz={handleRetakeQuiz}
        />
      )}

      <TransparencyFooter />
    </div>
  );
}
