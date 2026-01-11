import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Particles } from './ui/particles';

const Background = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background transition-colors duration-300">
      {/* Glowing Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/40 dark:bg-primary/20 blur-[100px] animate-blob" style={{ animationDuration: '15s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-secondary/40 dark:bg-secondary/20 blur-[100px] animate-blob" style={{ animationDuration: '18s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[60%] w-[25vw] h-[25vw] rounded-full bg-accent/40 dark:bg-accent/20 blur-[100px] animate-blob" style={{ animationDuration: '20s', animationDelay: '5s' }} />
      <div className="absolute bottom-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-primary/30 dark:bg-primary/10 blur-[120px] animate-blob" style={{ animationDuration: '25s', animationDelay: '1s' }} />

       <Particles
        className="absolute inset-0"
        quantity={70}
        ease={80}
        color={isDarkMode ? "#ffffff" : "#000000"}
        refresh
      />
    </div>
  );
};

export default Background;
