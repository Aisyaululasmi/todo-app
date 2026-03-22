'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  function set(field: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function validate() {
    const next = { name: '', email: '', password: '', confirmPassword: '' };
    if (!fields.name.trim()) next.name = 'Name is required.';
    if (!fields.email.trim()) next.email = 'Email is required.';
    if (!fields.password) {
      next.password = 'Password is required.';
    } else if (fields.password.length < 8) {
      next.password = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(fields.password)) {
      next.password = 'Password must contain at least one uppercase letter.';
    } else if (!/[0-9]/.test(fields.password)) {
      next.password = 'Password must contain at least one number.';
    }
    if (!fields.confirmPassword) next.confirmPassword = 'Please confirm your password.';
    else if (fields.confirmPassword !== fields.password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setServerError('');
    try {
      await register(fields.email, fields.password, fields.name);
      router.push('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Create Account</h2>
      <p className="text-sm text-slate-500 mb-6">Sign up to get started.</p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Name"
          type="text"
          placeholder="John Doe"
          value={fields.name}
          onChange={set('name')}
          error={errors.name}
          disabled={isLoading}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={set('email')}
          error={errors.email}
          disabled={isLoading}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={fields.password}
          onChange={set('password')}
          error={errors.password}
          disabled={isLoading}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={fields.confirmPassword}
          onChange={set('confirmPassword')}
          error={errors.confirmPassword}
          disabled={isLoading}
        />

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
