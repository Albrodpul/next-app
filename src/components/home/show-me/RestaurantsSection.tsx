'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@apollo/client'
import { GET_ALL_RESTAURANTS } from '@/graphql/restaurants'
import { HomeCarouselSection } from './HomeCarouselSection'

export function RestaurantsSection() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  const { data, loading } = useQuery(GET_ALL_RESTAURANTS, {
    variables: {
      orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
      first: 8,
      page: 1,
    },
    fetchPolicy: 'cache-first',
  })

  const restaurants = data?.getAllRestaurants?.data || []

  const items = useMemo(
    () =>
      restaurants.map((restaurant: any) => {
        const localizedName = restaurant[`name_${locale}`] || restaurant.name
        const localizedShortDescription =
          restaurant[`short_description_${locale}`] || restaurant.short_description

        const country = restaurant.location?.address?.country?.name
        const location = restaurant.location?.name
          ? {
              name: restaurant.location.name,
              country,
            }
          : undefined

        return {
          uuid: restaurant.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: restaurant.mainImage
            ? { url: restaurant.mainImage.url, alt: localizedName }
            : undefined,
          location,
          currency: undefined,
          price: undefined,
          isExclusive: !restaurant.user_can_purchase,
          rating: undefined,
        }
      }),
    [restaurants, locale]
  )

  return (
    <HomeCarouselSection
      title={t.rich('restaurants_h2', { em: (chunks) => <em>{chunks}</em> })}
      onSeeAll={() => router.push('/restaurants')}
      seeAllLabel={t('see_all')}
      items={items}
      loading={loading}
      emptyMessage={t('we_couldn_t_find_any_exact_matches_for_that_search')}
      cardType="restaurant"
    />
  )
}

export default RestaurantsSection
