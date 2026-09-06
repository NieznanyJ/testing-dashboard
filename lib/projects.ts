import { TestProject } from '@/types/test-project';
import { CreateProjectInput } from './prisma';

export async function getProjects(): Promise<TestProject[]> {
  try {
    const response = await fetch('/api/projects');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
  } catch (e) {
    throw new Error(`Failed to fetch projects -> ${e}`);
  }
}

export async function createProject(createProjectInput: CreateProjectInput) {
  const response = await fetch('/api/projects/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createProjectInput),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to create project (${response.status}): ${body}`);
  }

  return response.json();
}
