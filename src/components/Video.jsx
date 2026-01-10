import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Video = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section id="video" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-2">
            <span className="gradient-text">
              {t('video.subtitle')}
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-secondary text-lg text-center">
            {t('video.description')}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div
            className="relative rounded-3xl overflow-hidden glass-panel border border-black/5 dark:border-white/10 group shadow-2xl"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(isPlaying ? false : true)}
          >
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover opacity-90"
                poster="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200"
                onEnded={() => setIsPlaying(false)}
              >
                <source src="your-video-url.mp4" type="video/mp4" />
              </video>

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-24 h-24 rounded-full flex items-center justify-center bg-primary text-bg-primary shadow-lg hover:shadow-primary/50 transition-shadow"
                  >
                    <Play className="w-10 h-10 ml-1" fill="currentColor" />
                  </motion.button>
                </div>
              )}

              <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button onClick={toggleMute} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                  </div>
                  <button onClick={handleFullscreen} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                    <Maximize size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Video;