import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import CheckIn from "./pages/CheckIn";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import StudentList from "./pages/StudentList";

const App = () => {
	// ! Create a sign in feature for a lecturer who wants to sign in again
	// Also create a unique key for lecturers only to protect some routes

	return (
		<>
			<Nav />
			<Routes>
				<Route
					path="/"
					element={<Home />}
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
