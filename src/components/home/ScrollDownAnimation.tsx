'use client'

/**
 * EXPLICACIÓN: ScrollDownAnimation
 * 
 * Animación de "scroll down" que aparece en el hero.
 * Similar a UtilsScrollDownAnimation.vue
 */

import React from 'react'
import styles from './ScrollDownAnimation.module.scss'

interface ScrollDownAnimationProps {
  onClick?: () => void
}

export function ScrollDownAnimation({ onClick }: ScrollDownAnimationProps) {
  return (
    <button className={styles.scrollDown} onClick={onClick} aria-label="Scroll down">
      <div className={styles.mouse}>
        <div className={styles.wheel}></div>
      </div>
      <div className={styles.arrows}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  )
}

export default ScrollDownAnimation
