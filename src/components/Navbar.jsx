import { useState, useEffect } from 'react';
import { Menu, X, Terminal, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, i18n } = useTranslation();
  
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
    { name: t('nav.video'), href: '#video' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'backdrop-blur-xl bg-bg-primary/70 border-b border-border' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
             <Terminal className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">Portfolio</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          
          <div className="h-6 w-px bg-border mx-2" />

          <ThemeToggle />

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full glass-panel hover:bg-white/10 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{currentLang.flag}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {langOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 glass-panel rounded-xl border border-border overflow-hidden p-1"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm flex items-center justify-between hover:bg-white/5 transition-colors ${
                        i18n.language === lang.code ? 'text-primary' : 'text-secondary'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-secondary hover:text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-primary border-b border-border overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-secondary hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <ThemeToggle />
                <div className="flex gap-2">
                  {languages.map((lang) => (
                     <button
                       key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`px-3 py-1 rounded-full border ${
                          i18n.language === lang.code 
                            ? 'border-primary text-primary bg-primary/10' 
                            : 'border-border text-secondary'
                        }`}
                     >
                        {lang.flag}
                     </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;