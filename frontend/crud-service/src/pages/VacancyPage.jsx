import { useParams } from 'react-router-dom';
import { useVacancies } from '../context/VacancyContext';
import VacancyCard from '../components/VacancyCard';

const VacancyPage = () => {
  const { vacancyId } = useParams();
  const {vacancies } = useVacancies();

  const vacancy = vacancies.find((v) => v.id.toString() === vacancyId);

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
      <VacancyCard key={vacancy.id} vacancy={vacancy} />
      <div className="mt-4 text-start">
        <h3>Описание</h3>
        <div dangerouslySetInnerHTML={{ __html: vacancy.description || 'Описание отсутствует' }} className="border p-3 rounded" />
      </div>
    </div>
  );
};

export default VacancyPage;