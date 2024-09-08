// src/App.js

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CityProvider } from "./context/CityContext";

import HomePage from "./pages/HomePage";
import WeatherPage from "./pages/WeatherPage";

function App() {
  return (
    <CityProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/weather/:cityName" element={<WeatherPage />} />
        </Routes>
      </Router>
    </CityProvider>
  );
}

export default App;
