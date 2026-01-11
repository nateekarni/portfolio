import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { contactItemsAPI, contactAPI } from '../services/api';

const Contact = () => {
  const { t } = useTranslation();
  const [contactItems, setContactItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // Fetch contact items from API
  useEffect(() => {
    const fetchContactItems = async () => {
      try {
        const res = await contactItemsAPI.getAll();
        setContactItems(res.data);
      } catch (error) {
        console.log('Error fetching contact items:', error.message);
      }
    };

    fetchContactItems();
    fetchConfig();
  }, []);

  const [sectionConfig, setSectionConfig] = useState(null);
  const fetchConfig = async () => {
    try {
      const res = await contactAPI.getConfig();
      if (res.data) setSectionConfig(res.data);
    } catch (e) { console.error(e); }
  };

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
    <section id='contact' className='py-24 relative'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid lg:grid-cols-2 gap-12'>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='bg-bg-surface border border-border shadow-lg p-8 rounded-3xl'
          >
            <h2 className='text-4xl md:text-5xl font-bold mb-8'>
              <span className='gradient-text'>{sectionConfig?.title || t('contact.title')}</span>
            </h2>
            <p className='text-xl text-secondary mb-12 leading-relaxed'>
              {sectionConfig?.description || t('contact.description')}
            </p>

            <div className='space-y-8'>
              {contactItems.length === 0 ? (
                <p className="text-secondary italic">Loading contact info...</p>
              ) : (
                contactItems.map((item) => {
                  const Icon = LucideIcons[item.icon] || LucideIcons.HelpCircle;
                  return (
                    <div key={item.id} className='flex items-center gap-6 group'>
                      <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'>
                        <Icon className='w-6 h-6' />
                      </div>
                      <div>
                        <div className='text-sm text-secondary font-medium'>{item.title}</div>
                        <div className='text-xl font-bold break-all'>{item.value}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='bg-bg-surface border border-border shadow-lg p-8 rounded-3xl'
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
                    className='form-input'
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
                    className='form-input'
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
                  className='form-input'
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
                  className='form-input'
                  placeholder='Tell me about your project...'
                ></textarea>
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
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
