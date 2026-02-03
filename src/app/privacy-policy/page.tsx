'use client'

import { useTranslations } from 'next-intl'
import styles from '../(legal)/layout.module.scss'

export default function PrivacyPolicyPage() {
  const t = useTranslations()

  return (
    <div className={styles.pageContainer}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className="heading2">{t('privacy_policy')}</h1>
          <p className={styles.lastUpdated}>{t('last_updated')}: January 2024</p>
        </div>

        <div className={styles.content}>
          <p>
            At Paradise a La Carte, we are committed to protecting your privacy and ensuring 
            the security of your personal information. This Privacy Policy explains how we 
            collect, use, disclose, and safeguard your information when you use our services.
          </p>

          <h2>Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Personal identification information (name, email address, phone number)</li>
            <li>Payment information (credit card details, billing address)</li>
            <li>Travel preferences and booking history</li>
            <li>Communication preferences</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and manage your bookings and reservations</li>
            <li>Provide personalized travel recommendations</li>
            <li>Communicate with you about your account and services</li>
            <li>Improve our services and develop new features</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We may share your information with third parties in the following circumstances:
          </p>
          <ul>
            <li>With service providers who assist us in operating our platform</li>
            <li>With travel partners to fulfill your bookings</li>
            <li>When required by law or to protect our rights</li>
            <li>With your consent</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or 
            destruction.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@paradisealacarte.com">privacy@paradisealacarte.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
