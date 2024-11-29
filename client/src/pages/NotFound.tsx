import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<main>
			<h1>This URL does not exist.</h1>
			<p className="url">{window.location.pathname}</p>
			<Link
				to="/"
				className="not-found"
			>
				Go back home
			</Link>
		</main>
	);
};

export default NotFound;
