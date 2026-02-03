'use client'

import { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery, NetworkStatus } from '@apollo/client'
import { ListingPage } from '@/components/shared/ListingPage'
import { ExperienceCard, ExperienceCardProps } from '@/components/cards'
import { Button } from '@/components/ui/Button'
import { GET_ALL_ACCOMMODATIONS } from '@/graphql/accommodations'

const PAGE_SIZE = 9

export default function AccommodationsPage() {
  const t = useTranslations()
  const locale = useLocale()

  const { data, loading, fetchMore, networkStatus } = useQuery(
    GET_ALL_ACCOMMODATIONS,
    {
      variables: {
        orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
        first: PAGE_SIZE,
        page: 1,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const accommodations = data?.getAllAccommodations?.data || []
  const pageInfo = data?.getAllAccommodations?.paginatorInfo
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore

  const mappedAccommodations = useMemo<ExperienceCardProps[]>(
    () =>
      accommodations.map((acc: any) => {
        const localizedName = acc[`name_${locale}`] || acc.name
        const localizedShortDescription =
          acc[`short_description_${locale}`] || acc.short_description

        const country = acc.location?.address?.country?.name
        const location = acc.location?.name
          ? {
              name: acc.location.name,
              country,
            }
          : undefined

        return {
          uuid: acc.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: acc.mainImage
            ? { url: acc.mainImage.url, alt: localizedName }
            : undefined,
          location,
          isExclusive: !acc.user_can_purchase,
          type: 'accommodation',
        }
      }),
    [accommodations, locale]
  )

  const hasMore =
    (pageInfo?.currentPage ?? 0) < (pageInfo?.lastPage ?? 0)

  const handleLoadMore = () => {
    if (!hasMore) return
    const nextPage = (pageInfo?.currentPage ?? 1) + 1
    fetchMore({
      variables: { page: nextPage },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getAllAccommodations) {
          return previousResult
        }

        const previousData = previousResult.getAllAccommodations?.data ?? []
        const newData = fetchMoreResult.getAllAccommodations.data ?? []

        const merged = [...previousData]
        newData.forEach((item: any) => {
          if (!merged.find((existing) => existing.uuid === item.uuid)) {
            merged.push(item)
          }
        })

        return {
          getAllAccommodations: {
            ...fetchMoreResult.getAllAccommodations,
            data: merged,
          },
        }
      },
    })
  }

  return (
    <ListingPage
      title={t.raw('accommodations_h2')}
      videoUrl="https://guias-enric.s3.eu-west-1.amazonaws.com/alojamiento.mp4"
      activeTab="tab-5"
    >
      <div>
        <h2 className="heading3">{t('accommodations')}</h2>
        <p className="body1" style={{ color: 'var(--brand-mid-grey)', marginTop: 8 }}>
          {t('accommodations_description')}
        </p>

        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            marginTop: 32,
          }}
        >
          {loading && accommodations.length === 0
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
            : mappedAccommodations.map((acc) => (
                <ExperienceCard
                  key={acc.uuid}
                  uuid={acc.uuid}
                  name={acc.name}
                  shortDescription={acc.shortDescription}
                  mainImage={acc.mainImage}
                  location={acc.location}
                  isExclusive={acc.isExclusive}
                  type="accommodation"
                />
              ))}
        </div>

        {!loading && mappedAccommodations.length === 0 && (
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