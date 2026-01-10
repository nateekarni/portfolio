import './i18n';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { heroAPI, aboutAPI, servicesAPI, projectsAPI, videoAPI, contactAPI, setUnauthorizedHandler } from './services/api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Video from './components/Video';
import Contact from './components/Contact';
import Background from './components/Background';
import Loading from './components/Loading';
import AllProjects from './pages/AllProjects';

import Unauthorized from './pages/Unauthorized';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ServicesManager from './pages/admin/ServicesManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import ContactManager from './pages/admin/ContactManager';
import MessagesManager from './pages/admin/MessagesManager';
import HeroManager from './pages/admin/HeroManager';
import AboutManager from './pages/admin/AboutManager';
import VideoManager from './pages/admin/VideoManager';
import SettingsManager from './pages/admin/SettingsManager';

const Home = ({ initialData }) => (
  <>
    <Navbar />
    <main className="relative z-10 pb-20">
      <Hero initialData={initialData.hero} />
      <About initialData={initialData.about} />
      <Services initialData={initialData.services} />
      <Projects initialData={initialData.projects} />
      <Video initialData={initialData.video} />
      <Contact initialData={initialData.contact} />
    </main>
  </>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};


function AppContent({ initialData, isLoading }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Register unauthorized handler
    setUnauthorizedHandler(async (status) => {
      // If 401/403 occurs during API call:
      // 1. Clear local auth state
      await logout();
      // 2. Redirect to login page
      navigate('/admin/login');
    });
  }, [navigate, logout]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <div className="min-h-screen relative font-display text-base transition-colors duration-500">
          <Background />
          <Home initialData={initialData} />
        </div>
      } />
      <Route path="/projects" element={
        <div className="min-h-screen relative font-display text-base transition-colors duration-500">
          <Background />
          <AllProjects />
        </div>
      } />
      
      {/* Access Denied Page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="hero" element={<HeroManager />} />
        <Route path="about" element={<AboutManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="video" element={<VideoManager />} />
        <Route path="contact" element={<ContactManager />} />
        <Route path="messages" element={<MessagesManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>
    </Routes>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState({
    hero: null,
    about: null,
    services: null,
    projects: null,
    video: null,
    contact: null
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch all critical data in parallel
        const [
          heroResponse,
          aboutResponse,
          servicesResponse,
          projectsResponse,
          videoResponse,
          contactResponse
        ] = await Promise.allSettled([
          heroAPI.get(),
          aboutAPI.get(),
          servicesAPI.getAll(),
          projectsAPI.getAll({ limit: 6 }),
          videoAPI.get(),
          contactAPI.getInfo()
        ]);

        setInitialData({
          hero: heroResponse.status === 'fulfilled' ? heroResponse.value.data : null,
          about: aboutResponse.status === 'fulfilled' ? aboutResponse.value.data : null,
          services: servicesResponse.status === 'fulfilled' ? servicesResponse.value.data : null,
          projects: projectsResponse.status === 'fulfilled' ? projectsResponse.value.data : null,
          video: videoResponse.status === 'fulfilled' ? videoResponse.value.data : null,
          contact: contactResponse.status === 'fulfilled' ? contactResponse.value.data : null
        });
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent initialData={initialData} isLoading={isLoading} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
