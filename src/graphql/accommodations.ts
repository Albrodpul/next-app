import { gql } from '@apollo/client'

// Consulta base para obtener alojamientos igual que en Nuxt
export const GET_ALL_ACCOMMODATIONS = gql`
  query getAllAccommodations(
    $orderBy: [QueryGetAllAccommodationsOrderByOrderByClause!]
    $first: Int
    $page: Int
    $showDrafts: Boolean = false
  ) {
    getAllAccommodations(
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
        mainImage {
          uuid
          url
          file_mime_type
        }
        accommodationType {
          uuid
          type
          type_en
          type_ar
          type_es
          type_fr
          type_de
          type_sv
        }
        min_price_per_night
        max_price_per_night
      }
      paginatorInfo {
        currentPage
        lastPage
        total
      }
    }
  }
`
