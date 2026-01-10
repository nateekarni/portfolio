import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, ExternalLink } from 'lucide-react';
import { aboutAPI } from '../services/api';

const About = () => {
  const { t } = useTranslation();
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await aboutAPI.get();
        setAboutData(res.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) return null;

  // Fallbacks
  const description1 = aboutData?.description_1 || t('about.description1');
  const description2 = aboutData?.description_2 || t('about.description2');
  const stats = aboutData?.about_stats?.length > 0 ? aboutData.about_stats : [
    { label: t('about.stats.experience'), value: '3+' },
    { label: t('about.stats.projects'), value: '20+' },
    { label: t('about.stats.clients'), value: '10+' },
    { label: t('about.stats.awards'), value: '5' }
  ];
  const certifications = aboutData?.certifications || [];

  return (
    <section id='about' className='py-20 relative'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid lg:grid-cols-2 gap-12 items-start'>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-3xl glass-panel"
          >
            <h2 className='text-4xl md:text-5xl font-bold mb-8'>
              <span className='gradient-text'>{aboutData?.title || t('about.title')}</span>
            </h2>
            <div className='space-y-6 text-lg leading-relaxed text-secondary'>
              <p>{description1}</p>
              <p>{description2}</p>
            </div>

            <div className='mt-12 grid grid-cols-2 gap-6'>
              {stats.map((stat, idx) => (
                <div key={idx} className='p-6 rounded-2xl glass-panel shadow-sm hover:border-primary/30 transition-colors'>
                  <div className='text-4xl font-bold mb-2 gradient-text'>{stat.value}</div>
                  <div className='text-sm font-medium text-secondary'>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='p-8 rounded-3xl glass-panel'
          >
            <h3 className='text-3xl font-bold mb-6 gradient-text'>Certifications</h3>
            {certifications.length === 0 ? (
              <p className="text-secondary italic">No certifications listed yet.</p>
            ) : (
              <ul className="space-y-4">
                {certifications.map((cert, idx) => (
                  <li key={idx}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => setSelectedCert(cert)}
                  >
                    <div className="w-12 h-12 rounded-lg bg-white p-2 border border-gray-100 flex items-center justify-center shrink-0">
                      {cert.logo_url ? (
                        <img src={cert.logo_url} alt={cert.issuer} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-md"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg group-hover:text-primary transition-colors">{cert.name}</div>
                      <div className="text-sm text-secondary">{cert.issuer}</div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">{cert.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

        </div>
      </div>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <a
                  href={selectedCert.cert_image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  title="Open original"
                >
                  <ExternalLink size={20} />
                </a>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-1 h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <img
                  src={selectedCert.cert_image_url}
                  alt={selectedCert.name}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                />
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{selectedCert.name}</h3>
                <p className="text-gray-500">{selectedCert.issuer} • {selectedCert.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
