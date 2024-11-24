import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateTrainingSessionPage from "./pages/CreateTrainingSessionPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<Layout />}>
          {" "}
          {/*Place the routes to all your pages nested in this Route tag */}
          <Route
            path="/pages/CreateTrainingSessionPage"
            element={<CreateTrainingSessionPage />}
          ></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
