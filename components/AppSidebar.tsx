'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentProject, useProjectsStore } from '@/stores/project-store';
import {
  Activity,
  Check,
  ChevronDown,
  CircleAlert,
  FolderGit2,
  GitBranch,
  LayoutDashboard,
  ListChecks,
  LoaderCircle,
  Plus,
  TestTubeDiagonal,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getProjects } from '@/lib/projects';

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { projects, setProjects, setCurrentProject } = useProjectsStore();
  const currentProject = useCurrentProject();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const loadedProjects = await getProjects();
        setProjects(loadedProjects);
        setHasError(false);

        const projectIdFromPath = pathname.match(/^\/projects\/([^/]+)/)?.[1];
        const projectFromPath = loadedProjects.find(({ id }) => id === projectIdFromPath);

        if (projectFromPath) {
          setCurrentProject(projectFromPath.id);
        } else if (loadedProjects[0]) {
          setCurrentProject(loadedProjects[0].id);
        }
      } catch (error) {
        console.error('Could not load projects:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProjects();
    // Load once on mount; navigation only updates the active styles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setProjects]);

  function selectProject(projectId: string) {
    setCurrentProject(projectId);
    router.push(`/projects/${projectId}/runs`);
  }

  const projectBasePath = currentProject ? `/projects/${currentProject.id}` : null;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="gap-3 border-b border-sidebar-border/70 p-3">
        <Link
          href="/"
          className="flex h-10 items-center gap-3 rounded-lg px-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
            <TestTubeDiagonal className="size-4" />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-semibold tracking-tight">
              TestOps Cloud
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              Test control center
            </span>
          </span>
        </Link>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="h-14 cursor-pointer rounded-xl border border-sidebar-border bg-sidebar-accent/45 px-2.5 hover:bg-sidebar-accent"
                    tooltip="Switch project"
                  />
                }
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm ring-1 ring-border">
                  {isLoading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : hasError ? (
                    <CircleAlert className="text-destructive" />
                  ) : (
                    <FolderGit2 />
                  )}
                </span>
                <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <span className="block text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                    Project
                  </span>
                  <span className="block truncate font-medium">
                    {isLoading
                      ? 'Loading projects…'
                      : hasError
                        ? 'Could not load'
                        : currentProject?.name || 'Select project'}
                  </span>
                </span>
                <ChevronDown className="ml-auto text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => selectProject(project.id)}
                    className="cursor-pointer gap-3 py-2"
                  >
                    <span className="flex size-7 items-center justify-center rounded-md bg-muted">
                      <FolderGit2 className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{project.name}</span>
                    {project.id === currentProject?.id && <Check />}
                  </DropdownMenuItem>
                ))}
                {projects.length > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  render={<Link href="/projects/new" />}
                  className="cursor-pointer gap-3"
                >
                  <span className="flex size-7 items-center justify-center rounded-md border border-dashed">
                    <Plus className="size-3.5" />
                  </span>
                  Create new project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.14em] uppercase">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/" />}
                isActive={pathname === '/'}
                tooltip="Dashboard"
                className="h-9"
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href={projectBasePath ?? '/projects/new'} />}
                isActive={Boolean(projectBasePath && pathname === projectBasePath)}
                tooltip="Project overview"
                className="h-9"
              >
                <Activity />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <Link href={projectBasePath ? `${projectBasePath}/runs` : '/projects/new'} />
                }
                isActive={Boolean(
                  projectBasePath && pathname.startsWith(`${projectBasePath}/runs`),
                )}
                tooltip="Test runs"
                className="h-9"
              >
                <ListChecks />
                <span>Test runs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/projects/new" />}
                isActive={pathname === '/projects/new'}
                tooltip="New project"
                className="h-9 border border-dashed border-sidebar-border text-muted-foreground hover:border-foreground/20"
              >
                <Plus />
                <span>New project</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-3">
        <div className="rounded-xl bg-sidebar-accent/45 p-3 group-data-[collapsible=icon]:hidden">
          {currentProject ? (
            <>
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px] shadow-emerald-500/15" />
                Ready for test runs
              </div>
              <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                <p className="flex items-center gap-2 truncate">
                  <FolderGit2 className="size-3 shrink-0" />
                  <span className="truncate">{currentProject.repo}</span>
                </p>
                <p className="flex items-center gap-2 truncate">
                  <GitBranch className="size-3 shrink-0" />
                  <span className="truncate">{currentProject.defaultBranch}</span>
                </p>
              </div>
            </>
          ) : (
            <p className="text-xs leading-5 text-muted-foreground">
              Create a project to start monitoring your test runs.
            </p>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
