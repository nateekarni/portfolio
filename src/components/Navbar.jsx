import { useState, useEffect } from 'react';
import { Menu, X, Terminal, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useSettings } from '../contexts/SettingsContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'th', label: 'ไทย', flag: 'https://flagcdn.com/w40/th.png' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
      scrolled ? "bg-background/80 backdrop-blur-md border-border/40 supports-[backdrop-filter]:bg-background/60" : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between px-6 md:px-8 max-w-7xl mx-auto">
        
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 mr-6">
          {settings?.logo_image_url ? (
             <img src={settings.logo_image_url} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <div className="flex items-center gap-2">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Terminal className="h-5 w-5" />
               </div>
               <span className="text-lg font-bold tracking-tight">{settings?.logo_text || 'Portfolio'}</span>
            </div>
          )}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
           {/* Language Switch */}
           <div className="relative">
              <motion.button
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={() => setLangOpen(!langOpen)}
                 className="p-3 rounded-full bg-bg-surface border border-border shadow-md hover:bg-bg-secondary transition-colors relative overflow-hidden"
              >
                 <Globe className="w-5 h-5 text-primary" />
              </motion.button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-36 rounded-2xl border border-border bg-bg-surface p-2 shadow-xl z-50"
                  >
                     {languages.map((lang) => (
                        <button
                           key={lang.code}
                           onClick={() => changeLanguage(lang.code)}
                           className={cn(
                              "relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-bg-secondary",
                              i18n.language === lang.code && "bg-primary/10 text-primary"
                           )}
                        >
                           <img 
                              src={lang.flag} 
                              alt={lang.label} 
                              className="w-5 h-5 rounded-full object-cover shadow-sm ring-1 ring-border" 
                           />
                           {lang.label}
                        </button>
                     ))}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <ThemeToggle />
        </div>
        
        <div className="md:hidden flex items-center gap-2">
             <ThemeToggle />
             <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b bg-background"
          >
            <div className="container py-4 space-y-4 px-6 pb-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-4 mt-4 border-t">
                  <span className="text-sm font-medium text-muted-foreground mr-auto">Language</span>
                  <div className="flex gap-2">
                     {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={cn(
                             "px-3 py-1 rounded-md text-xs font-medium border transition-colors",
                             i18n.language === lang.code 
                                ? "bg-primary text-primary-foreground border-primary" 
                                : "bg-transparent text-muted-foreground border-input"
                          )}
                        >
                           {lang.code.toUpperCase()}
                        </button>
                     ))}
                  </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
