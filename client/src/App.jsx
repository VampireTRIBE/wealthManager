import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/SignupPage";
import HomePagePostLogin from "./pages/homeDashboardPage";
import ProtectRoute from "./componets/routeProtection/protectedRoute";
import { UserProvider } from "./hooks/userContext";
import HomeAssets from "./pages/assets/homeAssets";

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/home/:id"
              element={
                <ProtectRoute>
                  <HomePagePostLogin />
                </ProtectRoute>
              }
            />
            <Route
              path="/home/:id/assets"
              element={
                <ProtectRoute>
                  <HomeAssets/>
                </ProtectRoute>
              }
            />
            <Route
              path="/home/:id/expenses"
              element={
                <ProtectRoute>
                  <HomeAssets/>
                </ProtectRoute>
              }
            />
            <Route
              path="/home/:id/incomes"
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
