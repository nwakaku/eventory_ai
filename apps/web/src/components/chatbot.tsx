import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useGetAllProducts } from "@/hooks/useProducts"
import { useGetAllTransactions } from "@/hooks/useTransactions"
import { useGetAllSuppliers } from "@/hooks/useSuppliers"
import { GoogleGenAI } from "@google/genai"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

type InsightType = "inventory" | "sales" | "products" | "alerts" | "summary"

const quickInsights: { label: string; type: InsightType }[] = [
  { label: "Inventory Overview", type: "inventory" },
  { label: "Sales Summary", type: "sales" },
  { label: "Top Products", type: "products" },
  { label: "Low Stock Alerts", type: "alerts" },
  { label: "Daily Summary", type: "summary" },
]

const formatNGN = (amount: number): string => {
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`
}

function renderMessage(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

const genAI = new GoogleGenAI({ apiKey: "AIzaSyArwFi-0aFC_QHyNckjMMlJ_ILiLnFltI0" })

const generateAIResponse = async (
  userMessage: string,
  context: {
    products: any[]
    transactions: any[]
    suppliers: any[]
  }
): Promise<string> => {
  const { products, transactions, suppliers } = context

  const inventorySummary = products
    ? `Total products: ${products.length}\n${products
        .slice(0, 10)
        .map(
          (p: any) =>
            `- ${p.name}: stock=${p.stock_on_hand || 0}, price=${formatNGN(p.unit_price || 0)}`
        )
        .join("\n")}`
    : "No products data available"

  const transactionsSummary = transactions
    ? `Recent transactions: ${transactions.length}\nTotal value: ${formatNGN(
        transactions.reduce((sum: number, t: any) => sum + (t.total || 0), 0)
      )}`
    : "No transactions data available"

  const suppliersSummary = suppliers
    ? `Total suppliers: ${suppliers.length}`
    : "No suppliers data available"

  const prompt = `You are an AI assistant for Easiventory, an inventory management system.

Current data context:
- Products:\n${inventorySummary}
- Transactions:\n${transactionsSummary}
- Suppliers: ${suppliersSummary}

User question: ${userMessage}

Instructions:
1. Answer questions about inventory, products, sales, suppliers, stock levels, and business insights
2. Use the data provided above to give accurate, specific answers with real numbers
3. Format your response with emojis for better readability (📊 for data, 💰 for money, 📦 for products, ⚠️ for alerts, etc.)
4. Be concise but informative
5. If asked about specific products or data, reference the actual numbers from the context
6. If you don't have enough information to answer, say so

Respond directly with your answer:`

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    })
    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      response.text ||
      "I apologize, but I couldn't generate a response. Please try again."
    return text
  } catch (error) {
    console.error("Gemini API error:", error)
    return "I'm experiencing some technical difficulties. Please try again in a moment."
  }
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI-powered inventory assistant. Ask me anything about your products, sales, stock levels, or get insights from your data. I can analyze trends, suggest reorder points, and help you make better business decisions!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: products } = useGetAllProducts()
  const { data: transactions } = useGetAllTransactions()
  const { data: suppliers } = useGetAllSuppliers()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateInsight = (type: InsightType): string => {
    if (!products || !transactions)
      return "I'm still loading your data. Please wait a moment..."

    switch (type) {
      case "inventory": {
        const totalValue = products.reduce(
          (sum, p) => sum + (p.stock_on_hand || 0) * (p.unit_price || 0),
          0
        )
        const lowStock = products.filter(
          (p) => (p.stock_on_hand || 0) <= (p.reorder_point || 0)
        ).length
        const outOfStock = products.filter(
          (p) => (p.stock_on_hand || 0) === 0
        ).length
        const categories = [
          ...new Set(products.map((p) => p.category).filter(Boolean)),
        ]
        return `📊 **Inventory Overview**\n\n• Total Products: ${products.length}\n• Total Inventory Value: ${formatNGN(totalValue)}\n• Low Stock Items: ${lowStock}\n• Out of Stock: ${outOfStock}\n• Categories: ${categories.length}`
      }
      case "sales": {
        const today = new Date().toDateString()
        const todayTransactions = transactions.filter(
          (t) => new Date(t.created_at || "").toDateString() === today
        )
        const todayRevenue = todayTransactions.reduce(
          (sum, t) => sum + (t.total || 0),
          0
        )
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        const weekTransactions = transactions.filter(
          (t) => t.created_at && new Date(t.created_at) >= weekAgo
        )
        const weekRevenue = weekTransactions.reduce(
          (sum, t) => sum + (t.total || 0),
          0
        )
        return `💰 **Sales Summary**\n\n• Today's Sales: ${todayTransactions.length} transactions\n• Today's Revenue: ${formatNGN(todayRevenue)}\n• This Week: ${weekTransactions.length} transactions\n• Weekly Revenue: ${formatNGN(weekRevenue)}`
      }
      case "products": {
        const topProducts = products
          .sort((a, b) => (b.stock_on_hand || 0) - (a.stock_on_hand || 0))
          .slice(0, 5)
        return `🏆 **Top Products by Stock**\n\n${topProducts.map((p, i) => `${i + 1}. ${p.name} - ${p.stock_on_hand} units`).join("\n")}`
      }
      case "alerts": {
        const lowStock = products.filter(
          (p) =>
            (p.stock_on_hand || 0) <= (p.reorder_point || 0) &&
            (p.stock_on_hand || 0) > 0
        ).length
        const outOfStock = products.filter(
          (p) => (p.stock_on_hand || 0) === 0
        ).length
        const expiringSoon = products.filter((p) => {
          if (!p.expiry_date) return false
          const days = Math.ceil(
            (new Date(p.expiry_date).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
          return days <= 7 && days > 0
        }).length
        return `⚠️ **Stock Alerts**\n\n• **Low Stock**: ${lowStock} items\n• **Out of Stock**: ${outOfStock} items\n• **Expiring Soon**: ${expiringSoon} items`
      }
      case "summary": {
        const totalValue = products.reduce(
          (sum, p) => sum + (p.stock_on_hand || 0) * (p.unit_price || 0),
          0
        )
        const today = new Date().toDateString()
        const todayTransactions = transactions.filter(
          (t) => new Date(t.created_at || "").toDateString() === today
        )
        const todayRevenue = todayTransactions.reduce(
          (sum, t) => sum + (t.total || 0),
          0
        )
        const lowStock = products.filter(
          (p) => (p.stock_on_hand || 0) <= (p.reorder_point || 0)
        ).length
        return `📋 **Daily Summary** - ${new Date().toLocaleDateString()}\n\n• Products: ${products.length} (${lowStock} need attention)\n• Today's Sales: ${todayTransactions.length} transactions\n• Today's Revenue: ${formatNGN(todayRevenue)}\n• Inventory Value: ${formatNGN(totalValue)}`
      }
      default:
        return "I can help you with inventory, sales, products, alerts, or summary. What would you like to know?"
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const lowerInput = input.toLowerCase()

      let response = ""

      if (lowerInput.includes("inventory") || lowerInput.includes("stock")) {
        response = generateInsight("inventory")
      } else if (
        lowerInput.includes("sales") ||
        lowerInput.includes("revenue") ||
        lowerInput.includes("money") ||
        lowerInput.includes("transactions")
      ) {
        response = generateInsight("sales")
      } else if (lowerInput.includes("product") || lowerInput.includes("top")) {
        response = generateInsight("products")
      } else if (
        lowerInput.includes("alert") ||
        lowerInput.includes("low") ||
        lowerInput.includes("expir")
      ) {
        response = generateInsight("alerts")
      } else if (
        lowerInput.includes("summary") ||
        lowerInput.includes("overview") ||
        lowerInput.includes("dashboard")
      ) {
        response = generateInsight("summary")
      } else if (lowerInput.includes("supplier")) {
        response = `🏢 **Suppliers**\n\nYou have ${suppliers?.length || 0} supplier(s).`
      } else {
        response = await generateAIResponse(input, {
          products: products || [],
          transactions: transactions || [],
          suppliers: suppliers || [],
        })
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickInsight = (type: InsightType) => {
    const insight = generateInsight(type)
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Show me ${type}`,
      timestamp: new Date(),
    }
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: insight,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage, assistantMessage])
  }

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-primary shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90"
        >
          <img
            src="https://thumbs.dreamstime.com/b/virtual-assistant-portrait-happy-black-man-call-center-consulting-talking-customer-services-communication-friendly-smile-277939748.jpg"
            alt="Chat"
            className="h-6 w-6 rounded-full object-cover"
          />
        </Button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-6 bottom-20 z-50 flex h-[400px] w-80 animate-in flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl duration-300 fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary to-green-600 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    AI Inventory Assistant
                  </h3>
                  <p className="text-xs text-white/70">Powered by Gemini AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted text-foreground"}`}
                  >
                    {msg.role === "assistant" && (
                      <Bot className="mr-2 inline-block h-4 w-4 text-primary" />
                    )}
                    <span className="whitespace-pre-wrap">{renderMessage(msg.content)}</span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border bg-muted/30 px-3 py-2">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {quickInsights.map((insight) => (
                  <button
                    key={insight.type}
                    onClick={() => handleQuickInsight(insight.type)}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary transition-colors hover:bg-primary/20"
                  >
                    {insight.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your inventory..."
                  className="h-10 flex-1 rounded-full border border-input bg-background px-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
