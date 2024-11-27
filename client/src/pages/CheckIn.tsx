import { yupResolver } from "@hookform/resolvers/yup";
import Axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { CheckInType } from "../exports/exports";
import { CheckInSchema } from "../exports/Schemas";

const CheckIn = () => {
	/**
	 * 
	todo:
	1. Time-Limited Check-In
		- Restrict check-in to a specific time window (e.g., the first 5 minutes of class).
		- Disable check-ins once the window closes, making it harder for absent students to exploit the system. 
	*/
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(CheckInSchema),
	});

	const formSubmit = async (data: CheckInType) => {
		if (!data) return;

		const newFormInput = {
			...data,
			time: new Date(),
			long: 0,
			lat: 0,
		};

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;

					newFormInput.lat = Number(latitude);
					newFormInput.long = Number(longitude);

					try {
						const res = await Axios.post(
							"https://record-attendance.onrender.com/save-user",
							newFormInput
						);

						if (res.data) {
							alert("Data recorded.");
						}
					} catch (error) {
						if (error instanceof AxiosError && error.response) {
							alert(error.response.data);
						} else {
							console.error("An unexpected error occurred:", error);
						}
					}
				},
				(error) => {
					console.error("Error getting location:", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	};

	return (
		<main>
			<form
				className="flex"
				onSubmit={handleSubmit(formSubmit)}
			>
				<label htmlFor="full-name">ENTER YOUR FULL NAME</label>
				<div className="group">
					<input
						type="name"
						{...register("fullname")}
						placeholder="e.g., Miles Morales"
					/>
					<p className="error">{errors && errors.fullname?.message}</p>
				</div>

				{/* <div className="shared"> */}
				{/* <div className="group"> */}
				<label htmlFor="id">ENTER COURSE CODE</label>
				<div className="group">
					<input
						type="text"
						maxLength={10}
						{...register("coursecode")}
						placeholder="e.g., AFR-291"
					/>
					<p className="error">{errors && errors.coursecode?.message}</p>
				</div>
				{/* </div> */}
				{/* <div> */}
				<label htmlFor="course-name">SELECT GROUP</label>
				<div className="group">
					<select
						id="group"
						{...register("groupid")}
					>
						<option value="">--Select group--</option>
						<option value="a">A</option>
						<option value="b">B</option>
						<option value="c">C</option>
						<option value="d">D</option>
						<option value="e">E</option>
						<option value="f">F</option>
						<option value="g">G</option>
					</select>
					<p className="error">{errors && errors.groupid?.message}</p>
				</div>
				{/* </div> */}
				{/* </div> */}

				<label htmlFor="full-name">ENTER YOUR INDEX NUMBER</label>
				<div className="group">
					<input
						type="text"
						maxLength={10}
						{...register("indexnumber")}
						placeholder="e.g., 421123890"
					/>
					<p className="error">{errors && errors.indexnumber?.message}</p>
				</div>

				<div className="group">
					<button>Check In</button>
				</div>
			</form>

			<div className="copyright">
    <p>&copy; 2024 BIT GROUP E GROUP 6 | All rights reserved.</p>
  </div>
		</main>
	);
};

export default CheckIn;
