import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import useContextProvider from "./hooks/useContextProvider";
import CheckIn from "./pages/CheckIn";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import StudentHome from "./pages/StudentHome";
import StudentList from "./pages/StudentList";

const App = () => {
	// ! Create a sign in feature for a lecturer who wants to sign in again
	// Also create a unique key for lecturers only to protect some routes

	/**
	 * :root {
	--background-color: #121212;
	--text-color: #e5e5e5;
	--accent-color: #007bff;
	--button-hover: #0056b3;
	--card-background: #1a1a1a;
	--form-background: #1a1a1a;
	--input-background: #1a1a1a;
	--input-border: #333;
	--input-focus: #007bff;
	--button-background: #007bff;
	--button-hover: #0056b3;
	--error-color: #e63946;
}

	 */
	// ! When there is a duplicate entry ask is it is him.
	// ! when I scroll up display course details on the nav bar

	const { role, lec } = useContextProvider();

	function ProtectedRoute() {
		if (role === "Lecturer") {
			return role === "Lecturer" && <Navigate to="/lec/home" />;
		} else if (role === "Student") {
			return role === "Student" && <Navigate to="/std/home" />;
		}
	}

	return (
		<>
			<Nav />

			<Routes>
				<Route
					path="/"
					element={
						role ? <ProtectedRoute /> : !lec ? <Landing /> : <Navigate to="/lec/home" />
					}
				/>
				<Route
					path="/std"
					element={<Navigate to="/std/home" />}
				/>
				<Route
					path="/lec"
					element={
						role ? (
							role === "Lecturer" && <Navigate to="/lec/home" />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/std/home"
					element={
						role ? (
							role === "Student" ? (
								<StudentHome />
							) : (
								<Navigate to="/lec/home" />
							)
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/lec/home"
					element={
						role ? (
							role === "Lecturer" ? (
								<StudentList />
							) : (
								<Navigate to="/std" />
							)
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/lec/register"
					element={
						role ? (
							role === "Lecturer" ? (
								<SignIn />
							) : (
								<Navigate to="/std/home" />
							)
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/std/check-in"
					element={
						role ? (
							role === "Student" ? (
								<CheckIn />
							) : (
								<Navigate to="/lec/home" />
							)
						) : (
							<Navigate to="/" />
						)
					}
				/>

				<Route
					path="*"
					element={<h1>This route is not found</h1>}
				/>
			</Routes>

			<Footer />
		</>
	);
};

export default App;
