import type { NewsArticle } from "@/lib/types"

// Mock data for news
const newsTitles = [
  "Bitcoin Surges to New All-Time High",
  "Ethereum 2.0 Upgrade: What You Need to Know",
  "Regulatory Challenges Facing Cryptocurrency Markets",
  "DeFi Revolution: The Future of Finance",
  "NFTs Continue to Disrupt the Art World",
  "Central Banks Explore Digital Currencies",
  "Crypto Mining and Environmental Concerns",
  "Blockchain Technology Beyond Cryptocurrency",
  "Major Companies Add Bitcoin to Balance Sheets",
  "Crypto Security: Best Practices for Investors",
]

const newsSources = ["CryptoNews", "BlockchainTimes", "CoinDesk", "Decrypt", "CoinTelegraph"]

// Generate random news data
function generateNewsData(): NewsArticle[] {
  const shuffledTitles = [...newsTitles].sort(() => 0.5 - Math.random())
  const topFiveTitles = shuffledTitles.slice(0, 5)

  return topFiveTitles.map((title, index) => {
    const source = newsSources[Math.floor(Math.random() * newsSources.length)]
    const daysAgo = Math.floor(Math.random() * 7) // 0 to 6 days ago
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    return {
      id: `news-${index + 1}`,
      title,
      description: `This is a summary of the article about ${title.toLowerCase()}. The article discusses recent developments, market trends, and expert opinions on this topic.`,
      url: "#",
      source,
      publishedAt: date.toISOString(),
    }
  })
}

// Fetch news data
export async function fetchNewsData(): Promise<NewsArticle[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return generateNewsData()
}

