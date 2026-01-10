import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import Background from '../components/Background';

const Unauthorized = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative font-display text-base transition-colors duration-500">
            <Background />
            <Navbar />
            
            <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
                <div className="max-w-md w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-red-200 dark:border-red-900 p-8 shadow-2xl text-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {t('error.unauthorized.title')}
                    </h1>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        {t('error.unauthorized.description')}
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium cursor-pointer"
                    >
                        <Home size={20} />
                        {t('error.common.backToHome')}
                    </button>
                    
                    <p className="mt-6 text-xs text-gray-400">
                        Error Code: 403 Forbidden
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
