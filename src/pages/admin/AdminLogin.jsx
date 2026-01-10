import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, AlertCircle, Loader } from 'lucide-react';

const AdminLogin = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading } = useAuth();
    const [error, setError] = useState(null);
    const [manualToken, setManualToken] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Auto-login if token is in URL
    useEffect(() => {
        if (token && !isAuthenticated && !isLoading) {
            handleLogin(token);
        }
    }, [token, isAuthenticated, isLoading]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (tokenToUse) => {
        setIsLoggingIn(true);
        setError(null);

        const result = await login(tokenToUse);

        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.error || 'Invalid token. Please try again.');
        }

        setIsLoggingIn(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (manualToken.trim()) {
            handleLogin(manualToken.trim());
        }
    };

    if (isLoading || isLoggingIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-500">Authenticating...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Admin Access
                        </h1>
                        <p className="text-gray-500">
                            Enter your admin token to continue
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Admin Token
                            </label>
                            <input
                                type="password"
                                value={manualToken}
                                onChange={(e) => setManualToken(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter your secret token"
                                autoComplete="off"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!manualToken.trim()}
                            className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-400 text-center">
                            💡 Tip: You can also login directly via URL:<br />
                            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-2 inline-block">
                                /admin/YOUR-TOKEN-HERE
                            </code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
