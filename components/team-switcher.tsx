"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="tw-data-[state=open]:tw-bg-sidebar-accent tw-data-[state=open]:tw-text-sidebar-accent-foreground"
            >
              <div className="tw-bg-sidebar-primary tw-text-sidebar-primary-foreground tw-flex tw-aspect-square tw-size-8 tw-items-center tw-justify-center tw-rounded-lg">
                <activeTeam.logo className="tw-size-4" />
              </div>
              <div className="tw-grid tw-flex-1 tw-text-left tw-text-sm tw-leading-tight">
                <span className="tw-truncate tw-font-medium">{activeTeam.name}</span>
                <span className="tw-truncate tw-text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="tw-ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="tw-w-(--radix-dropdown-menu-trigger-width) tw-min-w-56 tw-rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="tw-text-muted-foreground tw-text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="tw-gap-2 tw-p-2"
              >
                <div className="tw-flex tw-size-6 tw-items-center tw-justify-center tw-rounded-md tw-border">
                  <team.logo className="tw-size-3.5 tw-shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="tw-gap-2 tw-p-2">
              <div className="tw-flex tw-size-6 tw-items-center tw-justify-center tw-rounded-md tw-border tw-bg-transparent">
                <Plus className="tw-size-4" />
              </div>
              <div className="tw-text-muted-foreground tw-font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
