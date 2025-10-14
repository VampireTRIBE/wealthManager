import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./hooks/userContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import ProtectRoute from "./componets/routeProtection/protectedRoute";

import HomePage from "./pages/homePage";
import LoginPage from "./pages/authentication/loginPage";
import SingupPage from "./pages/authentication/SignupPage";
import HomeDashbordPage from "./pages/homeDashbordPage";
import HomeAssets from "./pages/assets/homeAssetsPage";


function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SingupPage />} />
            <Route
              path="/home/:id"
              element={
                <ProtectRoute>
                  <HomeDashbordPage />
                </ProtectRoute>
              }
            />
            <Route
              path="/home/:id/:c"
              element={
                <ProtectRoute>
                  <HomeAssets/>
                </ProtectRoute>
              }
            />
          </Routes>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
