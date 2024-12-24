import { createContext, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

export interface Entity {
	id: string;
	fullname: string;
	indexnumber: string;
	groupid: string;
	coursecode: string;
	last_checked: Date;
	checked: boolean;
}

export interface LecturerType extends Omit<Entity, "indexnumber"> {
	coursename: string;
	no_of_meetings: number;
}

interface ContextType {
	studentList: Entity[] | [];
	setStudentList: Dispatch<SetStateAction<Entity[] | []>>;
	role: "Lecturer" | "Student";
	lecAutofillDetails: Omit<LecturerType, "checked">;
	stdAutofillDetails: CheckInType;
	authenticate: (key: string, coursename: string) => void;
	socket: Socket;
}

export interface RegisterType
	extends Omit<Entity, "last_checked" | "indexnumber" | "id" | "checked"> {
	coursename: string;
	no_of_meetings: number;
}

export interface CheckInType extends Omit<Entity, "last_checked" | "id" | "checked"> {}

export interface LocationType
	extends Omit<Entity, "last_checked" | "indexnumber" | "groupid" | "fullname" | "coursecode"> {}

export const ContextProvider = createContext<ContextType | undefined>(undefined);
