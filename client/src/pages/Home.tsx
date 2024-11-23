import { Link } from "react-router-dom";
import useContextProvider from "../hooks/useContextProvider";

const Home = () => {
	const { registered } = useContextProvider();

	return (
		<main>
			<fieldset>
				<legend>Lecturer</legend>

				<div className="group cont">
					<p>
						Lecturers should use this button to register a course. Share the code to
						your students to record their attendance.
					</p>
					<Link to="/lec/register">
						<button>Register Course</button>
					</Link>
				</div>

				<div className="group cont">
					<p>Already registered a course? Click here to login.</p>

					<div>
						<Link
							to="/std/check-in"
							className="margin-right"
						>
							<button>Log in</button>
						</Link>
						<p className="margin-right">OR</p>
						<Link
							to="/lec/home"
							// className="group cont"
						>
							<button className="home-link">View Student List</button>
						</Link>
					</div>
				</div>

				{/* {registered && ( */}
				{/* <Link
					to="/lec/home"
					className="group cont"
				>
					<button className="home-link">View Student List</button>
				</Link> */}
				{/* // // )} */}
			</fieldset>

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

export default Home;
