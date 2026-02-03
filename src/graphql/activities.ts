import { gql } from '@apollo/client'

// Consulta base para obtener actividades igual que en Nuxt
export const GET_ALL_ACTIVITIES = gql`
  query getAllActivities(
    $orderBy: [QueryGetAllActivitiesOrderByOrderByClause!]
    $first: Int
    $page: Int
    $showDrafts: Boolean = false
  ) {
    getAllActivities(
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
        date
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
        mainImage {
          uuid
          url
          file_mime_type
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
