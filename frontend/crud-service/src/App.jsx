import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@tabler/core/dist/css/tabler.min.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { VacancyProvider } from "./context/VacancyContext";
import VacancyPage from './pages/VacancyPage';
import './App.css';

function App() {
  return (
    <VacancyProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/vacancy/:vacancyId" element={<VacancyPage />} />
          </Routes>
        </div>
      </Router>
    </VacancyProvider>
  );
}

export default App;