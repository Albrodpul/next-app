'use client'

import { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery, NetworkStatus } from '@apollo/client'
import { ListingPage } from '@/components/shared/ListingPage'
import { ExperienceCard, ExperienceCardProps } from '@/components/cards'
import { Button } from '@/components/ui/Button'
import { GET_ALL_EXPERIENCES } from '@/graphql/experiences'

const PAGE_SIZE = 9

export default function ExperiencesPage() {
  const t = useTranslations()
  const locale = useLocale()

  const { data, loading, fetchMore, networkStatus, error } = useQuery(
    GET_ALL_EXPERIENCES,
    {
      variables: {
        orderBy: [{ column: 'CREATED_AT', order: 'DESC' }],
        first: PAGE_SIZE,
        page: 1,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const experiences = data?.getAllExperiences?.data || []
  const pageInfo = data?.getAllExperiences?.paginatorInfo
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore

  const mappedExperiences = useMemo<ExperienceCardProps[]>(
    () =>
      experiences.map((exp: any) => {
        const localizedName = exp[`name_${locale}`] || exp.name
        const localizedShortDescription =
          exp[`short_description_${locale}`] || exp.short_description

        const country = exp.location?.address?.country?.name
        const location = exp.location?.name
          ? {
              name: exp.location.name,
              country,
            }
          : undefined

        return {
          uuid: exp.uuid,
          name: localizedName,
          shortDescription: localizedShortDescription,
          mainImage: exp.mainImage
            ? { url: exp.mainImage.url, alt: localizedName }
            : undefined,
          location,
          isExclusive: !exp.user_can_purchase,
          type: 'experience',
        }
      }),
    [experiences, locale]
  )

  const hasMore =
    (pageInfo?.currentPage ?? 0) < (pageInfo?.lastPage ?? 0)

  const handleLoadMore = () => {
    if (!hasMore) return
    const nextPage = (pageInfo?.currentPage ?? 1) + 1
    fetchMore({
      variables: { page: nextPage },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getAllExperiences) {
          return previousResult
        }

        const previousData = previousResult.getAllExperiences?.data ?? []
        const newData = fetchMoreResult.getAllExperiences.data ?? []

        const merged = [...previousData]
        newData.forEach((item: any) => {
          if (!merged.find((existing) => existing.uuid === item.uuid)) {
            merged.push(item)
          }
        })

        return {
          getAllExperiences: {
            ...fetchMoreResult.getAllExperiences,
            data: merged,
          },
        }
      },
    })
  }

  return (
    <ListingPage
      title={t.raw('curated_experiences_h2')}
      videoUrl="https://guias-enric.s3.eu-west-1.amazonaws.com/experiencia.mp4"
      activeTab="tab-2"
    >
      <div>
        <h2 className="heading3">{t('experiences')}</h2>
        <p className="body1" style={{ color: 'var(--brand-mid-grey)', marginTop: 8 }}>
          {t('curated_experiences_description')}
        </p>

        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            marginTop: 32,
          }}
        >
          {loading && experiences.length === 0
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
            : mappedExperiences.map((exp) => (
                <ExperienceCard
                  key={exp.uuid}
                  uuid={exp.uuid}
                  name={exp.name}
                  shortDescription={exp.shortDescription}
                  mainImage={exp.mainImage}
                  location={exp.location}
                  isExclusive={exp.isExclusive}
                  type="experience"
                />
              ))}
        </div>

        {!loading && mappedExperiences.length === 0 && (
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
