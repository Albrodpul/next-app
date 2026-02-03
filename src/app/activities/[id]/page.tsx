'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuery, gql } from '@apollo/client'
import { DetailPage } from '@/components/shared'

const ACTIVITY_QUERY = gql`
  query Activity($uuid: String!) {
    activity(uuid: $uuid) {
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

export default function ActivityDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const uuid = params.id as string

  const { data, loading, error } = useQuery(ACTIVITY_QUERY, {
    variables: { uuid },
    skip: !uuid,
  })

  return (
    <DetailPage
      item={data?.activity || null}
      loading={loading}
      error={error}
      type="activity"
      categoryPath="/activities"
      categoryLabel={t('activities')}
    />
  )
}
