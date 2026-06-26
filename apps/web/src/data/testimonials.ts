import { Star } from "lucide-react"

export interface Testimonial {
  id: number
  quote: string
  name: string
  role: string
  company: string
  avatar: string
  rating: number
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "Easiventory completely transformed how we manage our inventory. We went from spending hours on spreadsheets every week to having real-time visibility of our entire operation. The implementation was incredibly smooth, and the support team has been fantastic.",
    name: "Evans Agunna",
    role: "Sales Director",
    company: "Blessed Pharmacy",
    avatar:
      "https://mockmind-api.uifaces.co/content/human/209.jpg",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "Since adopting Easiventory, our stockouts have dropped by 80%. The low stock alerts and automated reorder suggestions are game-changers for a fast-paced retail operation like ours.",
    name: "Chioma Okafor",
    role: "Operations Manager",
    company: "FreshMart NG",
    avatar:
      "https://mockmind-api.uifaces.co/content/human/167.jpg",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "Managing multiple warehouse locations used to be a nightmare. Easiventory gave us a single pane of glass across all our sites. The real-time sync means we always know exactly what we have and where it is.",
    name: "Tunde Balogun",
    role: "CEO",
    company: "Lagos Distributors",
    avatar:
      "https://mockmind-api.uifaces.co/content/human/159.jpg",
    rating: 5,
  },
  {
    id: 4,
    quote:
      "The reporting and analytics alone are worth it. We can now track sales velocity, monitor category performance, and make data-driven purchasing decisions. Our profit margins have improved significantly.",
    name: "Abu Suleiman",
    role: "Supply Chain Lead",
    company: "Northern Foods Ltd",
    avatar:
      "https://mockmind-api.uifaces.co/content/human/42.jpg",
    rating: 5,
  },
]
