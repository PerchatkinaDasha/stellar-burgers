import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';

const maxIngredients = 6; // Максимальное количество ингредиентов для отображения

// Компонент OrderCard отвечает за отображение карточки заказа
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  /** TODO: взять переменную из стора */
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.data
  );

  // Вычисление информации о заказе
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null; // Если ингредиентов нет, возвращаем null

    // Формируем массив ингредиентов, входящих в заказ
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // Рассчитываем общую стоимость заказа
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Ограничиваем количество отображаемых ингредиентов
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Определяем количество ингредиентов, которые не уместились в отображение
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    // Преобразуем строку даты в объект Date
    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]); // Пересчитываем, если изменился заказ или ингредиенты

  if (!orderInfo) return null; // Если информации о заказе нет, не рендерим компонент

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
