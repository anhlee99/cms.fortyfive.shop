import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { requireSession } from '@/lib/auth'

export default async function Page() {
    const { user } = await requireSession()

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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="tw-hidden md:tw-block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="tw-hidden md:tw-block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
   
      </SidebarInset>
      </SidebarProvider>
    )
}