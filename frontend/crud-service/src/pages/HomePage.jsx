import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchVacancies } from '../services/vacancyService'
import VacancyCard from '../components/VacancyCard';

const HomePage = () => {
  const [vacancies, setVacancies] = useState([]);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  useEffect (() => {
    const loadVacancies = async () => {
      try {
        const data = await fetchVacancies();
        setVacancies(data);
      } catch (error) {
        setError('Error loading vacancies');
      }
    };
    loadVacancies();

    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="container">
      <div className="navbar navbar-expand bg-black position-fixed w-100" style={{ top: 0, left: 0, zIndex: 999 }}>
        <div className="container">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="form-check form-switch me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="theme-toggle"
                  checked={isDark}
                  onChange={() => setIsDark(!isDark)}
                />
                <label className="form-check-label" htmlFor="theme-toggle">Темная тема</label>
              </div>
            </div>
            <button className="btn btn-danger" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: '70px' }}>
        <h2>Список вакансий</h2>
        {error && <p className="text-danger">{error}</p>}
        <div className="vacancies-list">
          {vacancies.map((vacancy) => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;