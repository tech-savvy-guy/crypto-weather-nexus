import type { NewsArticle } from "@/lib/types"

// Get API key from environment variables
const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY

// NewsData.io API endpoint with API key
const NEWS_API_URL =
  `https://newsdata.io/api/1/latest?apikey=${API_KEY}&q=crypto&language=en&size=5`

// Maximum length for descriptions
const MAX_DESCRIPTION_LENGTH = 150

// Helper function to truncate text
function truncateText(text: string | null, maxLength: number): string {
  if (!text) return "No description available"

  if (text.length <= maxLength) return text

  // Find the last space before the maxLength to avoid cutting words
  const lastSpace = text.substring(0, maxLength).lastIndexOf(" ")
  const truncateIndex = lastSpace > 0 ? lastSpace : maxLength

  return text.substring(0, truncateIndex) + "..."
}

// Fetch news data from NewsData.io API
export async function fetchNewsData(): Promise<{ data: NewsArticle[] | null; error: string | null }> {
  try {
    // For development testing only - uncomment to test error state
    // throw new Error("API Error Test")

    const response = await fetch(NEWS_API_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch news data: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== "success" || !data.results) {
      throw new Error("Invalid response from news API")
    }

    // Map the NewsData.io response to our NewsArticle type
    const articles = data.results
      .map((article: any) => ({
        id: article.article_id,
        title: article.title,
        description: truncateText(article.description || `Latest news about ${article.title}`, MAX_DESCRIPTION_LENGTH),
        url: article.link,
        source: article.source_name,
        publishedAt: article.pubDate,
      }))
      .slice(0, 5) // Ensure we only get 5 articles max

    return { data: articles, error: null }
  } catch (error) {
    console.error("Error fetching news data:", error)
    return {
      data: null,
      error: "Couldn't fetch News. Please try again later.",
    }
  }
}

