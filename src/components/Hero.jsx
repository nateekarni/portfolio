import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Play } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import VideoPopup from './VideoPopup';
import { BorderBeam } from './ui/border-beam';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Marquee } from './ui/marquee';
import TechIcon from './TechIcon';

const defaultTechnologies = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", 
  "Supabase", "Framer Motion", "Vite", "OpenAI", "Vercel",
  "Firebase", "Redux", "MQTT", "MongoDB", "PostgreSQL", 
  "Docker", "Git", "Figma"
];

const Hero = ({ initialData }) => {
  const { t } = useTranslation();
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [theme, setTheme] = useState('light');

  // Use initialData if provided, otherwise use empty state
  const heroData = initialData || null;

  // Use dynamic technologies from database. 
  // If database has empty array, use empty array. Only use default if field is missing (null/undefined).
  const technologies = heroData?.technologies !== undefined && heroData?.technologies !== null
    ? heroData.technologies 
    : defaultTechnologies;

  // Fallback to translation if API data missing or empty strings
  const greeting = heroData?.greeting || t('hero.greeting');
  const name = heroData?.name || t('hero.name');
  const role = heroData?.role || t('hero.role');
  const status = heroData?.status_text || t('hero.status');

  // Detect theme for particles
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     document.querySelector('html').getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'dark' : 'light');
    };
    
    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
           checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <section id='home' className='relative min-h-screen w-full flex flex-col justify-center overflow-x-clip pt-32 md:pt-48'>

      <div className='z-10 w-full max-w-7xl mx-auto px-6 mb-12'>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
          {/* Text Content (Left) */}
          <div className='flex flex-col items-center text-center lg:items-start lg:text-left gap-6'>
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-sm backdrop-blur border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default">
                <span className='mr-2 flex h-2 w-2 relative'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-primary'></span>
                </span>
                {status}
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 leading-[1.1] pb-2'
            >
              {greeting} <br className="block md:hidden" /> {name}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed'
            >
              {role}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2'
            >
              <Button size="lg" className="rounded-full h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold" asChild>
                <a href='#projects'>
                  {t('hero.viewWork')} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              
              <div className="flex gap-2">
                {heroData?.social_links?.slice(0, 3).map((link, i) => {
                    const Icon = LucideIcons[link.icon] || LucideIcons.Globe;
                    return (
                      <Button key={i} variant="outline" size="icon" className="rounded-full h-12 w-12 border-border/50 bg-background/50 backdrop-blur hover:bg-accent/50" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform}>
                            <Icon className="h-5 w-5" />
                        </a>
                      </Button>
                    );
                })}
              </div>
            </motion.div>
          </div>

          {/* Hero Image/Video Section (Right on desktop, Bottom on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
            className="relative w-full order-last lg:order-none"
          >
            {/* Image Container with Theme-Adaptive Glass Effect */}
            <div className="group relative rounded-2xl p-2 backdrop-blur-md lg:rounded-3xl max-w-md mx-auto lg:mx-0 lg:ml-auto transition-all duration-300 border ring-1 shadow-2xl 
              border-slate-200 bg-slate-200/50 ring-white/50 shadow-slate-400/20
              dark:border-white/10 dark:bg-white/5 dark:ring-white/5 dark:shadow-none">
              
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border shadow-inner transition-all duration-300
                border-slate-200 bg-slate-100/50
                dark:border-white/10 dark:bg-muted-foreground/10">
                    <div className="relative w-full h-full group-hover:scale-[1.01] transition-transform duration-500">
                        <img 
                          src={heroData?.hero_image_url || 'https://images.unsplash.com/photo-1544256306-234edc1c306d'} 
                          alt={name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                        
                        {/* Play Button if video exists */}
                        {heroData?.hero_video_url && (
                            <div 
                              className="absolute inset-0 flex items-center justify-center cursor-pointer"
                              onClick={() => setShowVideoPopup(true)}
                            >
                              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                                  <Play className="h-8 w-8 text-white fill-white" />
                              </div>
                            </div>
                        )}
                    </div>
                  
                  <BorderBeam size={250} duration={12} delay={9} borderWidth={1.5} />
              </div>
            </div>
          </motion.div>
        
        </div>
      </div>

      {/* Logos Marquee (Technologies) */}
      <div className="w-full relative z-20 mt-20 mb-10">
        <div className="w-[120%] -ml-[10%] py-8 rotate-[-2deg] border-y border-border shadow-xl transition-colors duration-300 bg-bg-secondary text-foreground">
            <Marquee pauseOnHover className="[--duration:30s] [--gap:4rem] relative z-10" style={{ "--duration": "30s" }}>
              {technologies.map((tech) => (
                <div key={tech} className="flex items-center justify-center px-6 gap-3 group transition-all duration-300 opacity-90 hover:opacity-100 cursor-pointer">
                    <TechIcon name={tech} size={40} className="transition-transform duration-300 group-hover:scale-110 drop-shadow-md" />
                    <span className="text-xl font-bold hidden md:block drop-shadow-sm">{tech}</span>
                </div>
              ))}
            </Marquee>
        </div>
      </div>

      {/* Video Popup */}
      <VideoPopup 
        videoUrl={heroData?.hero_video_url || ''}
        isOpen={showVideoPopup}
        onClose={() => setShowVideoPopup(false)}
      />
    </section>
  );
};

export default Hero;
