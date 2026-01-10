import { useState, useEffect } from 'react';
import { videoAPI } from '../../services/api';
import {
    Save,
    AlertCircle,
    Check,
    Loader,
    Video,
    Image as ImageIcon
} from 'lucide-react';

const VideoManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [videoData, setVideoData] = useState({
        subtitle: '',
        description: '',
        video_url: '',
        cover_image_url: ''
    });

    useEffect(() => {
        fetchVideoData();
    }, []);

    const fetchVideoData = async () => {
        try {
            setLoading(true);
            const res = await videoAPI.get();
            setVideoData(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await videoAPI.update(videoData);
            setSuccess('Video section updated successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Video Section</h1>

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

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Section Subtitle</label>
                        <input
                            type="text"
                            value={videoData.subtitle}
                            onChange={e => setVideoData(prev => ({ ...prev, subtitle: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700"
                            placeholder="e.g. My Process"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                        <textarea
                            rows={3}
                            value={videoData.description}
                            onChange={e => setVideoData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Video URL (MP4)</label>
                            <div className="relative">
                                <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={videoData.video_url}
                                    onChange={e => setVideoData(prev => ({ ...prev, video_url: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 font-mono text-sm text-blue-600 dark:text-blue-400"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Cover Image URL</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={videoData.cover_image_url}
                                    onChange={e => setVideoData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 font-mono text-sm text-blue-600 dark:text-blue-400"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                        <label className="block text-sm font-medium mb-4 dark:text-gray-300">Preview</label>
                        <div className="relative rounded-3xl overflow-hidden glass-panel border border-black/5 dark:border-white/10 shadow-xl max-w-2xl mx-auto aspect-video bg-black">
                            <video
                                src={videoData.video_url}
                                poster={videoData.cover_image_url}
                                controls
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50"
                        >
                            {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VideoManager;
