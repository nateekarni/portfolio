import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

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
              <span className='gradient-text'>{t('about.title')}</span>
            </h2>
            <div className='space-y-6 text-lg leading-relaxed text-secondary'>
              <p>
                {t('about.description1')}
              </p>
              <p>
                {t('about.description2')}
              </p>
            </div>

            <div className='mt-12 grid grid-cols-2 gap-6'>
              {[
                { label: t('about.stats.experience'), value: '3+' },
                { label: t('about.stats.projects'), value: '20+' },
                { label: t('about.stats.clients'), value: '10+' },
                { label: t('about.stats.awards'), value: '5' }
              ].map((stat, idx) => (
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
             <ul className="space-y-4">
               {[
                 { name: 'Certified React Developer', issuer: 'Meta', date: '2025', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png', certImg: 'https://img.freepik.com/free-vector/modern-certificate-template-appreciation_1017-38662.jpg' },
                 { name: 'Advanced Software Testing', issuer: 'ISTQB', date: '2024', logo: 'https://companieslogo.com/img/orig/ISTQB.D-2da26815.png?t=1720244492', certImg: 'https://img.freepik.com/free-vector/modern-certificate-template-appreciation_1017-38662.jpg' },
                 { name: 'UI/UX Design Specialization', issuer: 'Google', date: '2023', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png', certImg: 'https://img.freepik.com/free-vector/modern-certificate-template-appreciation_1017-38662.jpg' },
                 { name: 'Full Stack Web Development', issuer: 'Udemy', date: '2023', logo: 'https://seeklogo.com/images/U/udemy-logo-5B56A082F8-seeklogo.com.png', certImg: 'https://img.freepik.com/free-vector/modern-certificate-template-appreciation_1017-38662.jpg' }
               ].map((cert, idx) => (
                 <li key={idx} 
                     className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
                     onClick={() => window.open(cert.certImg, '_blank')}
                 >
                    <div className="w-12 h-12 rounded-lg bg-white p-2 border border-gray-100 flex items-center justify-center shrink-0">
                        <img src={cert.logo} alt={cert.issuer} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg group-hover:text-primary transition-colors">{cert.name}</div>
                      <div className="text-sm text-secondary">{cert.issuer}</div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">{cert.date}</span>
                 </li>
               ))}
             </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
