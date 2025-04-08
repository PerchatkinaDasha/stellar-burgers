import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients, ...rest }, ref) => {
  /** TODO: взять переменную из стора */
  const burgerConstructor = useSelector(
    (state) => state.ordersPlacement.constructorItems
  );

  // Вычисление количества каждого ингредиента в заказе
  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};

    // Подсчет количества каждого ингредиента
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Если есть булочка, учитываем ее дважды (верхняя и нижняя часть бургера)
    if (bun) counters[bun._id!] = 2;

    return counters;
  }, [burgerConstructor]);

  // Отображение UI-компонента категории ингредиентов
  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      {...rest}
    />
  );
});
