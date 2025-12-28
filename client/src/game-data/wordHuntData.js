// Common English words for Word Hunt validation
// Using a Set for O(1) lookup performance
import wordList from "word-list-json"

// Use an external word list package and keep only reasonable lengths for a 4x4 board
// This keeps the bundle size and memory reasonable while supporting robust validation
const filteredWords = wordList.filter((word) => word.length >= 3 && word.length <= 8)

// Export a Set for O(1) lookups with lowercase entries
export const WORD_HUNT_DICTIONARY = new Set(filteredWords.map((word) => word.toLowerCase()))


