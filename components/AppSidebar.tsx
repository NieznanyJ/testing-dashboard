'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrentProject, useProjectsStore } from '@/stores/project-store'
import { ChevronDown, Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProjects } from '@/lib/projects'

type SidebarAction = {
    label: string
    href: string
}

type SidebarSection =
    | {
        type: 'dropdown'
        label: string
        items: string[]
        selectedItem: string
        onSelect: (item: string) => void
        footerAction?: SidebarAction
    }
    | {
        type: 'list'
        label: string
        items: string[]
        selectedItem?: string
        onSelect: (item: string) => void
        footerAction?: SidebarAction
    }

function SidebarSection(section: SidebarSection) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>

            {section.type === 'dropdown' ? (
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={<SidebarMenuButton className="cursor-pointer" />}
                            >
                                {section.selectedItem || 'Select project'}
                                <ChevronDown className="ml-auto" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="flex flex-col gap-1">
                                {section.items.map((item) => (
                                    <DropdownMenuItem
                                        key={item}
                                        onClick={() => section.onSelect(item)}
                                        className="cursor-pointer"
                                    >
                                        {item}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            ) : (
                <SidebarMenu>
                    {section.items.map((item) => (
                        <SidebarMenuItem key={item}>
                            <SidebarMenuButton
                                isActive={section.selectedItem === item}
                                onClick={() => section.onSelect(item)}
                                className="cursor-pointer"
                            >
                                {item}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            )}

            {section.footerAction && (
                <SidebarMenu className="mt-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={<Link href={section.footerAction.href} />}
                            className="cursor-pointer text-muted-foreground"
                        >
                            <Plus />
                            <span>{section.footerAction.label}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            )}
        </SidebarGroup>
    )
}

export default function AppSidebar() {
    const router = useRouter();
    const { projects, setProjects } = useProjectsStore();

    // Prefer the project from the URL so the selection survives a page refresh.
    const { projectId } = useParams<{ projectId?: string }>()
    const storedProject = useCurrentProject()
    const currentProject = projects.find((project) => project.id === projectId) ?? storedProject
    const setCurrentProject = useProjectsStore(
        (state) => state.setCurrentProject,
    )
    const [selectedSetting, setSelectedSetting] = useState('General')


    useEffect(() => {
        const loadProjects = async () => {
            const projects = await getProjects()
            setProjects(projects)
        }

        loadProjects()
    }, [setProjects])


    const sections: SidebarSection[] = [
        {
            type: 'dropdown',
            label: 'Projects',
            items: projects.map((project) => project.name),
            selectedItem: currentProject?.name ?? '',
            onSelect: (projectName) => {
                const project = projects.find(
                    ({ name }) => name === projectName,
                )

                if (project) {
                    setCurrentProject(project.id)
                    router.push(`/projects/${project.id}/runs`)
                }
            },
            footerAction: {
                label: 'Create new project',
                href: '/projects/new',
            },
        },
        {
            type: 'list',
            label: 'Settings',
            items: ['General', 'Preferences'],
            selectedItem: selectedSetting,
            onSelect: setSelectedSetting,
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader />

            <SidebarContent>
                {sections.map((section) => (
                    <SidebarSection key={section.label} {...section} />
                ))}
            </SidebarContent>
        </Sidebar>
    )
}
