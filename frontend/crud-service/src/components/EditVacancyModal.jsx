import React, { useState, useEffect } from 'react';
import '../styles/EditVacancyModal.css'

const EditVacancyModal = ({ isOpen, onClose, vacancy, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    status: '',
    description: '',
  });

  useEffect(() => {
    if (vacancy && isOpen) {
      setFormData({
        title: vacancy.title || '',
        company_name: vacancy.company_name || '',
        status: vacancy.status || '',
        description: vacancy.description || '',
      });
    }
  }, [vacancy, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedVacancy = { ...vacancy, ...formData };
    onUpdate(updatedVacancy);
    onClose();
  };

  return isOpen ? (
    <div className="modal" >
      <div className="modal-content bg-dark border-1 shadow-lg rounded-3 w-25" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header border-0">
          <h5 className="modal-title">Редактировать вакансию</h5>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Заголовок</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Компания</label>
              <input
                type="text"
                className="form-control"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Статус</label>
              <input
                type="text"
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Описание</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
              />
            </div>
          </div>
          <div className="modal-footer bg-dark border-0">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Закрыть</button>
            <button type="submit" className="btn btn-primary">Сохранить изменения</button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default EditVacancyModal;
