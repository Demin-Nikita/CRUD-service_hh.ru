import { createContext, useContext, useState, useEffect } from "react";
import { fetchVacancies } from "../services/vacancyService";

const VacancyContext = createContext();

export const VacancyProvider = ({ children }) => {
  const [vacancies, setVacancies] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const loadVacancies = async (page = currentPage) => {
    try {
      const data = await fetchVacancies(page);
      setVacancies(data.data);
      setTotalPages(data.pagination.total_pages);
    } catch (error) {
      setError("Ошибка загрузки вакансий");
    }
  };

  useEffect(() => {
    loadVacancies();
  }, [currentPage]);

  return (
    <VacancyContext.Provider
      value={{
        vacancies,
        setVacancies,
        error,
        currentPage,
        setCurrentPage,
        totalPages,
        loadVacancies,
      }}
    >
      {children}
    </VacancyContext.Provider>
  );
};

export const useVacancies = () => useContext(VacancyContext);
