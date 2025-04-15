"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Loader2 } from "lucide-react"
import { organization, useListOrganizations, useSession } from "@/lib/auth-client"
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { ActiveOrganization } from "@/lib/auth-types"

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar()
  const organizations = useListOrganizations()
  const { data: session } = useSession()
  const [activeOrg, setActiveOrg] = useState<ActiveOrganization | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  useEffect(() => {
    // Set initial active organization
    if (organizations.data && organizations.data.length > 0) {
      const firstOrg = organizations.data[0]
      setActiveOrg({
        members: [],
        invitations: [],
        ...firstOrg,
      })
    }
  }, [organizations.data])

  if (!session) {
    return null
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {activeOrg?.logo ? (
                    <Image
                      src={activeOrg.logo}
                      alt={activeOrg.name}
                      width={16}
                      height={16}
                      className="rounded-sm"
                    />
                  ) : (
                    <span className="text-lg font-semibold">
                      {(activeOrg?.name || "P").charAt(0)}
                    </span>
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeOrg?.name || "Personal"}
                  </span>
                  <span className="truncate text-xs">
                    {activeOrg?.members?.length || 1} members
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizations
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={async () => {
                  organization.setActive({ organizationId: null })
                  setActiveOrg(null)
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  P
                </div>
                Personal
                <DropdownMenuShortcut>⌘0</DropdownMenuShortcut>
              </DropdownMenuItem>
              {organizations.data?.map((org, index) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={async () => {
                    if (org.id === activeOrg?.id) return
                    // Set optimistic state first
                    setActiveOrg({
                      members: [],
                      invitations: [],
                      ...org,
                    })
                    // Then make the actual API call
                    const { data } = await organization.setActive({
                      organizationId: org.id,
                    })
                    setActiveOrg(data)
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {org.logo ? (
                      <Image
                        src={org.logo}
                        alt={org.name}
                        width={16}
                        height={16}
                        className="rounded-sm"
                      />
                    ) : (
                      org.name.charAt(0)
                    )}
                  </div>
                  {org.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setCreateDialogOpen(true)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">New Organization</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          <CreateOrganizationForm onSuccess={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

function CreateOrganizationForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSlugEdited, setIsSlugEdited] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)

  useEffect(() => {
    if (!isSlugEdited) {
      const generatedSlug = name.trim().toLowerCase().replace(/\s+/g, "-")
      setSlug(generatedSlug)
    }
  }, [name, isSlugEdited])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Organization Name</Label>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Organization Slug</Label>
          <Input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setIsSlugEdited(true)
            }}
            placeholder="Slug"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Logo</Label>
          <Input type="file" accept="image/*" onChange={handleLogoChange} />
          {logo && (
            <div className="mt-2">
              <Image
                src={logo}
                alt="Logo preview"
                className="w-16 h-16 object-cover"
                width={64}
                height={64}
              />
            </div>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={loading}
          onClick={async () => {
            setLoading(true)
            await organization.create(
              {
                name: name,
                slug: slug,
                logo: logo || undefined,
              },
              {
                onResponse: () => {
                  setLoading(false)
                },
                onSuccess: () => {
                  toast.success("Organization created successfully")
                  onSuccess()
                },
                onError: (error) => {
                  toast.error(error.error.message)
                  setLoading(false)
                },
              },
            )
          }}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Create"}
        </Button>
      </DialogFooter>
    </>
  )
} 