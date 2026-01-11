import { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Save, Loader, Globe, Image as ImageIcon, Type, LayoutTemplate } from 'lucide-react';

const SettingsManager = () => {
    const { settings, updateSettings, loading: initialLoading } = useSettings();
    const [formData, setFormData] = useState({
        site_name: '',
        site_description: '',
        logo_text: '',
        logo_image_url: '',
        favicon_url: '',
        meta_keywords: '',
        show_hero: true,
        show_about: true,
        show_services: true,
        show_projects: true,
        show_video: true,
        show_contact: true
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (settings) {
            setFormData({
                site_name: settings.site_name || '',
                site_description: settings.site_description || '',
                logo_text: settings.logo_text || '',
                logo_image_url: settings.logo_image_url || '',
                favicon_url: settings.favicon_url || '',
                meta_keywords: settings.meta_keywords || '',
                show_hero: settings.show_hero ?? true,
                show_about: settings.show_about ?? true,
                show_services: settings.show_services ?? true,
                show_projects: settings.show_projects ?? true,
                show_video: settings.show_video ?? true,
                show_contact: settings.show_contact ?? true
            });
        }
    }, [settings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await updateSettings(formData);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings. ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    if (initialLoading) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                        Site Settings
                    </h2>
                    <p className="text-text-secondary mt-1">
                        จัดการข้อมูลทั่วไปของเว็บไซต์ (SEO, Logo, Title)
                    </p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl border ${
                    message.type === 'success' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* General Settings */}
                <div className="p-6 rounded-2xl bg-bg-surface border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Globe className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">General Information (SEO)</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-secondary">Site Name (Page Title)</label>
                            <input
                                type="text"
                                value={formData.site_name}
                                onChange={e => setFormData({...formData, site_name: e.target.value})}
                                className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-border focus:border-primary outline-none transition-colors"
                                placeholder="e.g. My Portfolio"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-secondary">Logo Text (Navbar)</label>
                            <input
                                type="text"
                                value={formData.logo_text}
                                onChange={e => setFormData({...formData, logo_text: e.target.value})}
                                className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-border focus:border-primary outline-none transition-colors"
                                placeholder="e.g. NAT.DEV"
                            />
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <label className="block text-sm font-medium text-text-secondary">Site Description (Meta Description)</label>
                        <textarea
                            value={formData.site_description}
                            onChange={e => setFormData({...formData, site_description: e.target.value})}
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-border focus:border-primary outline-none transition-colors resize-none"
                            placeholder="Brief description of your portfolio for search engines..."
                        />
                    </div>

                    <div className="mt-6 space-y-2">
                        <label className="block text-sm font-medium text-text-secondary">Keywords (Comma separated)</label>
                        <input
                            type="text"
                            value={formData.meta_keywords}
                            onChange={e => setFormData({...formData, meta_keywords: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-border focus:border-primary outline-none transition-colors"
                            placeholder="portfolio, react, developer"
                        />
                    </div>
                </div>

                {/* Branding */}
                <div className="p-6 rounded-2xl bg-bg-surface border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <ImageIcon className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">Branding & Assets</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-text-secondary">Logo Image URL (Optional)</label>
                            <input
                                type="text"
                                value={formData.logo_image_url}
                                onChange={e => setFormData({...formData, logo_image_url: e.target.value})}
                                className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-border focus:border-primary outline-none transition-colors font-mono text-sm"
                                placeholder="https://..."
                            />
                            {formData.logo_image_url && (
                                <div className="p-4 rounded-xl border border-dashed border-border bg-bg-secondary/50 flex items-center justify-center">
                                    <img src={formData.logo_image_url} alt="Logo Preview" className="h-12 object-contain" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-text-secondary">Favicon URL</label>
                            <input
                                type="text"
                                value={formData.favicon_url}
                                onChange={e => setFormData({...formData, favicon_url: e.target.value})}
                                className="w-full px-4 py-2 rounded-xl bg-bg-secondary border border-border focus:border-primary outline-none transition-colors font-mono text-sm"
                                placeholder="https://.../favicon.ico"
                            />
                            {formData.favicon_url && (
                                <div className="p-4 rounded-xl border border-dashed border-border bg-bg-secondary/50 flex items-center justify-center">
                                    <img src={formData.favicon_url} alt="Favicon Preview" className="w-8 h-8 object-contain" />
                                </div>
                            )}
                        </div>
                    </div>

                {/* Section Visibility */}
                <div className="p-6 rounded-2xl bg-bg-surface border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                            <LayoutTemplate className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">Section Visibility</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {['hero', 'about', 'video', 'services', 'projects', 'contact'].map(section => (
                            <div key={section} className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary/50 border border-border/50">
                                <span className="capitalize font-medium text-text-primary">{section} Section</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={formData[`show_${section}`] ?? true}
                                        onChange={e => setFormData({...formData, [`show_${section}`]: e.target.checked})}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none ring-4 ring-transparent peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsManager;
