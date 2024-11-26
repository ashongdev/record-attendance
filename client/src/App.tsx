import { Navigate, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import CheckIn from "./pages/CheckIn";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import StudentHome from "./pages/StudentHome";
import StudentList from "./pages/StudentList";

const App = () => {
	// ! Create a sign in feature for a lecturer who wants to sign in again
	// Also create a unique key for lecturers only to protect some routes

	return (
		<>
			<Nav />
			<Routes>
				{/* Create a page showing "Are you a student" */}
				<Route
					path="/"
					element={<Landing />}
				/>
				<Route
					path="/std"
					element={<Navigate to="/std/home" />}
				/>
				<Route
					path="/lec"
					element={<Navigate to="/lec/home" />}
				/>
				<Route
					path="/std/home"
					element={<StudentHome />}
				/>
				<Route
					path="/lec/home"
					element={<StudentList />}
				/>
				<Route
					path="/lec/register"
					element={<SignIn />}
				/>
				<Route
					path="/std/check-in"
					element={<CheckIn />}
				/>
			</Routes>
		</>
	);
};

export default App;
