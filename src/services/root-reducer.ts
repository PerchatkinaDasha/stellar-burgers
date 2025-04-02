import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredient-slice';
import ordersReducer from './slices/order-placement';
import userReducer from './slices/users-slice';
import feedReducer from './slices/feed-slice';
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  ordersPlacement: ordersReducer,
  feeds: feedReducer
});
