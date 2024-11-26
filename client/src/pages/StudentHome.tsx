import { Link } from "react-router-dom";

const StudentHome = () => {
	return (
		<main>
			<fieldset>
				<legend>Students</legend>
				<div className="group cont">
					<p>Students should click on this button to check in into a course.</p>
					<Link to="/std/check-in">
						<button>Check In</button>
					</Link>
				</div>
			</fieldset>
		</main>
	);
};

export default StudentHome;
