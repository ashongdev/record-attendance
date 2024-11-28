export type CorsCallback = (error: Error | null, success: boolean) => void;

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
