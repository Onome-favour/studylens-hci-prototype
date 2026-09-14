import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import AppShell from './components/layout/AppShell.jsx';

// Pages
import DashboardPage from './pages/DashboardPage.jsx';
import CoursePage from './pages/CoursePage.jsx';
import TopicPage from './pages/TopicPage.jsx';
import RecommendationPage from './pages/RecommendationPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

/**
 * App
 *
 * Root component with React Router configuration.
 * All routes are nested under AppShell which provides the
 * header, navigation, and layout structure.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          {/* Core pages */}
          <Route index element={<DashboardPage />} />
          <Route path="course" element={<CoursePage />} />
          <Route path="course/topic/:topicId" element={<TopicPage />} />
          <Route path="recommendation" element={<RecommendationPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
