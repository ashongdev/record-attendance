import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Entity } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";

const StudentHome = () => {
	const { getStorageItem } = useFunctions();
	const { role } = useContextProvider();
	const hasCheckedIn = getStorageItem("checkedin?", null);
	const checkInData: Entity = getStorageItem("checkin-data", null);

	useEffect(() => {
		if (role === "Student") {
			localStorage.removeItem("lec_autofill_details");
		}
	}, []);

	return (
		<main>
			<fieldset>
				<legend>Students</legend>
				<div className="group cont">
					{!hasCheckedIn ? (
						<p>Students should click on this button to check in into a course.</p>
					) : (
						<p>Recent Checkin Details</p>
					)}

					{checkInData && hasCheckedIn && (
						<>
							<div className="details">
								<div>
									<span>Course Code: </span>
									{checkInData.coursecode}
								</div>
								<div>
									<span>Group: </span>
									{checkInData.groupid}
								</div>
								<div>
									<span>Full Name: </span>
									{checkInData.fullname}
								</div>
								<div>
									<span>Index Number: </span>
									{checkInData.indexnumber}
								</div>
							</div>
						</>
					)}

					<Link
						to="/std/check-in"
						style={{ marginTop: "2rem" }}
					>
						<button>Check In</button>
					</Link>
				</div>
			</fieldset>
		</main>
	);
};

export default StudentHome;
