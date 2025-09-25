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
        <div className="tw-flex tw-flex-1 tw-flex-col tw-gap-4 tw-p-4 tw-pt-0">
          <div className="tw-grid tw-auto-rows-min tw-gap-4 md:tw-grid-cols-3">
            <div className="tw-aspect-video tw-rounded-xl tw-bg-muted/50" />
            <div className="tw-aspect-video tw-rounded-xl tw-bg-muted/50" />
            <div className="tw-aspect-video tw-rounded-xl tw-bg-muted/50" />
          </div>
          <div className="tw-min-h-[100vh] tw-flex-1 tw-rounded-xl tw-bg-muted/50 md:tw-min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
