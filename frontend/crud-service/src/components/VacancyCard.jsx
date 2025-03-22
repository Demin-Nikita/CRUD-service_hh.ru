import React from 'react';
import { IconBriefcase, IconCalendar, IconBuilding } from "@tabler/icons-react";
import { useNavigate } from 'react-router-dom';
import '../styles/VacancyCard.css'

const VacancyCard = ({ vacancy }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isDarkTheme = document.body.classList.contains('dark');
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/vacancy/${vacancy.id}`);
  };

  return (
    <div
      className={`card shadow-sm border-0 ${isDarkTheme ? 'bg-custom-dark text-light' : ''} mb-3`}
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
      </div>
    </div>
  );
};

export default VacancyCard;