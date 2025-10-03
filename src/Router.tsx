import { useRoutes } from "react-router-dom"
import { UploaderProvider } from "@contexts/UploaderContext"
import { AlertProvider } from "@contexts/AlertContext"
import * as pages from "./pages"
import Helper from "./utils/helper"
import ROUTES from "./routes"

Helper.populateComponentsInRoutes(ROUTES, pages)

const Router = (): JSX.Element | null => {
	return <UploaderProvider>
		<AlertProvider>
			{useRoutes(ROUTES)}
		</AlertProvider>
	</UploaderProvider>

}

export default Router
