import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OpportunityDetails from "./pages/OpportunityDetails";
import SavedOpportunities from "./pages/SavedOpportunities";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/opportunity/:id"
          element={<OpportunityDetails />}
        />
        <Route
          path="/saved"
          element={<ProtectedRoute>
                    <SavedOpportunities />
                  </ProtectedRoute>}
        />
        <Route
          path="/login" element={<Login />} 
        />
        <Route
         path="/signup" element={<Signup />}
        />
        <Route 
          path="/admin" element={<Admin />}
        />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;