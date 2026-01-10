import { useState, useEffect } from 'react';
import { contactItemsAPI } from '../../services/api';
import IconPicker from '../../components/admin/IconPicker';
import {
    Save,
    Plus,
    Trash2,
    GripVertical,
    AlertCircle,
    Check,
    Loader,
    Info
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ConfirmModal from '../../components/admin/ConfirmModal';

const ContactManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showIconPicker, setShowIconPicker] = useState(null);
    const [configData, setConfigData] = useState({ title: '', description: '' });
    const [configSaving, setConfigSaving] = useState(false);

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const [itemsRes, configRes] = await Promise.all([
                contactItemsAPI.getAll(),
                contactItemsAPI.getConfig()
            ]);
            setItems(itemsRes.data || []);
            if (configRes.data) {
                setConfigData({
                    title: configRes.data.title || '',
                    description: configRes.data.description || ''
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async () => {
        try {
            const newItem = {
                title: 'New Channel',
                value: 'detail...',
                icon: 'Mail',
                type: 'generic',
                display_order: items.length + 1
            };
            const res = await contactItemsAPI.add(newItem);
            if (res.data) {
                setItems([...items, res.data]); // Assume API returns created item
                // Or refetch if not returning
                // fetchItems();
            } else {
                fetchItems();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateItem = async (index, field, value) => {
        const item = items[index];
        const newItems = [...items];
        newItems[index] = { ...item, [field]: value };
        setItems(newItems);

        try {
            await contactItemsAPI.update(item.id, { [field]: value });
        } catch (err) {
            // Revert or show error
            // setError(err.message);
        }
    };

    const handleDeleteItem = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await contactItemsAPI.delete(deleteId);
            setItems(items.filter(i => i.id !== deleteId));
            setShowDeleteModal(false);
            setDeleteId(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-text-secondary">Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Contact Items
                    </h1>
                    <p className="text-text-secondary">Manage contact methods displayed on the Contact page.</p>
                </div>
                <button
                    onClick={handleAddItem}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-sm font-medium"
                >
                    <Plus size={18} />
                    Add Item
                </button>
            </div>

            {/* Section Configuration */}
            <div className="bg-bg-surface rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-text-primary">Section Settings</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Section Title</label>
                        <input
                            type="text"
                            value={configData.title}
                            onChange={(e) => setConfigData(prev => ({ ...prev, title: e.target.value }))}
                            className="form-input bg-bg-secondary border-border text-text-primary focus:border-primary focus:ring-primary/20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Section Description</label>
                        <input
                            type="text"
                            value={configData.description}
                            onChange={(e) => setConfigData(prev => ({ ...prev, description: e.target.value }))}
                            className="form-input bg-bg-secondary border-border text-text-primary focus:border-primary focus:ring-primary/20"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={async () => {
                            try {
                                setConfigSaving(true);
                                await contactItemsAPI.updateConfig(configData);
                                setSuccess('Section settings updated!');
                            } catch (err) { setError(err.message); }
                            finally { setConfigSaving(false); }
                        }}
                        disabled={configSaving}
                        className="cursor-pointer px-4 py-2 bg-bg-primary border border-border text-text-primary rounded-lg hover:bg-bg-secondary disabled:opacity-50 transition-colors"
                    >
                        {configSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {
                error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl flex items-center gap-2">
                        <AlertCircle size={20} /> {error}
                    </div>
                )
            }
            {
                success && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-600 p-4 rounded-xl flex items-center gap-2">
                        <Check size={20} /> {success}
                    </div>
                )
            }

            <div className="space-y-3">
                {items.length === 0 && (
                    <div className="text-center py-12 bg-bg-surface rounded-2xl border border-border">
                        <Info className="w-12 h-12 mx-auto text-text-secondary mb-3" />
                        <p className="text-text-secondary">No contact items found. Add one to get started.</p>
                    </div>
                )} {items.map((item, index) => {
                    const Icon = LucideIcons[item.icon] || LucideIcons.HelpCircle;
                    return (
                        <div key={item.id} className="flex gap-4 items-start p-6 bg-bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group">
                            <div className="mt-2 cursor-move text-text-secondary hover:text-text-primary">
                                <GripVertical size={20} />
                            </div>

                            <div
                                onClick={() => setShowIconPicker(index)}
                                className="w-12 h-12 flex items-center justify-center bg-bg-secondary rounded-xl border border-border shrink-0 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                            >
                                <Icon className="w-6 h-6 text-text-primary" />
                            </div>

                            <div className="flex-1 grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary uppercase mb-1 block">Title</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-bg-secondary text-text-primary font-medium focus:ring-1 focus:ring-primary focus:border-primary"
                                        placeholder="e.g. Email"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary uppercase mb-1 block">Value</label>
                                    <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => handleUpdateItem(index, 'value', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-border bg-bg-secondary text-text-primary focus:ring-1 focus:ring-primary focus:border-primary"
                                        placeholder="e.g. hello@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="cursor-pointer p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity self-center"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Icon Picker Modal */}
            {
                showIconPicker !== null && (
                    <IconPicker
                        value={items[showIconPicker].icon}
                        onChange={(iconName) => handleUpdateItem(showIconPicker, 'icon', iconName)}
                        onClose={() => setShowIconPicker(null)}
                    />
                )
            }
            
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Contact Item"
                message="Are you sure you want to delete this contact item?"
                type="danger"
            />
        </div >
    );
};

export default ContactManager;

