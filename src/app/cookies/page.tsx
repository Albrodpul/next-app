'use client'

import { useTranslations } from 'next-intl'
import styles from '../(legal)/layout.module.scss'

export default function CookiesPolicyPage() {
  const t = useTranslations()

  return (
    <div className={styles.pageContainer}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className="heading2">{t('cookies_policy')}</h1>
          <p className={styles.lastUpdated}>{t('last_updated')}: January 2024</p>
        </div>

        <div className={styles.content}>
          <p>
            This Cookie Policy explains how Paradise a La Carte uses cookies and similar 
            technologies to recognize you when you visit our website.
          </p>

          <h2>What are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device 
            when you visit a website. They are widely used to make websites work more 
            efficiently and provide information to website owners.
          </p>

          <h2>Types of Cookies We Use</h2>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable 
            basic functions like page navigation and access to secure areas of the website.
          </p>

          <h3>Performance Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by 
            collecting and reporting information anonymously.
          </p>

          <h3>Functionality Cookies</h3>
          <p>
            These cookies enable the website to provide enhanced functionality and 
            personalization, such as remembering your preferences.
          </p>

          <h3>Marketing Cookies</h3>
          <p>
            These cookies are used to track visitors across websites to display relevant 
            advertisements based on your interests.
          </p>

          <h2>How to Manage Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can 
            typically find these settings in the "Options" or "Preferences" menu of your 
            browser.
          </p>
          <ul>
            <li>Chrome: Settings → Privacy and security → Cookies</li>
            <li>Firefox: Options → Privacy & Security → Cookies</li>
            <li>Safari: Preferences → Privacy → Cookies</li>
            <li>Edge: Settings → Cookies and site permissions</li>
          </ul>

          <h2>Third-Party Cookies</h2>
          <p>
            We may use third-party services that set cookies on our behalf, including:
          </p>
          <ul>
            <li>Google Analytics for website analytics</li>
            <li>Stripe for payment processing</li>
            <li>Social media platforms for sharing functionality</li>
          </ul>

          <h2>Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. We encourage you to 
            periodically review this page for the latest information.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at{' '}
            <a href="mailto:privacy@paradisealacarte.com">privacy@paradisealacarte.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
