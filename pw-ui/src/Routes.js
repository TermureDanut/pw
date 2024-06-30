import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import WelcomePage from "./components/welcome-page/WelcomePage";
import ProtectedRoute from "./components/protected-route/ProtectedRoute";
import MainPage from "./components/main-page/MainPage";
import RegisterPage from "./components/register-page/RegisterPage";
import AccountPage from "./components/account-page/AccountPage";
import DeletedTemplates from "./components/deleted-templates/DeletedTemplates";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<WelcomePage/>}/>
                <Route path="/mainpage" element={<ProtectedRoute><MainPage/></ProtectedRoute>}/>
                <Route path="/register" element={<ProtectedRoute><RegisterPage/></ProtectedRoute>}/>
                <Route path="/myaccount" element={<ProtectedRoute><AccountPage/></ProtectedRoute>}/>
                <Route path="/templates/deleted" element={<ProtectedRoute><DeletedTemplates/></ProtectedRoute>}/>
            </Routes>
        </Router>
    );
}

export default AppRoutes;