import { Link } from "react-router-dom";
import useFunctions from "../hooks/useFunctions";

const Nav = () => {
	const { getStorageItem } = useFunctions();

	const role = getStorageItem("role", null);

	return (
		<header>
			<nav>
				<Link to="/">
					<h1>ClassTrack</h1>
				</Link>

				<div className="right">
					<p>{!role ? "Unidentified." : role}</p>
				</div>
			</nav>
		</header>
	);
};

export default Nav;
