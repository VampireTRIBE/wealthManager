import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./hooks/userContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import ProtectRoute from "./componets/routeProtection/protectedRoute";

import HomePage from "./pages/homePage";
import LoginPage from "./pages/authentication/loginPage";
import SingupPage from "./pages/authentication/SignupPage";
import HomeDashbordPage from "./pages/homeDashbordPage";
import HomeAssets from "./pages/assets/homePage";
import HomeAssetsSub from "./pages/assets/homePageSubCategory";
import HomeAssetsSub2 from "./pages/assets/homePageSubCategory2";
import HomeAssetsSub3 from "./pages/assets/homePageSubCategory3";
import { UserCurveProvider } from "./hooks/userCurveContex";

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <UserProvider>
          <UserCurveProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SingupPage />} />
              <Route path="/home" element={<HomeDashbordPage />} />

              {/* assets */}
              <Route path="/assets" element={<HomeAssets />} />
              <Route path="/assets/:sc" element={<HomeAssetsSub />} />
              <Route path="/assets/:sc/:ssc" element={<HomeAssetsSub2 />} />
              <Route
                path="/assets/:sc/:ssc/:sssc"
                element={<HomeAssetsSub3 />}
              />
            </Routes>
          </UserCurveProvider>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
