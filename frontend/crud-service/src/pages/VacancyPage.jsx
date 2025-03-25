import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useVacancies } from '../context/VacancyContext';
import VacancyCard from '../components/VacancyCard';
import { editVacancy, deleteVacancy, updateVacancy } from '../services/vacancyService';
import EditVacancyModal from '../components/EditVacancyModal';

const VacancyPage = () => {
  const { vacancyId } = useParams();
  const { vacancies, setVacancies } = useVacancies();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const vacancy = vacancies.find((v) => v.id.toString() === vacancyId);
  const navigate = useNavigate();

  // Modal form management
  const handleEditClick = (vacancy) => {
    setIsEditModalOpen(true);
  };
  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  // Handle vacancy options
  const handleDelete = async (vacancyId) => {
    try {
      const response = await deleteVacancy(vacancyId);
      navigate('/home');
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

  if (!vacancy) {
    return (
      <div className="container mt-5 text-center">
        <h1>Вакансия не найдена</h1>
        <p>Проверьте правильность ID вакансии.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Display VacancyCard with edit, update, and delete actions */}
      <VacancyCard
        key={vacancy.id}
        vacancy={vacancy}
        onEditClick={handleEditClick}
        onUpdateClick={handleUpdate}
        onDeleteClick={handleDelete}
      />
      {/* Display description of the vacancy */}
      <div className="mt-4 text-start">
        <h3>Описание</h3>
        <div dangerouslySetInnerHTML={{ __html: vacancy.description || 'Описание отсутствует' }} className="border p-3 rounded" />
      </div>
      {/* Display address of the company */}
      <div className="mt-4 text-start">
        <h3>Адрес</h3>
        <p>{vacancy.address || 'Адрес не указан'}</p>
      </div>
      {/* Back button to navigate to the home page */}
      <div className="mt-4">
        <button className="btn btn-secondary w-50" onClick={() => navigate('/home')}>
          Назад к списку вакансий
        </button>
      </div>
      {/* Edit vacancy modal */}
      {isEditModalOpen && (
        <EditVacancyModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          vacancy={vacancy}
          onUpdate={handleEditVacancy}
        />
      )}
    </div>
  );
};

export default VacancyPage;