import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppStateProvider } from "./context/AppState";
import { DataProvider } from "./data/store";
import { AppShell } from "./components/layout/AppShell";

import { Landing } from "./pages/Landing";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Home } from "./pages/Home";
import { Book } from "./pages/Book";
import { SessionDetail } from "./pages/SessionDetail";
import { Family } from "./pages/Family";
import { FamilyMemberDetail } from "./pages/FamilyMemberDetail";
import { AddFamilyMember } from "./pages/AddFamilyMember";
import { Cart } from "./pages/Cart";
import { BookingConfirmation } from "./pages/BookingConfirmation";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import { PaymentMethods } from "./pages/PaymentMethods";
import { Notifications } from "./pages/Notifications";
import { HelpSupport } from "./pages/HelpSupport";
import { AppPreferences } from "./pages/AppPreferences";
import { About } from "./pages/About";
import { AdminLayout, AdminLogin, RequireAdmin } from "./admin/AdminLayout";
import { Overview } from "./admin/pages/Overview";
import { Schedule } from "./admin/pages/Schedule";
import { Bookings } from "./admin/pages/Bookings";
import { Players } from "./admin/pages/Players";
import { Pricing } from "./admin/pages/Pricing";
import { SettingsPage } from "./admin/pages/SettingsPage";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Overview />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="players" element={<Players />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

function Screens() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return <AdminRoutes />;
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/home" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/session/:id" element={<SessionDetail />} />

        <Route path="/family" element={<Family />} />
        <Route path="/family/add" element={<AddFamilyMember />} />
        <Route path="/family/:id" element={<FamilyMemberDetail />} />
        <Route path="/family/:id/edit" element={<AddFamilyMember />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />

        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/payment" element={<PaymentMethods />} />
        <Route path="/profile/notifications" element={<Notifications />} />
        <Route path="/profile/help" element={<HelpSupport />} />
        <Route path="/profile/preferences" element={<AppPreferences />} />
          
      </Routes>
    </AppShell>
  );
}

function App() {
  return (
    <DataProvider>
      <AppStateProvider>
        <HashRouter>
          <Screens />
        </HashRouter>
      </AppStateProvider>
    </DataProvider>
  );
}

export default App;
