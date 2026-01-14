// UI
import { Toaster } from "sonner";

// Pages
import LoginPage from "./pages/login.page";
import UsersPage from "./pages/users.page";
import DashboardPage from "./pages/dashboard.page";

// Layouts
import RootLayout from "./layouts/root.layout";

// Router
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        richColors
        position="top-right"
        offset={{ top: 72 }}
        mobileOffset={{ top: 72 }}
      />
    </>
  );
};

export default App;
