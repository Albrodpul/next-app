'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@apollo/client'
import { GET_ALL_DESTINATIONS } from '@/graphql/destinations'
import { HomeCarouselSection } from './HomeCarouselSection'

export function DestinationsSection() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  const { data, loading } = useQuery(GET_ALL_DESTINATIONS, {
    variables: {
      orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
      first: 8,
      page: 1,
    },
    fetchPolicy: 'cache-first',
  })

  const destinations = data?.getAllLocations?.data || []

  const items = useMemo(
    () =>
      destinations.map((destination: any) => {
        const localizedName = destination[`name_${locale}`] || destination.name
        const localizedShortDescription =
          destination[`short_description_${locale}`] || destination.short_description

        const country = destination.address?.country?.name
        const location = country
          ? {
              name: country,
            }
          : undefined

        return {
          uuid: destination.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: destination.mainImage
            ? { url: destination.mainImage.url, alt: localizedName }
            : undefined,
          location,
          currency: undefined,
          price: undefined,
          isExclusive: false,
          rating: undefined,
        }
      }),
    [destinations, locale]
  )

  return (
    <HomeCarouselSection
      title={t.rich('destinations_h2', { em: (chunks) => <em>{chunks}</em> })}
      onSeeAll={() => router.push('/destinations')}
      seeAllLabel={t('see_all')}
      items={items}
      loading={loading}
      emptyMessage={t('we_couldn_t_find_any_exact_matches_for_that_search')}
      cardType="destination"
    />
  )
}

export default DestinationsSection
