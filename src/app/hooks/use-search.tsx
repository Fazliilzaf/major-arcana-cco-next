import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "./use-debounce";

interface UseSearchOptions<T> {
  items: T[];
  searchKeys: (keyof T)[]; // Keys to search in
  debounceMs?: number; // Debounce delay (default: 300ms)
  caseSensitive?: boolean;
  fuzzyMatch?: boolean; // Allow fuzzy matching (typos)
}

/**
 * Debounced search hook with fuzzy matching
 * 
 * @example
 * const { query, setQuery, results, isSearching } = useSearch({
 *   items: messages,
 *   searchKeys: ['sender', 'subject', 'preview'],
 *   debounceMs: 300,
 * });
 * 
 * <input value={query} onChange={(e) => setQuery(e.target.value)} />
 * {results.map(item => <div>{item.sender}</div>)}
 */
export function useSearch<T extends Record<string, any>>({
  items,
  searchKeys,
  debounceMs = 300,
  caseSensitive = false,
  fuzzyMatch = false,
}: UseSearchOptions<T>) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, debounceMs);

  // Fuzzy match score (simple Levenshtein-like)
  const getFuzzyScore = useCallback((text: string, search: string): number => {
    if (!fuzzyMatch) {
      return text.includes(search) ? 1 : 0;
    }

    let score = 0;
    let searchIndex = 0;

    for (let i = 0; i < text.length && searchIndex < search.length; i++) {
      if (text[i] === search[searchIndex]) {
        score++;
        searchIndex++;
      }
    }

    return searchIndex === search.length ? score / text.length : 0;
  }, [fuzzyMatch]);

  // Search and filter results
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return items;
    }

    const searchTerm = caseSensitive ? debouncedQuery : debouncedQuery.toLowerCase();

    return items.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key];
        if (value == null) return false;

        const textValue = caseSensitive ? String(value) : String(value).toLowerCase();
        
        if (fuzzyMatch) {
          return getFuzzyScore(textValue, searchTerm) > 0.5;
        } else {
          return textValue.includes(searchTerm);
        }
      });
    });
  }, [items, searchKeys, debouncedQuery, caseSensitive, fuzzyMatch, getFuzzyScore]);

  // Is currently debouncing?
  const isSearching = query !== debouncedQuery;

  return {
    query,
    setQuery,
    results,
    isSearching,
    resultCount: results.length,
  };
}

/**
 * Highlight search matches in text
 * 
 * @example
 * const highlighted = highlightMatches('Hello World', 'wor');
 * // Returns: ['Hello ', <mark>Wor</mark>, 'ld']
 */
export function highlightMatches(
  text: string,
  query: string,
  caseSensitive = false
): (string | JSX.Element)[] {
  if (!query.trim()) {
    return [text];
  }

  const searchText = caseSensitive ? text : text.toLowerCase();
  const searchQuery = caseSensitive ? query : query.toLowerCase();
  
  const index = searchText.indexOf(searchQuery);
  
  if (index === -1) {
    return [text];
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return [
    before,
    <mark key="match" className="bg-yellow-200 text-gray-900 font-semibold">
      {match}
    </mark>,
    ...highlightMatches(after, query, caseSensitive),
  ];
}
