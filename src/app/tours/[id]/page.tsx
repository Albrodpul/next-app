'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuery, gql } from '@apollo/client'
import { DetailPage } from '@/components/shared'

const TOUR_QUERY = gql`
  query Tour($uuid: String!) {
    tour(uuid: $uuid) {
      uuid
      name
      short_description
      description
      main_image {
        url
        alt
      }
      gallery {
        url
        alt
      }
      location {
        name
        country
      }
      duration
      min_price
      currency
      is_exclusive
      rating
      reviews_count
      included
      not_included
      highlights
      requirements
      cancellation_policy
      package_types {
        uuid
        name
        description
        price
        duration
      }
    }
  }
`

export default function TourDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const uuid = params.id as string

  const { data, loading, error } = useQuery(TOUR_QUERY, {
    variables: { uuid },
    skip: !uuid,
  })

  return (
    <DetailPage
      item={data?.tour || null}
      loading={loading}
      error={error}
      type="tour"
      categoryPath="/tours"
      categoryLabel={t('tours')}
    />
  )
}
