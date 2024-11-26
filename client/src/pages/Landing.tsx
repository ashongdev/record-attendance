import { useEffect, useState } from "react";
import SuccessAlert from "../components/SuccessAlert";
import useContextProvider from "../hooks/useContextProvider";
import "../styles/Landing.css";

const Landing = () => {
	function setRole(role: "Lecturer" | "Student") {
		localStorage.setItem("role", JSON.stringify(role));
	}

	const { role } = useContextProvider();

	useEffect(() => {
		if (role === "Lecturer") {
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} else if (role === "Student") {
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		}
	}, [role]);
	const [redirecting, setRedirecting] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	return (
		<div className="landing-page">
			{showSuccessMessage && (
				<SuccessAlert
					successMessage="Redirecting"
					setShowSuccessMessage={setShowSuccessMessage}
				/>
			)}

			<h1>Welcome to the Attendance Tracker</h1>
			<span>Select your role to get started:</span>
			<div className="roles">
				<button
					className="role-button lecturer"
					onClick={() => {
						setRole("Lecturer");
						setShowSuccessMessage(true);
					}}
				>
					I am a Lecturer
				</button>
				<button
					className="role-button student"
					onClick={() => {
						setShowSuccessMessage(true);
						setRole("Student");
					}}
				>
					I am a Student
				</button>
			</div>
		</div>
	);
};

export default Landing;
