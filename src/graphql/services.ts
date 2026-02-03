import { gql } from '@apollo/client'

// Consulta base para obtener servicios igual que en Nuxt
export const GET_ALL_SERVICES = gql`
  query getAllServices(
    $orderBy: [QueryGetAllServicesOrderByOrderByClause!]
    $first: Int
    $page: Int
    $showDrafts: Boolean = false
  ) {
    getAllServices(
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
        short_description_ar
        short_description_sv
        mainImage {
          uuid
          url
          file_mime_type
        }
        user_can_purchase
        locations {
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
      }
      paginatorInfo {
        currentPage
        lastPage
        total
      }
    }
  }
`
