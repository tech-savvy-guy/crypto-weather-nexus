import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCryptoDetails } from "@/lib/api/crypto"
import CryptoDetailView from "@/components/crypto/crypto-detail-view"
import CryptoDetailSkeleton from "@/components/crypto/crypto-detail-skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CryptoDetailPageProps {
  params: {
    id: string
  }
}

export default async function CryptoDetailPage({ params }: CryptoDetailPageProps) {
  const { id } = params

  try {
    const crypto = await getCryptoDetails(id)

    if (!crypto) {
      notFound()
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{crypto.name}</h1>
        </div>

        <Suspense fallback={<CryptoDetailSkeleton />}>
          <CryptoDetailView crypto={crypto} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error fetching crypto details:", error)
    notFound()
  }
}

