import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateTrainingSessionPage from "./pages/CreateTrainingSessionPage";
import Layout from "./components/Layout";
import MessagingApp from "./components/Inbox/Messaging";
import ChatScreen from "./components/Inbox/ChatScreen";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import PersonalInformationPage from "./pages/PersonalInformationPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ViewTrainingSessionPage from "./pages/ViewTrainingSessionPage";
import TrainingSessionsContent from "./components/ViewTrainingSessions/TrainingSessionContent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/HomePage" element={<HomePage />} />
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
          <Route
            path="/pages/ViewTrainingSessionPage/:trainingSessionId"
            element={<TrainingSessionsContent />}
          ></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
