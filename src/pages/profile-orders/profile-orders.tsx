import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrdersByUser } from '@slices';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  // Получаем заказы пользователя из стора
  const orders: TOrder[] = useSelector((state) => state.user.orderBurger);

  // Загружаем заказы при монтировании компонента
  useEffect(() => {
    dispatch(getOrdersByUser());
  }, [dispatch]);

  // Передаем список заказов в UI-компонент
  return <ProfileOrdersUI orders={orders} />;
};
