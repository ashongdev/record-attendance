import { ReactNode, useState } from "react";
import { ContextProvider, Entity } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

const Context = ({ children }: { children: ReactNode }) => {
	const { getStorageItem } = useFunctions();

	const [studentList, setStudentList] = useState<Entity[] | []>(
		getStorageItem("studentList", [])
	);
	const role: "Lecturer" | "Student" = getStorageItem("role", null);
	const lecAutofillDetails = getStorageItem("lec_autofill_details", null);
	const stdAutofillDetails = getStorageItem("std_autofill_details", null);

	const [lecturerLongitude, setLecturerLongitude] = useState(0);
	const [lecturerLatitude, setLecturerLatitude] = useState(0);

	return (
		<ContextProvider.Provider
			value={{
				studentList,
				setStudentList,
				lecturerLongitude,
				setLecturerLongitude,
				lecturerLatitude,
				setLecturerLatitude,
				role,
				lecAutofillDetails,
				stdAutofillDetails,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
