import { yupResolver } from "@hookform/resolvers/yup";
import Axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DuplicateEntryAlert from "../components/DuplicateEntryAlert";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert";
import { RegisterType } from "../exports/exports";
import { SignInSchema } from "../exports/Schemas";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";

const RegisterCourse = () => {
	const { lecAutofillDetails, authenticate } = useContextProvider();
	const { getStorageItem } = useFunctions();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(SignInSchema),
	});

	const [error, setError] = useState({ header: "", description: "" });
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showDuplicateEntryAlert, setShowDuplicateEntryAlert] = useState(false);

	const [data, setData] = useState<RegisterType | null>(
		getStorageItem("lec_autofill_details", null)
	);

	const auth: { status: boolean; key: string; coursename: string } = getStorageItem("auth", null);

	useEffect(() => {
		if (data) {
			setValue("coursename", data.coursename);
			setValue("coursecode", data.coursecode);
			setValue("fullname", data.fullname);
		}

		if (!auth.key && !auth.coursename) return;

		authenticate(auth.key, auth.coursename);
	}, []);

	// Handle form submission
	const formSubmit = async (data: RegisterType) => {
		const newFormInput = {
			...data,
			last_checked: new Date(),
		};

		setLoading(true);
		try {
			const response = await Axios.post(
				// "http://localhost:4000/register-course",
				"https://record-attendance.onrender.com/register-course",
				newFormInput
			);

			if (response.data) {
				localStorage.setItem("lec_autofill_details", JSON.stringify(response.data));
				setData(response.data);

				setLoading(false);
				setSuccessMessage("Course registered successfully!");
				setShowSuccessMessage(true);
				setTimeout(() => setShowSuccessMessage(false), 1500);
				setTimeout(() => (window.location.href = "/lec/home"), 1500);
			}
		} catch (err) {
			setLoading(false);
			setShowErrorMessage(true);

			if (err instanceof AxiosError && err.response) {
				const { data: errorData } = err.response;
				const reqError: string = errorData;

				if (/double entry detected/i.test(reqError)) {
					setData(data);
					setError({
						header: "Duplicate Entry.",
						description: "An entry with the same details already exists.",
					});

					setShowDuplicateEntryAlert(true);
				} else {
					console.log(err);
					setError({
						header: "Unexpected Error",
						description: "An unexpected error occurred. Please try again later.",
					});
				}
			} else {
				console.log(err);
				setError({
					header: "Unexpected Error",
					description: "An unexpected error occurred. Please try again later.",
				});
			}
			setTimeout(() => setShowErrorMessage(false), 3000);
		}
	};

	return (
		<main>
			{showErrorMessage && (
				<ErrorAlert
					error={error}
					setShowErrorMessage={setShowErrorMessage}
				/>
			)}

			{showSuccessMessage && (
				<SuccessAlert
					successMessage={successMessage}
					setShowSuccessMessage={setShowSuccessMessage}
				/>
			)}

			{showDuplicateEntryAlert && (
				<DuplicateEntryAlert
					data={data}
					setShowDuplicateEntryAlert={setShowDuplicateEntryAlert}
				/>
			)}

			<form
				className="flex"
				onSubmit={handleSubmit(formSubmit)}
			>
				<label htmlFor="coursename">Enter Course Title</label>
				<div className="group">
					<input
						type="text"
						id="coursename"
						{...register("coursename")}
						disabled={lecAutofillDetails?.coursename ? true : false}
						title={lecAutofillDetails?.coursename && "Has been autofilled."}
						placeholder="e.g., African Studies"
					/>
					<p className="error">{errors.coursename?.message}</p>
				</div>

				<label htmlFor="coursecode">Enter Course Code</label>
				<div className="group">
					<input
						type="text"
						id="coursecode"
						{...register("coursecode")}
						maxLength={10}
						placeholder="e.g., AFR-291"
						title={lecAutofillDetails?.coursecode && "Has been autofilled."}
						disabled={lecAutofillDetails?.coursecode ? true : false}
					/>
					<p className="error">{errors.coursecode?.message}</p>
				</div>

				<label htmlFor="groupid">Select Group</label>
				<div className="group">
					<select
						id="groupid"
						{...register("groupid")}
					>
						<option value="">--Select group--</option>
						{["A", "B", "C", "D", "E", "F", "G"].map((group) => (
							<option
								key={group}
								value={group.toLowerCase()}
							>
								{group}
							</option>
						))}
					</select>
					<p className="error">{errors.groupid?.message}</p>
				</div>

				<label htmlFor="fullname">Enter Your Name</label>
				<div className="group">
					<input
						type="text"
						id="fullname"
						{...register("fullname")}
						placeholder="e.g., John Doe"
						disabled={lecAutofillDetails?.fullname ? true : false}
						title={lecAutofillDetails?.fullname && "Has been autofilled."}
					/>
					<p className="error">{errors.fullname?.message}</p>
				</div>

				<div className="group">
					{!loading ? (
						<button type="submit">Register Course</button>
					) : (
						<div className="loader-cont">
							<div className="loader" />
						</div>
					)}
				</div>
			</form>
		</main>
	);
};

export default RegisterCourse;
