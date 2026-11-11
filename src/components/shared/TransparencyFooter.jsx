import { AlertCircle, RotateCcw, Download } from 'lucide-react';
import useLearningHistory from '../../hooks/useLearningHistory.js';

/**
 * TransparencyFooter
 *
 * An academically honest disclaimer explaining that the prototype
 * uses simulated recommendation logic. Placed at the bottom of
 * relevant pages to maintain research integrity.
 *
 * Includes:
 * - Subtle "Download Research Logs (JSON)" button for research reproducibility and data audit.
 * - Subtle "Reset Demo Data" button for demonstration reset.
 */
export default function TransparencyFooter() {
  const { history, resetHistory } = useLearningHistory();

  const handleDownloadResearchData = () => {
    try {
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        ...history,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `studylens-research-data-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Failed to export research data:', err);
    }
  };

  return (
    <footer className="mt-10 border-t border-surface-200 pt-6 pb-4">
      <div className="rounded-lg bg-surface-100 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600">
              Research Prototype Transparency Notice
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              This prototype uses deterministic, rule-based recommendation logic
              and does not use a trained machine learning model or external AI API.
              No user study has been conducted and no research findings are being
              claimed. StudyLens is an HCI research prototype exploring explainable
              recommendation design, learner agency, and transparent feedback.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-surface-200/80 pt-2.5 text-[11px] text-slate-400">
          <span>StudyLens v1.0 · HCI Research Prototype</span>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadResearchData}
              className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-brand-600 hover:underline"
              title="Export all session logs, attempts, confidence ratings, and reflections as JSON"
            >
              <Download className="h-3 w-3" />
              Download Research Logs (JSON)
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset learning history back to initial demo state?')) {
                  resetHistory();
                  window.location.href = '/';
                }
              }}
              className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-brand-600 hover:underline"
              title="Reset student learning history to default state for testing"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
