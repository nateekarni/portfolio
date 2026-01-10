import { useState, useEffect } from 'react';
import { aboutAPI } from '../../services/api';
import IconPicker from '../../components/admin/IconPicker';
import {
    Save,
    Plus,
    Trash2,
    GripVertical,
    AlertCircle,
    Check,
    Loader,
    Trophy,
    Award
} from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';

const AboutManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState({ type: null, id: null });

    const [aboutData, setAboutData] = useState({
        title: '',
        description_1: '',
        description_2: '',
        stats: [],
        certifications: []
    });

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            setLoading(true);
            const res = await aboutAPI.get();
            setAboutData(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBio = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await aboutAPI.update({
                title: aboutData.title,
                description_1: aboutData.description_1,
                description_2: aboutData.description_2
            });
            setSuccess('Bio updated successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // --- Stats Management ---

    const handleAddStat = async () => {
        try {
            const newStat = {
                label: 'New Stat',
                value: '0',
                display_order: aboutData.stats.length + 1
            };
            await aboutAPI.addStat(newStat);
            fetchAboutData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateStat = async (index, field, value) => {
        const stat = aboutData.stats[index];
        // Optimistic
        const newStats = [...aboutData.stats];
        newStats[index] = { ...stat, [field]: value };
        setAboutData(prev => ({ ...prev, stats: newStats }));

        try {
            await aboutAPI.updateStat(stat.id, { [field]: value });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteStat = (id) => {
        setDeleteConfig({ type: 'stat', id });
        setShowDeleteModal(true);
    };

    // --- Certifications Management ---

    const handleAddCert = async () => {
        try {
            const newCert = {
                name: 'New Certificate',
                issuer: 'Issuer',
                date: new Date().getFullYear().toString(),
                logo_url: '',
                cert_image_url: '',
                display_order: aboutData.certifications.length + 1
            };
            await aboutAPI.addCert(newCert);
            fetchAboutData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateCert = async (index, field, value) => {
        const cert = aboutData.certifications[index];
        const newCerts = [...aboutData.certifications];
        newCerts[index] = { ...cert, [field]: value };
        setAboutData(prev => ({ ...prev, certifications: newCerts }));

        try {
            await aboutAPI.updateCert(cert.id, { [field]: value });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteCert = (id) => {
        setDeleteConfig({ type: 'cert', id });
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteConfig.id) return;
        
        try {
            if (deleteConfig.type === 'stat') {
                 await aboutAPI.deleteStat(deleteConfig.id);
                 setAboutData(prev => ({ ...prev, stats: prev.stats.filter(s => s.id !== deleteConfig.id) }));
            } else if (deleteConfig.type === 'cert') {
                 await aboutAPI.deleteCert(deleteConfig.id);
                 setAboutData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== deleteConfig.id) }));
            }
            setShowDeleteModal(false);
            setDeleteConfig({ type: null, id: null });
        } catch (err) {
            setError(err.message);
        }
    };

    // Helper for image url prompt
    const handleImagePrompt = (index, type) => {
        const url = prompt('Enter Image URL:');
        if (url) {
            handleUpdateCert(index, type, url);
        }
    };

    if (loading) return <div className="p-8 text-center text-text-secondary">Loading...</div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary">About Me Setup</h1>

            {/* Alerts */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl flex items-center gap-2">
                    <AlertCircle size={20} /> {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 p-4 rounded-xl flex items-center gap-2">
                    <Check size={20} /> {success}
                </div>
            )}

            {/* BIO */}
            <div className="bg-bg-surface rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text-primary">Biography</h2>
                    <button
                        onClick={handleSaveBio}
                        disabled={saving}
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm transition-colors"
                    >
                        {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Bio
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Section Title</label>
                        <input
                            type="text"
                            value={aboutData.title}
                            onChange={e => setAboutData(prev => ({ ...prev, title: e.target.value }))}
                            className="form-input bg-bg-secondary border-border text-text-primary focus:border-primary focus:ring-primary/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Paragraph 1</label>
                        <textarea
                            rows={3}
                            value={aboutData.description_1}
                            onChange={e => setAboutData(prev => ({ ...prev, description_1: e.target.value }))}
                            className="form-input bg-bg-secondary border-border text-text-primary focus:border-primary focus:ring-primary/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Paragraph 2</label>
                        <textarea
                            rows={3}
                            value={aboutData.description_2}
                            onChange={e => setAboutData(prev => ({ ...prev, description_2: e.target.value }))}
                            className="form-input bg-bg-secondary border-border text-text-primary focus:border-primary focus:ring-primary/20"
                        />
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="bg-bg-surface rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <Trophy className="text-yellow-500" /> Stats
                    </h2>
                    <button
                        onClick={handleAddStat}
                        className="cursor-pointer flex items-center gap-2 text-sm text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Plus size={16} /> Add Stat
                    </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {aboutData.stats.map((stat, index) => (
                        <div key={stat.id} className="p-4 rounded-xl border border-border bg-bg-secondary relative group transition-colors hover:border-border/80">
                            <button
                                onClick={() => handleDeleteStat(stat.id)}
                                className="cursor-pointer absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={stat.value}
                                    onChange={e => handleUpdateStat(index, 'value', e.target.value)}
                                    className="w-full bg-transparent border-none text-2xl font-bold text-center focus:ring-0 p-0 text-text-primary"
                                    placeholder="Value"
                                />
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={e => handleUpdateStat(index, 'label', e.target.value)}
                                    className="w-full bg-transparent border-none text-xs text-center text-text-secondary focus:ring-0 p-0"
                                    placeholder="Label"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CERTIFICATIONS */}
            <div className="bg-bg-surface rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <Award className="text-purple-500" /> Certifications
                    </h2>
                    <button
                        onClick={handleAddCert}
                        className="cursor-pointer flex items-center gap-2 text-sm text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Plus size={16} /> Add Cert
                    </button>
                </div>

                <div className="space-y-4">
                    {aboutData.certifications.map((cert, index) => (
                        <div key={cert.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-bg-secondary rounded-xl group hover:border-primary/30 border border-transparent transition-all">
                            {/* Logo Preview */}
                            <div
                                onClick={() => handleImagePrompt(index, 'logo_url')}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-bg-surface border border-border flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden shrink-0 relative group/img transition-colors"
                            >
                                {cert.logo_url ? (
                                    <img src={cert.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <span className="text-xs text-center text-text-secondary">Add Logo</span>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                    <span className="text-white text-xs">Edit</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={cert.name}
                                        onChange={e => handleUpdateCert(index, 'name', e.target.value)}
                                        placeholder="Certificate Name"
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-bg-surface text-text-primary text-sm font-bold focus:ring-1 focus:ring-primary focus:border-primary"
                                    />
                                    <input
                                        type="text"
                                        value={cert.issuer}
                                        onChange={e => handleUpdateCert(index, 'issuer', e.target.value)}
                                        placeholder="Issuer"
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-bg-surface text-text-primary text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={cert.date}
                                        onChange={e => handleUpdateCert(index, 'date', e.target.value)}
                                        placeholder="Year/Date"
                                        className="w-32 px-3 py-2 rounded-lg border border-border bg-bg-surface text-text-primary text-sm text-center focus:ring-1 focus:ring-primary focus:border-primary"
                                    />
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            value={cert.cert_image_url}
                                            onChange={e => handleUpdateCert(index, 'cert_image_url', e.target.value)}
                                            placeholder="Certificate Image/PDF URL (for preview)"
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-bg-surface text-text-secondary font-mono text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteCert(cert.id)}
                                className="cursor-pointer self-start p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title={deleteConfig.type === 'stat' ? 'Delete Stat' : 'Delete Certificate'}
                message={
                    deleteConfig.type === 'stat' 
                    ? 'Are you sure you want to delete this stat?'
                    : 'Are you sure you want to delete this certificate?'
                }
                type="danger"
            />
        </div>
    );
};

export default AboutManager;

