import React, { useEffect, useState } from 'react';
import { IconTrash, IconRefresh, IconEdit,} from "@tabler/icons-react";
import { useNavigate } from 'react-router-dom';
import '../styles/VacancyCard.css'
import { deleteVacancy, updateVacancy, editVacancy } from '../services/vacancyService';
import { useVacancies } from "../context/VacancyContext";
import EditVacancyModal from './EditVacancyModal';

const VacancyCard = ({ vacancy }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { vacancies, setVacancies, error } = useVacancies();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteVacancy(vacancy.id);
      setVacancies(vacancies.filter((item) => item.id !== vacancy.id));
    } catch (error) {
      console.error('Error deleting vacancy:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const updatedVacancy = await updateVacancy(vacancy.id);
      setVacancies(vacancies.map((item) => (item.id === vacancy.id ? updatedVacancy : item)));
    } catch (error) {
      console.error('Error updating vacancy:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/vacancy/${vacancy.id}`);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditedVacancy = async (editedVacancy) => {
    try {
      setIsUpdating(true);
      const finalVacancy = await editVacancy(editedVacancy);
      setVacancies(vacancies.map((item) => (item.id === finalVacancy.id ? finalVacancy : item)));
    } catch (error) {
      console.error('Error updating vacancy:', error);
    } finally {
      setIsUpdating(false);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div
      className={`card shadow-sm border-0 bg-custom-dark text-light mb-3`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-center mb-3">
          {vacancy.logo_url && (
            <img
              src={vacancy.logo_url}
              alt={vacancy.company_name}
              className="rounded-circle me-3"
              style={{ width: '40px', height: '40px', border: '2px solid #ddd' }}
            />
          )}
          <h5 className="card-title mb-0">{vacancy.title}</h5>
        </div>
        <p className="text-muted mb-1">Компания: {vacancy.company_name || 'Не указана'}</p>
        <p className="text-muted mb-1">Добавлена: {vacancy.created_at ? formatDate(vacancy.created_at) : 'Не указано'}</p>
        <p className="text-muted">Статус вакансии: {vacancy.status || 'Не указан'}</p>

        <div className="vacancy-card-actions">
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            title="Удалить вакансию"
          >
            <IconTrash size={20} />
          </button>

          <button
            className="update-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate();
            }}
            disabled={isUpdating}
            title="Обновить вакансию"
          >
            <IconRefresh size={20} />
          </button>

          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick();
            }}
            title="Редактировать вакансию"
          >
            <IconEdit size={20} />
          </button>
        </div>
      </div>
      {isEditModalOpen && (
        <EditVacancyModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          vacancy={vacancy}
          onUpdate={handleEditedVacancy}
        />
      )}
    </div>
  );
};

export default VacancyCard;