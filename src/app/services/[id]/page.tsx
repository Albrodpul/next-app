'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuery, gql } from '@apollo/client'
import { DetailPage } from '@/components/shared'

const SERVICE_QUERY = gql`
  query Service($uuid: String!) {
    service(uuid: $uuid) {
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
      requirements
      cancellation_policy
      service_types {
        uuid
        name
        description
        price
        duration
      }
    }
  }
`

export default function ServiceDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const uuid = params.id as string

  const { data, loading, error } = useQuery(SERVICE_QUERY, {
    variables: { uuid },
    skip: !uuid,
  })

  // Transform service_types to package_types format
  const item = data?.service ? {
    ...data.service,
    package_types: data.service.service_types?.map((svc: any) => ({
      uuid: svc.uuid,
      name: svc.name,
      description: svc.description,
      price: svc.price,
      duration: svc.duration,
    })),
  } : null

  return (
    <DetailPage
      item={item}
      loading={loading}
      error={error}
      type="service"
      categoryPath="/services"
      categoryLabel={t('services')}
    />
  )
}
