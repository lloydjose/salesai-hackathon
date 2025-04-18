"use client"

import * as React from "react"
import {
  Bot,
  Send,
  Settings2,
  SquareTerminal,
  Workflow,
  CreditCard,
} from "lucide-react"

import { NavMain } from "@/components/shared/nav-main"
import { NavSecondary } from "@/components/shared/nav-secondary"
import { NavUser } from "@/components/shared/nav-user"
import { OrganizationSwitcher } from "@/components/shared/organization-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

const data = {
  platform: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
  ],
  research: [
    {
      title: "Prospect Research",
      url: "/dashboard/prospect-research",
      icon: Bot,
    },
    {
      title: "Pre Call Planner",
      url: "/dashboard/pre-call-planner",
      icon: Bot,
    }
  ],
  ai: [
    {
      title: "Cold Call Simulator",
      url: "/dashboard/realtime-simulator",
      icon: Bot,
    },
    {
      title: "Conversation Intelligence",
      url: "/dashboard/conversation-intelligence",
      icon: Bot,
    },
    {
      title: "Cold Email & Follow-ups",
      url: "/dashboard/cold-emails",
      icon: Workflow,
    }
  ],
  deals: [
    {
      title: "Playbook Builder",
      url: "/dashboard",
      icon: Workflow,
    },
  ],
  account: [
    {
      title: "Settings",
      url: "/dashboard/account/settings",
      icon: Settings2,
    },
    {
      title: "Billing",
      url: "/dashboard/account/billing",
      icon: CreditCard,
    },
  ],
  navSecondary: [
    {
      title: "Suggest Features",
      url: "/",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.platform} groupLabel="Platform" />
        <NavMain items={data.research} groupLabel="Research" />
        <NavMain items={data.ai} groupLabel="AI Tools" />
        <NavMain items={data.deals} groupLabel="Deals Intelligence" />
        <NavMain items={data.account} groupLabel="Account" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
