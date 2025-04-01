import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

// Типизация состояния стора для хранения данных о заказах
interface TInitialState {
  data: TOrdersData; // Данные о заказах
  loading: boolean; // Флаг загрузки
  error: string | null; // Ошибка запроса, если есть
  order: any; // Информация о конкретном заказе
}

const initialState: TInitialState = {
  data: { orders: [], total: 0, totalToday: 0 }, // Начальное состояние данных о заказах
  loading: false, // Изначально загрузка отключена
  error: null, // Ошибок нет
  order: null // Заказ отсутствует
};

// Асинхронный экшен для получения всех фидов (заказов)
export const getFeeds = createAsyncThunk(
  'feeds/getFeeds',
  async () => await getFeedsApi()
);

// Асинхронный экшен для получения заказа по его ID
export const getFeedById = createAsyncThunk(
  'feeds/getFeed',
  async (id: number) => (await getOrderByNumberApi(id)).orders[0]
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка запроса всех заказов
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      })

      // Обработка запроса заказа по ID
      .addCase(getFeedById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.order = null; // Сбрасываем предыдущий заказ
      })
      .addCase(getFeedById.fulfilled, (state, action) => {
        state.order = action.payload; // Сохраняем заказ в стейт
        state.loading = false;
      })
      .addCase(getFeedById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export default feedsSlice.reducer;
