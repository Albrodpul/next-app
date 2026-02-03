import { gql } from '@apollo/client'

// Consulta base para obtener destinos (locations) igual que en Nuxt
export const GET_ALL_DESTINATIONS = gql`
  query getAllLocations(
    $orderBy: [QueryGetAllLocationsOrderByOrderByClause!]
    $first: Int
    $page: Int
    $showDrafts: Boolean = false
  ) {
    getAllLocations(
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
        language
        number_of_plans
        address {
          uuid
          latitude
          longitude
          country {
            uuid
            name
          }
        }
        mainImage {
          uuid
          url
          file_mime_type
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
