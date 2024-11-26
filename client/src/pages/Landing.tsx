import { Link } from "react-router-dom";
import "../styles/Landing.css";

const LandingPage = () => {
	return (
		<div className="landing-page">
			<h1>Welcome to the Attendance Tracker</h1>
			<p>Select your role to get started:</p>
			<div className="roles">
				<Link to="/lec/home">
					<button className="role-button lecturer">I am a Lecturer</button>
				</Link>
				<Link to="/std/home">
					<button className="role-button student">I am a Student</button>
				</Link>
			</div>
		</div>
	);
};

export default LandingPage;
