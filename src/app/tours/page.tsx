'use client'

import { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery, NetworkStatus } from '@apollo/client'
import { ListingPage } from '@/components/shared/ListingPage'
import { ExperienceCard, ExperienceCardProps } from '@/components/cards'
import { Button } from '@/components/ui/Button'
import { GET_ALL_TOURS } from '@/graphql/tours'

const PAGE_SIZE = 9

export default function ToursPage() {
  const t = useTranslations()
  const locale = useLocale()

  const { data, loading, fetchMore, networkStatus } = useQuery(
    GET_ALL_TOURS,
    {
      variables: {
        orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
        first: PAGE_SIZE,
        page: 1,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const tours = data?.getAllTours?.data || []
  const pageInfo = data?.getAllTours?.paginatorInfo
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore

  const mappedTours = useMemo<ExperienceCardProps[]>(
    () =>
      tours.map((tour: any) => {
        const localizedName = tour[`name_${locale}`] || tour.name
        const localizedShortDescription =
          tour[`short_description_${locale}`] || tour.short_description

        const country = tour.location?.address?.country?.name
        const location = tour.location?.name
          ? {
              name: tour.location.name,
              country,
            }
          : undefined

        return {
          uuid: tour.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: tour.mainImage
            ? { url: tour.mainImage.url, alt: localizedName }
            : undefined,
          location,
          isExclusive: !tour.user_can_purchase,
          type: 'tour',
        }
      }),
    [tours, locale]
  )

  const hasMore =
    (pageInfo?.currentPage ?? 0) < (pageInfo?.lastPage ?? 0)

  const handleLoadMore = () => {
    if (!hasMore) return
    const nextPage = (pageInfo?.currentPage ?? 1) + 1
    fetchMore({
      variables: { page: nextPage },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getAllTours) {
          return previousResult
        }

        const previousData = previousResult.getAllTours?.data ?? []
        const newData = fetchMoreResult.getAllTours.data ?? []

        const merged = [...previousData]
        newData.forEach((item: any) => {
          if (!merged.find((existing) => existing.uuid === item.uuid)) {
            merged.push(item)
          }
        })

        return {
          getAllTours: {
            ...fetchMoreResult.getAllTours,
            data: merged,
          },
        }
      },
    })
  }

  return (
    <ListingPage
      title={t.raw('tours_h2')}
      videoUrl="https://guias-enric.s3.eu-west-1.amazonaws.com/tour.mp4"
      activeTab="tab-4"
    >
      <div>
        <h2 className="heading3">{t('tours')}</h2>
        <p className="body1" style={{ color: 'var(--brand-mid-grey)', marginTop: 8 }}>
          {t('tours_description')}
        </p>

        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            marginTop: 32,
          }}
        >
          {loading && tours.length === 0
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
            : mappedTours.map((tour) => (
                <ExperienceCard
                  key={tour.uuid}
                  uuid={tour.uuid}
                  name={tour.name}
                  shortDescription={tour.shortDescription}
                  mainImage={tour.mainImage}
                  location={tour.location}
                  isExclusive={tour.isExclusive}
                  type="tour"
                />
              ))}
        </div>

        {!loading && mappedTours.length === 0 && (
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
