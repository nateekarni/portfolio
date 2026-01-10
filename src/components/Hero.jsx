import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className='min-h-screen flex items-center justify-center relative pt-20 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-6 w-full relative z-10'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6'>
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-primary'></span>
              </span>
              <span className='text-sm font-medium tracking-wide mx-1'>{t('hero.status')}</span>
            </div>

            <h1 className='text-6xl md:text-8xl font-bold leading-tight mb-8 tracking-tighter'>
              {t('hero.greeting')} <br />
              <span className='gradient-text'>
                {t('hero.name')}
              </span>
            </h1>

            <p className='text-xl md:text-2xl text-secondary mb-10 max-w-xl leading-relaxed'>
              {t('hero.role')}
            </p>

            <div className='flex flex-wrap gap-4'>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href='#projects'
                className='px-8 py-4 bg-primary text-bg-primary rounded-full font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(var(--color-primary),0.3)] transition-all'
              >
                {t('hero.viewWork')} <ArrowRight size={20} />
              </motion.a>
              
              <div className='flex gap-4 items-center px-6'>
                {[Github, Linkedin, Mail].map((Icon, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ y: -3, color: 'var(--color-primary)' }}
                    href='#'
                    className='p-2 text-secondary hover:text-primary transition-colors'
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className='relative hidden lg:block'
          >
            <div className='relative w-full aspect-square max-w-md mx-auto'>
              <div className='absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse'></div>
              <div className='relative h-full w-full rounded-[2rem] overflow-hidden glass-panel border border-black/5 dark:border-white/10 p-2'>
                <img 
                  src='https://images.unsplash.com/photo-1544256306-234edc1c306d?q=80&w=2609&auto=format&fit=crop' 
                  alt='Hero' 
                  className='w-full h-full object-cover rounded-[1.5rem] opacity-90'
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
