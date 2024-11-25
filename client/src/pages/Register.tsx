import { yupResolver } from "@hookform/resolvers/yup";
import Axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SignInType } from "../exports/exports";
import { SignInSchema } from "../exports/Schemas";
import useContextProvider from "../hooks/useContextProvider";

const SignIn = () => {
	const {
		setRegistered,
		setLecturerLatitude,
		setLecturerLongitude,
		lecturerLongitude,
		lecturerLatitude,
	} = useContextProvider();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(SignInSchema),
	});

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

	// !Create signin alert when course is registered!

	const formSubmit = async (data: SignInType) => {
		const newFormInput = {
			...data,
			time: new Date(),
			long: lecturerLongitude,
			lat: lecturerLatitude,
		};

		if (lecturerLongitude && lecturerLatitude) {
			try {
				const response = await Axios.post(
					// "https://record-attendance.onrender.com/sign-in",
					"http://localhost:4400/sign-in",
					newFormInput
				);

				if (response.data) {
					setRegistered(true);

					localStorage.setItem("lec", JSON.stringify(response.data));
					alert("Course registered. Go back home to view enrolled students.");

					setTimeout(() => {
						// window.location.href = "/";
					}, 2000);
				}
			} catch (error) {
				if (error instanceof AxiosError && error.response) {
					alert(error.response.data);
				} else {
					console.error("An unexpected error occurred:", error);
				}
			}
		} else {
			alert(
				"Could not get your location. Check your internet connection and allow this app to access your location."
			);
		}
	};
	// todo : authorize lecturer info always

	return (
		<main>
			<form
				className="flex"
				onSubmit={handleSubmit(formSubmit)}
			>
				<label htmlFor="course-name">ENTER COURSE TITLE</label>
				<div className="group">
					<input
						type="text"
						{...register("coursename")}
						placeholder="e.g., African Studies"
					/>
					<p className="error">{errors && errors.coursename?.message}</p>
				</div>

				<label htmlFor="id">ENTER COURSE CODE</label>
				<div className="group">
					<input
						type="text"
						placeholder="e.g., AFR-291"
						maxLength={10}
						{...register("coursecode")}
					/>
					<p className="error">{errors && errors.coursecode?.message}</p>
				</div>

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

				<label htmlFor="fullName">ENTER YOUR NAME</label>
				<div className="group">
					<input
						type="text"
						{...register("fullname")}
						placeholder="e.g., John Doe"
					/>
					<p className="error">{errors && errors.fullname?.message}</p>
				</div>

				<div className="group">
					<button>Register Course</button>
				</div>
			</form>
		</main>
	);
};

export default SignIn;
