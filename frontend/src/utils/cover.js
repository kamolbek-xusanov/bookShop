// Every book gets its own gradient, picked from its title
const palettes = [
  ['#0f766e', '#134e4a'],
  ['#b45309', '#78350f'],
  ['#4338ca', '#1e1b4b'],
  ['#be123c', '#4c0519'],
  ['#15803d', '#052e16'],
  ['#7c3aed', '#2e1065'],
  ['#0369a1', '#082f49'],
  ['#c2410c', '#431407'],
]

export function coverGradient(title = '') {
  let hash = 0
  for (const char of title) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  const [from, to] = palettes[hash % palettes.length]
  return `linear-gradient(135deg, ${from}, ${to})`
}
