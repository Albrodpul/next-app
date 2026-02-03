import { gql } from '@apollo/client'

// Consulta base para obtener experiencias igual que en Nuxt
export const GET_ALL_EXPERIENCES = gql`
  query getAllExperiences(
    $orderBy: [QueryGetAllExperiencesOrderByOrderByClause!]
    $first: Int
    $page: Int
    $showDrafts: Boolean = false
  ) {
    getAllExperiences(
      orderBy: $orderBy
      first: $first
      page: $page
      showDrafts: $showDrafts
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
        user_can_purchase
        mainImage {
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
      }
      paginatorInfo {
        currentPage
        lastPage
        total
      }
    }
  }
`
