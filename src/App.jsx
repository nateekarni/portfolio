import './i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Video from './components/Video';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Background from './components/Background';
import AllProjects from './pages/AllProjects';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ServicesManager from './pages/admin/ServicesManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import ContactManager from './pages/admin/ContactManager';
import MessagesManager from './pages/admin/MessagesManager';

const Home = () => (
  <>
    <Navbar />
    <main className="relative z-10 space-y-20 md:space-y-32 pb-20">
      <Hero />
      <About />
      <Services />
      <Projects />
      <Video />
      <Contact />
    </main>
    <Footer />
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
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div className="min-h-screen relative font-display text-base transition-colors duration-500">
                <Background />
                <Home />
              </div>
            } />
            <Route path="/projects" element={
              <div className="min-h-screen relative font-display text-base transition-colors duration-500">
                <Background />
                <AllProjects />
              </div>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/:token" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="contact" element={<ContactManager />} />
              <Route path="messages" element={<MessagesManager />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
