import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  login,
  register,
  getUser,
  getOrdersByUser,
  updateUser
} from '../slices/users-slice';
import { TUser, TOrder } from '@utils-types';

const mockUser: TUser = { email: 'test@example.com', name: 'John Doe' };
const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Флюоресцентный люминесцентный бургер',
    createdAt: '2024-05-23T00:48:48.039Z',
    updatedAt: '2024-05-23T00:48:48.410Z',
    number: 40680,
    ingredients: ['1', '2']
  }
];

jest.mock('@api', () => ({
  getUserApi: jest.fn(() => Promise.resolve({ user: mockUser })),
  getOrdersApi: jest.fn(() => Promise.resolve(mockOrders)),
  loginUserApi: jest.fn(() =>
    Promise.resolve({
      user: mockUser,
      accessToken: 'token',
      refreshToken: 'refresh'
    })
  ),
  registerUserApi: jest.fn(() =>
    Promise.resolve({
      user: mockUser,
      accessToken: 'token',
      refreshToken: 'refresh'
    })
  ),
  updateUserApi: jest.fn(() => Promise.resolve({ user: mockUser }))
}));

describe('userSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: { user: userReducer }
    });
  });

  it('должен обрабатывать состояние login.pending', async () => {
    const initialState = store.getState().user;

    store.dispatch(
      login.pending('requestId', {
        email: 'test@example.com',
        password: 'password'
      })
    );

    const state = store.getState().user;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать login.fulfilled', async () => {
    await store.dispatch(
      login.fulfilled(mockUser, '123', {
        email: 'test@example.com',
        password: 'password'
      })
    );

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  it('должен обработать login.rejected', async () => {
    const errorMessage = 'Login failed';

    await store.dispatch(
      login.rejected(new Error(errorMessage), '123', {
        email: 'test@example.com',
        password: 'password'
      })
    );

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.error).toEqual({ message: errorMessage });
  });

  it('должен обработать getUser.pending', async () => {
    store.dispatch(getUser.pending('requestId'));

    const state = store.getState().user;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать getUser.fulfilled', async () => {
    await store.dispatch(getUser.fulfilled(mockUser, '123'));

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  it('должен обработать getUser.rejected', async () => {
    const errorMessage = 'Failed to fetch user data';
    await store.dispatch(getUser.rejected(new Error(errorMessage), '123'));

    const state = store.getState().user;
    expect(state.loading).toBe(false);
    expect(state.error).toEqual({ message: errorMessage });
  });

  it('должен обработать getOrdersByUser.fulfilled', async () => {
    await store.dispatch(getOrdersByUser.fulfilled(mockOrders, '123'));

    const state = store.getState().user;
    expect(state.orderBurger).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  it('должен обработать updateUser.fulfilled', async () => {
    await store.dispatch(updateUser.fulfilled(mockUser, '123', {}));

    const state = store.getState().user;
    expect(state.data).toEqual(mockUser);
    expect(state.error).toBeNull();
  });
});
