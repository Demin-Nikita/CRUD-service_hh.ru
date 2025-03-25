import { useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';
import { fetchVacancies, addVacancy } from '../services/vacancyService'
import { useVacancies } from "../context/VacancyContext";
import VacancyCard from '../components/VacancyCard';
import EditVacancyModal from '../components/EditVacancyModal';
import { editVacancy, deleteVacancy, updateVacancy } from '../services/vacancyService';

const HomePage = () => {
  // Access context values for vacancies, pagination, and methods
  const {
    vacancies,
    currentPage,
    setCurrentPage,
    totalPages,
    loadVacancies,
    setVacancies,
  } = useVacancies();
  const [vacancyId, setVacancyId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  document.body.classList.add('dark');

  // Load vacancies when the component is mounted
  useEffect(() => {
    loadVacancies();
  }, []);

  const handleAddVacancy = async () => {
    try {
      const newVacancy = await addVacancy(vacancyId);
      loadVacancies();
      setIsModalOpen(false);
      setVacancyId('');
    } catch (error) {
      console.error('Error adding vacancy:', error);
      if (error.response && error.response.status === 404) {
        setErrorMessage('Вакансии с таким ID не существует.');
      } else {
        setErrorMessage('Произошла ошибка при добавлении вакансии.');
      }
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

  // Modal form management
  const handleEditClick = (vacancy) => {
    setIsEditModalOpen(true);
    setSelectedVacancy(vacancy);
  };
  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedVacancy(null);
  };

  // Handle vacancy options
  const handleDelete = async (vacancyId) => {
    try {
      const response = await deleteVacancy(vacancyId);
      loadVacancies();
    } catch (error) {
      console.error('Error deleting vacancy:', error);
    }
  };

  const handleUpdate = async (vacancyId) => {
    try {
      const updatedVacancy = await updateVacancy(vacancyId);
      setVacancies(vacancies.map((item) => (item.id === vacancyId ? updatedVacancy : item)));
    } catch (error) {
      console.error('Error updating vacancy:', error);
    }
  };

  const handleEditVacancy = async (editedVacancy) => {
    try {
      const finalVacancy = await editVacancy(editedVacancy);
      setVacancies(vacancies.map((item) => (item.id === finalVacancy.id ? finalVacancy : item)));
    } catch (error) {
      console.error('Error updating vacancy:', error);
    } finally {
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="container">
      {/* Navigation Bar */}
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

      {/* Main content */}
      <div className="container" style={{ marginTop: '70px' }}>
        <h2>Список вакансий</h2>
        {/* Modal to add a new vacancy */}
        {isModalOpen && (
          <div className="modal show d-flex justify-content-center" style={{ display: 'block' }}>
            <div className="modal-dialog">
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
                  {errorMessage && (
                    <div className="mt-2 text-danger">
                      <p>{errorMessage}</p>
                    </div>
                  )}
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

        {/* Render list of vacancies */}
        <div className="vacancies-list inert">
          {vacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              onEditClick={handleEditClick}
              onUpdateClick={handleUpdate}
              onDeleteClick={handleDelete}
            />
          ))}
        </div>

        {/* Pagination controls */}
        <div className="pagination d-flex justify-content-center mt-3">
          <button
            className="btn btn-secondary mx-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"} Назад
          </button>
          <span className="mx-3 text-white mt-2">
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

      {/* Edit vacancy modal */}
      {isEditModalOpen && selectedVacancy && (
        <EditVacancyModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          vacancy={selectedVacancy}
          onUpdate={handleEditVacancy}
        />
      )}
    </div>
  );
};

export default HomePage;