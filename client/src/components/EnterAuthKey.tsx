import { useState } from "react";
import useContextProvider from "../hooks/useContextProvider";

const EnterAuthKey = () => {
	const { authenticate } = useContextProvider();

	const [key, setKey] = useState("");
	const [courseName, setCourseName] = useState("");

	return (
		<div className="modal">
			<form
				className="container"
				onSubmit={(e) => {
					e.preventDefault();

					key !== null && key.length > 0 && authenticate(key, courseName);
				}}
			>
				<p>Enter Auth Key to verify identity.</p>

				<div className="details">
					<div>
						<input
							type="password"
							placeholder="Enter auth key"
							security=""
							value={key}
							onChange={(e) => setKey(e.target.value)}
						/>
					</div>
					<div>
						<input
							type="text"
							placeholder="Enter course title"
							security=""
							value={courseName}
							onChange={(e) => setCourseName(e.target.value)}
						/>
					</div>
				</div>

				<div className="buttons">
					<button>Verify</button>
				</div>

				<p className="message">
					*Authentication key is provided by the administrator. Please see your faculty
					head to get the auth key for your course.
				</p>
			</form>
		</div>
	);
};

export default EnterAuthKey;
