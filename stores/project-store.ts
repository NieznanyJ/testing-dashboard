import { TestProject } from '@/types/test-project';
import { create } from 'zustand';

interface ProjectsStore {
  projects: TestProject[];
  currentProjectId: string | null;
  setProjects: (projects: TestProject[]) => void;
  setCurrentProject: (id: string | null) => void;
  addProject: (project: TestProject) => void;
}

export const useProjectsStore = create<ProjectsStore>()((set) => ({
  projects: [],
  currentProjectId: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (id) => set({ currentProjectId: id }),
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
}));

export const useCurrentProject = () =>
  useProjectsStore((state) =>
    state.projects.find((project) => project.id === state.currentProjectId),
  );
