import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { rootReducer } from './root-reducer';

// Создаем Redux-хранилище (store) с основным редьюсером (rootReducer)
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// Определяем тип состояния (State) всего приложения
export type RootState = ReturnType<typeof rootReducer>;

// Определяем тип диспетчера (Dispatch) для использования в приложении
export type AppDispatch = typeof store.dispatch;

// Кастомные хуки useDispatch и useSelector для работы с типизированным Redux-хранилищем
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
