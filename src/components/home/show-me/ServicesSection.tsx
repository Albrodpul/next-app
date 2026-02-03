'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@apollo/client'
import { GET_ALL_SERVICES } from '@/graphql/services'
import { HomeCarouselSection } from './HomeCarouselSection'

export function ServicesSection() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  const { data, loading } = useQuery(GET_ALL_SERVICES, {
    variables: {
      orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
      first: 8,
      page: 1,
    },
    fetchPolicy: 'cache-first',
  })

  const services = data?.getAllServices?.data || []

  const items = useMemo(
    () =>
      services.map((service: any) => {
        const localizedName = service[`name_${locale}`] || service.name
        const localizedShortDescription =
          service[`short_description_${locale}`] || service.short_description

        const firstLocation = service.locations?.[0]
        const country = firstLocation?.address?.country?.name
        const location = firstLocation?.name
          ? {
              name: firstLocation.name,
              country,
            }
          : undefined

        return {
          uuid: service.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: service.mainImage
            ? { url: service.mainImage.url, alt: localizedName }
            : undefined,
          location,
          currency: undefined,
          price: undefined,
          isExclusive: !service.user_can_purchase,
          rating: undefined,
        }
      }),
    [services, locale]
  )

  return (
    <HomeCarouselSection
      title={t.rich('services_h2', { em: (chunks) => <em>{chunks}</em> })}
      onSeeAll={() => router.push('/services')}
      seeAllLabel={t('see_all')}
      items={items}
      loading={loading}
      emptyMessage={t('we_couldn_t_find_any_exact_matches_for_that_search')}
      cardType="service"
    />
  )
}

export default ServicesSection
