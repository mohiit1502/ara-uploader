interface RouteConfig {
  path: String
  class?: String
  element: String | JSX.Element | null
  children?: Array<RouteConfig>
}
