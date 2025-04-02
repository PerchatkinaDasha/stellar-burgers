import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useParams, useSearchParams } from 'react-router-dom';
import { getFeedById } from '@slices';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams();

  const orderData = useSelector((state) => state.feeds.order);
  const dispatch = useDispatch();

  console.log(orderData);

  // Загружаем информацию о заказе при монтировании компонента
  useEffect(() => {
    dispatch(getFeedById(+number!)); // Преобразуем номер заказа в число и отправляем экшен
  }, []);

  // Получаем список ингредиентов из хранилища Redux
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.data
  );

  // Подготавливаем данные для отображения
  const orderInfo = useMemo(() => {
    // Если нет данных о заказе или ингредиентов, возвращаем null
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt); // Преобразуем дату создания заказа

    // Определяем тип данных для хранения ингредиентов с количеством
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Формируем объект с ингредиентами и их количеством
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: any) => {
        if (!acc[item]) {
          // Находим ингредиент по ID
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++; // Увеличиваем счетчик ингредиента
        }

        return acc;
      },
      {}
    );

    // Рассчитываем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc: any, item: any) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]); // Пересчитываем данные при изменении заказа или списка ингредиентов

  // Если данные еще загружаются, показываем прелоадер
  if (!orderInfo) {
    return <Preloader />;
  }

  // Отображаем UI-компонент с информацией о заказе
  return <OrderInfoUI orderInfo={orderInfo} />;
};
