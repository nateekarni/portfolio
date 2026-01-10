import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, AlertCircle, Loader, Mail, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading } = useAuth();
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password');
            return;
        }

        setIsLoggingIn(true);
        setError(null);

        const result = await login(email.trim(), password);

        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.error || 'Invalid credentials. Please try again.');
        }

        setIsLoggingIn(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-text-secondary">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
            <div className="w-full max-w-md">
                <div className="bg-bg-surface rounded-2xl shadow-xl border border-border p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary mb-2">
                            Admin Login
                        </h1>
                        <p className="text-text-secondary">
                            Enter your credentials to access the admin panel
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-text-secondary" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input !pl-12 pr-4 bg-bg-secondary border-border text-text-primary placeholder:text-text-secondary focus:border-primary focus:ring-primary/20"
                                    placeholder="admin@example.com"
                                    autoComplete="email"
                                    disabled={isLoggingIn}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-text-secondary" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input !pl-12 pr-12 bg-bg-secondary border-border text-text-primary placeholder:text-text-secondary focus:border-primary focus:ring-primary/20"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    disabled={isLoggingIn}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-text-secondary hover:text-text-primary" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-text-secondary hover:text-text-primary" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoggingIn || !email.trim() || !password.trim()}
                            className="cursor-pointer w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isLoggingIn ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border">
                        <p className="text-xs text-text-secondary text-center">
                            🔒 Secured with Supabase Authentication
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

