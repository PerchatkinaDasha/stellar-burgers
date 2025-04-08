import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Типизация состояния стора для хранения ингредиентов
interface TInitialState {
  data: TIngredient[]; // Список ингредиентов
  loading: boolean; // Флаг загрузки
  error: string | null; // Ошибка запроса, если есть
}

export const initialState: TInitialState = {
  data: [], // Начальное состояние данных об ингредиентах
  loading: false, // Изначально загрузка отключена
  error: null // Ошибок нет
};

// Асинхронный экшен для получения ингредиентов
export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async (_, thunkAPI) => {
    try {
      const data = await getIngredientsApi(); // Запрос данных об ингредиентах
      return thunkAPI.fulfillWithValue(data); // Возвращаем полученные данные
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Не удалось получить ингредиенты';
      return thunkAPI.rejectWithValue(errorMessage); // В случае ошибки передаем сообщение
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка запроса ингредиентов
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.data = action.payload; // Сохраняем полученные ингредиенты в стейт
        state.loading = false;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || 'Произошла неизвестная ошибка';
      });
  }
});

export default ingredientsSlice.reducer;
