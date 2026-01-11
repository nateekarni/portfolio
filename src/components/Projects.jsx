import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { projectsAPI } from '../services/api';
import TechIcon from './TechIcon';

const Projects = () => {
    const { t } = useTranslation();
    const [selectedId, setSelectedId] = useState(null);
    const [apiProjects, setApiProjects] = useState(null);
    const [sectionConfig, setSectionConfig] = useState(null);

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await projectsAPI.getAll();
                if (res.data && res.data.length > 0) {
                    // Transform API data to match component structure
                    setApiProjects(res.data.map(p => ({
                        ...p,
                        desc: p.description,
                        github: p.github_url,
                        demo: p.demo_url
                    })));
                }
            } catch (error) {
                console.log('Using fallback projects data:', error.message);
            }
        };

        const fetchConfig = async () => {
            try {
                const res = await projectsAPI.getConfig();
                if (res.data) setSectionConfig(res.data);
            } catch (e) { console.error(e); }
        };

        fetchProjects();
        fetchConfig();
    }, []);

    // Use API data if available, otherwise use static data
    const projects = apiProjects || projectsData;
    const visibleProjects = projects.slice(0, 6);
    const selectedProject = projects.find(p => p.id === selectedId);
    
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        if (selectedProject) {
            setActiveImage(selectedProject.image);
        }
    }, [selectedProject]);

    // Mock gallery logic - in a real app, projects would have a gallery array
    // For now, we'll create an array with the main image and some placeholders if no gallery exists
    const projectGallery = selectedProject?.gallery || 
        (selectedProject ? [
            selectedProject.image,
            // Add fallback/duplicate images for UI demonstration if needed, or just use one
            // 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop',
            // 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'
        ] : []);

    return (
        <section id="projects" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="gradient-text">{sectionConfig?.title || t('projects.title')}</span>
                    </h2>
                    <p className="text-secondary max-w-xl text-lg">
                        {sectionConfig?.description || t('projects.subtitle')}
                    </p>
                </motion.div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {visibleProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            onClick={() => setSelectedId(project.id)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="cursor-pointer group rounded-3xl overflow-hidden bg-bg-surface border border-border bg-bg-surface shadow-md hover:shadow-xl hover:shadow-primary/5 transition-all outline-none"
                        >
                            <div className="aspect-video overflow-hidden relative">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-white text-sm font-medium">View Details</span>
                                </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                                                {project.category}
                                            </span>
                                            <h3 className="text-xl font-bold mt-3 group-hover:text-primary transition-colors text-text-primary">
                                                {project.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                                        {project.desc}
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-bg-primary/50 text-text-secondary border border-border">
                                                <TechIcon name={tag} size={14} className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                {projects.length > 6 && (
                    <div className="flex justify-center">
                        <Link
                            to="/projects"
                            className="px-8 py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all pointer-events-auto"
                        >
                            View All Projects
                        </Link>
                    </div>
                )}

                {/* Modal Logic */}

                {createPortal(
                    <AnimatePresence>
                        {selectedProject && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 p-4 md:p-10"
                                onClick={() => setSelectedId(null)}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative w-full max-w-7xl max-h-[90vh] bg-background rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="p-6 border-b border-border flex justify-between items-center bg-bg-surface shrink-0">
                                        <div>
                                            <h3 className="text-2xl font-bold text-text-primary">{selectedProject.title}</h3>
                                            <p className="text-sm text-text-secondary">{selectedProject.category}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedId(null)}
                                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-secondary hover:text-text-primary"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
                                        {/* Image Section with Thumbnails */}
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Main Image */}
                                            <div className="flex-1 aspect-video rounded-2xl overflow-hidden bg-bg-surface relative border border-border shadow-lg">
                                                <motion.img
                                                    key={activeImage}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                    src={activeImage || selectedProject.image}
                                                    alt={selectedProject.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Thumbnails (Only show if > 1 image, but logic supports 1 too for layout consistency if desired, or skip) */}
                                            {projectGallery.length > 0 && (
                                                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-32 md:max-h-[500px] shrink-0 custom-scrollbar pb-2 md:pb-0">
                                                    {projectGallery.map((img, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setActiveImage(img)}
                                                            className={`relative aspect-video md:aspect-square w-24 md:w-full shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImage === img ? 'border-primary ring-2 ring-primary/20 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                                                        >
                                                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex flex-wrap gap-4">
                                            <a
                                                href={selectedProject.demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                            >
                                                <ExternalLink size={20} /> Live Demo
                                            </a>
                                            <a
                                                href={selectedProject.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 border border-border bg-bg-surface rounded-xl flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-semibold text-text-primary"
                                            >
                                                <Github size={20} /> Source Code
                                            </a>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                                About this Project
                                            </h4>
                                            <p className="text-text-secondary text-lg leading-relaxed">
                                                {selectedProject.desc}
                                            </p>
                                        </div>

                                        {/* Technologies */}
                                        <div>
                                            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                                Technologies
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.tags.map(tag => (
                                                    <span key={tag} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface border border-border text-sm font-medium text-text-primary">
                                                        <TechIcon name={tag} size={16} className="w-4 h-4" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>
        </section>
    );
};

export default Projects;
