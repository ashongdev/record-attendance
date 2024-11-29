import Axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Entity, LocationType } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";

const StudentList = () => {
	const {
		studentList,
		setStudentList,
		setLecturerLatitude,
		setLecturerLongitude,
		lecturerLongitude,
		lecturerLatitude,
		lecAutofillDetails,
		role,
	} = useContextProvider();

	const getStudentList = async (courseCode: string, groupid: string) => {
		try {
			const res = await Axios.get(
				`https://record-attendance.onrender.com/lec/${
					// `http://localhost:4401/lec/${
					courseCode + "-" + groupid.toUpperCase()
				}`
			);
			const data: Entity[] = res.data;

			if (data.length >= 1) {
				setStudentList(data);
			} else {
				setEmpty("No match found for search.");
			}
		} catch (error) {
			console.log("error:", error);
		}
	};

	const getLecturersLocation = async (courseCode: string, groupid: string) => {
		try {
			if (!courseCode && !groupid) {
				setEmpty("Register course to view enrolled students.");

				return;
			}

			const res = await Axios.get(
				`https://record-attendance.onrender.com/lec/${
					courseCode + "-" + groupid.toUpperCase()
				}`
				// `http://localhost:4401/lec/${courseCode + "-" + groupid.toUpperCase()}`
			);

			const { lat, long }: LocationType = res.data;

			setLecturerLatitude(Number(lat.toFixed(2)));
			setLecturerLongitude(Number(long.toFixed(2)));
		} catch (error) {
			console.log("🚀 ~ error:", error);
			setEmpty("Could not get your location.");
		}
	};

	const [empty, setEmpty] = useState("");

	const fireEvent = () => {
		getLecturersLocation(lecAutofillDetails?.coursecode, lecAutofillDetails?.groupid);
		if (lecAutofillDetails?.coursecode && lecAutofillDetails?.groupid) {
			getStudentList(lecAutofillDetails?.coursecode, lecAutofillDetails?.groupid);
		}
	};
	useEffect(() => {
		fireEvent();

		if (role === "Lecturer") {
			localStorage.removeItem("checkedin?");
			localStorage.removeItem("checkin-data");
		}
	}, []);

	const currentDate = new Date().toLocaleString();

	return (
		<main>
			{lecAutofillDetails && (
				<div className="group-info">
					<button className="course-code">
						{lecAutofillDetails?.coursecode || "Code"}
					</button>
					<button className="group-id">Group {lecAutofillDetails?.groupid}</button>
					<button
						className="refresh-btn"
						onClick={fireEvent}
					>
						REFRESH
					</button>
					<button
						className="refresh-btn"
						onClick={() => window.print()}
					>
						Print
					</button>
				</div>
			)}

			<div className="display-list">
				<table>
					<thead>
						<tr className="list">
							<th>No.</th>
							<th>FullName</th>
							<th>Index No.</th>
							<th className="time">Time</th>
							<th className="present">Present</th>
						</tr>
					</thead>
					<tbody>
						{studentList.length > 0 ? (
							studentList.map((student, index) => (
								<tr
									className="list"
									key={student.id}
								>
									<td>{index + 1}</td>
									<td>{student.fullname}</td>
									<td>{student.indexnumber}</td>
									<td>
										{formatDistanceToNow(student.time, { addSuffix: true })}
									</td>
									<td>
										{lecturerLatitude === Number(student.lat.toFixed(2)) &&
										lecturerLongitude === Number(student.long.toFixed(2))
											? "IN"
											: "NOT IN"}
									</td>
								</tr>
							))
						) : (
							<p className="empty">{empty}</p>
						)}
					</tbody>
				</table>
			</div>

			<p className="date">
				Attendance for {lecAutofillDetails?.coursecode} as of {currentDate}
			</p>

			<div className="register">
				<Link
					to="/lec/register"
					className="register btn"
				>
					Register Group
				</Link>
			</div>
		</main>
	);
};

export default StudentList;
