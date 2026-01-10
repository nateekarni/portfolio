import { useState, useEffect } from 'react';
import { projectsAPI } from '../../services/api';
import {
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Eye,
    EyeOff,
    Star,
    ExternalLink,
    Github,
    AlertCircle,
    Check,
    FolderOpen
} from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';

const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        image: '',
        description: '',
        tags: [],
        github_url: '',
        demo_url: '',
        is_featured: false,
        display_order: 0,
        is_active: true
    });
    const [tagInput, setTagInput] = useState('');
    
    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await projectsAPI.getAll({ includeInactive: true });
            setProjects(res.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: '',
            image: '',
            description: '',
            tags: [],
            github_url: '',
            demo_url: '',
            is_featured: false,
            display_order: 0,
            is_active: true
        });
        setTagInput('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title || '',
            category: project.category || '',
            image: project.image || '',
            description: project.description || '',
            tags: project.tags || [],
            github_url: project.github_url || '',
            demo_url: project.demo_url || '',
            is_featured: project.is_featured || false,
            display_order: project.display_order || 0,
            is_active: project.is_active !== false
        });
        setEditingId(project.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            if (editingId) {
                await projectsAPI.update(editingId, formData);
                setSuccess('Project updated successfully!');
            } else {
                await projectsAPI.create(formData);
                setSuccess('Project created successfully!');
            }
            resetForm();
            fetchProjects();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await projectsAPI.delete(deleteId);
            setSuccess('Project deleted successfully!');
            fetchProjects();
            setShowDeleteModal(false);
            setDeleteId(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleActive = async (project) => {
        try {
            await projectsAPI.update(project.id, { is_active: !project.is_active });
            fetchProjects();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleFeatured = async (project) => {
        try {
            await projectsAPI.update(project.id, { is_featured: !project.is_featured });
            fetchProjects();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()]
                }));
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    if (loading && projects.length === 0) {
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
                        Projects Manager
                    </h1>
                    <p className="text-text-secondary">จัดการโปรเจคที่แสดงในหน้า Portfolio</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                    <Plus size={20} />
                    Add Project
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

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-bg-surface rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border">
                        <div className="sticky top-0 bg-bg-surface border-b border-border p-6 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-text-primary">
                                {editingId ? 'Edit Project' : 'Add New Project'}
                            </h2>
                            <button onClick={resetForm} className="p-2 hover:bg-bg-primary rounded-lg text-text-secondary cursor-pointer">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="form-input"
                                        placeholder="Project title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="form-input"
                                        placeholder="Development, UI/UX Design, etc."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                    className="form-input"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.image && (
                                    <img src={formData.image} alt="Preview" className="mt-3 h-32 object-cover rounded-lg" />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="form-input"
                                    placeholder="Project description..."
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Tags (Press Enter to add)
                                </label>
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    className="form-input"
                                    placeholder="React, Node.js, Tailwind..."
                                />
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-red-500 cursor-pointer"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* URLs */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        GitHub URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.github_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                                        className="form-input"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Demo URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.demo_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                                        className="form-input"
                                        placeholder="https://demo.example.com"
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex flex-wrap gap-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="text-text-primary font-medium">Featured Project</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="text-text-primary font-medium">Active (Visible)</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-text-primary font-medium">Order:</span>
                                    <input
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                        className="w-20 px-3 py-2 rounded-lg border border-border bg-bg-primary text-text-primary"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-4 pt-6 border-t border-border">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 rounded-xl border border-border text-text-secondary hover:bg-bg-primary cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 flex items-center gap-2 cursor-pointer"
                                >
                                    <Save size={18} />
                                    {editingId ? 'Update Project' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="bg-bg-surface rounded-2xl border border-border p-12 text-center text-text-secondary">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No projects yet. Click "Add Project" to create one.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className={`bg-bg-surface rounded-2xl border overflow-hidden ${project.is_active
                                    ? 'border-border'
                                    : 'border-yellow-300 dark:border-yellow-700 opacity-75'
                                }`}
                        >
                            {/* Image */}
                            <div className="aspect-video bg-bg-secondary relative">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-text-secondary">
                                        <FolderOpen size={48} />
                                    </div>
                                )}
                                {project.is_featured && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                        <Star size={12} /> Featured
                                    </div>
                                )}
                                {!project.is_active && (
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                        Hidden
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <span className="text-xs font-medium text-primary">{project.category}</span>
                                        <h3 className="font-bold text-text-primary">{project.title}</h3>
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {project.tags?.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="text-xs px-2 py-0.5 bg-bg-secondary rounded text-text-secondary">
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags?.length > 3 && (
                                        <span className="text-xs text-text-secondary">+{project.tags.length - 3}</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex gap-1">
                                        {project.demo_url && (
                                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-primary">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                        {project.github_url && (
                                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-primary">
                                                <Github size={16} />
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleToggleFeatured(project)}
                                            className={`p-2 rounded-lg ${project.is_featured
                                                    ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                            title={project.is_featured ? 'Unfeature' : 'Feature'}
                                        >
                                            <Star size={16} fill={project.is_featured ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(project)}
                                            className={`p-2 rounded-lg ${project.is_active
                                                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                            title={project.is_active ? 'Hide' : 'Show'}
                                        >
                                            {project.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone."
                type="danger"
            />
        </div>
    );
};

export default ProjectsManager;
