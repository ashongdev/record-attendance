export type CorsCallback = (error: Error | null, success: boolean) => void;

export interface Entity {
	id: string;
	fullname: string;
	indexnumber: string;
	groupid: string;
	coursecode: string;
	last_checked: Date;
	checked: string;
}

export interface LecturerType extends Omit<Entity, "indexnumber"> {
	coursename: string;
}
