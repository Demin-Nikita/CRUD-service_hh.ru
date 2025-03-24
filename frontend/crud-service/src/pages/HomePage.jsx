import { useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';
import { fetchVacancies, addVacancy } from '../services/vacancyService'
import { useVacancies } from "../context/VacancyContext";
import VacancyCard from '../components/VacancyCard';

const HomePage = () => {
  const {
    vacancies,
    setVacancies,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    loadVacancies,
  } = useVacancies();
  const [vacancyId, setVacancyId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate();
  document.body.classList.add('dark');

  const handleEditClick = (vacancy) => {
    setSelectedVacancy(vacancy);
    setIsEditModalOpen(true);
  };

  const handleAddVacancy = async () => {
    try {
      const newVacancy = await addVacancy(vacancyId);
      loadVacancies();
      setIsModalOpen(false);
      setVacancyId('');
    } catch (error) {
      console.error('Error adding vacancy:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container">
      <div
        className="navbar navbar-expand position-fixed w-100"
        style={{ top: 0, left: 0, zIndex: 999, backgroundColor: '#121b28' }}
      >
        <div className="container">
          <div className="d-flex w-100 justify-content-end align-items-center">
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginRight: '10px' }}>
              Добавить вакансию
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: '70px' }}>
        <h2>Список вакансий</h2>
        {isModalOpen && (
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog" style={{ marginTop: '50px' }}>
              <div className="modal-content bg-dark border-1 shadow-lg rounded-3">
                <div className="modal-header border-0" >
                  <h5 className="modal-title">Добавить вакансию</h5>
                </div>
                <div className="modal-body">
                  <label htmlFor="vacancy-id">ID вакансии</label>
                  <input
                    type="text"
                    id="vacancy-id"
                    className="form-control"
                    value={vacancyId}
                    onChange={(e) => setVacancyId(e.target.value)}
                  />
                </div>
                <div className="modal-footer bg-dark border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Закрыть
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddVacancy}
                    disabled={!vacancyId}
                  >
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-danger">{error}</p>}
        <div className="vacancies-list inert">
          {vacancies.map((vacancy) => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>

        <div className="pagination d-flex justify-content-center mt-3">
          <button
            className="btn btn-secondary mx-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"} Назад
          </button>
          <span className="mx-3 text-white">
            Страница {currentPage} из {totalPages}
          </span>
          <button
            className="btn btn-secondary mx-1"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Вперед {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;