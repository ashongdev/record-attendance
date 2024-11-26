import { Link } from "react-router-dom";
import useContextProvider from "../hooks/useContextProvider";

const StudentHome = () => {
	const { registered } = useContextProvider();

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
