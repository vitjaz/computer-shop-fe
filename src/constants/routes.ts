export const ROUTE_NAMES = {
  uiKit: 'ui-kit',
} as const

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
