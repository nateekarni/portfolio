import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { contactAPI } from '../services/api';

const Contact = () => {
  const { t } = useTranslation();
  const [contactInfo, setContactInfo] = useState({
    email: 'hello@example.com',
    phone: '+1 (555) 000-0000',
    location: 'New York, NY'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // Fetch contact info from API
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await contactAPI.getInfo();
        if (res.data) {
          setContactInfo({
            email: res.data.email || 'hello@example.com',
            phone: res.data.phone || '+1 (555) 000-0000',
            location: res.data.location || 'New York, NY'
          });
        }
      } catch (error) {
        console.log('Using fallback contact info:', error.message);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await contactAPI.sendMessage(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id='contact' className='py-20 relative'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid lg:grid-cols-2 gap-12'>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='glass-panel p-8 rounded-3xl'
          >
            <h2 className='text-4xl md:text-5xl font-bold mb-8'>
              <span className='gradient-text'>{t('contact.title')}</span>
            </h2>
            <p className='text-xl text-secondary mb-12 leading-relaxed'>
              {t('contact.description')}
            </p>

            <div className='space-y-8'>
              <div className='flex items-center gap-6 group'>
                <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'>
                  <Mail className='w-6 h-6' />
                </div>
                <div>
                  <div className='text-sm text-secondary font-medium'>Email</div>
                  <div className='text-xl font-bold'>{contactInfo.email}</div>
                </div>
              </div>

              <div className='flex items-center gap-6 group'>
                <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'>
                  <Phone className='w-6 h-6' />
                </div>
                <div>
                  <div className='text-sm text-secondary font-medium'>Phone</div>
                  <div className='text-xl font-bold'>{contactInfo.phone}</div>
                </div>
              </div>

              <div className='flex items-center gap-6 group'>
                <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'>
                  <MapPin className='w-6 h-6' />
                </div>
                <div>
                  <div className='text-sm text-secondary font-medium'>Location</div>
                  <div className='text-xl font-bold'>{contactInfo.location}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='glass-panel p-8 rounded-3xl'
          >
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className='flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400'>
                  <CheckCircle size={20} />
                  <span className='font-medium'>Message sent successfully!</span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className='flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'>
                  <AlertCircle size={20} />
                  <span className='font-medium'>Failed to send message. Please try again.</span>
                </div>
              )}

              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-secondary'>Name</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/20 focus:border-primary focus:outline-none transition-colors'
                    placeholder='John Doe'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-secondary'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/20 focus:border-primary focus:outline-none transition-colors'
                    placeholder='john@example.com'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-secondary'>Subject</label>
                <input
                  type='text'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  className='w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/20 focus:border-primary focus:outline-none transition-colors'
                  placeholder='Project Inquiry'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-secondary'>Message</label>
                <textarea
                  rows='4'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/20 focus:border-primary focus:outline-none transition-colors'
                  placeholder='Tell me about your project...'
                ></textarea>
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full py-4 bg-primary text-bg-primary font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? (
                  <Loader className='w-5 h-5 animate-spin' />
                ) : (
                  <Send size={18} />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
