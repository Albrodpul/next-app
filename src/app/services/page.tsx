'use client'

import { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery, NetworkStatus } from '@apollo/client'
import { ListingPage } from '@/components/shared/ListingPage'
import { ExperienceCard, ExperienceCardProps } from '@/components/cards'
import { Button } from '@/components/ui/Button'
import { GET_ALL_SERVICES } from '@/graphql/services'

const PAGE_SIZE = 9

export default function ServicesPage() {
  const t = useTranslations()
  const locale = useLocale()

  const { data, loading, fetchMore, networkStatus } = useQuery(
    GET_ALL_SERVICES,
    {
      variables: {
        orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
        first: PAGE_SIZE,
        page: 1,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const services = data?.getAllServices?.data || []
  const pageInfo = data?.getAllServices?.paginatorInfo
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore

  const mappedServices = useMemo<ExperienceCardProps[]>(
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
          isExclusive: !service.user_can_purchase,
          type: 'service',
        }
      }),
    [services, locale]
  )

  const hasMore =
    (pageInfo?.currentPage ?? 0) < (pageInfo?.lastPage ?? 0)

  const handleLoadMore = () => {
    if (!hasMore) return
    const nextPage = (pageInfo?.currentPage ?? 1) + 1
    fetchMore({
      variables: { page: nextPage },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getAllServices) {
          return previousResult
        }

        const previousData = previousResult.getAllServices?.data ?? []
        const newData = fetchMoreResult.getAllServices.data ?? []

        const merged = [...previousData]
        newData.forEach((item: any) => {
          if (!merged.find((existing) => existing.uuid === item.uuid)) {
            merged.push(item)
          }
        })

        return {
          getAllServices: {
            ...fetchMoreResult.getAllServices,
            data: merged,
          },
        }
      },
    })
  }

  return (
    <ListingPage
      title={t.raw('services_h2')}
      videoUrl="https://guias-enric.s3.eu-west-1.amazonaws.com/servicio.mp4"
      activeTab="tab-6"
    >
      <div>
        <h2 className="heading3">{t('services')}</h2>
        <p className="body1" style={{ color: 'var(--brand-mid-grey)', marginTop: 8 }}>
          {t('services_description')}
        </p>

        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            marginTop: 32,
          }}
        >
          {loading && services.length === 0
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--brand-off-white)',
                    borderRadius: 16,
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-mid-grey)',
                  }}
                >
                  {t('loading')}...
                </div>
              ))
            : mappedServices.map((service) => (
                <ExperienceCard
                  key={service.uuid}
                  uuid={service.uuid}
                  name={service.name}
                  shortDescription={service.shortDescription}
                  mainImage={service.mainImage}
                  location={service.location}
                  isExclusive={service.isExclusive}
                  type="service"
                />
              ))}
        </div>

        {!loading && mappedServices.length === 0 && (
          <p className="body1" style={{ marginTop: 24 }}>
            {t('we_couldn_t_find_any_exact_matches_for_that_search')}.
          </p>
        )}

        {hasMore && (
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Button
              variant="primary"
              onClick={handleLoadMore}
              disabled={isFetchingMore}
            >
              {isFetchingMore ? t('loading') : t('show_more')}
            </Button>
          </div>
        )}
      </div>
    </ListingPage>
  )
}
