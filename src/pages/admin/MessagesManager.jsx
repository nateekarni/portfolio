import { useState, useEffect } from 'react';
import { contactAPI, messagesAPI } from '../../services/api';
import {
    Mail,
    Trash2,
    Check,
    X,
    AlertCircle,
    Eye,
    Clock,
    MessageSquare,
    RefreshCw
} from 'lucide-react';

const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await contactAPI.getMessages();
            setMessages(res.data || []);
            setUnreadCount(res.unreadCount || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (message) => {
        try {
            await messagesAPI.markAsRead(message.id, !message.is_read);
            fetchMessages();
            if (selectedMessage?.id === message.id) {
                setSelectedMessage({ ...message, is_read: !message.is_read });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            await messagesAPI.delete(id);
            setSuccess('Message deleted successfully!');
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSelectMessage = async (message) => {
        setSelectedMessage(message);
        // Mark as read when opening
        if (!message.is_read) {
            try {
                await messagesAPI.markAsRead(message.id, true);
                setMessages(prev => prev.map(m =>
                    m.id === message.id ? { ...m, is_read: true } : m
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (err) {
                console.error('Failed to mark as read:', err);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading && messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Messages
                    </h1>
                    <p className="text-text-secondary">
                        ข้อความจาก Contact Form ({unreadCount} ยังไม่อ่าน)
                    </p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border rounded-xl hover:bg-bg-secondary transition-colors cursor-pointer text-text-primary"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="text-red-700 dark:text-red-400">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto cursor-pointer">
                        <X size={18} className="text-red-500" />
                    </button>
                </div>
            )}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-green-700 dark:text-green-400">{success}</span>
                    <button onClick={() => setSuccess(null)} className="ml-auto cursor-pointer">
                        <X size={18} className="text-green-500" />
                    </button>
                </div>
            )}

            {/* Messages */}
            {messages.length === 0 ? (
                <div className="bg-bg-surface rounded-2xl border border-border p-12 text-center text-text-secondary">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>ยังไม่มีข้อความ</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Messages List */}
                    <div className="lg:col-span-1 bg-bg-surface rounded-2xl border border-border overflow-hidden">
                        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    onClick={() => handleSelectMessage(message)}
                                    className={`p-4 cursor-pointer transition-colors ${selectedMessage?.id === message.id
                                            ? 'bg-primary/5 border-l-4 border-primary'
                                            : 'hover:bg-bg-secondary'
                                        } ${!message.is_read ? 'bg-blue-500/5' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${message.is_read ? 'bg-gray-300' : 'bg-blue-500'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`font-medium truncate ${message.is_read ? 'text-text-secondary' : 'text-text-primary'
                                                    }`}>
                                                    {message.name}
                                                </span>
                                            </div>
                                            <div className="text-sm text-text-secondary truncate mb-1">
                                                {message.subject || '(No Subject)'}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-text-secondary/70">
                                                <Clock size={12} />
                                                {formatDate(message.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Message Detail */}
                    <div className="lg:col-span-2 bg-bg-surface rounded-2xl border border-border overflow-hidden">
                        {selectedMessage ? (
                            <div className="flex flex-col h-full">
                                {/* Message Header */}
                                <div className="p-6 border-b border-border">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-text-primary mb-1">
                                                {selectedMessage.subject || '(No Subject)'}
                                            </h2>
                                            <div className="flex items-center gap-4 text-sm text-text-secondary">
                                                <span className="flex items-center gap-1">
                                                    <Mail size={14} />
                                                    {selectedMessage.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {formatDate(selectedMessage.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleMarkAsRead(selectedMessage)}
                                                className={`p-2 rounded-lg transition-colors cursor-pointer ${selectedMessage.is_read
                                                        ? 'text-text-secondary hover:bg-bg-secondary'
                                                        : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                                    }`}
                                                title={selectedMessage.is_read ? 'Mark as unread' : 'Mark as read'}
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(selectedMessage.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {selectedMessage.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-text-primary">
                                                {selectedMessage.name}
                                            </div>
                                            <div className="text-sm text-text-secondary">
                                                {selectedMessage.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Body */}
                                <div className="p-6 flex-1 overflow-y-auto">
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-wrap text-text-primary">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Reply Action */}
                                <div className="p-6 border-t border-border">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your Message'}`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all cursor-pointer"
                                    >
                                        <Mail size={18} />
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full py-20 text-text-secondary">
                                <div className="text-center">
                                    <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>เลือกข้อความเพื่อดูรายละเอียด</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesManager;
