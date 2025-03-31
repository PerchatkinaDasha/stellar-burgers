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
  async (_, thunkAPI) => {
    try {
      return thunkAPI.fulfillWithValue(await getFeedsApi()); // Запрос данных и возврат результата
    } catch (error) {
      return thunkAPI.rejectWithValue(error); // В случае ошибки передаем ее в стейт
    }
  }
);

// Асинхронный экшен для получения заказа по его ID
export const getFeedById = createAsyncThunk(
  'feeds/getFeed',
  async (id: number, thunkAPI) => {
    try {
      const data = await getOrderByNumberApi(id); // Получаем данные по ID
      return thunkAPI.fulfillWithValue(data.orders[0]); // Возвращаем первый найденный заказ
    } catch (error) {
      return thunkAPI.rejectWithValue(error); // В случае ошибки передаем ее в стейт
    }
  }
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      });
  }
});

export default feedsSlice.reducer;
