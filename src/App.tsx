import { HashRouter, Routes, Route } from "react-router-dom";
import { AppStateProvider } from "./context/AppState";
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

function App() {
  return (
    <AppStateProvider>
      <HashRouter>
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

            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/payment" element={<PaymentMethods />} />
            <Route path="/profile/notifications" element={<Notifications />} />
            <Route path="/profile/help" element={<HelpSupport />} />
            <Route path="/profile/preferences" element={<AppPreferences />} />
          </Routes>
        </AppShell>
      </HashRouter>
    </AppStateProvider>
  );
}

export default App;
