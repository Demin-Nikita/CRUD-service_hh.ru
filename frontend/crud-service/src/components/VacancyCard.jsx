import React, { useEffect, useState } from 'react';
import { IconTrash, IconRefresh, IconEdit,} from "@tabler/icons-react";
import { useNavigate } from 'react-router-dom';
import { deleteVacancy, updateVacancy, editVacancy } from '../services/vacancyService';
import { useVacancies } from "../context/VacancyContext";
import EditVacancyModal from './EditVacancyModal';
import '../styles/VacancyCard.css'

// VacancyCard component for displaying and managing vacancy information
const VacancyCard = ({ vacancy, onEditClick, onDeleteClick, onUpdateClick }) => {
  // Context hook to fetch and manage vacancies
  const { vacancies, loadVacancies, setVacancies, error } = useVacancies();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCardClick = () => {
    navigate(`/vacancy/${vacancy.id}`);
  };

  return (
    <div
      className={"card"}
      onClick={handleCardClick}
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
              onDeleteClick(vacancy.id);
            }}
            title="Удалить вакансию"
          >
            <IconTrash size={20} />
          </button>
          <button
            className="update-btn"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateClick(vacancy.id);
            }}
            title="Обновить вакансию"
          >
            <IconRefresh size={20} />
          </button>
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(vacancy);
            }}
            title="Редактировать вакансию"
          >
            <IconEdit size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VacancyCard;