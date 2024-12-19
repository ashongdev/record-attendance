import Axios from "axios";
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

	const authenticate = async (key: string, coursename: string) => {
		if (!key && !coursename) return (window.location.href = "/");

		try {
			const auth = await Axios.get(
				// `http://localhost:4402/lec/auth/${key + "-" + coursename}`
				`https://record-attendance.onrender.com/lec/auth/${key + "-" + coursename}`
			);

			if (auth.data.msg === "Request authorized") {
				localStorage.setItem("role", JSON.stringify("Lecturer"));
				localStorage.setItem("auth", JSON.stringify({ status: true, key, coursename }));
			}
		} catch (error) {
			if (window.location.pathname !== "/autofill/lec/details") {
				localStorage.removeItem("lec_autofill_details");
				localStorage.removeItem("role");
				window.location.href = "/";
			}
			localStorage.setItem("auth", JSON.stringify(false));
			console.log("🚀 ~ authenticate ~ error:", error);
		}
	};

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
				authenticate,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
