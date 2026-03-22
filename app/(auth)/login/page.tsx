'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');

  function validate() {
    const next = { email: '', password: '' };
    if (!email.trim()) next.email = 'Email is required.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return !next.email && !next.password;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setServerError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Sign in</h2>
      <p className="text-sm text-slate-500 mb-6">Welcome back to Todo Platform</p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
        />

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary-600 hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
