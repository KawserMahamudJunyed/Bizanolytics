// ANTIGRAVITY INTEGRATION — TOKEN TRUNCATION
// Mode: A (public)
// Keeps Groq input under budget (~900 tokens ≈ 3600 chars)

/**
 * Truncate text to approximate token count.
 * Conservative estimate: ~4 chars per token.
 */
export function truncateToTokens(text: string, maxTokens: number = 900): string {
  const maxChars = maxTokens * 4
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars)
}

/**
 * Clean raw HTML text for LLM consumption.
 * Strips excessive whitespace, URLs, and non-content noise.
 */
export function cleanTextForLLM(text: string): string {
  return text
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, "")
    // Collapse multiple newlines
    .replace(/\n{3,}/g, "\n\n")
    // Collapse multiple spaces
    .replace(/[ \t]{2,}/g, " ")
    // Remove empty lines with only whitespace
    .replace(/^\s*$/gm, "")
    .trim()
}
