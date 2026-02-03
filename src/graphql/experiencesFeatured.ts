import { gql } from '@apollo/client'

// Consulta para obtener experiencias destacadas (featured)
export const GET_FEATURED_EXPERIENCES = gql`
  query getAllExperiences(
    $orderBy: [QueryGetAllExperiencesOrderByOrderByClause!]
    $first: Int
    $page: Int
    $featured: Boolean
    $filterEnabled: Boolean
    $dateGreaterThanToday: Boolean
  ) {
    getAllExperiences(
      orderBy: $orderBy
      first: $first
      page: $page
      featured: $featured
      filterEnabled: $filterEnabled
      dateGreaterThanToday: $dateGreaterThanToday
    ) {
      data {
        uuid
        slug
        name
        name_es
        name_en
        name_fr
        name_de
        name_sv
        name_ar
        short_description
        short_description_es
        short_description_en
        short_description_fr
        short_description_de
        short_description_sv
        short_description_ar
        start_date
        end_date
        remaining_uses
        mainImage {
          uuid
          url
          file_mime_type
        }
        coverVideo {
          uuid
          url
          file_mime_type
        }
        location {
          uuid
          name
          address {
            uuid
            latitude
            longitude
            country {
              uuid
              name
            }
          }
        }
        user_can_purchase
      }
      paginatorInfo {
        currentPage
        lastPage
        total
      }
    }
  }
`