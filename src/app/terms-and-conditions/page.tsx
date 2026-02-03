'use client'

import { useTranslations } from 'next-intl'
import styles from '../(legal)/layout.module.scss'

export default function TermsAndConditionsPage() {
  const t = useTranslations()

  return (
    <div className={styles.pageContainer}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className="heading2">{t('terms_and_conditions')}</h1>
          <p className={styles.lastUpdated}>{t('last_updated')}: January 2024</p>
        </div>

        <div className={styles.content}>
          <p>
            Welcome to Paradise a La Carte. These Terms and Conditions govern your use of our 
            website and services. By accessing or using our services, you agree to be bound 
            by these terms.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Paradise a La Carte services, you accept and agree to be 
            bound by the terms and provisions of this agreement. If you do not agree to these 
            terms, please do not use our services.
          </p>

          <h2>2. Use of Services</h2>
          <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul>
            <li>Use the services in any way that violates any applicable laws</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the services to transmit any harmful or malicious content</li>
            <li>Interfere with the proper working of the services</li>
          </ul>

          <h2>3. Booking and Reservations</h2>
          <p>
            When you make a booking through our platform, you enter into a contract with us 
            and/or our travel partners. All bookings are subject to availability and 
            confirmation.
          </p>

          <h2>4. Payment Terms</h2>
          <p>
            Payment is required at the time of booking unless otherwise specified. We accept 
            major credit cards and other payment methods as indicated on our platform.
          </p>

          <h2>5. Cancellation Policy</h2>
          <p>
            Cancellation policies vary depending on the type of booking and service provider. 
            Please review the specific cancellation policy for each booking before confirming.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            Paradise a La Carte shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages resulting from your use of our services.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            All content on our platform, including text, graphics, logos, and images, is the 
            property of Paradise a La Carte and is protected by intellectual property laws.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective 
            immediately upon posting to our website.
          </p>

          <h2>9. Contact Information</h2>
          <p>
            For any questions regarding these Terms and Conditions, please contact us at{' '}
            <a href="mailto:legal@paradisealacarte.com">legal@paradisealacarte.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
