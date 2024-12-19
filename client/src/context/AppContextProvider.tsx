import Axios from "axios";
import { ReactNode, useState } from "react";
import io from "socket.io-client";
import { ContextProvider, Entity } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

// const socket = io("http://localhost:4000");
const socket = io("https://record-attendance.onrender.com");

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
		if (!key || !coursename) {
			window.location.href = "/";
			return false;
		}

		try {
			const response = await Axios.get(
				// `http://localhost:4000/lec/auth/${key}-${coursename}`
				`https://record-attendance.onrender.com/lec/auth/${key}-${coursename}`
			);

			// if (response.data.msg === "Request authorized") {
			// 	localStorage.setItem("role", JSON.stringify("Lecturer"));
			// 	localStorage.setItem("auth", JSON.stringify({ status: true, key, coursename }));

			// 	if (
			// 		window.location.pathname === "/lec/home" ||
			// 		window.location.pathname === "/lec/register"
			// 	) {
			// 		return true;
			// 	} else {
			// 		window.location.href = "/";
			// 	}

			// 	return true;
			// }

			throw new Error("Unauthorized request");
		} catch (error) {
			console.error("Authentication error:", error);

			if (window.location.pathname !== "/autofill/lec/details") {
				localStorage.removeItem("lec_autofill_details");
				localStorage.removeItem("role");
				window.location.href = "/";

				return false;
			}

			localStorage.setItem("auth", JSON.stringify(false));
			return false;
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
				socket,
			}}
		>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
