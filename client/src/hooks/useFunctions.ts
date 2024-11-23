const useFunctions = () => {
	const getStorageItem = (itemName: string, returnItem: null | [] | undefined | boolean) => {
		const storedItem = localStorage.getItem(itemName);
		try {
			return storedItem ? JSON.parse(storedItem) : returnItem;
		} catch (error) {
			console.error("Error parsing opt changes from localStorage:", error);
			return null;
		}
	};

	return { getStorageItem };
};

export default useFunctions;
