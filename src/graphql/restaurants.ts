import { gql } from '@apollo/client'

// Consulta base para obtener restaurantes igual que en Nuxt
export const GET_ALL_RESTAURANTS = gql`
  query getAllRestaurants(
    $orderBy: [QueryGetAllRestaurantsOrderByOrderByClause!]
    $first: Int
    $page: Int
    $showDrafts: Boolean = false
  ) {
    getAllRestaurants(
      orderBy: $orderBy
      first: $first
      page: $page
      showDrafts: $showDrafts
    ) {
      data {
        uuid
        slug
        name
        short_description
        short_description_es
        short_description_en
        short_description_fr
        short_description_de
        short_description_sv
        short_description_ar
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
            country {
              uuid
              name
            }
          }
        }
        address {
          uuid
          latitude
          longitude
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
