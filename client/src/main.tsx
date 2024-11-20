import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import ContextProvider from "./context/AppContextProvider.tsx";
import Styles from "./styles/Styles.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ContextProvider>
			<BrowserRouter>
				{/* For rendering stylesheets */}
				<Styles />

				<App />
			</BrowserRouter>
		</ContextProvider>
	</StrictMode>
);
