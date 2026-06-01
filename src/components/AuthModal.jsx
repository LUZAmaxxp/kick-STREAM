import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setAuthToken } from '../lib/auth';

export default function AuthModal({ open, onClose, onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) { setError('Please enter a valid email.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError('');
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email, password }
        : { email, password, username: email.split('@')[0] };
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || 'Authentication failed'); return; }
      if (data.token) setAuthToken(data.token);
      onAuth({ ...data.user, authToken: data.token });
      onClose();
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-[#F5F3EE] border-2 border-[#1A1A1A] p-8 rounded-none w-full max-w-sm shadow-xl relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-[#1A1A1A] hover:text-[#00A651] text-xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="font-anton text-2xl text-[#1A1A1A] mb-4 uppercase text-center">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="border-2 border-[#1A1A1A] px-4 py-2 font-dmsans text-[#1A1A1A] bg-[#FFF] rounded-none focus:outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              className="border-2 border-[#1A1A1A] px-4 py-2 font-dmsans text-[#1A1A1A] bg-[#FFF] rounded-none focus:outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <div className="text-red-600 text-xs text-center">{error}</div>}
            <button
              type="submit"
              className="bg-[#1A1A1A] text-[#F5F3EE] font-anton text-[15px] tracking-[0.14em] border-0 rounded-none uppercase py-2 mt-2 hover:bg-[#00A651] hover:text-[#F5F3EE] transition"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              className="text-[#00A651] font-dmsans text-xs underline hover:text-[#1A1A1A]"
              onClick={() => setIsLogin(v => !v)}
              type="button"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
