import { yupResolver } from "@hookform/resolvers/yup";
import Axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert";
import { CheckInType } from "../exports/exports";
import { CheckInSchema } from "../exports/Schemas";
import useContextProvider from "../hooks/useContextProvider";

const CheckIn = () => {
	/**
	 * 
	todo:
	1. Time-Limited Check-In
		- Restrict check-in to a specific time window (e.g., the first 5 minutes of class).
		- Disable check-ins once the window closes, making it harder for absent students to exploit the system. 
	*/

	const { stdAutofillDetails } = useContextProvider();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(CheckInSchema),
		defaultValues: {
			fullname: stdAutofillDetails?.fullname,
			groupid: stdAutofillDetails?.groupid,
			indexnumber: stdAutofillDetails?.indexnumber,
		},
	});

	const [error, setError] = useState({ header: "", description: "" });
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [loading, setLoading] = useState(false);

	// Form submission handler
	const formSubmit = async (data: CheckInType) => {
		setLoading(true);

		try {
			const res = await Axios.post(
				// "http://localhost:4402/check-in",
				"https://record-attendance.onrender.com/check-in",
				{ ...data, last_checked: new Date() }
			);
			if (res.data) {
				setLoading(false);
				setSuccessMessage("You have successfully enrolled.");
				setShowSuccessMessage(true);
				setTimeout(() => setShowSuccessMessage(false), 2000);

				localStorage.setItem("checkedin?", JSON.stringify(true));
				localStorage.setItem("checkin-data", JSON.stringify({ ...data, time: new Date() }));
			}
		} catch (err) {
			setLoading(false);
			setShowErrorMessage(true);

			if (err instanceof AxiosError && err.response) {
				const reqError: string = err.response.data;
				if (/not registered/i.test(reqError)) {
					setError({
						header: "Invalid Course",
						description:
							"Invalid course code or group ID. Verify your input or check with your lecturer.",
					});
				} else if (/double entry detected/i.test(reqError)) {
					setError({
						header: "Duplicate Entry",
						description: "An entry with the same details already exists.",
					});
				} else {
					setError({
						header: "Unexpected Error",
						description: "Something went wrong. Please try again later.",
					});
				}
			} else {
				setError({
					header: "Network Error",
					description: "Unable to connect to the server. Please try again.",
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

			<form
				className="flex"
				onSubmit={handleSubmit(formSubmit)}
			>
				<div className="group">
					<label htmlFor="fullname">Full Name</label>
					<input
						type="name"
						{...register("fullname")}
						placeholder="e.g., Miles Morales"
						title={stdAutofillDetails?.fullname && "Has been autofilled."}
						disabled={stdAutofillDetails?.fullname ? true : false}
					/>
					<p className="error">{errors.fullname?.message}</p>
				</div>

				<div className="group">
					<label htmlFor="coursecode">Course Code</label>
					<input
						type="text"
						id="coursecode"
						maxLength={10}
						{...register("coursecode")}
						placeholder="e.g., AFR-291"
					/>
					<p className="error">{errors.coursecode?.message}</p>
				</div>

				<div className="group">
					<label htmlFor="groupid">Group</label>
					<select
						id="groupid"
						{...register("groupid")}
						title={stdAutofillDetails?.groupid && "Has been autofilled."}
						disabled={stdAutofillDetails?.groupid ? true : false}
					>
						<option value="">--Select Group--</option>
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

				<div className="group">
					<label htmlFor="indexnumber">Index Number</label>
					<input
						type="text"
						id="indexnumber"
						maxLength={10}
						{...register("indexnumber")}
						placeholder="e.g., 421123890"
						title={stdAutofillDetails?.indexnumber && "Has been autofilled."}
						disabled={stdAutofillDetails?.indexnumber ? true : false}
					/>
					<p className="error">{errors.indexnumber?.message}</p>
				</div>

				<div className="group">
					{!loading ? (
						<button type="submit">Check In</button>
					) : (
						<div className="loader" />
					)}
				</div>
			</form>
		</main>
	);
};

export default CheckIn;
