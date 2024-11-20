import { ReactNode, useState } from "react";
import { ContextProvider, StudentType } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

const Context = ({ children }: { children: ReactNode }) => {
	const { getStorageItem } = useFunctions();

	const [studentList, setStudentList] = useState<StudentType[] | []>(
		getStorageItem("studentList", [])
	);
	const [registered, setRegistered] = useState(getStorageItem("lec", false));

	const [lecturerLongitude, setLecturerLongitude] = useState(0);
	const [lecturerLatitude, setLecturerLatitude] = useState(0);

	return (
		<ContextProvider.Provider
			value={{
				studentList,
				setStudentList,
				setRegistered,
				registered,
				lecturerLongitude,
				setLecturerLongitude,
				lecturerLatitude,
				setLecturerLatitude,
				// key,
				// keyAuthorized,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
