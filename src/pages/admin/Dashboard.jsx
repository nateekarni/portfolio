import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI, projectsAPI, contactAPI } from '../../services/api';
import {
    Briefcase,
    FolderOpen,
    MessageSquare,
    TrendingUp,
    Eye,
    AlertCircle
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        services: { total: 0, active: 0 },
        projects: { total: 0, featured: 0 },
        messages: { total: 0, unread: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary/30 transition-all group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? '...' : value}
            </div>
            <div className="text-gray-500 dark:text-gray-400 font-medium">{title}</div>
            {subValue !== undefined && (
                <div className="mt-2 text-sm text-gray-400">
                    <span className="text-primary font-semibold">{subValue}</span> {subLabel}
                </div>
            )}
        </Link>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        to="/admin/services"
                        className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-primary/10 hover:text-primary transition-all"
                    >
                        <Briefcase size={20} />
                        <span className="font-medium">จัดการ Services</span>
                    </Link>
                    <Link
                        to="/admin/projects"
                        className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-primary/10 hover:text-primary transition-all"
                    >
                        <FolderOpen size={20} />
                        <span className="font-medium">จัดการ Projects</span>
                    </Link>
                    <Link
                        to="/admin/contact"
                        className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-primary/10 hover:text-primary transition-all"
                    >
                        <Eye size={20} />
                        <span className="font-medium">แก้ไข Contact</span>
                    </Link>
                    <Link
                        to="/admin/messages"
                        className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-primary/10 hover:text-primary transition-all"
                    >
                        <MessageSquare size={20} />
                        <span className="font-medium">ดู Messages</span>
                    </Link>
                </div>
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
