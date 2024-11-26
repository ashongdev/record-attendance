import { createContext, Dispatch, SetStateAction } from "react";

export interface StudentType {
	fullname: string;
	indexnumber: string;
	groupid: string;
	coursecode: string;
	time: Date;
	long: number;
	lat: number;
}

interface ContextType {
	studentList: StudentType[] | [];
	setStudentList: Dispatch<SetStateAction<StudentType[] | []>>;
	lecturerLatitude: number;
	setLecturerLatitude: Dispatch<SetStateAction<number>>;
	lecturerLongitude: number;
	setLecturerLongitude: Dispatch<SetStateAction<number>>;
	role: "Lecturer" | "Student";
}

export type CheckInType = {
	indexnumber: string;
	groupid: string;
	fullname: string;
	coursecode: string;
};

export type SignInType = {
	coursecode: string | null;
	coursename: string | null;
	fullname: string | null;
};
export const ContextProvider = createContext<ContextType | undefined>(undefined);

export type LocationType = { lat: number; long: number };
