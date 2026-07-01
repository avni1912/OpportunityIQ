import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OpportunityDetails from "./pages/OpportunityDetails";
import SavedOpportunities from "./pages/SavedOpportunities";

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
          element={<SavedOpportunities />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;