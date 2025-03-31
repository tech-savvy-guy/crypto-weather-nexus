"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { fetchNewsData } from "@/lib/redux/slices/newsSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, RefreshCw, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function NewsDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error } = useSelector((state: RootState) => state.news)

  useEffect(() => {
    dispatch(fetchNewsData())

    // Refresh data every 60 seconds
    const interval = setInterval(() => {
      dispatch(fetchNewsData())
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch])

  if (loading === "pending" && !data.length) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p className="text-muted-foreground mb-4 text-center">{error}</p>
          <Button onClick={() => dispatch(fetchNewsData())} className="mt-2" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Top Crypto News</h2>
      {data.map((article) => (
        <Card key={article.id} className="overflow-hidden gradient-card hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="font-normal">
                {article.source}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {new Date(article.publishedAt).toLocaleDateString()}
              </div>
            </div>
            <p className="mb-4 text-muted-foreground">{article.description}</p>
            <Button variant="outline" size="sm" asChild className="group">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Read Full Article
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

