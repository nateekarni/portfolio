import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import {
  Layout, Smartphone, Globe, Code, Box, Layers, CheckCircle, Search, Monitor,
  Palette, Figma, PenTool, Bug, Settings, Globe2, Wrench, ChevronLeft, ChevronRight,
  X, Video, Film, Image as ImageIcon, Database, ShoppingCart, Check, Star
} from 'lucide-react';
import { servicesAPI } from '../services/api';

// Icon mapping for dynamic icon rendering
const iconMap = {
  Layout, Smartphone, Globe, Code, Box, Layers, CheckCircle, Search, Monitor,
  Palette, Figma, PenTool, Bug, Settings, Globe2, Wrench, Video, Film,
  ImageIcon, Database, ShoppingCart, Check, Star
};

const getIcon = (iconName) => iconMap[iconName] || Globe;

const Services = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [apiServices, setApiServices] = useState(null);
  const [apiOtherServices, setApiOtherServices] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const [mainRes, otherRes] = await Promise.all([
          servicesAPI.getAll({ category: 'main' }),
          servicesAPI.getAll({ category: 'other' })
        ]);

        if (mainRes.data && mainRes.data.length > 0) {
          // Transform API data to match component structure
          setApiServices(mainRes.data.map(s => ({
            ...s,
            icon: getIcon(s.icon),
            items: (s.items || []).map(item => ({
              ...item,
              icon: getIcon(item.icon)
            }))
          })));
        }

        if (otherRes.data && otherRes.data.length > 0) {
          setApiOtherServices(otherRes.data.map(s => ({
            ...s,
            icon: getIcon(s.icon),
            items: (s.items || []).map(item => ({
              ...item,
              icon: getIcon(item.icon)
            }))

          })));
        }
      } catch (error) {
        console.log('Using fallback services data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
    fetchConfig();
  }, []);

  const [sectionConfig, setSectionConfig] = useState(null);
  const fetchConfig = async () => {
    try {
      const res = await servicesAPI.getConfig();
      if (res.data) setSectionConfig(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (selectedService?.gallery?.length > 0) {
      setActiveImage(selectedService.gallery[0]);
    }
  }, [selectedService]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updateWidth = () => {
      if (carouselRef.current) {
        setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };

    // Slight delay to ensure render
    setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const services = [
    {
      id: 'website',
      title: t('services.website.title'),
      description: t('services.website.description'),
      icon: Globe,
      items: [
        { name: 'Full Stack Development', icon: Code, desc: 'Complete web solutions using modern technologies' },
        { name: 'CMS Integration', icon: Database, desc: 'Custom content management system setup' },
        { name: 'E-commerce Solutions', icon: ShoppingCart, desc: 'Online store functionality and payment integration' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2070&auto=format&fit=crop'
      ],
      pricing: [
        { name: 'Basic', price: '$499', features: ['Single Landing Page', 'Mobile Responsive', 'Contact Form', '1 Month Support'] },
        { name: 'Professional', price: '$999', features: ['Multi-page Website', 'CMS Integration', 'SEO Optimization', '3 Months Support', 'Speed Optimization'] },
        { name: 'Enterprise', price: '$1999', features: ['Custom E-commerce', 'Payment Gateway', 'Priority Support', 'Advanced Security', 'Analytics Integration', '1 Year Support'] }
      ]
    },
    {
      id: 'frontend',
      title: t('services.frontend.title'),
      description: t('services.frontend.description'),
      icon: Layout,
      items: [
        { name: 'Responsive Web Application', icon: Smartphone, desc: 'Applications that work seamlessly across all devices' },
        { name: 'Modern React Ecosystem', icon: Code, desc: 'Built with React, Next.js, and modern tools' },
        { name: 'Performance Optimization', icon: Monitor, desc: 'Fast loading times and optimal user experience' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop'
      ],
      pricing: [
        { name: 'Component', price: '$199', features: ['Interactive UI Component', 'Responsive', 'Clean Code'] },
        { name: 'Single Page App', price: '$799', features: ['React/Next.js SPA', 'API Integration', 'State Management', 'Testing'] },
        { name: 'Full Application', price: '$1499', features: ['Complex Architecture', 'Authentication', 'Database Integration', 'Deployment'] }
      ]
    },
    {
      id: 'uiux',
      title: t('services.uiux.title'),
      description: t('services.uiux.description'),
      icon: Palette,
      items: [
        { name: 'Responsive Design', icon: Smartphone, desc: 'Layouts that adapt to any screen size' },
        { name: 'Prototype', icon: Figma, desc: 'Interactive mockups for user flow testing' },
        { name: 'User Interface Design', icon: Layout, desc: 'Visually appealing and intuitive interfaces' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=2080&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509395062558-41264c530cb6?q=80&w=2070&auto=format&fit=crop'
      ],
      pricing: [
        { name: 'Wireframe', price: '$299', features: ['User Flow', 'Low-fidelity Design', '2 Revisions'] },
        { name: 'UI Design', price: '$699', features: ['High-fidelity Design', 'Design System', 'Prototyping', 'Source Files'] },
        { name: 'Full Package', price: '$1299', features: ['UX Research', 'User Testing', 'Full UI Design', 'Interactive Prototype', 'Developer Handoff'] }
      ]
    },
    {
      id: 'testing',
      title: t('services.testing.title'),
      description: t('services.testing.description'),
      icon: Bug,
      items: [
        { name: 'Manual Testing', icon: CheckCircle, desc: 'Thorough verification of functionality and usability' },
        { name: 'Automated Testing', icon: Code, desc: 'Scripted tests for regression and stability' },
        { name: 'Bug Reporting', icon: Search, desc: 'Detailed issue tracking and documentation' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1605522466906-ddcb68a73196?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&auto=format&fit=crop'
      ],
      pricing: [
        { name: 'Smoke Test', price: '$149', features: ['Critical Path Testing', 'Basic Report'] },
        { name: 'Standard QA', price: '$499', features: ['Manual Testing', 'Detailed Bug Report', 'Cross-browser Testing'] },
        { name: 'Automation', price: '$999', features: ['Test Script Development', 'CI/CD Integration', 'Performance Testing', 'Comprehensive Report'] }
      ]
    },
    {
      id: 'wordpress',
      title: t('services.wordpress.title'),
      description: t('services.wordpress.description'),
      icon: Globe2,
      items: [
        { name: 'Theme Customization', icon: Palette, desc: 'Tailoring themes to match your brand identity' },
        { name: 'Plugin Configuration', icon: Settings, desc: 'Extending functionality with the right tools' },
        { name: 'Site Maintenance', icon: Wrench, desc: 'Regular updates and security checks' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1622675363311-ac60f6037cda?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1481487484168-9b930d5b7d9f?q=80&w=2070&auto=format&fit=crop'
      ],
      pricing: [
        { name: 'Setup', price: '$299', features: ['Theme Installation', 'Basic Plugins', 'Content Upload'] },
        { name: 'Customization', price: '$599', features: ['Child Theme Development', 'CSS Styling', 'Speed Optimization'] },
        { name: 'E-commerce', price: '$899', features: ['WooCommerce Setup', 'Product Upload', 'Payment Integration'] }
      ]
    }
  ];

  const otherServices = [
    {
      id: 'digital',
      title: t('services.digital.title'),
      description: t('services.digital.description'),
      icon: Video,
      items: [
        { name: 'Motion Graphic', icon: Film, desc: 'Animated visual content for engagement' },
        { name: 'Video Editor', icon: Video, desc: 'Professional cutting and post-production' },
        { name: 'Graphic Design', icon: ImageIcon, desc: 'Static visuals for digital and print media' }
      ],
      gallery: [
        'https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1574717432741-9346631bf350?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop'
      ],
      pricing: [
        { name: 'Basic Edit', price: '$199', features: ['Cut/Trim', 'Color Correction', 'Basic Audio Mix'] },
        { name: 'Visual Effects', price: '$499', features: ['Motion Graphics', 'Transitions', 'Sound Design'] },
        { name: 'Full Production', price: '$999', features: ['Storyboarding', 'Advanced Editing', 'VFX', 'Final Polish'] }
      ]
    }
  ];

  // Use API data if available, otherwise use hardcoded fallback
  const displayServices = apiServices || services;
  const displayOtherServices = apiOtherServices || otherServices;

  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, displayServices.length - itemsPerPage);

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    let interval;
    if (!isPaused && !isMobile && displayServices.length > itemsPerPage) {
      interval = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, isMobile, maxIndex, displayServices.length]);

  return (
    <section id='services' className='py-20 relative'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Main Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">{sectionConfig?.title || t('services.title')}</span>
          </h2>
          <p className="text-secondary max-w-xl mx-auto text-lg">
            {sectionConfig?.description || t('services.subtitle')}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {isMobile ? (
            <div className="grid grid-cols-1 gap-8">
              {displayServices.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className='p-8 rounded-3xl glass-panel hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col'
                >
                  <div className='flex items-center gap-4 mb-6 border-b border-border/50 pb-4'>
                    <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'>
                      <service.icon className='w-6 h-6' />
                    </div>
                    <h3 className='text-xl font-bold whitespace-nowrap'>{service.title}</h3>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    {service.items.slice(0, 3).map((item, itemIdx) => (
                      <div key={itemIdx} className="flex gap-3 items-start">
                        <div className="mt-1 text-primary shrink-0">
                          <item.icon size={16} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <p className="text-xs text-secondary dark:text-white leading-relaxed font-light">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='mt-auto pt-6 border-t border-border/50'>
                    <button
                      onClick={() => setSelectedService(service)}
                      className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 pointer-events-auto"
                    >
                      {t('services.viewDetail')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <>
              <motion.div
                ref={carouselRef}
                className='overflow-hidden'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <motion.div
                  className="flex gap-6"
                  animate={{ x: `calc(-${currentIndex * (100 / itemsPerPage)}% - ${currentIndex * (24 / itemsPerPage)}px)` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  {displayServices.map((service, idx) => (
                    <motion.div
                      key={idx}
                      style={{ minWidth: 'calc(33.333% - 16px)' }}
                      className='p-8 rounded-3xl glass-panel transition-all group flex flex-col relative'
                    >
                      <div className='flex items-center gap-4 mb-6 border-b border-border/50 pb-4'>
                        <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'>
                          <service.icon className='w-6 h-6' />
                        </div>
                        <h3 className='text-xl font-bold whitespace-nowrap'>{service.title}</h3>
                      </div>

                      <div className="space-y-4 mb-8 flex-grow">
                        {service.items.slice(0, 3).map((item, itemIdx) => (
                          <div key={itemIdx} className="flex gap-3 items-start">
                            <div className="mt-1 text-primary shrink-0">
                              <item.icon size={16} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{item.name}</h4>
                              <p className="text-xs text-secondary dark:text-white leading-relaxed font-light">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className='mt-auto pt-6 border-t border-border/50 relative z-20'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(service);
                          }}
                          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                        >
                          {t('services.viewDetail')}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Controls */}
              {displayServices.length > itemsPerPage && (
                <>
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-bg-primary border border-border hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-all z-10 glass-panel"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === maxIndex}
                    className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-bg-primary border border-border hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-all z-10 glass-panel"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Other Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="my-16 mb-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
            {t('services.otherServices')}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {displayOtherServices.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className='p-8 rounded-3xl glass-panel border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col'
              >
                <div className='flex items-center gap-4 mb-6 border-b border-border/50 pb-4'>
                  <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'>
                    <service.icon className='w-6 h-6' />
                  </div>
                  <h3 className='text-xl font-bold whitespace-nowrap'>{service.title}</h3>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  {service.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex gap-3 items-start">
                      <div className="mt-1 text-primary shrink-0">
                        <item.icon size={16} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-secondary dark:text-white leading-relaxed font-light">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-auto pt-6 border-t border-border/50'>
                  <button
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    {t('services.viewDetail')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Full Screen Modal */}
        {createPortal(
          <AnimatePresence>
            {selectedService && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10"
                onClick={() => setSelectedService(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-7xl max-h-[90vh] bg-bg-primary rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
                >
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/5 dark:bg-black/20 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <selectedService.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{selectedService.title}</h3>
                        <p className="text-sm text-secondary">Service Details & Portfolio</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedService(null)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="w-8 h-8" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
                    {/* Gallery / Works - Top */}
                    {selectedService.gallery && selectedService.gallery.length > 0 && (
                      <section>
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Main Image */}
                          <div className="flex-1 aspect-video rounded-2xl overflow-hidden bg-black/5 dark:bg-black/20 relative group border border-black/10 dark:border-white/10 shadow-lg">
                            <motion.img
                              key={activeImage}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              src={activeImage || selectedService.gallery[0]}
                              alt="Project Main"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Thumbnails */}
                          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-32 md:max-h-[500px] shrink-0 custom-scrollbar pb-2 md:pb-0">
                            {selectedService.gallery.map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`relative aspect-video md:aspect-square w-24 md:w-full shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImage === img ? 'border-primary ring-2 ring-primary/20 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                              >
                                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Service Description */}
                    <section>
                      <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        About this Service
                      </h4>
                      <p className="text-secondary text-lg leading-relaxed">
                        {selectedService.description}
                      </p>
                    </section>

                    {/* Included Services (Package Content) */}
                    <section>
                      <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        {t('services.modal.whatIncluded')}
                      </h4>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedService.items.map((item, i) => (
                          <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-primary/30 transition-colors">
                            <div className="mt-1 text-primary shrink-0">
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-semibold mb-1">{item.name}</h5>
                              <p className="text-sm text-secondary dark:text-gray-400">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Pricing Packages */}
                    {selectedService.pricing && (
                      <section>
                        <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <span className="w-1 h-6 bg-primary rounded-full"></span>
                          Pricing Options
                        </h4>
                        <div className="grid md:grid-cols-3 gap-6">
                          {selectedService.pricing.map((plan, idx) => (
                            <div key={idx} className={`relative p-6 rounded-3xl border flex flex-col ${idx === 1 ? 'border-primary/50 bg-primary/5 shadow-xl shadow-primary/10' : 'border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5'}`}>
                              {idx === 1 && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
                                  MOST POPULAR
                                </div>
                              )}
                              <div className="mb-4">
                                <h5 className="text-lg font-bold mb-2">{plan.name}</h5>
                                <div className="text-3xl font-extrabold gradient-text">{plan.price}</div>
                              </div>
                              <ul className="space-y-3 mb-8 flex-grow">
                                {plan.features.map((feature, fIdx) => (
                                  <li key={fIdx} className="flex items-start gap-3 text-sm text-secondary">
                                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                              <button className={`w-full py-3 rounded-xl font-bold transition-all ${idx === 1 ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'}`}>
                                Choose Plan
                              </button>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* CTA / Pricing */}
                    <section className="mt-auto bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col md:flex-row gap-8 items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold mb-2">Ready to work together?</h4>
                        <p className="text-secondary max-w-lg">Get a custom quote for your project. I usually reply within 24 hours.</p>
                      </div>
                      <div className="flex gap-4">
                        <a
                          href="#contact"
                          onClick={() => setSelectedService(null)}
                          className="px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                          Contact Me <ChevronRight size={20} />
                        </a>
                      </div>
                    </section>
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

export default Services;
