import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import WelcomePage from "./components/welcome-page/WelcomePage";
import StudentsList from "./components/students-list/StudentsList";

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<WelcomePage/>}/>
                <Route exact path="/students/list" element={<StudentsList/>}/>
            </Routes>
        </Router>
    );
}

export default AppRoutes;