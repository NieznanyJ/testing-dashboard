import { TestProject } from '@/types/test-project';

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
