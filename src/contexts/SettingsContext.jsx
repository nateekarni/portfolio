import { createContext, useState, useEffect, useContext } from 'react';
import { settingsAPI } from '../services/api';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        site_name: 'Portfolio',
        site_description: 'Personal Portfolio',
        logo_text: 'Portfolio',
        logo_image_url: null,
        favicon_url: null,
        meta_keywords: ''
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await settingsAPI.get();
            if (res.data) {
                setSettings(res.data);
                applySettings(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const applySettings = (data) => {
        // Update Title
        if (data.site_name) {
            document.title = data.site_name;
        }

        // Update Favicon
        if (data.favicon_url) {
            const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            link.href = data.favicon_url;
            document.getElementsByTagName('head')[0].appendChild(link);
        }

        // Update Meta Description
        if (data.site_description) {
            let meta = document.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'description';
                document.head.appendChild(meta);
            }
            meta.content = data.site_description;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const updateSettings = async (newData) => {
        const res = await settingsAPI.update(newData);
        if (res.data) {
            setSettings(res.data);
            applySettings(res.data);
        }
        return res;
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, loading, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
