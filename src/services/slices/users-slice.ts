import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { setCookie } from './../../utils/cookie';

// Начальное состояние для данных пользователя
type TInitialState = {
  data: TUser;
  loading: boolean;
  error: null | { message: string };
  orderBurger: TOrder[];
};

// Исходное состояние с пустыми значениями
const initialState: TInitialState = {
  data: { name: '', email: '' }, // Данные пользователя
  loading: false, // Флаг загрузки
  error: null, // Ошибка (если есть)
  orderBurger: [] // Заказы (пока пустой массив)
};

// Создание асинхронных экшенов для работы с API

// Получение данных пользователя
export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  try {
    const data = await getUserApi(); // Запрос к API для получения данных пользователя
    return thunkAPI.fulfillWithValue(data.user); // Успех - возвращаем данные пользователя
  } catch (error) {
    return thunkAPI.rejectWithValue(error); // Ошибка - отклоняем с ошибкой
  }
});

// Получение заказов пользователя
export const getOrdersByUser = createAsyncThunk(
  'user/getOrders',
  async (_, thunkAPI) => {
    try {
      const data = await getOrdersApi(); // Запрос к API для получения заказов
      return thunkAPI.fulfillWithValue(data); // Успех - возвращаем заказы
    } catch (error) {
      return thunkAPI.rejectWithValue(error); // Ошибка - отклоняем с ошибкой
    }
  }
);

// Вход пользователя в систему
export const login = createAsyncThunk(
  'user/login',
  async (fields: TLoginData, thunkAPI) => {
    try {
      const data = await loginUserApi(fields); // Запрос к API для входа пользователя
      // Сохраняем токены в cookies
      setCookie('accessToken', data.accessToken);
      setCookie('refreshToken', data.refreshToken);
      return thunkAPI.fulfillWithValue(data.user); // Успех - возвращаем данные пользователя
    } catch (error) {
      return thunkAPI.rejectWithValue(error); // Ошибка - отклоняем с ошибкой
    }
  }
);

// Регистрация пользователя
export const register = createAsyncThunk(
  'user/register',
  async (fields: TRegisterData, thunkAPI) => {
    try {
      const data = await registerUserApi(fields); // Запрос к API для регистрации пользователя
      // Сохраняем токены в cookies
      setCookie('accessToken', data.accessToken);
      setCookie('refreshToken', data.refreshToken);
      return thunkAPI.fulfillWithValue(data.user); // Успех - возвращаем данные пользователя
    } catch (error) {
      return thunkAPI.rejectWithValue(error); // Ошибка - отклоняем с ошибкой
    }
  }
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (fields: Partial<TUser>, thunkAPI) => {
    try {
      const data = await updateUserApi(fields); // Запрос к API для обновления данных пользователя
      return thunkAPI.fulfillWithValue(data.user); // Успех - возвращаем обновленные данные пользователя
    } catch (error) {
      return thunkAPI.rejectWithValue(error); // Ошибка - отклоняем с ошибкой
    }
  }
);

// Слайс для управления состоянием пользователя
const userSlice = createSlice({
  name: 'user',
  initialState, // Изначальное состояние
  reducers: {}, // Здесь можно добавить дополнительные редьюсеры, если нужно
  extraReducers: (builder) => {
    builder
      // Логика для обработки различных состояний асинхронных экшенов (загрузка, успех, ошибка)

      // Вход в систему
      .addCase(login.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload; // Успех - сохраняем данные пользователя
        state.loading = false; // Снимаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false; // Снимаем флаг загрузки
        state.error = { message: action.error.message || 'Ошибка входа' }; // Устанавливаем ошибку
      })

      // Регистрация
      .addCase(register.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(register.fulfilled, (state, action) => {
        state.data = action.payload; // Успех - сохраняем данные пользователя
        state.loading = false; // Снимаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false; // Снимаем флаг загрузки
        state.error = { message: action.error.message || 'Ошибка регистрации' }; // Устанавливаем ошибку
      })

      // Получение данных пользователя
      .addCase(getUser.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload; // Успех - сохраняем данные пользователя
        state.loading = false; // Снимаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false; // Снимаем флаг загрузки
        state.error = {
          message:
            action.error.message || 'Не удалось получить данные пользователя'
        }; // Устанавливаем ошибку
      })

      // Получение заказов пользователя
      .addCase(getOrdersByUser.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(getOrdersByUser.fulfilled, (state, action) => {
        state.orderBurger = action.payload; // Успех - сохраняем заказы
        state.error = null; // Очищаем ошибку
      })
      .addCase(getOrdersByUser.rejected, (state, action) => {
        state.error = {
          message: action.error.message || 'Не удалось получить заказы'
        }; // Устанавливаем ошибку
        state.loading = false; // Снимаем флаг загрузки
      })

      // Обновление данных пользователя
      .addCase(updateUser.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload; // Успех - сохраняем обновленные данные пользователя
        state.loading = false; // Снимаем флаг загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false; // Снимаем флаг загрузки
        state.error = {
          message: action.error.message || 'Не удалось обновить пользователя'
        }; // Устанавливаем ошибку
      });
  }
});

// Экспортируем редьюсер слайса
export default userSlice.reducer;
