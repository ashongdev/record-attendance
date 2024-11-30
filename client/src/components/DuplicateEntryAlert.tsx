import Axios from "axios";
import { Dispatch, FC, SetStateAction } from "react";
import { RegisterType } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";

interface Props {
	data: RegisterType | null;
	setShowDuplicateEntryAlert: Dispatch<SetStateAction<boolean>>;
}

const DuplicateEntryAlert: FC<Props> = ({ setShowDuplicateEntryAlert, data }) => {
	const { lecturerLatitude, lecturerLongitude } = useContextProvider();
	const getDetails = async () => {
		try {
			const response = await Axios.post(
				// "http://localhost:4401/lec/get-details",
				"https://record-attendance.onrender.com/lec/get-details",
				{ data, lecturerLatitude, lecturerLongitude }
			);

			if (response.data) {
				localStorage.setItem("lec_autofill_details", JSON.stringify(response.data));
				setShowDuplicateEntryAlert(false);

				setTimeout(() => (window.location.href = "/lec/home"), 1500);
			}
		} catch (error) {
			console.log("🚀 ~ getDetails ~ error:", error);
		}
	};

	return (
		<div className="modal">
			<div className="container">
				<h1>Is this you?</h1>

				<div className="details">
					<div>
						<span>Course Name: </span>
						{data?.coursename}
					</div>
					<div>
						<span>Course Code: </span> {data?.coursecode}
					</div>
					<div>
						<span>Group: </span>
						{data?.groupid}
					</div>
					<div>
						<span>Full Name: </span>
						{data?.fullname}
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
						onClick={getDetails}
					>
						Yes
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
