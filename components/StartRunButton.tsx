'use client';

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from './ui/button';

export default function StartRunButton({ projectId }: { projectId: string }) {
  const pending = useRef(false);
  const [isStarting, setIsStarting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function startRun() {
    if (pending.current) return;
    pending.current = true;
    setIsStarting(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/runs/start`, {
        method: 'POST',
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? 'Failed to start run');
      }
      setMessage('Test process started. The run will appear when tests begin.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start run');
    } finally {
      pending.current = false;
      setIsStarting(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button size="lg" onClick={startRun} disabled={isStarting}>
        <Play /> {isStarting ? 'Starting...' : 'Start run'}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="max-w-sm text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  );
}
