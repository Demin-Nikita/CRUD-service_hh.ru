import { createContext, useContext, useState, useEffect } from "react";
import { fetchVacancies } from "../services/vacancyService";

const VacancyContext = createContext();

export const VacancyProvider = ({ children }) => {
  const [vacancies, setVacancies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const data = await fetchVacancies();
        setVacancies(data);
      } catch (error) {
        setError("Ошибка загрузки вакансий");
      }
    };

    loadVacancies();
  }, []);

  return (
    <VacancyContext.Provider value={{ vacancies, setVacancies, error }}>
      {children}
    </VacancyContext.Provider>
  );
};

export const useVacancies = () => useContext(VacancyContext);
