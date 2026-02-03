'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuery, gql } from '@apollo/client'
import { DetailPage } from '@/components/shared'

const ACCOMMODATION_QUERY = gql`
  query Accommodation($uuid: String!) {
    accommodation(uuid: $uuid) {
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
      included
      not_included
      highlights
      cancellation_policy
      room_types {
        uuid
        name
        description
        price
      }
    }
  }
`

export default function AccommodationDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const uuid = params.id as string

  const { data, loading, error } = useQuery(ACCOMMODATION_QUERY, {
    variables: { uuid },
    skip: !uuid,
  })

  // Transform room_types to package_types format
  const item = data?.accommodation ? {
    ...data.accommodation,
    package_types: data.accommodation.room_types?.map((room: any) => ({
      uuid: room.uuid,
      name: room.name,
      description: room.description,
      price: room.price,
    })),
  } : null

  return (
    <DetailPage
      item={item}
      loading={loading}
      error={error}
      type="accommodation"
      categoryPath="/accommodations"
      categoryLabel={t('accommodations')}
    />
  )
}
