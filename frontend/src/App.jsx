import { Route, Router } from "react-router-dom";
import Navbar from "./components/Navbar";
const App = () => {
  return (
    <div className="text-red-500 text-3xl font-bold">
      Hello App
     <Navbar />
     <Router>
      <Route path="/" element={<HomePage />} />
      <Route path="/Signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<profilePage />} />
     </Router>
    </div>
  );
};

export default App;