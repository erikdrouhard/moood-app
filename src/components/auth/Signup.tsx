import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

interface Props {
  onSignup: (token: string) => void;
}

export default function Signup({ onSignup }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      onSignup(data.token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-10 max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <Input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
