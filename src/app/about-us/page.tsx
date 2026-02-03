'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import styles from './page.module.scss'

export default function AboutUsPage() {
  const t = useTranslations()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <video autoPlay muted loop playsInline preload="auto">
          <source src="/videos/intro-desktop.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className="heading1">{t('travel_redefined')}</h1>
          <p className="heading4">
            {t('limitless_travel_one_place1')}{' '}
            <em>{t('limitless_travel_one_place2')}</em>{' '}
            {t('limitless_travel_one_place3')}
          </p>
          {!isAuthenticated && (
            <div className={styles.heroActions}>
              <Button variant="secondary" onClick={() => router.push('/register')}>
                {t('i_want_to_be_part_of_this2')}
              </Button>
              <Button variant="ghost" onClick={() => router.push('/login')}>
                {t('sign_in')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Who We Are Section */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.twoColumn}>
            <div>
              <div className={styles.sectionLabel}>{t('who_we_are')}</div>
              <div className={styles.sectionTitle}>
                <h2 className="heading2">
                  {t('your')} <em>{t('phygital')}</em> {t('personal_concierge')}
                </h2>
              </div>
              <div className={styles.sectionDescription}>
                <p className="body1">
                  {t('paradise_a_la_carte_is_a_personal_virtual_concierge_redefining_travel_with_unparalleled_curated_experiences_and_cutting_edge_technology')}
                </p>
                <p className="body1">
                  {t('transforming_the_future_of_travel_seamlessly_blending_physical_and_digital_worlds_as_part_of_your_journey')}
                </p>
              </div>
            </div>
            <div className={styles.videoContainer}>
              <video autoPlay muted loop playsInline>
                <source src="/videos/who-we-are-desktop.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionTitle} style={{ textAlign: 'center' }}>
            <h2 className="heading2">{t('our_impact')}</h2>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>50+</div>
              <div className={styles.statLabel}>{t('destinations')}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>1000+</div>
              <div className={styles.statLabel}>{t('experiences')}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>{t('concierge_support')}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>{t('satisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionTitle} style={{ textAlign: 'center' }}>
            <h2 className="heading2">{t('our_values')}</h2>
          </div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>✨</div>
              <div className={styles.valueTitle}>{t('excellence')}</div>
              <div className={styles.valueDescription}>
                {t('we_strive_for_excellence_in_every_experience')}
              </div>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤝</div>
              <div className={styles.valueTitle}>{t('trust')}</div>
              <div className={styles.valueDescription}>
                {t('building_lasting_relationships_based_on_trust')}
              </div>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌍</div>
              <div className={styles.valueTitle}>{t('sustainability')}</div>
              <div className={styles.valueDescription}>
                {t('committed_to_responsible_travel')}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
