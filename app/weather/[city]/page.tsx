import { redirect } from "next/navigation"

interface WeatherDetailPageProps {
  params: {
    city: string
  }
}

export default function WeatherDetailPage({ params }: WeatherDetailPageProps) {
  const { city } = params
  const decodedCity = decodeURIComponent(city)

  // Redirect to wttr.in for the city
  redirect(`https://wttr.in/${encodeURIComponent(decodedCity)}`)
}

