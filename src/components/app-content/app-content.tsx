import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  ProtectedPage,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';

import { IngredientDetails, Modal, OrderInfo } from '@components';
import { getIngredients, getUser } from '@slices';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { getCookie } from '../../utils/cookie';

export const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background; // Проверяем, есть ли background

  const isAuthenticated = !!getCookie('accessToken');
  const dispatch = useDispatch();

  useEffect(() => {
    if (getCookie('accessToken')) dispatch(getUser());
    dispatch(getIngredients());
  }, [dispatch]);

  const handleBack = () => navigate(-1);

  return (
    <>
      {/* Основные маршруты (страницы) */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedPage isAuthenticated={!isAuthenticated}>
              <Login />
            </ProtectedPage>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedPage isAuthenticated={!isAuthenticated}>
              <Register />
            </ProtectedPage>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedPage isAuthenticated={!isAuthenticated}>
              <ForgotPassword />
            </ProtectedPage>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedPage isAuthenticated={isAuthenticated}>
              <ResetPassword />
            </ProtectedPage>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedPage isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedPage>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedPage isAuthenticated={isAuthenticated}>
              <ProfileOrders />
            </ProtectedPage>
          }
        />

        {/* Добавляем отображение деталей ингредиента на отдельной странице */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Добавляем отображение деталей заказа на отдельной странице */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Маршруты для модальных окон */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={''} onClose={handleBack}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={''} onClose={handleBack}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={''} onClose={handleBack}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
