import { Link } from "react-router-dom";
import useFunctions from "../hooks/useFunctions";

const Nav = () => {
	const { getStorageItem } = useFunctions();

	const lec = getStorageItem("lec", null);

	return (
		<header className="flex">
			<nav className="flex">
				<Link to={lec?.coursecode && "/lec/home"}>
					<h1 style={{ textTransform: "capitalize" }}>
						{/* {lec?.coursecode ? lec?.coursecode : "Course Name"} - Attendance */}
						Home
					</h1>
				</Link>

				<div className="right">
					<p style={{ textTransform: "capitalize" }}>
						{/* {lec?.coursename ? lec?.coursename : "Course Name"} */}
					</p>
					<p style={{ textTransform: "capitalize" }}>
						{/* {lec?.fullname ? lec?.fullname : "Lecturer Name"} */}
					</p>
				</div>
			</nav>
		</header>
	);
};

export default Nav;
