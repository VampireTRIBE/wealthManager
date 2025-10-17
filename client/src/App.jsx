import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./hooks/userContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import ProtectRoute from "./componets/routeProtection/protectedRoute";

import HomePage from "./pages/homePage";
import LoginPage from "./pages/authentication/loginPage";
import SingupPage from "./pages/authentication/SignupPage";
import HomeDashbordPage from "./pages/homeDashbordPage";
import HomeAssets from "./pages/assets/homePage";
import IndividualAssets from "./pages/assets/individualDetails";

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        {/* <UserProvider> */}
        <Routes>
          {/* <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SingupPage />} /> */}
          <Route path="/home/:u_id" element={<HomeDashbordPage />} />
          <Route path="/home/:u_id/:dc_id" element={<HomeAssets />} />
          <Route path="/home/:u_id/:dc_id/:sc_id" element={<IndividualAssets />} />
          <Route path="/home/:u_id/:dc_id/:sc_id/ssc_id" element={<IndividualAssets />} />
        </Routes>
        {/* </UserProvider> */}
      </Router>
    </>
  );
}

export default App;
