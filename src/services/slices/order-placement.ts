import { getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { v4 as uuid4 } from 'uuid';

// Типизация состояния стора для хранения данных о заказах
interface TInitialState {
  constructorItems: {
    bun: {
      price: number;
      _id?: string;
    };
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean; // Флаг, указывающий на выполнение запроса на заказ
  orderModalData: TOrder | null; // Данные заказа для отображения в модальном окне
  loading: boolean; // Флаг загрузки
  error: string | null; // Сообщение об ошибке, если есть
}

// Асинхронный экшен для создания заказа
export const requestOrder = createAsyncThunk(
  'order/request',
  async (array: string[], thunkAPI) => {
    try {
      const data = await orderBurgerApi(array); // Отправка запроса на создание заказа
      return thunkAPI.fulfillWithValue(data.order); // Возвращаем данные заказа
    } catch (error) {
      return thunkAPI.rejectWithValue(error); // В случае ошибки передаем её в стейт
    }
  }
);

const initialState: TInitialState = {
  constructorItems: {
    bun: { price: 0 }, // Изначально булка отсутствует
    ingredients: [] // Список ингредиентов пуст
  },
  orderRequest: false, // Заказ не отправляется
  orderModalData: null, // Нет активного заказа
  loading: false, // Нет загрузки
  error: null // Нет ошибок
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор бургера
    addConstructorItem: {
      prepare: (ingredient: TConstructorIngredient) => ({
        payload: { ...ingredient, uniqueId: uuid4() } // Генерация уникального ID для каждого ингредиента
      }),
      reducer: (
        state,
        action: PayloadAction<TConstructorIngredient & { uniqueId: string }>
      ) => {
        const item = action.payload;
        if (item.type === 'bun') {
          state.constructorItems.bun = item; // Если это булка, заменяем текущую
        } else {
          state.constructorItems.ingredients.push(item); // Иначе добавляем в список ингредиентов
        }
      }
    },
    // Удаление ингредиента из конструктора по индексу
    deleteConstructorItemByIndex: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== action.payload
        );
    },
    // Закрытие модального окна с заказом и сброс данных
    closeOrderModalData: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    },
    // Перемещение ингредиента вверх или вниз в списке
    moveConstructorItems: (state, action) => {
      const index =
        action.payload.type === 'up'
          ? action.payload.index - 1
          : action.payload.index + 1;

      const moveItem = state.constructorItems.ingredients[action.payload.index];

      state.constructorItems.ingredients.splice(action.payload.index, 1);

      state.constructorItems.ingredients.splice(index, 0, moveItem);
    }
  },

  extraReducers: (builder) => {
    builder
      // Обработка состояния при отправке запроса на заказ
      .addCase(requestOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      // Обработка успешного заказа
      .addCase(requestOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload; // Сохраняем данные заказа
        state.orderRequest = false;
        state.error = null;
        state.constructorItems = { bun: { price: 0 }, ingredients: [] }; // Очищаем конструктор
      })
      // Обработка ошибки при оформлении заказа
      .addCase(requestOrder.rejected, (state, action) => {
        state.error = action.payload as string;
        state.orderRequest = false;
      });
  }
});

export const {
  addConstructorItem,
  deleteConstructorItemByIndex,
  moveConstructorItems,
  closeOrderModalData
} = ordersSlice.actions;
export default ordersSlice.reducer;
