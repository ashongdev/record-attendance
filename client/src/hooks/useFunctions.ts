import { Dispatch, SetStateAction } from "react";
import * as XLSX from "xlsx";
import { Entity, LecturerType } from "../exports/exports";

const useFunctions = () => {
	const getStorageItem = (itemName: string, returnItem: null | [] | undefined | boolean) => {
		const storedItem = localStorage.getItem(itemName);
		try {
			return storedItem ? JSON.parse(storedItem) : returnItem;
		} catch (error) {
			console.error("Error parsing opt changes from localStorage:", error);
			return null;
		}
	};

	const currentDate = new Date().toLocaleString();
	const generateExcelFile = (
		studentList: Entity[],
		lecAutofillDetails: Omit<LecturerType, "checked">
	) => {
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

	const storedStudentList = getStorageItem("studentList", null);
	const searchStudent = (
		setSearchValue: Dispatch<SetStateAction<string>>,
		searchValue: string,
		studentList: Entity[],
		setFilteredStudentList: Dispatch<SetStateAction<Entity[]>>
	) => {
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
			setFilteredStudentList(storedStudentList);
			return;
		}

		if (exactMatches.length < 1) {
			setFilteredStudentList([]);

			return;
		}
	};

	return { getStorageItem, generateExcelFile, searchStudent };
};

export default useFunctions;
