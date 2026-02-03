'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui'
import styles from './not-found.module.scss'

export default function NotFoundPage() {
  const router = useRouter()
  const t = useTranslations()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page not found</h2>
        <p className={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
