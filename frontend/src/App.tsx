import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateTrainingSessionPage from "./pages/CreateTrainingSessionPage";
import Layout from "./components/Layout";
import MessagingApp from "@/components/Inbox/DirectMessages/Messaging";
import ChatScreen from "./components/Inbox/ChatScreen/ChatScreen";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import PersonalInformationPage from "./pages/PersonalInformationPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import CreateFirstDmPage from "./pages/CreateFirstDmPage";
import ViewTrainingSessionPage from "./pages/ViewTrainingSessionPage";
import SignUpPage from "./pages/SignUpPage";
import VerificationCodePage from "./pages/VerificationCodePage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/HomePage" element={<HomePage />} />
        {/*placed route here as it does not use original layout with Nav, bottom
        nav, ...*/}
        <Route
          path="/pages/CreateFirstDmPage"
          element={<CreateFirstDmPage />}
        ></Route>
        <Route path="/" element={<Layout />}>
          {" "}
          <Route path="/messages" element={<MessagingApp />} />
          <Route path="/chat" element={<ChatScreen />} />
          {/*Place the routes to all your pages nested in this Route tag */}
          <Route
            path="/pages/CreateTrainingSessionPage"
            element={<CreateTrainingSessionPage />}
          ></Route>
          <Route
            path="/pages/PersonalInformationPage"
            element={<PersonalInformationPage />}
          ></Route>
          <Route
            path="/pages/EditProfilePage"
            element={<EditProfilePage />}
          ></Route>
          <Route path="/pages/ProfilePage" element={<ProfilePage />}></Route>
          <Route
            path="/pages/ChangePasswordPage"
            element={<ChangePasswordPage />}
          ></Route>
          <Route
            path="/pages/ViewTrainingSessionPage"
            element={<ViewTrainingSessionPage />}
          ></Route>
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/verificationcode" element={<VerificationCodePage />} />
          <Route path="/pages/CalendarPage" element={<CalendarPage />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
