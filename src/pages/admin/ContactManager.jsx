import { useState, useEffect } from 'react';
import { contactAPI } from '../../services/api';
import {
    Save,
    Plus,
    Trash2,
    AlertCircle,
    Check,
    X,
    Mail,
    Phone,
    MapPin,
    Globe
} from 'lucide-react';

const ContactManager = () => {
    const [contactInfo, setContactInfo] = useState({
        email: '',
        phone: '',
        location: '',
        social_links: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            setLoading(true);
            const res = await contactAPI.getInfo();
            if (res.data) {
                setContactInfo({
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    location: res.data.location || '',
                    social_links: res.data.social_links || []
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            setSaving(true);
            await contactAPI.updateInfo(contactInfo);
            setSuccess('Contact information updated successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddSocialLink = () => {
        setContactInfo(prev => ({
            ...prev,
            social_links: [...prev.social_links, { platform: '', url: '', icon: 'Globe' }]
        }));
    };

    const handleRemoveSocialLink = (index) => {
        setContactInfo(prev => ({
            ...prev,
            social_links: prev.social_links.filter((_, i) => i !== index)
        }));
    };

    const handleSocialLinkChange = (index, field, value) => {
        setContactInfo(prev => ({
            ...prev,
            social_links: prev.social_links.map((link, i) =>
                i === index ? { ...link, [field]: value } : link
            )
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Contact Information
                </h1>
                <p className="text-gray-500">จัดการข้อมูลติดต่อที่แสดงบนเว็บไซต์</p>
            </div>

            {/* Alerts */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="text-red-700 dark:text-red-400">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto">
                        <X size={18} className="text-red-500" />
                    </button>
                </div>
            )}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-green-700 dark:text-green-400">{success}</span>
                    <button onClick={() => setSuccess(null)} className="ml-auto">
                        <X size={18} className="text-green-500" />
                    </button>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Contact Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                        Basic Information
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Mail size={16} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="hello@example.com"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Phone size={16} />
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={contactInfo.phone}
                                onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="+66 98 765 4321"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <MapPin size={16} />
                                Location
                            </label>
                            <input
                                type="text"
                                value={contactInfo.location}
                                onChange={(e) => setContactInfo(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Bangkok, Thailand"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Social Links
                        </h2>
                        <button
                            type="button"
                            onClick={handleAddSocialLink}
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Plus size={16} />
                            Add Link
                        </button>
                    </div>

                    {contactInfo.social_links.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No social links yet. Click "Add Link" to add one.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {contactInfo.social_links.map((link, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="flex-1 grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Platform</label>
                                            <input
                                                type="text"
                                                value={link.platform}
                                                onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                                                placeholder="GitHub, LinkedIn, etc."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">URL</label>
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Icon Name</label>
                                            <input
                                                type="text"
                                                value={link.icon}
                                                onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                                                placeholder="Github, Linkedin, Twitter..."
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSocialLink(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg self-center"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <Save size={20} />
                        )}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactManager;
