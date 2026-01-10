import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { projectsAPI } from '../services/api';

const Projects = () => {
    const { t } = useTranslation();
    const [selectedId, setSelectedId] = useState(null);
    const [apiProjects, setApiProjects] = useState(null);

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

        fetchProjects();
    }, []);

    // Use API data if available, otherwise use static data
    const projects = apiProjects || projectsData;
    const visibleProjects = projects.slice(0, 6);
    const selectedProject = projects.find(p => p.id === selectedId);

    return (
        <section id="projects" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="gradient-text">{t('projects.title')}</span>
                    </h2>
                    <p className="text-secondary max-w-xl text-lg">
                        {t('projects.subtitle')}
                    </p>
                </motion.div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {visibleProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            layoutId={`card-${project.id}`}
                            onClick={() => setSelectedId(project.id)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="cursor-pointer group rounded-3xl overflow-hidden bg-white dark:bg-white/5 glass-panel hover:shadow-xl hover:shadow-primary/5 transition-all outline-none"
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
                                        <h3 className="text-xl font-bold mt-3 group-hover:text-primary transition-colors text-gray-900 dark:text-white">
                                            {project.title}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-secondary dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                    {project.desc}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 text-secondary dark:text-gray-300 border border-black/10 dark:border-white/10">
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

                <AnimatePresence>
                    {selectedProject && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10"
                            onClick={() => setSelectedId(null)}
                        >
                            <motion.div

                                key={selectedProject.id}
                                layoutId={`card-${selectedProject.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full h-full max-w-6xl bg-bg-primary rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row"
                            >
                                {/* Left side - Image */}
                                <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-black">
                                    <img
                                        src={selectedProject.image}
                                        alt={selectedProject.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />

                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="absolute top-6 left-6 md:hidden p-2 rounded-full bg-black/40 text-white backdrop-blur-md"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                </div>

                                {/* Right side - Content */}
                                <div className="md:w-1/2 flex flex-col h-full overflow-y-auto relative bg-bg-primary">
                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="absolute top-6 right-6 hidden md:block p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-10"
                                    >
                                        <X size={24} />
                                    </button>

                                    <div className="p-8 md:p-12 flex-1">
                                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                                            {selectedProject.category}
                                        </span>

                                        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{selectedProject.title}</h3>

                                        <p className="text-secondary dark:text-gray-300 text-lg leading-relaxed mb-8">
                                            {selectedProject.desc}
                                        </p>

                                        <div className="mb-8">
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">Technologies</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-border/50">
                                            <a
                                                href={selectedProject.demo}
                                                className="flex-1 px-6 py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                            >
                                                <ExternalLink size={20} /> Live Demo
                                            </a>
                                            <a
                                                href={selectedProject.github}
                                                className="flex-1 px-6 py-4 border border-border/50 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center gap-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors font-semibold"
                                            >
                                                <Github size={20} /> Source Code
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Projects;
