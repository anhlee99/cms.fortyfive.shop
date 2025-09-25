import { AppSidebar } from "@/components/app-sidebar"
import { BreadcrumbHeader } from "@/components/breadcrumb-header"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { requireAuth } from '@/lib/auth'

export default async function Page() {
    const { user } = await requireAuth()

    return (
      <SidebarProvider>
        <AppSidebar
          user={user}
        />
        <SidebarInset>
        <header className="tw-flex tw-h-16 tw-shrink-0 tw-items-center tw-gap-2 tw-transition-[width,height] tw-ease-linear tw-group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="tw-flex tw-items-center tw-gap-2 tw-px-4">
            <SidebarTrigger className="tw--ml-1" />
            <Separator orientation="vertical" className="tw-mr-2 tw-h-4" />
            <BreadcrumbHeader />
          </div>
        </header>
   
      </SidebarInset>
      </SidebarProvider>
    )
}