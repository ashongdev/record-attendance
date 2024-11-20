import { Link } from "react-router-dom";
import useContextProvider from "../hooks/useContextProvider";

const Home = () => {
	const { registered } = useContextProvider();

	return (
		<main>
			<div className="group cont">
				<p>
					Lecturers should use this button to register a course. Share the code to your
					students to record their attendance.
				</p>
				<Link to="/lec/sign-in">
					<button>Register Course</button>
				</Link>
			</div>

			<div className="group cont">
				<p>Students should click on this button to check in into a course.</p>
				<Link to="/std/check-in">
					<button>Check In</button>
				</Link>
			</div>

			{registered && (
				<div>
					<Link to="/lec/home">See Student List</Link>
				</div>
			)}
		</main>
	);
};

export default Home;
