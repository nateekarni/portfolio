import { useState, useEffect } from 'react';
import { servicesAPI } from '../../services/api';
import {
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Eye,
    EyeOff,
    GripVertical,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Check,
    Briefcase
} from 'lucide-react';
import IconPicker from '../../components/admin/IconPicker';
import * as LucideIcons from 'lucide-react';

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [showIconPicker, setShowIconPicker] = useState(null); // 'main' or item index (number)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'Globe',
        category: 'main',
        items: [],
        gallery: [],
        pricing: [],
        display_order: 0,
        is_active: true
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await servicesAPI.getAll({ includeInactive: true });
            setServices(res.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            icon: 'Globe',
            category: 'main',
            items: [],
            gallery: [],
            pricing: [],
            display_order: 0,
            is_active: true
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (service) => {
        setFormData({
            title: service.title || '',
            description: service.description || '',
            icon: service.icon || 'Globe',
            category: service.category || 'main',
            items: service.items || [],
            gallery: service.gallery || [],
            pricing: service.pricing || [],
            display_order: service.display_order || 0,
            is_active: service.is_active !== false
        });
        setEditingId(service.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            if (editingId) {
                await servicesAPI.update(editingId, formData);
                setSuccess('Service updated successfully!');
            } else {
                await servicesAPI.create(formData);
                setSuccess('Service created successfully!');
            }
            resetForm();
            fetchServices();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            await servicesAPI.delete(id);
            setSuccess('Service deleted successfully!');
            fetchServices();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleActive = async (service) => {
        try {
            await servicesAPI.update(service.id, { is_active: !service.is_active });
            fetchServices();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { name: '', icon: 'Check', desc: '' }]
        }));
    };

    const handleRemoveItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleAddPricing = () => {
        setFormData(prev => ({
            ...prev,
            pricing: [...prev.pricing, { name: '', price: '', features: [], isPopular: false }]
        }));
    };

    const handleRemovePricing = (index) => {
        setFormData(prev => ({
            ...prev,
            pricing: prev.pricing.filter((_, i) => i !== index)
        }));
    };

    const handlePricingChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            pricing: prev.pricing.map((plan, i) =>
                i === index ? { ...plan, [field]: value } : plan
            )
        }));
    };

    const handleAddGalleryImage = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            setFormData(prev => ({
                ...prev,
                gallery: [...prev.gallery, url]
            }));
        }
    };

    const handleRemoveGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    // Handle Icon Selection from Picker
    const handleIconSelect = (iconName) => {
        if (showIconPicker === 'main') {
            setFormData(prev => ({ ...prev, icon: iconName }));
        } else if (typeof showIconPicker === 'number') {
            handleItemChange(showIconPicker, 'icon', iconName);
        }
        setShowIconPicker(null);
    };


    if (loading && services.length === 0) {
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Services Manager
                    </h1>
                    <p className="text-gray-500">จัดการบริการที่แสดงบนเว็บไซต์</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    Add Service
                </button>
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

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingId ? 'Edit Service' : 'Add New Service'}
                            </h2>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Service title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Icon
                                    </label>
                                    <div
                                        onClick={() => setShowIconPicker('main')}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer hover:border-primary transition-colors"
                                    >
                                        {formData.icon && LucideIcons[formData.icon] ? (
                                            <>
                                                {(() => {
                                                    const Icon = LucideIcons[formData.icon];
                                                    return <Icon className="w-5 h-5 text-primary" />;
                                                })()}
                                                <span className="text-gray-900 dark:text-white">{formData.icon}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">Select Icon...</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Service description..."
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="main">Main Services</option>
                                        <option value="other">Other Services</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">Active</span>
                                    </label>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Service Items
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Add Item
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={item.name}
                                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                                            />

                                            {/* Item Icon Picker Trigger */}
                                            <div
                                                onClick={() => setShowIconPicker(index)}
                                                className="w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm flex items-center justify-center cursor-pointer hover:border-primary"
                                            >
                                                {item.icon && LucideIcons[item.icon] ? (
                                                    (() => {
                                                        const Icon = LucideIcons[item.icon];
                                                        return <Icon className="w-4 h-4" title={item.icon} />;
                                                    })()
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Icon</span>
                                                )}
                                            </div>

                                            <input
                                                type="text"
                                                placeholder="Description"
                                                value={item.desc}
                                                onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Gallery */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Gallery Images
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddGalleryImage}
                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Add Image
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {formData.gallery.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Gallery ${index}`}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveGalleryImage(index)}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {editingId ? 'Update Service' : 'Create Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Services List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {services.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No services yet. Click "Add Service" to create one.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {services.map((service) => (
                            <div key={service.id} className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="text-gray-400 cursor-move">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                {service.title}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${service.category === 'main'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                                }`}>
                                                {service.category}
                                            </span>
                                            {!service.is_active && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    Hidden
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                            {service.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleActive(service)}
                                            className={`p-2 rounded-lg transition-colors ${service.is_active
                                                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                            title={service.is_active ? 'Hide' : 'Show'}
                                        >
                                            {service.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                                            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                        >
                                            {expandedId === service.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === service.id && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Items ({service.items?.length || 0})</h4>
                                            <div className="space-y-1">
                                                {service.items?.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="text-sm text-gray-700 dark:text-gray-300">
                                                        • {item.name}
                                                    </div>
                                                ))}
                                                {(service.items?.length || 0) > 3 && (
                                                    <div className="text-sm text-gray-400">
                                                        +{service.items.length - 3} more...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Gallery ({service.gallery?.length || 0})</h4>
                                            <div className="flex gap-2">
                                                {service.gallery?.slice(0, 3).map((url, i) => (
                                                    <img key={i} src={url} alt="" className="w-12 h-12 object-cover rounded" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Icon Picker Modal */}
            {showIconPicker !== null && (
                <IconPicker
                    value={
                        showIconPicker === 'main'
                            ? formData.icon
                            : formData.items[showIconPicker]?.icon
                    }
                    onChange={handleIconSelect}
                    onClose={() => setShowIconPicker(null)}
                />
            )}
        </div>
    );
};

export default ServicesManager;
