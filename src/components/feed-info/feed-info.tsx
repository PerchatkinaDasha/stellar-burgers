import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */

  const {
    orders: feeds,
    total,
    totalToday
  } = useSelector((state) => state.feeds.data);
  const orders: TOrder[] = feeds;
  const feed = { total, totalToday };
  // Получаем номера готовых заказов
  const readyOrders = getOrders(orders, 'done');
  // Получаем номера заказов в процессе выполнения
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
