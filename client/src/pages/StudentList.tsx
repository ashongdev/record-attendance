import Axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LocationType, StudentType } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";

const StudentList = () => {
	const {
		studentList,
		setStudentList,
		setLecturerLatitude,
		setLecturerLongitude,
		lecturerLongitude,
		lecturerLatitude,
		registered,
	} = useContextProvider();
	const { getStorageItem } = useFunctions();

	const getStudentList = async (courseCode: string, groupid: string) => {
		try {
			const res = await Axios.get(
				`https://record-attendance.onrender.com/std/${
					courseCode + "-" + groupid.toUpperCase()
				}`
			);
			const data: StudentType[] = res.data;

			if (data.length >= 1) {
				setStudentList(data);
			} else {
				setEmpty("No match found for search.");
			}
		} catch (error) {
			console.log("🚀 ~ getStudentList ~ error:", error);
		}
	};

	const getLecturersLocation = async (courseCode: string, groupid: string) => {
		try {
			if (!courseCode && !groupid) {
				console.log("🚀 ~ getStudentList ~ error:", "Invalid course code and groupid");
				setEmpty("Register course to view enrolled students.");

				return;
			}

			const res = await Axios.get(
				`https://record-attendance.onrender.com/lec/${
					courseCode + "-" + groupid.toUpperCase()
				}`
			);

			const { lat, long }: LocationType = res.data;

			setLecturerLatitude(Number(lat.toFixed(2)));
			setLecturerLongitude(Number(long.toFixed(2)));
		} catch (error) {
			setEmpty("Could not get your location.");

			console.log("🚀 ~ getStudentList ~ error:", error);
		}
	};

	const lec = getStorageItem("lec", null);

	const [empty, setEmpty] = useState("");

	const fireEvent = () => {
		getLecturersLocation(lec?.coursecode, lec?.groupid);
		if (lec?.coursecode && lec?.groupid) {
			getStudentList(lec?.coursecode, lec?.groupid);
		}
	};
	useEffect(() => {
		// todo = also check lecturers name and coursename
		fireEvent();
	}, []);

	return (
		<main>
			<div className="group-info">
				<div className="course-code">{lec?.coursecode || "Course Code"}</div>
				<div className="group-id">GROUP {lec?.groupid || "Unknown"}</div>

				<button
					className="refresh-btn"
					onClick={fireEvent}
				>
					Refresh
				</button>
			</div>

			<div className="display-list">
				<table>
					<thead>
						<tr className="list">
							<th>No.</th>
							<th>FullName</th>
							<th>Index No.</th>
							<th>Time</th>
							<th>Present</th>
						</tr>
					</thead>
					<tbody>
						{studentList.length > 0 ? (
							studentList.map((student, index) => (
								<tr
									className="list"
									key={student.indexnumber}
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

			<div className="check-in">
				{!registered && (
					<Link
						to="/lec/register"
						className="btn"
					>
						Click here to register course
					</Link>
				)}
			</div>
		</main>
	);
};

export default StudentList;
