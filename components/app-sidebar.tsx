"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  SquareTerminal,
  Apple,
  Layers,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { User } from "@/types/user"
import { usePathname } from "next/navigation";
import { NavItem } from "@/components/nav-main";
// This is sample data.


const data = {
  teams: [
    {
      name: "Shop 1",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboards",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Đơn hàng",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Danh sách",
          url: "#",
        },
        {
          title: "Tạo mới",
          url: "#",
        },
      ],
    },
    {
      title: "Khách hàng",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Danh sách",
          url: "/customers",
        },
        {
          title: "Tạo mới",
          url: "/customers/new",
        },
        {
          title: "Tag khách hàng",
          url: "/customers/tags",
        },
      ],
    },
    {
      title: "Sản phẩm",
      url: "#",
      icon: Apple,
      items: [
        {
          title: "Danh sách",
          url: "#",
        },
        {
          title: "Tạo mới",
          url: "#",
        },
      ],
    },
    {
      title: "Kho hàng",
      url: "#",
      icon: Layers,
      items: [
        {
          title: "Danh sách",
          url: "#",
        },
        {
          title: "Tạo mới",
          url: "#",
        },
      ],
    },
    {
      title: "Cửa hàng",
      url: "#",
      icon: Layers,
      items: [
        {
          title: "Danh sách",
          url: "/shops",
        },
        {
          title: "Tạo mới",
          url: "/shops/new",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User; // make required if you want
};


// add user prop to AppSidebar props and pass it to TeamSwitcher
export function AppSidebar({ user, ...props }: AppSidebarProps) {
    const pathname = usePathname();
    const navItems: NavItem[] = React.useMemo(
        () =>
          data.navMain.map((item) => {
            const active =
              normalize(pathname) === normalize(item.url) ||
              item.items?.some((s) => pathStartsWith(normalize(pathname), normalize(s.url)));
            
              if (active) {
                // If the item is active, set all its sub-items to inactive
                item.items = item.items?.map((subItem) => ({
                  ...subItem,
                  isActive: false,
                }));
              }
            return { ...item, isActive: active };
          }),
        [pathname]
      );

    return (
        <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems} />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
        </Sidebar>
    )
}

function normalize(p: string) {
  return p.replace(/\/+$/, "") || "/"; // remove trailing slash
}
function pathStartsWith(path: string, base: string) {
  return path === base || path.startsWith(base + "/");
}