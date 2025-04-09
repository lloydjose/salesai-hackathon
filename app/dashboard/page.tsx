import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, DollarSign, Clock, ChevronRight } from "lucide-react"

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Overview" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Until Wedding</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">June 15, 2024</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guest Count</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,580</div>
              <p className="text-xs text-muted-foreground">70% of total budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45/82</div>
              <p className="text-xs text-muted-foreground">54% completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your wedding planning progress this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Venue booking confirmed for June 15",
                  "5 new guest RSVPs received",
                  "Catering menu finalized",
                  "Wedding dress fitting scheduled",
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="size-2 rounded-full bg-primary" />
                    <div className="flex-1 text-sm">{activity}</div>
                    <div className="text-xs text-muted-foreground">2d ago</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to do</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "Add new guests",
                "Update budget",
                "Schedule vendor meeting",
                "Create new task",
              ].map((action, i) => (
                <Button key={i} variant="ghost" className="w-full justify-between">
                  {action}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
