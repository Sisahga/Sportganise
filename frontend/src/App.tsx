import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateTrainingSessionPage from "./pages/CreateTrainingSessionPage";
import Layout from "./components/Layout";
import MessagingDashboard from "@/components/Inbox/DirectMessagesDashboard/MessagingDashboard.tsx";
import DirectMessageChatPage from "@/pages/DirectMessageChannelPage.tsx";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import PersonalInformationPage from "./pages/PersonalInformationPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ViewTrainingSessionPage from "./pages/ViewTrainingSessionPage";
import SignUpPage from "./pages/SignUpPage";
import VerificationCodePage from "./pages/VerificationCodePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/" element={<Layout />}>
          {" "}
          {/*Place the routes to all your pages nested beneath this Route tag */}
          <Route
            path="/pages/ChangePasswordPage"
            element={<ChangePasswordPage />}
          ></Route>
          <Route
            path="/pages/CreateTrainingSessionPage"
            element={<CreateTrainingSessionPage />}
          ></Route>
          <Route
            path="/pages/DirectMessageChannelPage"
            element={<DirectMessageChatPage />}
          />
          <Route
            path="/pages/EditProfilePage"
            element={<EditProfilePage />}
          ></Route>
          <Route
            path="/pages/DirectMessagesDashboard"
            element={<MessagingDashboard />}
          />
          <Route
            path="/pages/PersonalInformationPage"
            element={<PersonalInformationPage />}
          ></Route>
          <Route path="/pages/ProfilePage" element={<ProfilePage />}></Route>
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/verificationcode" element={<VerificationCodePage />} />
          <Route
            path="/pages/ViewTrainingSessionPage"
            element={<ViewTrainingSessionPage />}
          ></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
