import { useState } from "react";
import SuccessAlert from "../components/SuccessAlert";
import useContextProvider from "../hooks/useContextProvider";
import "../styles/Landing.css";

const Landing = () => {
	function setRole(role: "Lecturer" | "Student") {
		localStorage.setItem("role", JSON.stringify(role));
	}

	const { role } = useContextProvider();

	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const handleClick = (role: "Lecturer" | "Student") => {
		setRole(role);
		setShowSuccessMessage(true);
		setTimeout(() => {
			window.location.reload();
		}, 2000);
	};

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
					onClick={() => handleClick("Lecturer")}
				>
					I am a Lecturer
				</button>
				<button
					className="role-button student"
					onClick={() => handleClick("Student")}
				>
					I am a Student
				</button>
			</div>
		</div>
	);
};

export default Landing;
