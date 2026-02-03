'use client'

import { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery, NetworkStatus } from '@apollo/client'
import { ListingPage } from '@/components/shared/ListingPage'
import { ExperienceCard, ExperienceCardProps } from '@/components/cards'
import { Button } from '@/components/ui/Button'
import { GET_ALL_ACTIVITIES } from '@/graphql/activities'

const PAGE_SIZE = 9

export default function ActivitiesPage() {
  const t = useTranslations()
  const locale = useLocale()

  const { data, loading, fetchMore, networkStatus } = useQuery(
    GET_ALL_ACTIVITIES,
    {
      variables: {
        orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
        first: PAGE_SIZE,
        page: 1,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const activities = data?.getAllActivities?.data || []
  const pageInfo = data?.getAllActivities?.paginatorInfo
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore

  const mappedActivities = useMemo<ExperienceCardProps[]>(
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
          isExclusive: !activity.user_can_purchase,
          type: 'activity',
        }
      }),
    [activities, locale]
  )

  const hasMore =
    (pageInfo?.currentPage ?? 0) < (pageInfo?.lastPage ?? 0)

  const handleLoadMore = () => {
    if (!hasMore) return
    const nextPage = (pageInfo?.currentPage ?? 1) + 1
    fetchMore({
      variables: { page: nextPage },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getAllActivities) {
          return previousResult
        }

        const previousData = previousResult.getAllActivities?.data ?? []
        const newData = fetchMoreResult.getAllActivities.data ?? []

        const merged = [...previousData]
        newData.forEach((item: any) => {
          if (!merged.find((existing) => existing.uuid === item.uuid)) {
            merged.push(item)
          }
        })

        return {
          getAllActivities: {
            ...fetchMoreResult.getAllActivities,
            data: merged,
          },
        }
      },
    })
  }

  return (
    <ListingPage
      title={t.raw('signature_activities_h2')}
      videoUrl="https://guias-enric.s3.eu-west-1.amazonaws.com/actividad.mp4"
      activeTab="tab-3"
    >
      <div>
        <h2 className="heading3">{t('activities')}</h2>
        <p className="body1" style={{ color: 'var(--brand-mid-grey)', marginTop: 8 }}>
          {t('signature_activities_description')}
        </p>

        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            marginTop: 32,
          }}
        >
          {loading && activities.length === 0
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
            : mappedActivities.map((activity) => (
                <ExperienceCard
                  key={activity.uuid}
                  uuid={activity.uuid}
                  name={activity.name}
                  shortDescription={activity.shortDescription}
                  mainImage={activity.mainImage}
                  location={activity.location}
                  isExclusive={activity.isExclusive}
                  type="activity"
                />
              ))}
        </div>

        {!loading && mappedActivities.length === 0 && (
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
