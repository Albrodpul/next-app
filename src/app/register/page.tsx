'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from '../(auth)/auth.module.scss'

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwords_do_not_match'))
      return
    }

    setIsLoading(true)

    try {
      // TODO: Implementar registro con GraphQL
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push('/login')
    } catch (err) {
      setError(t('registration_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    // TODO: Implementar registro social
    console.log('Social register:', provider)
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src="/logos/PALC_Black.svg" alt="Paradise a La Carte" />
        </div>

        <div className={styles.header}>
          <h1 className="heading3">{t('create_account')}</h1>
          <p className="body2">{t('join_paradise_a_la_carte')}</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('first_name')}</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('enter_your_first_name')}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('last_name')}</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('enter_your_last_name')}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder={t('enter_your_email')}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder={t('create_a_password')}
              required
              minLength={8}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('confirm_password')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder={t('confirm_your_password')}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? t('creating_account') : t('create_account')}
          </button>
        </form>

        <div className={styles.divider}>{t('or_continue_with')}</div>

        <div className={styles.socialButtons}>
          <button
            type="button"
            className={styles.socialButton}
            onClick={() => handleSocialLogin('google')}
          >
            <svg viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            className={styles.socialButton}
            onClick={() => handleSocialLogin('apple')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Apple
          </button>
        </div>

        <div className={styles.footer}>
          {t('already_have_account')}{' '}
          <Link href="/login">{t('sign_in')}</Link>
        </div>
      </div>
    </div>
  )
}
