import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SuccessAlert from "../components/SuccessAlert";
import { saveLecDataSchema } from "../exports/Schemas";
import { RegisterType } from "../exports/exports";

const LecturerDetailsForm = () => {
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(saveLecDataSchema),
	});

	const formSubmit = (data: Omit<RegisterType, "groupid">) => {
		if (!data) return;

		localStorage.setItem("lec_autofill_details", JSON.stringify(data));

		setTimeout(() => {
			window.location.href = "/lec/home";
		}, 1500);

		setShowSuccessMessage(true);
	};

	return (
		<main>
			{showSuccessMessage && (
				<SuccessAlert
					successMessage="Redirecting"
					setShowSuccessMessage={setShowSuccessMessage}
				/>
			)}

			<form
				className="flex"
				onSubmit={handleSubmit(formSubmit)}
			>
				<label htmlFor="coursename">What course do you teach?</label>
				<div className="group">
					<input
						type="text"
						id="coursename"
						{...register("coursename")}
						placeholder="e.g., African Studies"
					/>
					<p className="error">{errors.coursename?.message}</p>
				</div>

				<label htmlFor="coursecode">Enter your course code</label>
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

				<label htmlFor="fullname">What is your name?</label>
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
					<button type="submit">Save My Data</button>
				</div>
			</form>

			<p className="url">
				*This data will be used to autofill your forms when registering a course.
			</p>
		</main>
	);
};

export default LecturerDetailsForm;
