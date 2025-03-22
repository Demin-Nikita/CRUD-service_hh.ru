import { useParams } from 'react-router-dom';

const VacancyPage = () => {
  const { vacancyId } = useParams();

  return (
    <div className="container">
      <h1>Детали вакансии</h1>
      <p>Здесь будет информация о вакансии с id: {vacancyId}</p>
      <p>Пока что это просто пример, и информация будет добавлена позже.</p>
    </div>
  );
};

export default VacancyPage;