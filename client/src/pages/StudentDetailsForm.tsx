import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SuccessAlert from "../components/SuccessAlert";
import { saveStdDataSchema } from "../exports/Schemas";
import { CheckInType } from "../exports/exports";

const StudentDetailsForm = () => {
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(saveStdDataSchema),
	});

	const formSubmit = (data: Omit<CheckInType, "coursecode">) => {
		if (!data) return;

		localStorage.setItem("std_autofill_details", JSON.stringify(data));

		setTimeout(() => {
			window.location.href = "/std/home";
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
				<label htmlFor="coursename">Enter your full name</label>
				<div className="group">
					<input
						type="text"
						id="coursename"
						{...register("fullname")}
						placeholder="e.g., John Doe"
					/>
					<p className="error">{errors.fullname?.message}</p>
				</div>

				<label htmlFor="coursecode">Enter your index number</label>
				<div className="group">
					<input
						type="text"
						id="coursecode"
						{...register("indexnumber")}
						maxLength={10}
						placeholder="e.g., 4211909893"
					/>
					<p className="error">{errors.indexnumber?.message}</p>
				</div>

				<div className="group">
					<label htmlFor="groupid">Which group are you in?</label>
					<select
						id="groupid"
						{...register("groupid")}
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
					<button type="submit">Save My Data</button>
				</div>
			</form>

			<p className="url">
				*This data will be used to autofill your forms when enrolling into a course.
			</p>
		</main>
	);
};

export default StudentDetailsForm;
