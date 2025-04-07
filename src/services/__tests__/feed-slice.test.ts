import { RootState } from '../store';
import { configureStore } from '@reduxjs/toolkit';
import feedReducer, { getFeeds, getFeedById } from '../slices/feed-slice';
import { getFeedsApi, getOrderByNumberApi } from '@api';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
}));

describe('feed-slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feeds: feedReducer,
      },
    });
  });

  describe('getFeeds', () => {
    it('должен обрабатывать состояние "fulfilled", когда запрос к API успешен', async () => {
      const mockFeedsData = {
        orders: [
          {
            _id: '1',
            number: 1001,
            status: 'done',
            name: 'burger1',
            createdAt: '2024-10-01T00:00:00Z',
            updatedAt: '2024-10-01T01:00:00Z',
            ingredients: ['1', '2', '3'],
          },
        ],
        total: 1,
        totalToday: 1,
      };

      (getFeedsApi as jest.Mock).mockResolvedValue(mockFeedsData);

      await store.dispatch(getFeeds() as any);

      const state = store.getState() as RootState;
      const feedsState = state.feeds;
      expect(feedsState.loading).toBe(false);
      expect(feedsState.error).toBeNull();
      expect(feedsState.data.orders).toHaveLength(1);
      expect(feedsState.data.total).toBe(1);
    });

    it('должен обрабатывать состояние "rejected", когда запрос к API не удался', async () => {
      const errorMessage = 'Не удалось получить feeds';
      const mockError = new Error(errorMessage);

      (getFeedsApi as jest.Mock).mockRejectedValue(mockError);

      await store.dispatch(getFeeds() as any);

      const state = store.getState() as RootState;
      const feedsState = state.feeds;
      expect(feedsState.loading).toBe(false);
      expect(feedsState.error).toBe(errorMessage); 
      expect(feedsState.data.orders).toHaveLength(0);
    });
  });

  describe('getFeedById', () => {
    it('должен обрабатывать состояние, когда вызов API успешен', async () => {
      const mockOrderData = {
        _id: '1',
        number: 1001,
        status: 'done',
        name: 'burger1',
        createdAt: '2024-10-01T00:00:00Z',
        updatedAt: '2024-10-01T01:00:00Z',
        ingredients: ['1', '2', '3'],
      };

      (getOrderByNumberApi as jest.Mock).mockResolvedValue({
        orders: [mockOrderData],
      });

      await store.dispatch(getFeedById(1001) as any);

      const state = store.getState() as RootState;
      const feedsState = state.feeds;
      expect(feedsState.loading).toBe(false);
      expect(feedsState.error).toBeNull();
      expect(feedsState.order).toEqual(mockOrderData);
    });

    it('должен обрабатывать состояние "rejected", когда вызов API завершается с ошибкой', async () => {
      const errorMessage = 'Не удалось получить order'; 
      const mockError = new Error(errorMessage);

      (getOrderByNumberApi as jest.Mock).mockRejectedValue(mockError);

      await store.dispatch(getFeedById(1001) as any);

      const state = store.getState() as RootState;
      const feedsState = state.feeds;
      expect(feedsState.loading).toBe(false);
      expect(feedsState.error).toBe(errorMessage); 
      expect(feedsState.order).toBeNull();
    });
  });
});
