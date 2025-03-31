import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WeatherDashboard from "@/components/dashboard/weather-dashboard"
import CryptoDashboard from "@/components/dashboard/crypto-dashboard"
import NewsDashboard from "@/components/dashboard/news-dashboard"
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton"
import NotificationsProvider from "@/components/notifications/notifications-provider"
import { Cloud, CreditCard, Newspaper } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-8">
      <NotificationsProvider />

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your real-time dashboard for weather, cryptocurrency, and news updates.</p>
      </div>

      <Tabs defaultValue="weather" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12 rounded-full p-1">
          <TabsTrigger
            value="weather"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Cloud className="mr-2 h-4 w-4" />
            Weather
          </TabsTrigger>
          <TabsTrigger
            value="crypto"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Cryptocurrency
          </TabsTrigger>
          <TabsTrigger
            value="news"
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Newspaper className="mr-2 h-4 w-4" />
            News
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weather" className="space-y-4 animate-in">
          <Suspense fallback={<DashboardSkeleton />}>
            <WeatherDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4 animate-in">
          <Suspense fallback={<DashboardSkeleton />}>
            <CryptoDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="news" className="space-y-4 animate-in">
          <Suspense fallback={<DashboardSkeleton />}>
            <NewsDashboard />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

