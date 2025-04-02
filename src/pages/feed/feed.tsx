import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getFeeds } from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector((state) => state.feeds.data.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => dispatch(getFeeds());

  return orders.length ? (
    <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
  ) : (
    <Preloader />
  );
};
