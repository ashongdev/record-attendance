import Axios from "axios";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";

interface Props {
	historyQueryIndex: string;
	setShowStudentHistory: Dispatch<SetStateAction<boolean>>;
}

const History: FC<Props> = ({ historyQueryIndex, setShowStudentHistory }) => {
	const { lecAutofillDetails } = useContextProvider();
	const { getStorageItem } = useFunctions();
	const [historyData, setHistoryData] = useState({ name: "", noOfTimes: 0 });

	const noOfTimes: number = getStorageItem("noOfTimes", null);

	const getStudentsHistory = async (studentId: string) => {
		try {
			const res = await Axios.get(`http://localhost:4000/lec/get-history/${studentId}`);

			if (res.data) {
				setShowStudentHistory(true);
				setHistoryData(res.data);
			}
		} catch (error) {
			alert("An unexpected error occurred. Please try again.");
			console.log("🚀 ~ getStudents ~ error:", error);
		}
	};
	useEffect(() => {
		getStudentsHistory(historyQueryIndex);
	}, []);

	return (
		<div className="modal">
			<div className="history-container">
				<button
					className="close-button"
					onClick={() => setShowStudentHistory(false)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18 18 6M6 6l12 12"
						/>
					</svg>
				</button>
				<p>{historyData.name} </p>
				<p>{historyQueryIndex}</p>
				<p>{lecAutofillDetails.coursecode}</p>
				<p>{lecAutofillDetails.groupid}</p>
				<p>
					Has been to{" "}
					{((historyData.noOfTimes / Number(noOfTimes) || 0) * 100).toFixed(2)}% of your
					class
				</p>
				<p>
					{historyData.noOfTimes} out of {noOfTimes} times
				</p>
			</div>
		</div>
	);
};

export default History;
