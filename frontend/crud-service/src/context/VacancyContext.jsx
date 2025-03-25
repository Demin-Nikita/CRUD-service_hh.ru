import { createContext, useContext, useState, useEffect } from "react";
import { fetchVacancies } from "../services/vacancyService";

// Create a context for managing vacancy data
const VacancyContext = createContext();

// Provider component to wrap the app and provide vacancy-related data
export const VacancyProvider = ({ children }) => {
  const [vacancies, setVacancies] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Function to load vacancies based on the current page
  const loadVacancies = async (page = currentPage) => {
    try {
      const data = await fetchVacancies(page);
      setVacancies(data.data);
      setTotalPages(data.pagination.total_pages);
    } catch (error) {
      setError("Ошибка загрузки вакансий");
    }
  };

  // Effect hook to load vacancies when the current page changes
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

// Custom hook to access the vacancy context
export const useVacancies = () => useContext(VacancyContext);
