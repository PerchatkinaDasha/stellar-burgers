import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const ingredientData = useSelector((state) => state.ingredients.data);

  // Получаем ID ингредиента из URL
  const { id } = useParams();

  // Ищем ингредиент по ID с мемоизацией для оптимизации
  const ingredient = useMemo(
    () => ingredientData?.find((item) => item._id === id),
    [ingredientData, id]
  );

  // Пока данные загружаются или ингредиент не найден — показываем Preloader
  if (!ingredient) return <Preloader />;

  // Отображаем UI с деталями ингредиента
  return <IngredientDetailsUI ingredientData={ingredient} />;
};
