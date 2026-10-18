const preloaded = new Set<string>()

export function preloadImage(src: string) {
  if (!src || preloaded.has(src)) return
  preloaded.add(src)

  const image = new Image()
  image.src = src
  image.decode?.().catch(() => {})
}
