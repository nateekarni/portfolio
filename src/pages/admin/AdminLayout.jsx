import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import {
    LayoutDashboard,
    Briefcase,
    FolderOpen,
    Mail,
    MessageSquare,
    LogOut,
    Menu,
    X,
    ArrowLeft,
    Star,
    User,
    PlayCircle
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
    const { logout, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/hero', label: 'Hero Section', icon: Star },
        { path: '/admin/about', label: 'About Me', icon: User },
        { path: '/admin/services', label: 'Services', icon: Briefcase },
        { path: '/admin/projects', label: 'Projects', icon: FolderOpen },
        { path: '/admin/video', label: 'Video Section', icon: PlayCircle },
        { path: '/admin/contact', label: 'Contact Info', icon: Mail },
        { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-bg-primary flex transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
        inset-y-0 left-0 z-50
        w-64 bg-bg-surface border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col min-h-full">
                    {/* Logo/Header */}
                    <div className="p-6 border-b border-border flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-bold text-text-primary">
                                Admin Panel
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="lg:hidden">
                                     <ThemeToggle />
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="lg:hidden p-2 rounded-lg hover:bg-bg-secondary text-text-primary"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="hidden lg:flex justify-between items-center mb-4">
                            <ThemeToggle />
                        </div>

                        <Link
                            to="/"
                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary mt-2"
                        >
                            <ArrowLeft size={14} />
                            Back to Website
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer
                  ${isActive(item.path)
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                    }
                `}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-border">
                        <button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar (Mobile) */}
                <header className="lg:hidden sticky top-0 z-30 bg-bg-surface border-b border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-bg-secondary text-text-primary"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-bold text-text-primary">Admin</h1>
                        <div className="w-10 flex justify-end">
                            {/* Placeholder or actions */}
                        </div> 
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
