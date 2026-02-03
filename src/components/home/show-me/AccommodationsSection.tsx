'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@apollo/client'
import { GET_ALL_ACCOMMODATIONS } from '@/graphql/accommodations'
import { HomeCarouselSection } from './HomeCarouselSection'

export function AccommodationsSection() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  const { data, loading } = useQuery(GET_ALL_ACCOMMODATIONS, {
    variables: {
      orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
      first: 8,
      page: 1,
    },
    fetchPolicy: 'cache-first',
  })

  const accommodations = data?.getAllAccommodations?.data || []

  const items = useMemo(
    () =>
      accommodations.map((accommodation: any) => {
        const localizedName = accommodation[`name_${locale}`] || accommodation.name
        const localizedShortDescription =
          accommodation[`short_description_${locale}`] || accommodation.short_description

        const country = accommodation.location?.address?.country?.name
        const location = accommodation.location?.name
          ? {
              name: accommodation.location.name,
              country,
            }
          : undefined

        return {
          uuid: accommodation.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: accommodation.mainImage
            ? { url: accommodation.mainImage.url, alt: localizedName }
            : undefined,
          location,
          currency: undefined,
          price: accommodation.min_price_per_night ?? undefined,
          isExclusive: !accommodation.user_can_purchase,
          rating: undefined,
        }
      }),
    [accommodations, locale]
  )

  return (
    <HomeCarouselSection
      title={t.rich('accommodations_h2', { em: (chunks) => <em>{chunks}</em> })}
      onSeeAll={() => router.push('/accommodations')}
      seeAllLabel={t('see_all')}
      items={items}
      loading={loading}
      emptyMessage={t('we_couldn_t_find_any_exact_matches_for_that_search')}
      cardType="accommodation"
    />
  )
}

export default AccommodationsSection
