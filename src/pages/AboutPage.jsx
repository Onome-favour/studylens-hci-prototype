import { Eye, Brain, Layers, User, Shield, SlidersHorizontal, Search, RefreshCw, ArrowRight } from 'lucide-react';
import TransparencyFooter from '../components/shared/TransparencyFooter.jsx';

/**
 * AboutPage
 *
 * Provides genuine research context for the StudyLens prototype.
 * Explains the HCI research question, the interactive loop being explored,
 * the key HCI concepts, and maintains academic honesty about the simulated system.
 */

const HCI_CONCEPTS = [
  {
    icon: Eye,
    label: 'Transparency',
    description:
      'The system\'s reasoning process is accessible to the student rather than hidden inside a black box.',
  },
  {
    icon: Brain,
    label: 'Explainability',
    description:
      'Recommendations are accompanied by understandable justifications that help the student evaluate the suggestion.',
  },
  {
    icon: Layers,
    label: 'Progressive Disclosure',
    description:
      'Explanation depth is controlled by the student — brief at first, with more detail available on request.',
  },
  {
    icon: SlidersHorizontal,
    label: 'Personalisation',
    description:
      'Recommendations adapt to the individual\'s learning history, quiz performance, and study patterns.',
  },
  {
    icon: User,
    label: 'User Control',
    description:
      'The student can accept, modify, or reject guidance. The system suggests rather than commands.',
  },
  {
    icon: Shield,
    label: 'Appropriate Trust',
    description:
      'The interface communicates the basis and limitations of its recommendations honestly.',
  },
];

const RESEARCH_LOOP_STEPS = [
  'Learning history data',
  'AI study recommendation',
  'Explanation & "Why?" reveal',
  'Student decision & control',
  'Learning activity (Quiz)',
  'History state updated',
  'Recommendation recalculated',
];

export default function AboutPage() {
  return (
    <div className="page animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            About StudyLens
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Human-AI Interaction (HCI) Research Prototype
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="card mb-4">
        <h2 className="section-heading mb-2">What is StudyLens?</h2>
        <p className="text-xs leading-relaxed text-slate-600">
          StudyLens is a focused HCI research prototype exploring how an AI learning assistant can use a student's learning history to recommend what they should study next — while transparently communicating why the recommendation was made and preserving student autonomy.
        </p>
        <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
          Rather than evaluating machine-learning accuracy, StudyLens investigates the <strong>interaction design</strong> between an AI recommendation system and a student.
        </p>
      </div>

      {/* Research question */}
      <div className="card mb-4 border-brand-200 bg-gradient-to-br from-brand-50/40 via-white to-white">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-2">
          Central HCI Research Question
        </h2>
        <blockquote className="border-l-2 border-brand-400 pl-3 text-xs italic text-slate-700 leading-relaxed">
          "How can an AI learning assistant use a student's learning history to recommend what they should study next while transparently communicating the reasoning behind its recommendation?"
        </blockquote>
      </div>

      {/* Interactive Research Loop */}
      <div className="card mb-4">
        <h2 className="section-heading mb-3">The Demonstration Loop</h2>
        <div className="space-y-2">
          {RESEARCH_LOOP_STEPS.map((step, idx) => (
            <div key={step} className="flex items-center gap-2.5 text-xs">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                {idx + 1}
              </span>
              <span className="font-medium text-slate-700">{step}</span>
              {idx < RESEARCH_LOOP_STEPS.length - 1 && (
                <ArrowRight className="h-3 w-3 text-slate-300 ml-auto hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HCI concepts */}
      <div className="card mb-4">
        <h2 className="section-heading mb-4">HCI Concepts Explored</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {HCI_CONCEPTS.map(({ icon: Icon, label, description }) => (
            <div key={label} className="flex gap-2.5 rounded-lg border border-surface-200 bg-surface-50/50 p-2.5">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-white text-brand-600 shadow-card">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{label}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important disclaimers */}
      <div className="card">
        <h2 className="section-heading mb-2.5">Academic Honesty & Limitations</h2>
        <ul className="space-y-2 text-xs text-slate-600">
          {[
            'Simulated AI Logic: Recommendation priority is calculated using a rule-based deterministic formula (4-factor scoring). No trained machine-learning model is used.',
            'No User Study Claimed: This is an exploratory prototype designed to demonstrate interaction ideas. No empirical user study or statistical evaluation has been conducted.',
            'No Educational Claims: StudyLens demonstrates UI patterns for transparency and user control; it does not claim validated learning outcomes.',
            'Single Course Scope: Focused on a single syllabus (Database Management CS 3200) to keep the prototype clear and accessible.',
          ].map((note, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
              <span className="leading-relaxed">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <TransparencyFooter />
    </div>
  );
}
