import { Provider } from 'react-redux';
import '../../index.css';
import styles from './app.module.css';

import { AppContent } from '../app-content';
import { AppHeader } from '../app-header';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './../../services/store';

// Основной компонент приложения
const App = () => (
  <Router>
    <div className={styles.app}>
      {/* Подключаем Redux-хранилище ко всему приложению */}
      <Provider store={store}>
        {/* Шапка приложения */}
        <AppHeader />
        {/* Основное содержимое приложения */}
        <AppContent />
      </Provider>
    </div>
  </Router>
);

export default App;
