import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Background = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [balls] = useState(() => 
    [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 20,
      width: `${Math.random() * 100 + 50}px`,
      height: `${Math.random() * 100 + 50}px`,
      color: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)'
    }))
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Dynamic Gradient Background */}
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: 'var(--color-bg)' }}
      />

      {/* Interactive Blob */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-20"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        style={{ background: 'var(--gradient-primary)' }}
      />

      {/* Falling Balls */}
      {balls.map((ball) => (
        <motion.div
            key={ball.id}
            className="absolute rounded-full opacity-20"
            initial={{ 
                top: -100, 
                left: ball.left,
                scale: ball.scale
            }}
            animate={{ 
                top: '120%',
            }}
            transition={{
                duration: ball.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: ball.delay
            }}
            style={{
                width: ball.width,
                height: ball.height,
                background: ball.color,
                filter: 'blur(40px)'
            }}
        />
      ))}

      {/* Tech Lines Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
        <defs>
          <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="var(--color-text)" strokeWidth="0.05" opacity="0.1"/>
          </pattern>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Animated Circuit Lines - Looped & Multiple - Covering Full Screen */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.g key={i}>
            <motion.path
              d={`M ${10 + i * 20} 0 V ${20 + i * 10} L ${30 + i * 20} ${40 + i * 10} V 100`}
              stroke="url(#line-gradient)"
              strokeWidth="0.2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ 
                duration: 5 + i, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 1.5,
                repeatDelay: 0.5
              }}
            />
            <motion.circle
              r="0.4"
              fill="var(--color-primary)"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              style={{ offsetPath: `path("M ${10 + i * 20} 0 V ${20 + i * 10} L ${30 + i * 20} ${40 + i * 10} V 100")` }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1.5,
                repeatDelay: 0.5
              }}
            />
          </motion.g>
        ))}

        <motion.path
          d="M 80 0 V 10 L 60 30 V 80"
          stroke="var(--color-secondary)"
          strokeWidth="0.2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        />
      </svg>

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ 
          backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default Background;
