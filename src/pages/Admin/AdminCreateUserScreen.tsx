import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Shield, 
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminCreateUserScreen = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create user in Supabase Auth
      // Note: In a real app, you'd use a service role or a backend function to create users without logging out.
      // Here we'll use signUp which might have limitations if email confirmation is on.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Ensure profile is created with the correct role
        // The trigger in Supabase usually handles this, but we can be explicit if needed.
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: role })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile role:', profileError);
          // We don't throw here because the user was already created
        }

        showToast('Usuario creado correctamente', 'success');
        navigate('/admin');
      }
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Error al crear el usuario');
      showToast('Error al crear el usuario', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin')}
            className={`p-2 rounded-xl transition-all ${
              isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Crear <span className="text-primary">Usuario</span>
            </h1>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Registra un nuevo administrador o cliente en el sistema
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-8 ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Email del Usuario
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="usuario@email.com"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all ${
                      isDark 
                        ? 'bg-zinc-800/50 border-zinc-700 text-white focus:border-primary' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-primary'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Contraseña Temporal
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all ${
                      isDark 
                        ? 'bg-zinc-800/50 border-zinc-700 text-white focus:border-primary' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-primary'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Rol del Usuario
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      role === 'user'
                        ? 'border-primary bg-primary/5 text-primary'
                        : isDark ? 'border-zinc-800 bg-zinc-800/50 text-zinc-500' : 'border-zinc-100 bg-zinc-50 text-zinc-500'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-xs">Cliente</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      role === 'admin'
                        ? 'border-primary bg-primary/5 text-primary'
                        : isDark ? 'border-zinc-800 bg-zinc-800/50 text-zinc-500' : 'border-zinc-100 bg-zinc-50 text-zinc-500'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-xs">Admin</span>
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear Usuario
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
