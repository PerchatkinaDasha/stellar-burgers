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
import './app-content.css';

import { IngredientDetails, Modal, OrderInfo } from '@components';
import { getIngredients, getUser } from '@slices';
import { useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { getCookie } from '../../utils/cookie';

export const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;

  const isAuthenticated = !!getCookie('accessToken');
  const dispatch = useDispatch();

  useEffect(() => {
    if (getCookie('accessToken')) dispatch(getUser());
    dispatch(getIngredients());
  }, [dispatch]);

  const handleBack = () => navigate(-1);

  return (
    <>
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

        {/* Исправленный маршрут деталей ингредиента */}
        <Route
          path='/ingredients/:id'
          element={
            <div className='detailPageWrap'>
              <p className='text text_type_main-large detailHeader'>
                Детали ингредиента
              </p>
              <IngredientDetails />
            </div>
          }
        />

        <Route
          path='/feed/:number'
          element={
            <div className='detailPageWrap'>
              <p className='text text_type_digits-default detailHeader'>
                #{orderNumber && orderNumber.padStart(6, '0')}
              </p>
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedPage isAuthenticated={isAuthenticated}>
              <div className='detailPageWrap'>
                <p className='text text_type_digits-default detailHeader'>
                  #{orderNumber && orderNumber.padStart(6, '0')}
                </p>
                <OrderInfo />
              </div>
            </ProtectedPage>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${orderNumber?.padStart(6, '0')}`}
                onClose={handleBack}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={handleBack}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`#${orderNumber?.padStart(6, '0')}`}
                onClose={handleBack}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
