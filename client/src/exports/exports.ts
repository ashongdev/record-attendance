import { createContext, Dispatch, SetStateAction } from "react";

export interface Entity {
	id: string;
	fullname: string;
	indexnumber: string;
	groupid: string;
	coursecode: string;
	time: Date;
	long: number;
	lat: number;
}

export interface LecturerType extends Omit<Entity, "indexnumber"> {
	coursename: string;
}

interface ContextType {
	studentList: Entity[] | [];
	setStudentList: Dispatch<SetStateAction<Entity[] | []>>;
	lecturerLatitude: number;
	setLecturerLatitude: Dispatch<SetStateAction<number>>;
	lecturerLongitude: number;
	setLecturerLongitude: Dispatch<SetStateAction<number>>;
	role: "Lecturer" | "Student";
	lecAutofillDetails: LecturerType;
	stdAutofillDetails: CheckInType;
}

export interface RegisterType extends Omit<Entity, "time" | "long" | "lat" | "indexnumber" | "id"> {
	coursename: string;
}

export interface CheckInType extends Omit<Entity, "time" | "long" | "lat" | "id"> {}

export interface LocationType
	extends Omit<Entity, "time" | "indexnumber" | "groupid" | "fullname" | "coursecode"> {}

export const ContextProvider = createContext<ContextType | undefined>(undefined);
