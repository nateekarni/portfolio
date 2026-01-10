import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI, projectsAPI, contactAPI } from '../../services/api';
import { supabase } from '../../lib/supabase';
import {
    Briefcase,
    FolderOpen,
    MessageSquare,
    TrendingUp,
    Eye,
    AlertCircle,
    Database,
    Loader,
    CheckCircle
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        services: { total: 0, active: 0 },
        projects: { total: 0, featured: 0 },
        messages: { total: 0, unread: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [seeding, setSeeding] = useState(false);
    const [seedResult, setSeedResult] = useState(null);

    const seedDatabase = async () => {
        if (!confirm('This will seed the database with initial data. Continue?')) return;

        setSeeding(true);
        setSeedResult(null);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/seed', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to seed database');
            }

            setSeedResult(result);
            fetchStats(); // Refresh stats after seeding
        } catch (err) {
            setError(err.message);
        } finally {
            setSeeding(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const [servicesRes, projectsRes, messagesRes] = await Promise.all([
                servicesAPI.getAll({ includeInactive: true }),
                projectsAPI.getAll({ includeInactive: true }),
                contactAPI.getMessages()
            ]);

            setStats({
                services: {
                    total: servicesRes.count || 0,
                    active: servicesRes.data?.filter(s => s.is_active).length || 0
                },
                projects: {
                    total: projectsRes.count || 0,
                    featured: projectsRes.data?.filter(p => p.is_featured).length || 0
                },
                messages: {
                    total: messagesRes.count || 0,
                    unread: messagesRes.unreadCount || 0
                }
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subValue, subLabel, icon: Icon, color, link }) => (
        <Link
            to={link}
            className="bg-bg-surface rounded-2xl p-6 border border-border hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">
                {loading ? '...' : value}
            </div>
            <div className="text-text-secondary font-medium">{title}</div>
            {subValue !== undefined && (
                <div className="mt-2 text-sm text-text-secondary/70">
                    <span className="text-primary font-semibold">{subValue}</span> {subLabel}
                </div>
            )}
        </Link>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                    Dashboard
                </h1>
                <p className="text-text-secondary">
                    ภาพรวมของระบบจัดการเนื้อหา
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 dark:text-red-400">{error}</span>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Services"
                    value={stats.services.total}
                    subValue={stats.services.active}
                    subLabel="active"
                    icon={Briefcase}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    link="/admin/services"
                />
                <StatCard
                    title="Projects"
                    value={stats.projects.total}
                    subValue={stats.projects.featured}
                    subLabel="featured"
                    icon={FolderOpen}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                    link="/admin/projects"
                />
                <StatCard
                    title="Messages"
                    value={stats.messages.total}
                    subValue={stats.messages.unread}
                    subLabel="unread"
                    icon={MessageSquare}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                    link="/admin/messages"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-bg-surface rounded-2xl p-6 border border-border">
                <h2 className="text-lg font-bold text-text-primary mb-4">
                    Quick Actions
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        to="/admin/services"
                        className="flex items-center gap-3 p-4 rounded-xl bg-bg-primary hover:bg-bg-secondary hover:text-primary transition-all cursor-pointer border border-border"
                    >
                        <Briefcase size={20} className="text-text-secondary" />
                        <span className="font-medium text-text-primary">จัดการ Services</span>
                    </Link>
                    <Link
                        to="/admin/projects"
                        className="flex items-center gap-3 p-4 rounded-xl bg-bg-primary hover:bg-bg-secondary hover:text-primary transition-all cursor-pointer border border-border"
                    >
                        <FolderOpen size={20} className="text-text-secondary" />
                        <span className="font-medium text-text-primary">จัดการ Projects</span>
                    </Link>
                    <Link
                        to="/admin/contact"
                        className="flex items-center gap-3 p-4 rounded-xl bg-bg-primary hover:bg-bg-secondary hover:text-primary transition-all cursor-pointer border border-border"
                    >
                        <Eye size={20} className="text-text-secondary" />
                        <span className="font-medium text-text-primary">แก้ไข Contact</span>
                    </Link>
                    <Link
                        to="/admin/messages"
                        className="flex items-center gap-3 p-4 rounded-xl bg-bg-primary hover:bg-bg-secondary hover:text-primary transition-all cursor-pointer border border-border"
                    >
                        <MessageSquare size={20} className="text-text-secondary" />
                        <span className="font-medium text-text-primary">ดู Messages</span>
                    </Link>
                </div>
            </div>

            {/* Seed Database Section */}
            <div className="bg-bg-surface rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">
                            Database Seeding
                        </h2>
                        <p className="text-sm text-text-secondary">
                            เพิ่มข้อมูลเริ่มต้น (Projects, Services, Contact) เข้าสู่ Database
                        </p>
                    </div>
                    <button
                        onClick={seedDatabase}
                        disabled={seeding}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer"
                    >
                        {seeding ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Seeding...
                            </>
                        ) : (
                            <>
                                <Database size={20} />
                                Seed Database
                            </>
                        )}
                    </button>
                </div>

                {seedResult && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
                            <CheckCircle size={20} />
                            Database seeded successfully!
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-500 space-y-1">
                            <p>• Projects inserted: {seedResult.results?.projects?.inserted || 0}</p>
                            <p>• Services inserted: {seedResult.results?.services?.inserted || 0}</p>
                            <p>• Contact info: {seedResult.results?.contact?.success ? 'Updated' : 'Failed'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
                    💡 วิธีใช้งาน Admin Panel
                </h3>
                <ul className="text-blue-700 dark:text-blue-400 space-y-1 text-sm">
                    <li>• ใช้เมนูด้านซ้ายเพื่อเข้าถึงหน้าจัดการต่างๆ</li>
                    <li>• การเปลี่ยนแปลงจะมีผลทันทีบนหน้าเว็บไซต์</li>
                    <li>• สามารถซ่อน/แสดง content ด้วยการเปลี่ยนสถานะ Active</li>
                    <li>• ข้อความจาก Contact Form จะปรากฏในหน้า Messages</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
