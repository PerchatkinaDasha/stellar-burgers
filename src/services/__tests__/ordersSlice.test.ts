import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, {
  addConstructorItem,
  deleteConstructorItemByIndex,
  moveConstructorItems
} from '../slices/order-placement';
import { RootState } from '../store';
import { TConstructorIngredient } from '@utils-types';

const ingredient1: TConstructorIngredient = {
  _id: '1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  id: 'unique-id-1'
};

const ingredient2: TConstructorIngredient = {
  _id: '2',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  id: 'unique-id-2'
};

describe('ordersSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { ordersPlacement: ordersReducer }
    });
  });

  it('должен обрабатывать добавление элемента в конструктор', () => {
    store.dispatch(addConstructorItem(ingredient1));

    const state = store.getState() as RootState;
    const constructorItems = state.ordersPlacement.constructorItems;

    const addedItem = constructorItems
      .ingredients[0] as TConstructorIngredient & { uniqueId: string };

    expect(constructorItems.ingredients).toHaveLength(1);
    expect(addedItem).toHaveProperty('uniqueId');
    expect(addedItem.uniqueId).toBeDefined();
    expect(addedItem).toEqual(expect.objectContaining(ingredient1));
  });

  it('должен обрабатывать удаление элемента конструктора по индексу', () => {
    store.dispatch(addConstructorItem(ingredient1));
    store.dispatch(addConstructorItem(ingredient2));

    store.dispatch(deleteConstructorItemByIndex(0));

    const state = store.getState() as RootState;
    const constructorItems = state.ordersPlacement.constructorItems;

    expect(constructorItems.ingredients).toHaveLength(1);
    expect(constructorItems.ingredients[0]._id).toBe('2');
  });

  it('должен обрабатывать перемещение элементов конструктора', () => {
    store.dispatch(addConstructorItem(ingredient1));
    store.dispatch(addConstructorItem(ingredient2));

    store.dispatch(moveConstructorItems({ index: 0, type: 'down' }));

    const state = store.getState() as RootState;
    const constructorItems = state.ordersPlacement.constructorItems;

    expect(constructorItems.ingredients[0]._id).toBe('2');
    expect(constructorItems.ingredients[1]._id).toBe('1');
  });
});