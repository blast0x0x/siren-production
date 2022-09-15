import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ChangePassword from './components/auth/ChangePassword';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Programmes from './components/Programmes';
import ProgrammeCreate from './components/ProgrammeCreate';
import ProgrammeUpdate from './components/ProgrammeUpdate';
import BudgetLines from './components/BudgetLines';
import BudgetLineCreate from './components/BudgetLineCreate';
import BudgetLineUpdate from './components/BudgetLineUpdate';
import Outputs from './components/Outputs';
import Users from './components/Users';
import UserCreate from './components/UserCreate';
import UserUpdate from './components/UserUpdate';
import GenerateReports from './components/GenerateReports';
import IprCreate from './components/IprCreate';
import IprEdit from './components/IprEdit';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import { LOGOUT } from './actions/types';

import './App.css';

function App() {
  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    store.dispatch(loadUser());

    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Alert />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/programme/create" element={<ProgrammeCreate />} />
          <Route path="/programme/edit/:id" element={<ProgrammeUpdate />} />
          <Route path="/budgetlines" element={<BudgetLines />} />
          <Route path="/budgetline/create" element={<BudgetLineCreate />} />
          <Route path="/budgetline/edit/:id" element={<BudgetLineUpdate />} />
          <Route path="/outputs" element={<Outputs />} />
          <Route path="/budget-lines" element={<BudgetLines />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user/create" element={<UserCreate />} />
          <Route path="/user/edit/:id" element={<UserUpdate />} />
          <Route path="/generate-reports" element={<GenerateReports />} />
          <Route path="/ipr/create" element={<IprCreate />} />
          <Route path="/ipr/edit/:id" element={<IprEdit />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
