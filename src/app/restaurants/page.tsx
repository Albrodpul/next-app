'use client'

import { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery, NetworkStatus } from '@apollo/client'
import { ListingPage } from '@/components/shared/ListingPage'
import { ExperienceCard, ExperienceCardProps } from '@/components/cards'
import { Button } from '@/components/ui/Button'
import { GET_ALL_RESTAURANTS } from '@/graphql/restaurants'

const PAGE_SIZE = 9

export default function RestaurantsPage() {
  const t = useTranslations()
  const locale = useLocale()

  const { data, loading, fetchMore, networkStatus } = useQuery(
    GET_ALL_RESTAURANTS,
    {
      variables: {
        orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
        first: PAGE_SIZE,
        page: 1,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const restaurants = data?.getAllRestaurants?.data || []
  const pageInfo = data?.getAllRestaurants?.paginatorInfo
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore

  const mappedRestaurants = useMemo<ExperienceCardProps[]>(
    () =>
      restaurants.map((restaurant: any) => {
        const localizedName = restaurant[`name_${locale}`] || restaurant.name
        const localizedShortDescription =
          restaurant[`short_description_${locale}`] || restaurant.short_description

        const country = restaurant.location?.address?.country?.name
        const location = restaurant.location?.name
          ? {
              name: restaurant.location.name,
              country,
            }
          : undefined

        return {
          uuid: restaurant.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: restaurant.mainImage
            ? { url: restaurant.mainImage.url, alt: localizedName }
            : undefined,
          location,
          isExclusive: !restaurant.user_can_purchase,
          type: 'restaurant',
        }
      }),
    [restaurants, locale]
  )

  const hasMore =
    (pageInfo?.currentPage ?? 0) < (pageInfo?.lastPage ?? 0)

  const handleLoadMore = () => {
    if (!hasMore) return
    const nextPage = (pageInfo?.currentPage ?? 1) + 1
    fetchMore({
      variables: { page: nextPage },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getAllRestaurants) {
          return previousResult
        }

        const previousData = previousResult.getAllRestaurants?.data ?? []
        const newData = fetchMoreResult.getAllRestaurants.data ?? []

        const merged = [...previousData]
        newData.forEach((item: any) => {
          if (!merged.find((existing) => existing.uuid === item.uuid)) {
            merged.push(item)
          }
        })

        return {
          getAllRestaurants: {
            ...fetchMoreResult.getAllRestaurants,
            data: merged,
          },
        }
      },
    })
  }

  return (
    <ListingPage
      title={t.raw('restaurants_h2')}
      videoUrl="https://guias-enric.s3.eu-west-1.amazonaws.com/restaurante.mp4"
      activeTab="tab-7"
    >
      <div>
        <h2 className="heading3">{t('food_and_drink')}</h2>
        <p className="body1" style={{ color: 'var(--brand-mid-grey)', marginTop: 8 }}>
          {t('restaurants_description')}
        </p>

        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            marginTop: 32,
          }}
        >
          {loading && restaurants.length === 0
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
            : mappedRestaurants.map((restaurant) => (
                <ExperienceCard
                  key={restaurant.uuid}
                  uuid={restaurant.uuid}
                  name={restaurant.name}
                  shortDescription={restaurant.shortDescription}
                  mainImage={restaurant.mainImage}
                  location={restaurant.location}
                  isExclusive={restaurant.isExclusive}
                  type="restaurant"
                />
              ))}
        </div>

        {!loading && mappedRestaurants.length === 0 && (
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