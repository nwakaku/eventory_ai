declare module "aos" {
  interface AOSOptions {
    duration?: number
    easing?: string
    once?: boolean
    offset?: number
    delay?: number
    anchor?: string
    anchorPlacement?: string
    threshold?: number
  }

  interface AOS {
    init(options?: AOSOptions): void
    refresh(): void
    refreshHard(): void
  }

  const AOS: AOS
  export default AOS
}
