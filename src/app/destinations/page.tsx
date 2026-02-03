'use client'

import { useTranslations } from 'next-intl'
import { ListingPage } from '@/components/shared/ListingPage'

export default function DestinationsPage() {
  const t = useTranslations()

  return (
    <ListingPage
      title={t.raw('destinations_h2')}
      videoUrl="https://guias-enric.s3.eu-west-1.amazonaws.com/destino.mp4"
      activeTab="tab-8"
    >
      <div>
        <h2 className="heading3">{t('destinations')}</h2>
        <p className="body1" style={{ color: 'var(--brand-mid-grey)', marginTop: 8 }}>
          {t('destinations_description')}
        </p>
        
        {/* TODO: Implementar lista de destinos con GraphQL */}
        <div style={{ 
          display: 'grid', 
          gap: 24, 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          marginTop: 32 
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i}
              style={{ 
                background: 'var(--brand-off-white)', 
                borderRadius: 16, 
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-mid-grey)'
              }}
            >
              Destination Card {i}
            </div>
          ))}
        </div>
      </div>
    </ListingPage>
  )
}
