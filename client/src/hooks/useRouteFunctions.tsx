import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
	role: "Lecturer" | "Student";
	children: ReactNode;
}

export const PublicRoute: FC<Props> = ({ role, children }) => {
	return role !== "Student" && role !== "Lecturer" ? (
		<>{children}</>
	) : role === "Student" ? (
		<Navigate to="std" />
	) : (
		<Navigate to="lec" />
	);
};

export const ProtectedRoute: FC<Props> = ({ role, children }) => {
	if (role !== "Student" && role !== "Lecturer") {
		return <Navigate to="/" />;
	}
	if (role === "Lecturer" || role === "Student") {
		return <>{children}</>;
	}
};
