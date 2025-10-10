import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/SignupPage";
import HomePagePostLogin from "./pages/homeDashboardPage";
import ProtectRoute from "./componets/routeProtection/protectedRoute";

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home/:id" element={
            <ProtectRoute children={<HomePagePostLogin/>}/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

