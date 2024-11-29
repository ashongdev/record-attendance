import * as yup from "yup";

export const SignInSchema = yup.object().shape({
	coursecode: yup
		.string()
		.required("This field is required")
		.matches(/^[A-Za-z]{2,4}-[0-9]{3,4}$/, "Please enter a valid course id"),
	coursename: yup
		.string()
		.required("This field is required")
		.min(8, "name must be at least 8 characters")
		.matches(/^[^!@#$%^&*()_+=]+ [A-Za-z ]+$/, "Please enter a valid course name"),
	fullname: yup
		.string()
		.required("This field is required")
		.min(8, "name must be at least 8 characters")
		.matches(/^[^!@#$%^&*()_+=]+ [A-Za-z ]+$/, "Please enter a valid name"),
	groupid: yup
		.string()
		.matches(/^[A-Za-z]{1}/, "Please select a group")
		.required(),
});

export const CheckInSchema = yup.object().shape({
	coursecode: yup
		.string()
		.matches(/^[A-Za-z]{2,4}-[0-9]{3,4}$/, "Please enter a valid course code")
		.required(),
	fullname: yup
		.string()
		.matches(/^[^!@#$%^&*()_+=]+ [A-Za-z ]+$/, "Please enter your full name")
		.required(),
	indexnumber: yup
		.string()
		.matches(/^[0-9]{10}$/, "Please enter a valid index number")
		.required(),
	groupid: yup
		.string()
		.matches(/^[A-Za-z]{1}/, "Please select a group")
		.required(),
});

export const saveStdDataSchema = yup.object().shape({
	fullname: yup
		.string()
		.matches(/^[^!@#$%^&*()_+=]+ [A-Za-z ]+$/, "Please enter your full name")
		.required(),
	indexnumber: yup
		.string()
		.matches(/^[0-9]{10}$/, "Please enter a valid index number")
		.required(),
	groupid: yup
		.string()
		.matches(/^[A-Za-z]{1}/, "Please select a group")
		.required(),
});

export const saveLecDataSchema = yup.object().shape({
	coursecode: yup
		.string()
		.required("This field is required")
		.matches(/^[A-Za-z]{2,4}-[0-9]{3,4}$/, "Please enter a valid course id"),
	coursename: yup
		.string()
		.required("This field is required")
		.min(8, "name must be at least 8 characters")
		.matches(/^[^!@#$%^&*()_+=]+ [A-Za-z ]+$/, "Please enter a valid course name"),
	fullname: yup
		.string()
		.required("This field is required")
		.min(8, "name must be at least 8 characters")
		.matches(/^[^!@#$%^&*()_+=]+ [A-Za-z ]+$/, "Please enter a valid name"),
});
