import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, X } from 'lucide-react';

const IconPicker = ({ value, onChange, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter icons based on search
    const filteredIcons = useMemo(() => {
        const iconList = Object.keys(LucideIcons).filter(key =>
            // Filter out non-icon exports if any, usually Lucide exports components
            key !== 'createLucideIcon' &&
            key !== 'default' &&
            /^[A-Z]/.test(key) // Assume icon names start with uppercase
        );

        if (!searchTerm) return iconList.slice(0, 100); // Show top 100 initially

        return iconList.filter(name =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 100); // Limit results for performance
    }, [searchTerm]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-bg-surface rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-border">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search icons..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-bg-secondary border-none text-text-primary focus:ring-2 focus:ring-primary outline-none placeholder:text-text-secondary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-secondary text-text-secondary hover:text-text-primary rounded-lg transition-colors cursor-pointer">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-6 sm:grid-cols-8 gap-2">
                    {filteredIcons.map(iconName => {
                        const Icon = LucideIcons[iconName];
                        return (
                            <button
                                key={iconName}
                                onClick={() => {
                                    onChange(iconName);
                                    onClose();
                                }}
                                className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl transition-all hover:bg-primary/10 hover:text-primary aspect-square ${value === iconName ? 'bg-primary text-white hover:bg-primary hover:text-white' : 'text-text-secondary'
                                    }`}
                                title={iconName}
                            >
                                <Icon className="w-6 h-6 mb-1" />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default IconPicker;
