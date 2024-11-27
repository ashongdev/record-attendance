import { yupResolver } from "@hookform/resolvers/yup";
import Axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DuplicateEntryAlert from "../components/DuplicateEntryAlert";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert";
import { SignInType } from "../exports/exports";
import { SignInSchema } from "../exports/Schemas";
import useContextProvider from "../hooks/useContextProvider";

const SignIn = () => {
	const { setLecturerLatitude, setLecturerLongitude, lecturerLongitude, lecturerLatitude } =
		useContextProvider();

	const {
		register,
		handleSubmit,
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

	// Get the geolocation of the lecturer
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;

					setLecturerLongitude(Number(longitude));
					setLecturerLatitude(Number(latitude));
				},
				(error) => {
					console.error("Error getting location:", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}, []);

	// Handle form submission
	const formSubmit = async (data: SignInType) => {
		const newFormInput = {
			...data,
			time: new Date(),
			long: lecturerLongitude,
			lat: lecturerLatitude,
		};

		// if (lecturerLongitude && lecturerLatitude) {
		setLoading(true);
		try {
			const response = await Axios.post(
				"http://localhost:4401/sign-in",
				// "https://record-attendance.onrender.com/sign-in",
				newFormInput
			);

			if (response.data) {
				localStorage.setItem("lec", JSON.stringify(response.data));
				setLoading(false);
				setSuccessMessage(
					"Course registered successfully! You can now view the enrolled students on the home page."
				);
				setShowSuccessMessage(true);
				setTimeout(() => setShowSuccessMessage(false), 2000);
			}
		} catch (err) {
			setLoading(false);
			setShowErrorMessage(true);

			setTimeout(() => setShowErrorMessage(false), 3000);

			if (err instanceof AxiosError && err.response) {
				const { data } = err.response;
				const reqError: string = data;

				if (/double entry detected/i.test(reqError)) {
					setError({
						header: "Duplicate Entry.",
						description: "An entry with the same details already exists.",
					});
					setShowDuplicateEntryAlert(true);
				} else {
					setError({
						header: "Unexpected Error",
						description: "An unexpected error occurred. Please try again later.",
					});
				}
			} else {
				setError({
					header: "Unexpected Error",
					description: "An unexpected error occurred. Please try again later.",
				});
			}
		}
		// } else {
		// 	setShowErrorMessage(true);
		// 	setTimeout(() => setShowErrorMessage(false), 3000);
		// }
	};

	return (
		<main>
			{error && showErrorMessage && (
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
					showDuplicateEntryAlert={showDuplicateEntryAlert}
					setShowDuplicateEntryAlert={setShowDuplicateEntryAlert}
				/>
			)}

			<form
				className="flex flex-col gap-4"
				onSubmit={handleSubmit(formSubmit)}
			>
				<label htmlFor="coursename">Enter Course Title</label>
				<div className="group">
					<input
						type="text"
						id="coursename"
						{...register("coursename")}
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
					/>
					<p className="error">{errors.fullname?.message}</p>
				</div>

				<div className="group">
					{!loading ? (
						<button type="submit">Register Course</button>
					) : (
						<div className="loader" />
					)}
				</div>
			</form>
		</main>
	);
};

export default SignIn;
