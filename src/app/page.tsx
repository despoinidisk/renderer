'use client';

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [msg, setMsg] = useState('Waiting for Rust...');
  const [name, setName] = useState('Next.js');

  useEffect(() => {
    const greetUser = async () => {
      try {
        const response = await invoke<string>('greet', { name });
        setMsg(response);
      } catch (error) {
        console.error("Failed to fetch greeting:", error);
      }
    };

    greetUser();
  }, [name]); // Re-runs whenever 'name' changes

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">{msg}</h1>

      <div className="w-64">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name..."
          className="text-center"
        />
      </div>
    </main>
  );
}
