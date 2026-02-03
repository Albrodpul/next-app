/**
 * Explore Items - Navegación de categorías
 * 
 * Este archivo define las opciones del menú de navegación
 * para explorar diferentes tipos de contenido.
 * 
 * Equivalente a: composables/exploreItems/index.ts
 */

export interface ExploreItem {
  route: string
  label: string
  tab: string
  value?: string
}

export function getExploreItems(): ExploreItem[] {
  return [
    {
      route: '/',
      label: 'everything',
      tab: 'tab-1',
    },
    {
      route: '/experiences',
      label: 'experiences',
      tab: 'tab-2',
    },
    {
      route: '/activities',
      label: 'activities',
      tab: 'tab-3',
    },
    {
      route: '/tours',
      label: 'tours',
      tab: 'tab-4',
    },
    {
      route: '/accommodations',
      label: 'accommodations',
      tab: 'tab-5',
    },
    {
      route: '/services',
      label: 'services',
      tab: 'tab-6',
    },
    {
      route: '/restaurants',
      label: 'food_and_drink',
      tab: 'tab-7',
    },
    {
      route: '/destinations',
      label: 'destinations',
      tab: 'tab-8',
    },
  ]
}

export default getExploreItems
