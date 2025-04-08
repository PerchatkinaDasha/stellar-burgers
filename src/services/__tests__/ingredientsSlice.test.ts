import ingredientsReducer, {
  getIngredients,
  initialState
} from '../slices/ingredient-slice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  it('должен обработать действие в состоянии pending и установить loading в true', () => {
    const action = getIngredients.pending.type;
    const state = ingredientsReducer(initialState, { type: action });

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать действие в состоянии fulfilled и установить данные и loading в false', () => {
    const mockData: TIngredient[] = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
      }
    ];
    const action = getIngredients.fulfilled(mockData, '', undefined);
    const state = ingredientsReducer(initialState, action);

    expect(state.data).toEqual(mockData);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('должен обработать действие в состоянии rejected и установить error и loading в false', () => {
    const mockError = new Error('Failed to fetch ingredients');
    const action = getIngredients.rejected(mockError, '', undefined);
    const state = ingredientsReducer(initialState, action);

    // Проверяем, содержит ли ошибка ожидаемую строку
    expect(state.error).toBeTruthy();
    expect(state.error).toMatch(/fetch|ошибка/i); // Проверяем на совпадение с "fetch" или "ошибка"
    expect(state.loading).toBe(false);
    expect(state.data).toEqual([]);
  });
});
