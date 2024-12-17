import Axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Entity } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";
import search from "../images/search-outline.svg";

const StudentList = () => {
	const { studentList, setStudentList, lecAutofillDetails } = useContextProvider();
	const { getStorageItem } = useFunctions();

	const currentDate = new Date().toLocaleString();
	const [searchValue, setSearchValue] = useState("");
	const [filteredStudentList, setFilteredStudentList] = useState(studentList);

	const searchStudent = () => {
		const trimmedSearchValue = searchValue.trim();
		setSearchValue(trimmedSearchValue);

		if (!trimmedSearchValue) {
			setFilteredStudentList([]);
			return;
		}

		const exactMatches = studentList.filter(({ indexnumber }) =>
			indexnumber.includes(trimmedSearchValue)
		);

		if (exactMatches.length > 0) {
			setFilteredStudentList(exactMatches);
			return;
		}

		// ! Check indexnumber before adding user
		// Find the closest match by comparing the start of the index numbers
		const closestMatch = studentList.reduce<Entity | null>((closest, current) => {
			// Compare if one indexnumber starts with the searchValue
			if (current.indexnumber.startsWith(trimmedSearchValue)) {
				return current; // Take the first valid match
			}

			return closest;
		}, null);

		if (closestMatch) {
			setFilteredStudentList([closestMatch]);
			return;
		}

		// No matches at all
		setFilteredStudentList([]);
		console.log("No matches found.");
	};

	useEffect(() => {
		searchStudent();
	}, [searchValue]);

	const getStudents = async (groupid: string, coursecode: string) => {
		try {
			const res = await Axios.post(
				`https://record-attendance.onrender.com//lec/get-students`,
				// `http://localhost:4402/lec/get-students`,
				{ groupid, coursecode }
			);

			const data: Entity[] = res.data;
			if (data) {
				setStudentList(res.data);
			}
		} catch (error) {
			console.log("🚀 ~ getStudents ~ error:", error);
		}
	};

	const updateLastChecked = async (
		date: Date,
		coursecode: string,
		groupid: string,
		studentId?: string
	) => {
		try {
			const res = await Axios.post(
				`https://record-attendance.onrender.com/lec/last-checked`,
				// `http://localhost:4402/lec/last-checked`,
				{ date, coursecode, groupid, studentId }
			);

			const data: Entity[] = res.data;

			localStorage.setItem("date", JSON.stringify(date.getDate()));
		} catch (error) {
			console.log("🚀 ~ getStudents ~ error:", error);
		}
	};

	const date = getStorageItem("date", null);

	useEffect(() => {
		if (lecAutofillDetails?.coursecode && lecAutofillDetails?.groupid) {
			getStudents(lecAutofillDetails.groupid, lecAutofillDetails.coursecode);
		}
	}, []);

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
						onClick={() =>
							getStudents(lecAutofillDetails.groupid, lecAutofillDetails.coursecode)
						}
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

			<div>
				<input
					type="text"
					placeholder="Search index number"
					value={searchValue}
					maxLength={10}
					onChange={(e) => {
						setSearchValue(e.target.value);
					}}
				/>

				<div>
					<img
						src={search}
						alt=""
						className="icon"
					/>
				</div>
			</div>

			<div className="display-list">
				<table>
					<thead>
						<tr className="list">
							<th>No.</th>
							<th>FullName</th>
							<th>Index No.</th>
							<th className="present">Status</th>
						</tr>
					</thead>
					<tbody>
						{filteredStudentList.length > 0
							? filteredStudentList.map(({ fullname, id, indexnumber }, index) => (
									<tr
										className="list"
										key={id}
									>
										<td>{index + 1}</td>
										<td>{fullname}</td>
										<td>{indexnumber}</td>
										<td>
											<input type="checkbox" />
										</td>
									</tr>
							  ))
							: filteredStudentList.length === 0 &&
							  studentList.length > 0 &&
							  studentList.map(
									(
										{ fullname, id, indexnumber, last_checked, checked },
										index
									) => (
										<tr
											className="list"
											key={id}
										>
											<td>{index + 1}</td>
											<td>{fullname}</td>
											<td>{indexnumber}</td>
											<td>
												<input
													type="checkbox"
													onClick={() => {
														updateLastChecked(
															new Date(),
															lecAutofillDetails.coursecode,
															lecAutofillDetails.groupid,
															indexnumber
														);
													}}
													defaultChecked={
														new Date(last_checked).toDateString() ===
														new Date().toDateString()
															? checked === "true"
																? true
																: false
															: false
													}
												/>
											</td>
										</tr>
									)
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
