import { useContext } from "react";
import { ContextProvider } from "../exports/exports";

const useContextProvider = () => {
	const context = useContext(ContextProvider);

	if (!context) {
		throw Error("useContextProvider must be used inside a ContextProvider");
	}

	return context;
};

export default useContextProvider;
