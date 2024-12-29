import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import VerificationCodePage from "./pages/VerificationCodePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verificationcode" element={<VerificationCodePage />} />
      </Routes>
    </Router>
  );
}

export default App;
