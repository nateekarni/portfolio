import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Loading = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary transition-colors duration-500">
      <div className="flex flex-col items-center justify-center">
        {/* Animated gradient orb */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-32 h-32 rounded-full relative mb-12"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-xl"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse"></div>
        </motion.div>

        {/* Pulsing dots */}
        <div className="flex justify-center mb-8 space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-primary"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Loading Portfolio
          </h2>
          <p className="text-text-secondary">
            Preparing your experience...
          </p>
        </motion.div>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-bg-secondary rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'} • Please wait
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
