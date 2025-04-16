"use client"

import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageHeaderProps {
  title: string
  children?: React.ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-background space-y-2 pb-2 border-b">
      <header className="flex h-16 shrink-0 items-center gap-1 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-1 px-4">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="mr-2 h-2" />
          <PageBreadcrumb title={title} />
        </div>
      </header>
      <div className="flex items-center justify-between px-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {children}
      </div>
    </div>
  )
} 