import { rootReducer } from '../root-reducer';
import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredient-slice';
import ordersReducer from '../slices/order-placement';
import userReducer from '../slices/users-slice';
import feedReducer from '../slices/feed-slice';

describe('rootReducer', () => {
  it('должен объединить все редюсы', () => {
    const combinedReducer = combineReducers({
      ingredients: ingredientsReducer,
      user: userReducer,
      ordersPlacement: ordersReducer,
      feeds: feedReducer
    });

    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual(combinedReducer(undefined, { type: '@@INIT' }));
  });
});