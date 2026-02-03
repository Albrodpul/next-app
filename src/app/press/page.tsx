'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import styles from './page.module.scss'

const pressArticles = [
  {
    id: 1,
    source: 'Forbes',
    title: 'The Future of Luxury Travel',
    excerpt: 'Paradise a La Carte is revolutionizing how we experience travel...',
    date: '2024-01-15',
    url: '#',
  },
  {
    id: 2,
    source: 'Condé Nast Traveler',
    title: 'Paradise a La Carte Redefines Travel',
    excerpt: 'A new approach to curated experiences that puts personalization first...',
    date: '2024-02-20',
    url: '#',
  },
  {
    id: 3,
    source: 'Travel + Leisure',
    title: 'Top 10 Travel Experiences of 2024',
    excerpt: 'Paradise a La Carte makes the list with their exclusive offerings...',
    date: '2024-03-10',
    url: '#',
  },
  {
    id: 4,
    source: 'Bloomberg',
    title: 'The Tech Behind Luxury Travel',
    excerpt: 'How Paradise a La Carte uses technology to enhance travel experiences...',
    date: '2024-04-05',
    url: '#',
  },
  {
    id: 5,
    source: 'Robb Report',
    title: 'Exclusive Experiences Worth Every Penny',
    excerpt: 'Paradise a La Carte delivers unparalleled luxury experiences...',
    date: '2024-05-12',
    url: '#',
  },
  {
    id: 6,
    source: 'The Wall Street Journal',
    title: 'The New Era of Personalized Travel',
    excerpt: 'Paradise a La Carte leads the charge in bespoke travel services...',
    date: '2024-06-18',
    url: '#',
  },
]

export default function PressPage() {
  const t = useTranslations()
  const router = useRouter()

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className="heading2">{t('press')}</h1>
        <p className="body1">{t('what_they_say_about_us')}</p>
      </div>

      <div className={styles.pressGrid}>
        {pressArticles.map((article) => (
          <article key={article.id} className={styles.pressCard}>
            <div className={styles.cardSource}>{article.source}</div>
            <h2 className={styles.cardTitle}>{article.title}</h2>
            <p className={styles.cardExcerpt}>{article.excerpt}</p>
            <div className={styles.cardFooter}>
              <span className={styles.cardDate}>{article.date}</span>
              <Button variant="link" onClick={() => window.open(article.url, '_blank')}>
                {t('read_more')} →
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.contactSection}>
        <h2 className="heading3">{t('press_inquiries')}</h2>
        <p className="body1">{t('for_press_inquiries_please_contact')}</p>
        <a href="mailto:press@paradisealacarte.com" className={styles.emailLink}>
          press@paradisealacarte.com
        </a>
        <Button 
          variant="secondary" 
          onClick={() => router.push('/contact-us')}
          style={{ marginTop: 24 }}
        >
          {t('contact_us')}
        </Button>
      </div>
    </div>
  )
}
