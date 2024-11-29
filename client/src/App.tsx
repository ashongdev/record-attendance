import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import useContextProvider from "./hooks/useContextProvider";
import { ProtectedRoute, PublicRoute } from "./hooks/useRouteFunctions";
import CheckIn from "./pages/CheckIn";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import RegisterCourse from "./pages/RegisterCourse";
import StudentHome from "./pages/StudentHome";
import StudentList from "./pages/StudentList";
// !Download Oh MY ZSH for my terminal
// todo: Add loader styles to css
// ! create more pages asking the groupid, name and index number to autofill forms
// !restrict student from checking in if detaild from localstorage matches the new one

// !rnfz
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
					element={<NotFound />}
				/>
			</Routes>
			<Footer />
		</>
	);
};

export default App;
