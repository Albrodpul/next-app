'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuery, gql } from '@apollo/client'
import { DetailPage } from '@/components/shared'

const RESTAURANT_QUERY = gql`
  query Restaurant($uuid: String!) {
    restaurant(uuid: $uuid) {
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
      min_price
      currency
      is_exclusive
      rating
      reviews_count
      highlights
      cuisine_types
      opening_hours
    }
  }
`

export default function RestaurantDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const uuid = params.id as string

  const { data, loading, error } = useQuery(RESTAURANT_QUERY, {
    variables: { uuid },
    skip: !uuid,
  })

  return (
    <DetailPage
      item={data?.restaurant || null}
      loading={loading}
      error={error}
      type="restaurant"
      categoryPath="/restaurants"
      categoryLabel={t('restaurants')}
    />
  )
}
