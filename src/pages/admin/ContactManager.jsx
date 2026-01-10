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

const ContactManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showIconPicker, setShowIconPicker] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await contactItemsAPI.getAll();
            setItems(res.data || []);
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

    const handleDeleteItem = async (id) => {
        if (!confirm('Are you sure you want to delete this contact item?')) return;
        try {
            await contactItemsAPI.delete(id);
            setItems(items.filter(i => i.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Contact Items
                    </h1>
                    <p className="text-gray-500">Manage contact methods displayed on the Contact page.</p>
                </div>
                <button
                    onClick={handleAddItem}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-sm font-medium"
                >
                    <Plus size={18} />
                    Add Item
                </button>
            </div>

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

            <div className="space-y-3">
                {items.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <Info className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No contact items found. Add one to get started.</p>
                    </div>
                )} {items.map((item, index) => {
                    const Icon = LucideIcons[item.icon] || LucideIcons.HelpCircle;
                    return (
                        <div key={item.id} className="flex gap-4 items-start p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="mt-2 cursor-move text-gray-300 hover:text-gray-500">
                                <GripVertical size={20} />
                            </div>

                            <div
                                onClick={() => setShowIconPicker(index)}
                                className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shrink-0 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                            >
                                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </div>

                            <div className="flex-1 grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Title</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 font-medium"
                                        placeholder="e.g. Email"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Value</label>
                                    <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => handleUpdateItem(index, 'value', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                        placeholder="e.g. hello@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity self-center"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Icon Picker Modal */}
            {showIconPicker !== null && (
                <IconPicker
                    value={items[showIconPicker].icon}
                    onChange={(iconName) => handleUpdateItem(showIconPicker, 'icon', iconName)}
                    onClose={() => setShowIconPicker(null)}
                />
            )}
        </div>
    );
};

export default ContactManager;
