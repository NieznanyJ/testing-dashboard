import { db } from '@/src/prisma/db';
import type { FieldInputTypes } from '@/src/prisma/contract.d';
import type { TestRun } from '@/types/test-run';

export async function getAllProjects() {
  return await db.orm.public.Project.all();
}

export async function getProjectById(id: string) {
  return await db.orm.public.Project.where({ id }).first();
}

export interface CreateProjectInput {
  name: string;
  repo: string;
  defaultBranch: string;
  testCommand: string;
}

export async function createProject(input: CreateProjectInput) {
  return await db.orm.public.Project.create(input);
}

export type CreateRunInput = Omit<TestRun, 'id'> & { id?: string };
export type UpdateRunInput = Partial<Omit<TestRun, 'id' | 'projectId'>>;

function serializeRunFiles(files: TestRun['files']): FieldInputTypes['public']['Run']['files'] {
  // Strip optional undefined properties before writing the JSON column.
  return JSON.parse(JSON.stringify(files)) as FieldInputTypes['public']['Run']['files'];
}

export async function createRun(input: CreateRunInput) {
  return await db.orm.public.Run.create({
    ...input,
    files: serializeRunFiles(input.files),
  });
}

export async function updateRun(id: string, input: UpdateRunInput) {
  const { files, ...fields } = input;
  return await db.orm.public.Run.where({ id }).update({
    ...fields,
    ...(files === undefined ? {} : { files: serializeRunFiles(files) }),
  });
}

export async function getRunsByProjectId(projectId: string): Promise<TestRun[]> {
  const rows = await db.orm.public.Run.where({ projectId })
    .orderBy((run) => run.startedAt.desc())
    .all();
  return rows.map((row) => ({
    ...row,
    finishedAt: row.finishedAt ?? undefined,
    duration: row.duration ?? undefined,
    files: row.files as unknown as TestRun['files'],
  }));
}

export async function getRunById(id: string, projectId?: string): Promise<TestRun | null> {
  const row = await db.orm.public.Run.where({ id, ...(projectId ? { projectId } : {}) }).first();
  if (!row) return null;
  return {
    ...row,
    finishedAt: row.finishedAt ?? undefined,
    duration: row.duration ?? undefined,
    files: row.files as unknown as TestRun['files'],
  };
}
