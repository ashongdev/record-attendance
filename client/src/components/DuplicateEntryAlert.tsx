import { Dispatch, FC, SetStateAction } from "react";
import { RegisterType } from "../exports/exports";

interface Props {
	data: RegisterType | null;
	setShowDuplicateEntryAlert: Dispatch<SetStateAction<boolean>>;
}

const DuplicateEntryAlert: FC<Props> = ({ setShowDuplicateEntryAlert, data }) => {
	const getDetails = async () => {
		localStorage.setItem("lec", JSON.stringify(data));
		setShowDuplicateEntryAlert(false);

		setTimeout(() => {
			window.location.href = "/";
		}, 1500);
	};

	return (
		<div className="modal">
			<div className="container">
				<h1>Is this you?</h1>

				<div className="details">
					<div>
						<span>Course Name: </span>Comm Skills
					</div>
					<div>
						<span>Course Code: </span> ENG-119
					</div>
					<div>
						<span>Group: </span>E
					</div>
					<div>
						<span>Full Name: </span>Edmond Okyere
					</div>
				</div>

				<div className="buttons">
					<button
						className="no"
						onClick={() => setShowDuplicateEntryAlert(false)}
					>
						No, it's not
					</button>
					<button
						className="yes"
						onClick={getDetails}
					>
						Yes, it's me
					</button>
				</div>

				<p className="message">
					*If this is not you, enter a unique value to register a new course.
				</p>
			</div>
		</div>
	);
};

export default DuplicateEntryAlert;
