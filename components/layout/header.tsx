"use client"

import type React from "react"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Bell, Clock, X, AlertTriangle, TrendingUp } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { clearNotifications } from "@/lib/redux/slices/notificationsSlice"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Notification } from "@/lib/types"

export default function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const notifications = useSelector((state: RootState) => state.notifications.items)
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setUnreadCount(notifications.length)
  }, [notifications])

  const handleClearNotifications = () => {
    dispatch(clearNotifications())
    setUnreadCount(0)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "price_alert":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "weather_alert":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              CryptoWeather Nexus
            </span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn("relative h-9 w-9 rounded-full transition-all", open && "bg-secondary")}
              >
                <Bell className={cn("h-5 w-5 transition-colors", open && "text-primary")} />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-in"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden" sideOffset={8}>
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={handleClearNotifications}>
                    <X className="h-3.5 w-3.5 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              {notifications.length > 0 ? (
                <ScrollArea className="max-h-[60vh]">
                  {notifications.map((notification: Notification, index: number) => (
                    <NotificationItem
                      key={index}
                      notification={notification}
                      formatTimeAgo={formatTimeAgo}
                      getNotificationIcon={getNotificationIcon}
                    />
                  ))}
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="bg-muted/30 p-3 rounded-full mb-3">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-1">No notifications yet</p>
                  <p className="text-xs text-muted-foreground">We'll notify you when important updates arrive</p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

interface NotificationItemProps {
  notification: Notification
  formatTimeAgo: (timestamp: string) => string
  getNotificationIcon: (type: string) => React.ReactNode
}

function NotificationItem({ notification, formatTimeAgo, getNotificationIcon }: NotificationItemProps) {
  return (
    <DropdownMenuItem className="flex flex-col items-start py-3 px-4 border-b last:border-0 cursor-default focus:bg-secondary/50">
      <div className="flex items-start w-full">
        <div className="bg-secondary/80 p-2 rounded-full mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between w-full mb-1">
            <p className="font-medium text-sm truncate">{notification.title}</p>
            <div className="flex items-center text-xs text-muted-foreground ml-2 whitespace-nowrap">
              <Clock className="h-3 w-3 mr-1" />
              {formatTimeAgo(notification.timestamp)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
        </div>
      </div>
    </DropdownMenuItem>
  )
}

