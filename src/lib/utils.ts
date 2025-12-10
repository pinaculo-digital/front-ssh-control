export function randomString(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
/**
 * Remove quebras de linha extras desnecessárias.
 * Substitui múltiplas quebras (\n, \r\n, \r) por apenas uma.
 * Também remove quebras no início e no final da string (trim).
 *
 * @param text - A string de entrada
 * @returns String com quebras de linha normalizadas
 */
export function normalizeLineBreaks(text: string): string {
  if (typeof text !== "string") {
    return "";
  }

  return text
    .replace(/\r\n/g, "\n") // Normaliza \r\n → \n
    .replace(/\r/g, "\n") // Normaliza \r → \n
    .replace(/\n+/g, "\n") // Remove múltiplas \n consecutivas
    .trim(); // Remove quebras no início/fim
}

/**
 * Normaliza quebras de linha extras em conteúdo Markdown.
 * Remove quebras desnecessárias, mas preserva parágrafos (1 linha em branco = 1 <p>).
 */
export function cleanMarkdownLineBreaks(content: string): string {
  if (!content) return "";

  return content
    .replace(/\r\n/g, "\n") // Normaliza Windows → Unix
    .replace(/\r/g, "\n") // Normaliza Mac antigo
    .replace(/\n{3,}/g, "\n\n") // 3+ quebras → 2 (um parágrafo vazio)
    .replace(/^\n+|\n+$/g, "") // Remove quebras no início e fim
    .replace(/\n\n$/g, "\n"); // Garante no máximo 1 quebra no final
}
