class Helper {
  static populateComponentsInRoutes(routes: RouteConfig[], components: any) {
    routes &&
      routes.forEach((route) => {
        const Component: JSX.ElementType =
          components[route.element as keyof object]
        route.element = <Component />
        if (route.children) {
          Helper.populateComponentsInRoutes(route.children, components)
        }
      })
  }
}

export default Helper
