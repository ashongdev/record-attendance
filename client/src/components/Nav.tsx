import { Link } from "react-router-dom";
import useContextProvider from "../hooks/useContextProvider";

const Nav = () => {
	const { role } = useContextProvider();

	return (
		<header className="flex">
			<nav className="flex">
				<Link to="/">
					<h1 style={{ textTransform: "capitalize" }}>Welcome</h1>
				</Link>

				<div className="right">
					<p style={{ textTransform: "uppercase" }}>{!role ? "Unidentified." : role}</p>
				</div>
			</nav>
		</header>
	);
};

export default Nav;
