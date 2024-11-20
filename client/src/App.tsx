import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import CheckIn from "./pages/CheckIn";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import StudentList from "./pages/StudentList";

const App = () => {
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
					path="/lec/sign-in"
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
