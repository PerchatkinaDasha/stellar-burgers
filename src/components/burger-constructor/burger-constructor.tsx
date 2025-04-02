import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';
import { closeOrderModalData, requestOrder } from '@slices';

export const BurgerConstructor: FC = () => {
  // Получаем данные из стора Redux
  const { constructorItems, orderModalData, orderRequest } = useSelector(
    (state) => state.ordersPlacement
  );
  const dispatch = useDispatch(); // Получаем функцию dispatch для отправки actions
  const navigate = useNavigate(); // Получаем функцию navigate для навигации по приложению

  // Функция для обработки клика по кнопке "Оформить заказ"
  const onOrderClick = () => {
    // Проверяем наличие токена доступа в куках
    if (!getCookie('accessToken')) {
      navigate('/login'); // Если токена нет, перенаправляем на страницу логина
      return;
    }

    // Проверяем, что булка выбрана и запрос на оформление заказа не выполняется
    if (!constructorItems.bun || orderRequest) return;

    // Формируем массив идентификаторов ингредиентов
    const ingredientIds = constructorItems.ingredients.map((item) => item._id);

    // Отправляем запрос на оформление заказа
    dispatch(
      requestOrder([
        constructorItems.bun._id!, // ID булки
        ...ingredientIds, // ID ингредиентов
        constructorItems.bun._id! // ID булки (для верхней части бургера)
      ])
    );
  };

  // Функция для закрытия модального окна с информацией о заказе
  const closeOrderModal = () => {
    dispatch(closeOrderModalData()); // Отправляем action для закрытия модального окна
  };

  // Вычисляем общую стоимость бургера с использованием useMemo для оптимизации
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) + // Стоимость двух булок
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price, // Суммируем стоимость ингредиентов
        0
      ),
    [constructorItems] // Зависимость: пересчитываем только при изменении constructorItems
  );

  // Возвращаем UI конструктора бургера
  return (
    <BurgerConstructorUI
      price={price} // Передаем общую стоимость бургера
      orderRequest={orderRequest} // Передаем состояние запроса на оформление заказа
      constructorItems={constructorItems} // Передаем данные о собранном бургере
      orderModalData={orderModalData} // Передаем данные для модального окна
      onOrderClick={onOrderClick} // Передаем обработчик клика по кнопке "Оформить заказ"
      closeOrderModal={closeOrderModal} // Передаем обработчик закрытия модального окна
    />
  );
};
