import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import useContextProvider from "./hooks/useContextProvider";
import { ProtectedRoute, PublicRoute } from "./hooks/useRouteFunctions";
import CheckIn from "./pages/CheckIn";
import Landing from "./pages/Landing";
import RegisterCourse from "./pages/RegisterCourse";
import StudentHome from "./pages/StudentHome";
import StudentList from "./pages/StudentList";

const App = () => {
	const { role } = useContextProvider();

	return (
		<>
			<Nav />
			<Routes>
				<Route
					path="/"
					element={
						<PublicRoute role={role}>
							<Landing />
						</PublicRoute>
					}
				/>

				<Route
					path="/std"
					element={<Navigate to="/std/home" />}
				/>

				{/* Student Routes */}
				<Route
					path="/std/home"
					element={
						<ProtectedRoute role={role}>
							{role === "Student" ? (
								<StudentHome />
							) : (
								<Navigate
									to="/lec/home"
									replace
								/>
							)}
						</ProtectedRoute>
					}
				/>
				<Route
					path="/std/check-in"
					element={
						<ProtectedRoute role={role}>
							{role === "Student" ? (
								<CheckIn />
							) : (
								<Navigate
									to="/lec/home"
									replace
								/>
							)}
						</ProtectedRoute>
					}
				/>

				{/* Lecturer Routes */}
				<Route
					path="/lec"
					element={
						<Navigate
							to="/lec/home"
							replace
						/>
					}
				/>
				<Route
					path="/lec/home"
					element={
						<ProtectedRoute role={role}>
							{role === "Lecturer" ? (
								<StudentList />
							) : (
								<Navigate
									to="/std/home"
									replace
								/>
							)}
						</ProtectedRoute>
					}
				/>
				<Route
					path="/lec/register"
					element={
						<ProtectedRoute role={role}>
							{role === "Lecturer" ? (
								<RegisterCourse />
							) : (
								<Navigate
									to="/std/home"
									replace
								/>
							)}
						</ProtectedRoute>
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
