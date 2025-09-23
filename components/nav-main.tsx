"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuAction
} from "@/components/ui/sidebar"

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: { title: string; url: string, icon?: LucideIcon, isActive?: boolean }[];
  isActive?: boolean;
};

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = Array.isArray(item.items) && item.items.length > 0;

          return <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="tw-group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                tooltip={item.title} onClick={() => {
                  if (!hasChildren) {
                    window.location.href = item.url;
                  }
                }}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {hasChildren && <ChevronRight className="tw-ml-auto tw-transition-transform tw-duration-200 group-data-[state=open]/collapsible:tw-rotate-90" />}
                </SidebarMenuButton>
                
              </CollapsibleTrigger>

              {hasChildren && (
                <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
              )}
              
            </SidebarMenuItem>
          </Collapsible>
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
