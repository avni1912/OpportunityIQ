import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OpportunityDetails from "./pages/OpportunityDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/opportunity/:id"
          element={<OpportunityDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;