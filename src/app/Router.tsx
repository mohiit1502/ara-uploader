import { useRoutes } from "react-router-dom"
import * as pages from "./pages"
import Helper from "./utils/helper"
import ROUTES from "./routes"

Helper.populateComponentsInRoutes(ROUTES, pages)

interface RouterProps {}

const Router = (props: RouterProps): JSX.Element | null => useRoutes(ROUTES)

export default Router
