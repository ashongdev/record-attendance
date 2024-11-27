import { ReactNode, useState } from "react";
import { ContextProvider, StudentType } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

const Context = ({ children }: { children: ReactNode }) => {
	const { getStorageItem } = useFunctions();

	const [studentList, setStudentList] = useState<StudentType[] | []>(
		getStorageItem("studentList", [])
	);
	const role: "Lecturer" | "Student" = getStorageItem("role", null);
	const lec = getStorageItem("lec", null);

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
				lec,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
