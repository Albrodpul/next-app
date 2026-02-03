'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@apollo/client'
import { GET_ALL_ACTIVITIES } from '@/graphql/activities'
import { HomeCarouselSection } from './HomeCarouselSection'

export function ActivitiesSection() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  const { data, loading } = useQuery(GET_ALL_ACTIVITIES, {
    variables: {
      orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
      first: 8,
      page: 1,
    },
    fetchPolicy: 'cache-first',
  })

  const activities = data?.getAllActivities?.data || []

  const items = useMemo(
    () =>
      activities.map((activity: any) => {
        const localizedName = activity[`name_${locale}`] || activity.name
        const localizedShortDescription =
          activity[`short_description_${locale}`] || activity.short_description

        const country = activity.location?.address?.country?.name
        const location = activity.location?.name
          ? {
              name: activity.location.name,
              country,
            }
          : undefined

        return {
          uuid: activity.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: activity.mainImage
            ? { url: activity.mainImage.url, alt: localizedName }
            : undefined,
          location,
          currency: undefined,
          price: undefined,
          isExclusive: !activity.user_can_purchase,
          rating: undefined,
        }
      }),
    [activities, locale]
  )

  return (
    <HomeCarouselSection
      title={t.rich('signature_activities_h2', { em: (chunks) => <em>{chunks}</em> })}
      onSeeAll={() => router.push('/activities')}
      seeAllLabel={t('see_all')}
      items={items}
      loading={loading}
      emptyMessage={t('we_couldn_t_find_any_exact_matches_for_that_search')}
      cardType="activity"
    />
  )
}

export default ActivitiesSection
