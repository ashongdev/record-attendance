import Axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { Entity } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";
import search from "../images/search-outline.svg";
import History from "./History";

const StudentList = () => {
	const { studentList, setStudentList, lecAutofillDetails, socket, authenticate } =
		useContextProvider();
	const { getStorageItem } = useFunctions();

	const currentDate = new Date().toLocaleString();
	const [searchValue, setSearchValue] = useState("");
	const searchRef = useRef<HTMLInputElement>(null);
	const [filteredStudentList, setFilteredStudentList] = useState(studentList);
	const [showStudentHistory, setShowStudentHistory] = useState(false);
	const [historyQueryIndex, setHistoryQueryIndex] = useState("");

	const storedStudentList = getStorageItem("studentList", null);
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
			setFilteredStudentList(storedStudentList);
			return;
		}

		if (exactMatches.length < 1) {
			setFilteredStudentList([]);

			return;
		}
	};

	const auth: { status: boolean; key: string; coursename: string } = getStorageItem("auth", null);

	useEffect(() => {
		searchStudent();
	}, [searchValue]);

	const getStudents = async (groupid: string, coursecode: string) => {
		try {
			const res = await Axios.post(
				`https://record-attendance.onrender.com/lec/get-students`,
				// `http://localhost:4000/lec/get-students`,
				{ groupid, coursecode }
			);

			const data = res.data;
			if (data) {
				setStudentList(data);

				localStorage.setItem("studentList", JSON.stringify(data));
			}
		} catch (error) {
			console.log("🚀 ~ getStudents ~ error:", error);
		}
	};

	useEffect(() => {
		if (!auth.key || !auth.coursename) {
			window.location.href = "/";

			return;
		}
		authenticate(auth.key, auth.coursename);

		socket.on("updateLastChecked", () => {
			getStudents(lecAutofillDetails.groupid, lecAutofillDetails.coursecode);
		});
	}, []);

	const updateLastChecked = async (
		date: Date,
		coursecode: string,
		groupid: string,
		studentId?: string
	) => {
		try {
			socket.emit("updateLastChecked", { date, coursecode, groupid, studentId });
		} catch (error) {
			alert("An unexpected error occurred. Please try again.");
			console.log("🚀 ~ getStudents ~ error:", error);
		}
	};
	const [isInputFocused, setIsInputFocused] = useState(false);

	const generateExcelFile = (studentList: Entity[]) => {
		try {
			const data = [
				[
					`Attendance for ${lecAutofillDetails?.coursecode} GROUP ${
						lecAutofillDetails?.groupid
					} as at ${new Date().toDateString()} ${currentDate}`,
				],
				[""],
				["No.", "Index Number", "Full Name", "Status"],
			];

			studentList.forEach((student: Entity, index) => {
				data.push([
					(index + 1).toString(),
					student.indexnumber,
					student.fullname,
					student.checked === true ? "Present" : "Absent",
				]);
			});

			data.push([""]);
			data.push([`Total Number of Students: ${studentList.length.toString()}`]);

			// Create a worksheet
			const worksheet = XLSX.utils.aoa_to_sheet(data);

			// Create a workbook and append the worksheet
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

			// Export the workbook as a file
			XLSX.writeFile(workbook, "Attendance.xlsx");
		} catch (error) {
			console.log("Error generating excel file");
		}
	};

	useEffect(() => {
		if (lecAutofillDetails?.coursecode && lecAutofillDetails?.groupid) {
			getStudents(lecAutofillDetails.groupid, lecAutofillDetails.coursecode);
		}
	}, []);

	const [showSearchBar, setShowSearchBar] = useState(false);

	return (
		<main>
			{lecAutofillDetails && (
				<>
					<div className={`group-info ${isInputFocused ? "hidden" : ""}`}>
						<button className="course-code">
							{lecAutofillDetails?.coursecode || "Code"}
						</button>

						<button className="group-id">Group {lecAutofillDetails?.groupid}</button>

						{lecAutofillDetails.groupid && lecAutofillDetails.coursecode && (
							<button
								className="refresh-btn"
								onClick={() =>
									getStudents(
										lecAutofillDetails.groupid,
										lecAutofillDetails.coursecode
									)
								}
							>
								REFRESH
							</button>
						)}

						<button
							className="refresh-btn"
							onClick={() => studentList.length > 0 && generateExcelFile(studentList)}
						>
							Generate Report
						</button>

						<button
							className="refresh-btn"
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => {
								setShowSearchBar(true);
								setTimeout(() => {
									searchRef.current && searchRef.current.focus();
								}, 10);
							}}
						>
							<img
								src={search}
								alt=""
								className="icon"
							/>
						</button>
					</div>

					{showSearchBar && (
						<div className={`search-bar ${isInputFocused ? "focused" : ""}`}>
							<input
								type="text"
								placeholder="Search by index number"
								value={searchValue}
								maxLength={10}
								ref={searchRef}
								onFocus={() => setIsInputFocused(true)}
								onBlur={(e) => {
									if (
										!e.relatedTarget ||
										(e.relatedTarget !== searchRef.current &&
											e.relatedTarget.nodeName !== "BUTTON")
									) {
										setIsInputFocused(false);
										setShowSearchBar(false);
									}
								}}
								onChange={(e) => {
									setSearchValue(e.target.value);
								}}
							/>
							<button
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => searchRef.current && searchRef.current.focus()}
							>
								<img
									src={search}
									alt=""
									className="icon"
								/>
							</button>
						</div>
					)}
				</>
			)}

			{showStudentHistory && (
				<History
					historyQueryIndex={historyQueryIndex}
					setShowStudentHistory={setShowStudentHistory}
				/>
			)}

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
						{filteredStudentList.length >= 0 && searchValue.length > 0
							? filteredStudentList.map(
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
															new Date().toDateString() && checked
													}
												/>
											</td>
										</tr>
									)
							  )
							: filteredStudentList.length === 0 &&
							  searchValue.length === 0 &&
							  studentList.length > 0 &&
							  studentList.map(
									(
										{ fullname, id, indexnumber, last_checked, checked },
										index
									) => {
										return (
											<tr
												className="list"
												key={id}
												onClick={() => {
													setShowStudentHistory(true);
													setHistoryQueryIndex(indexnumber);
												}}
												title="Click to view student attendance history"
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
															new Date(
																last_checked
															).toDateString() ===
															new Date().toDateString()
																? checked
																: false
														}
													/>
												</td>
											</tr>
										);
									}
							  )}
					</tbody>
				</table>
			</div>

			<p className="date">
				Attendance for {lecAutofillDetails?.coursecode} as at {currentDate}
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
