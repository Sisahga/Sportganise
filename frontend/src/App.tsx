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
// import CreateDmChannelPage from "./pages/CreateDmChannelPage.tsx";
import ViewTrainingSessionPage from "./pages/ViewTrainingSessionPage";
// import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerificationCodePage from "./pages/VerificationCodePage";
import CalendarPage from "./pages/CalendarPage";
import ModifyTrainingSessionPage from "./pages/ModifyTrainingSessionPage";
import PriceComparisonToolPage from "./pages/PriceComparisonToolPage";
// import BlockedUsersListPage from "./pages/BlockedUserListPage";
// import TrainingPlanPage from "./pages/TrainingPlanPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/*placed route here as it does not use original layout with Nav, bottom
       nav, ...*/}
          {/*<Route*/}
          {/*    path="/pages/CreateDmChannelPage"*/}
          {/*    element={<CreateDmChannelPage />}*/}
          {/*></Route>*/}
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
            <Route path="/pages/ProfilePage" element={<ProfilePage />}></Route>
            <Route
                path="/pages/DirectMessagesDashboard"
                element={<MessagingDashboard />}
            />
            <Route
                path="/pages/PersonalInformationPage"
                element={<PersonalInformationPage />}
            ></Route>
            <Route path="/pages/ProfilePage" element={<ProfilePage />}></Route>
            {/*<Route path="/login" element={<LogInPage />}></Route>*/}
            <Route path="/signup" element={<SignUpPage />}></Route>
            <Route path="/verificationcode" element={<VerificationCodePage />} />
            {/*<Route path="/forgotpassword" element={<ForgotPasswordPage />} />*/}
            <Route
                path="/pages/ViewTrainingSessionPage"
                element={<ViewTrainingSessionPage />}
            ></Route>
            <Route path="/pages/CalendarPage" element={<CalendarPage />}></Route>
            <Route
                path="/pages/ModifyTrainingSessionPage"
                element={<ModifyTrainingSessionPage />}
            ></Route>
            <Route
                path="/pages/PriceComparisonToolPage"
                element={<PriceComparisonToolPage />}
            ></Route>
            {/*<Route*/}
            {/*    path="/pages/BlockedUserListPage"*/}
            {/*    element={<BlockedUsersListPage />}*/}
            {/*></Route>*/}
            {/*<Route*/}
            {/*    path="/pages/TrainingPlanPage"*/}
            {/*    element={<TrainingPlanPage />}*/}
            {/*></Route>*/}
          </Route>
        </Routes>
      </Router>
  );
}

export default App;
