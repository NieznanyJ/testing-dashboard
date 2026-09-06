'use client';

import { useState } from 'react';
import { ExternalLink, ImageIcon, Play, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { artifactUrl, traceViewerUrl } from '@/lib/artifact-urls';
import type { TestArtifact } from '@/types/test-result';

export default function RunArtifact({
  projectId,
  runId,
  artifact,
}: {
  projectId: string;
  runId: string;
  artifact: TestArtifact;
}) {
  const [failed, setFailed] = useState(false);
  const url = artifactUrl(projectId, runId, artifact);
  if (artifact.type === 'screenshot') {
    return (
      <Dialog onOpenChange={() => setFailed(false)}>
        <DialogTrigger render={<Button variant="outline" size="sm" />}>
          <ImageIcon /> {artifact.name}
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-5xl">
          <DialogTitle>{artifact.name}</DialogTitle>
          <DialogDescription>Screenshot from this test run.</DialogDescription>
          {failed ? (
            <p role="alert">Screenshot is unavailable. The file may have been removed.</p>
          ) : (
            // Screenshots retain their original dimensions and are served by the run API.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={artifact.name}
              onError={() => setFailed(true)}
              className="max-h-[70vh] w-full object-contain"
            />
          )}
          <a href={url} target="_blank" rel="noreferrer" className="text-sm underline">
            Open original screenshot
          </a>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Button
      variant="outline"
      size="sm"
      render={
        <a
          href={artifact.type === 'trace' ? traceViewerUrl(url) : url}
          target="_blank"
          rel="noreferrer"
        />
      }
    >
      {artifact.type === 'trace' ? <Play /> : <Video />}
      {artifact.name} <ExternalLink />
    </Button>
  );
}
