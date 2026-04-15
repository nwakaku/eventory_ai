import { useState, useRef, useEffect, useCallback } from "react"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  Loader2,
  GripVertical,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useGetAllProducts } from "@/hooks/useProducts"
import { useGetAllTransactions } from "@/hooks/useTransactions"
import { useGetAllSuppliers } from "@/hooks/useSuppliers"

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

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your inventory assistant. Ask me about products, sales, stock levels, or any insights from your data. I can also generate quick reports for you!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

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

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const lowerInput = input.toLowerCase()
      let response = ""
      if (lowerInput.includes("inventory") || lowerInput.includes("stock"))
        response = generateInsight("inventory")
      else if (
        lowerInput.includes("sales") ||
        lowerInput.includes("revenue") ||
        lowerInput.includes("money")
      )
        response = generateInsight("sales")
      else if (lowerInput.includes("product") || lowerInput.includes("top"))
        response = generateInsight("products")
      else if (
        lowerInput.includes("alert") ||
        lowerInput.includes("low") ||
        lowerInput.includes("expir")
      )
        response = generateInsight("alerts")
      else if (
        lowerInput.includes("summary") ||
        lowerInput.includes("overview") ||
        lowerInput.includes("dashboard")
      )
        response = generateInsight("summary")
      else if (lowerInput.includes("supplier"))
        response = `🏢 **Suppliers**\n\nYou have ${suppliers?.length || 0} supplier(s).`
      else
        response =
          "I can help you with inventory, sales, products, alerts, or summary. What would you like to know?"

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 800)
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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
    },
    [position]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        })
      }
    },
    [isDragging]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <>
      <div
        className={`fixed bottom-6 transition-all duration-200 ${isDragging ? "cursor-grabbing" : ""}`}
        style={{
          right: `${position.x}px`,
          bottom: `${position.y}px`,
          zIndex: 9999,
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          onMouseDown={handleMouseDown}
          className="h-14 w-14 rounded-full bg-primary shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">
              AI
            </span>
          </div>
          <GripVertical className="absolute top-1 left-1 h-3 w-3 text-white/50 opacity-0 hover:opacity-100" />
        </Button>
      </div>

      {isOpen && (
        <div
          className="fixed flex h-[500px] w-96 animate-in flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl duration-300 fade-in slide-in-from-bottom-4"
          style={{
            right: `calc(24px + ${position.x}px)`,
            bottom: `calc(90px + ${position.y}px)`,
            zIndex: 10000,
          }}
        >
          <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary to-green-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Inventory Assistant
                </h3>
                <p className="text-xs text-white/70">AI-powered insights</p>
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
                  <span className="whitespace-pre-wrap">{msg.content}</span>
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
      )}
    </>
  )
}
