'use client'

/**
 * SearchBar - Barra de búsqueda global
 * 
 * Este componente se usa en las páginas de listado para filtrar resultados.
 * Equivalente a UtilsSearchDropdown.vue del proyecto Vue.
 */

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import styles from './SearchBar.module.scss'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  suggestions?: string[]
  onSuggestionSelect?: (suggestion: string) => void
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder,
  suggestions = [],
  onSuggestionSelect,
  className,
}: SearchBarProps) {
  const t = useTranslations()
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  )

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    onSuggestionSelect?.(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div ref={wrapperRef} className={clsx(styles.wrapper, className)}>
      <div className={clsx(styles.searchBar, isFocused && styles.focused)}>
        <svg 
          className={styles.icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => {
            setIsFocused(true)
            setShowSuggestions(true)
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || t('search_placeholder')}
          className={styles.input}
        />

        {value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Sugerencias */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {filteredSuggestions.map((suggestion, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span>{suggestion}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
