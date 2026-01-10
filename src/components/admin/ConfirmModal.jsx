import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'danger', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isLoading = false 
}) => {
  
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={24} className="text-red-500" />;
      case 'warning':
        return <AlertCircle size={24} className="text-amber-500" />;
      case 'info':
      default:
        return <Info size={24} className="text-blue-500" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500/10';
      case 'warning':
        return 'bg-amber-500/10';
      case 'info':
      default:
        return 'bg-blue-500/10';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 shadow-red-500/20';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20';
      case 'info':
      default:
        return 'bg-primary hover:bg-primary/90 shadow-primary/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-colors"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-bg-surface border border-white/10 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full ${getIconBg()} flex items-center justify-center`}>
                    {getIcon()}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">{title}</h3>
                </div>
                
                <p className="text-text-secondary mb-8 leading-relaxed ml-16">
                  {message}
                </p>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-text-secondary hover:bg-text-primary/5 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-xl text-white font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${getButtonClass()}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
