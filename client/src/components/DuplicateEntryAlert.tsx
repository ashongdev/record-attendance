import { Dispatch, FC, SetStateAction } from "react";

interface Props {
	showDuplicateEntryAlert: boolean;
	setShowDuplicateEntryAlert: Dispatch<SetStateAction<boolean>>;
}

const DuplicateEntryAlert: FC<Props> = ({ setShowDuplicateEntryAlert }) => {
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
						No
					</button>
					<button
						className="yes"
						onClick={() => setShowDuplicateEntryAlert(false)}
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
