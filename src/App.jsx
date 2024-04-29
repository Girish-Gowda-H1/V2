// App.js
import { BrowserRouter } from 'react-router-dom';

// Axios
import axios from 'axios';

// Local
import ScrollToTop from '@components/ScrollToTop';
import GlobalContextProvider from './context';
import Routes from './routes';
import ThemeCustomization from './ui/themes';

import './App.css';

export function App() {
  axios.defaults.headers.common['SECURITY-TOKEN'] = localStorage.getItem('u_st');
  axios.defaults.headers.common['ADMIN-USER-ID'] = localStorage.getItem('u_id');

  // axios.defaults.baseURL = import.meta.env.RB_PYTHON_BACKEND_URL || 'https://cdash-backend.royalbrothers.com/api/dashboard/v1/upkeep';

  return (
    <BrowserRouter>
      <GlobalContextProvider>
        <ThemeCustomization>
          <ScrollToTop>
            <Routes />
          </ScrollToTop>
        </ThemeCustomization>
      </GlobalContextProvider>
    </BrowserRouter>
  );
}
