import { useState, useEffect } from 'react';
import { heroAPI } from '../../services/api';
import IconPicker from '../../components/admin/IconPicker';
import {
    Save,
    Plus,
    Trash2,
    GripVertical,
    AlertCircle,
    Check,
    Loader,
    Image as ImageIcon
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';

const HeroManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showIconPicker, setShowIconPicker] = useState(null); // stores index of item being edited
    
    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [heroData, setHeroData] = useState({
        greeting: '',
        name: '',
        role: '',
        status_text: '',
        hero_image_url: '',
        hero_video_url: '',
        technologies: [],
        social_links: []
    });

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        try {
            setLoading(true);
            const res = await heroAPI.get();
            setHeroData(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTech = () => {
        setHeroData(prev => ({
            ...prev,
            technologies: [...(prev.technologies || []), "New Tech"]
        }));
    };

    const handleUpdateTech = (index, value) => {
        const newTechs = [...(heroData.technologies || [])];
        newTechs[index] = value;
        setHeroData(prev => ({ ...prev, technologies: newTechs }));
    };

    const handleDeleteTech = (index) => {
        const newTechs = [...(heroData.technologies || [])];
        newTechs.splice(index, 1);
        setHeroData(prev => ({ ...prev, technologies: newTechs }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await heroAPI.update({
                greeting: heroData.greeting,
                name: heroData.name,
                role: heroData.role,
                status_text: heroData.status_text,
                hero_image_url: heroData.hero_image_url,
                technologies: heroData.technologies || [] // Ensure array is sent even if empty
            });
            setSuccess('Hero section updated successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddSocial = async () => {
        try {
            const newLink = {
                platform: 'New Platform',
                url: '#',
                icon: 'Link',
                display_order: heroData.social_links.length + 1
            };
            await heroAPI.addSocialLink(newLink);
            fetchHeroData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateSocial = async (index, field, value) => {
        const link = heroData.social_links[index];
        const updatedLink = { ...link, [field]: value };

        // Optimistic update
        const newLinks = [...heroData.social_links];
        newLinks[index] = updatedLink;
        setHeroData(prev => ({ ...prev, social_links: newLinks }));

        try {
            await heroAPI.updateSocialLink(link.id, { [field]: value });
        } catch (err) {
            setError(err.message);
            fetchHeroData(); // Revert on error
        }
    };

    const handleDeleteSocial = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await heroAPI.deleteSocialLink(deleteId);
            setHeroData(prev => ({
                ...prev,
                social_links: prev.social_links.filter(link => link.id !== deleteId)
            }));
            setShowDeleteModal(false);
            setDeleteId(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-text-secondary">Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary">Hero Section</h1>

            {/* Alerts */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl flex items-center gap-2 border border-red-200 dark:border-red-900">
                    <AlertCircle size={20} /> {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 p-4 rounded-xl flex items-center gap-2 border border-green-200 dark:border-green-900">
                    <Check size={20} /> {success}
                </div>
            )}

            {/* Main Content Form */}
            <div className="bg-bg-surface rounded-2xl border border-border p-6">
                <h2 className="text-xl font-bold mb-4 text-text-primary">Main Content</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text-secondary">Greeting</label>
                            <input
                                type="text"
                                value={heroData.greeting}
                                onChange={e => setHeroData(prev => ({ ...prev, greeting: e.target.value }))}
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text-secondary">Name</label>
                            <input
                                type="text"
                                value={heroData.name}
                                onChange={e => setHeroData(prev => ({ ...prev, name: e.target.value }))}
                                className="form-input"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Role</label>
                        <input
                            type="text"
                            value={heroData.role}
                            onChange={e => setHeroData(prev => ({ ...prev, role: e.target.value }))}
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Status Text</label>
                        <div className="flex gap-2">
                            <span className="relative flex h-3 w-3 mt-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <input
                                type="text"
                                value={heroData.status_text}
                                onChange={e => setHeroData(prev => ({ ...prev, status_text: e.target.value }))}
                                className="form-input"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Hero Image URL</label>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={heroData.hero_image_url || ''}
                                    onChange={e => setHeroData(prev => ({ ...prev, hero_image_url: e.target.value }))}
                                    className="form-input font-mono text-sm"
                                    placeholder="https://example.com/me.jpg"
                                />
                                <p className="text-xs text-text-secondary mt-1">Leave empty to use default image.</p>
                            </div>
                            <div className="w-16 h-16 rounded-xl bg-bg-secondary overflow-hidden border border-border flex-shrink-0">
                                {heroData.hero_image_url ? (
                                    <img src={heroData.hero_image_url} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-secondary">
                                        <ImageIcon size={20} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                        >
                            {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Technologies */}
            <div className="bg-bg-surface rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text-primary">Marquee Technologies</h2>
                    <button
                        onClick={handleAddTech}
                        className="flex items-center gap-2 text-sm text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                        <Plus size={16} /> Add Tech
                    </button>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(heroData.technologies || []).map((tech, index) => (
                        <div key={index} className="flex gap-2 items-center">
                             <input
                                type="text"
                                value={tech}
                                onChange={(e) => handleUpdateTech(index, e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg-surface text-text-primary text-sm outline-none focus:border-primary"
                                placeholder="Technology Name"
                            />
                            <button
                                onClick={() => handleDeleteTech(index)}
                                className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {(!heroData.technologies || heroData.technologies.length === 0) && (
                        <div className="col-span-full text-center text-text-secondary py-8 border-2 border-dashed border-border rounded-xl">
                            No technologies added yet. The default list will be used if the database field is missing.
                        </div>
                    )}
                 </div>
            </div>

            {/* Social Links */}
            <div className="bg-bg-surface rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text-primary">Social Links</h2>
                    <button
                        onClick={handleAddSocial}
                        className="flex items-center gap-2 text-sm text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                        <Plus size={16} /> Add Link
                    </button>
                </div>

                <div className="space-y-3">
                    {heroData.social_links.map((link, index) => {
                        const Icon = LucideIcons[link.icon] || LucideIcons.Link;
                        return (
                            <div key={link.id} className="flex gap-3 items-start p-4 bg-bg-secondary rounded-xl group hover:border-primary/30 border border-transparent transition-all">
                                <button className="mt-2 text-text-secondary cursor-move hover:text-text-primary">
                                    <GripVertical size={20} />
                                </button>

                                <div className="w-12 h-12 flex items-center justify-center bg-bg-surface rounded-lg border border-border shrink-0 cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => setShowIconPicker(index)}>
                                    <Icon size={24} className="text-text-primary" />
                                </div>

                                <div className="flex-1 grid md:grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            value={link.platform}
                                            onChange={(e) => handleUpdateSocial(index, 'platform', e.target.value)}
                                            placeholder="Platform Name"
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-bg-surface text-text-primary text-sm outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => handleUpdateSocial(index, 'url', e.target.value)}
                                            placeholder="URL"
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-bg-surface text-text-secondary font-mono text-sm outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDeleteSocial(link.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Icon Picker Modal */}
            {showIconPicker !== null && (
                <IconPicker
                    value={heroData.social_links[showIconPicker].icon}
                    onChange={(iconName) => handleUpdateSocial(showIconPicker, 'icon', iconName)}
                    onClose={() => setShowIconPicker(null)}
                />
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Link"
                message="Are you sure you want to delete this social link?"
                type="danger"
            />
        </div>
    );
};

export default HeroManager;


