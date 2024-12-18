import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EnterAuthKey from "../components/EnterAuthKey";
import "../styles/Landing.css";

const Landing = () => {
	const handleClick = (role: "Lecturer" | "Student") => {
		if (role !== "Student" && role !== "Lecturer") return;

		localStorage.setItem("role", JSON.stringify(role));

		if (role === "Student") {
			setTimeout(() => {
				window.location.href = "/autofill/std/details";
			}, 1500);
		}
		if (role === "Lecturer") {
			setTimeout(() => {
				window.location.href = "/autofill/lec/details";
			}, 1500);
		}
	};

	const [showAuthDialog, setShowAuthDialog] = useState(false);

	useEffect(() => {
		localStorage.removeItem("lec_autofill_details");
		localStorage.removeItem("std_autofill_details");
		localStorage.removeItem("checkin-data");
		localStorage.removeItem("checkedin?");
	}, []);

	return (
		<div className="landing-page">
			<h1>Welcome to the Attendance Tracker</h1>
			<span>Select your role to get started:</span>
			<div className="roles">
				<Link to="">
					<button
						className="role-button lecturer"
						onClick={() => setShowAuthDialog(true)}
					>
						I am a Lecturer
					</button>
				</Link>

				{showAuthDialog && <EnterAuthKey />}

				<Link to="/autofill/std/details">
					<button
						className="role-button student"
						onClick={() => handleClick("Student")}
					>
						I am a Student
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Landing;
