import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Header from '@components/header/Header';
import Home from '@pages/home/Home';
import theme from '@styles/theme';
import '@styles/global.css';
import '@styles/globalStyles';

// Страницы пользовательской части
import TestPage from '@pages/TestPage';
import LoginPage from '@pages/loginPage/LoginPage';
import RegisterPage from '@pages/auth/registerPage/RegisterPage';
import Logout from '@pages/auth/Logout';

import ProfilePage from '@pages/auth/profilePage/ProfilePage';
import { observer } from 'mobx-react';
import SelectApplicationType from "@pages/SelectApplicationType";
import SubmitApplicationForm from "@pages/SubmitApplicationForm";
import SuccessPage from "@pages/SuccessPage";
import ApplicationListPage from "@pages/ApplicationListPage";
import ProrectorPage from "./pages/ProrectorPage";
import SupportPage from './pages/SupportPage/SupportPage';
import ReviewerPage from './pages/ReviewerPage';

const BaseLayout: React.FC = () => {
    const location = useLocation();

    // Определяем, находится ли пользователь на админском маршруте
    const isAdminRoute = location.pathname.startsWith('/admin');
    return (
        <>
            {!isAdminRoute && <Header />}
            <Outlet />
        </>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Пользовательские маршруты */}
                    <Route path='/' element={<BaseLayout />}>
                        <Route index element={<Home />} />
                        <Route path='test' element={<TestPage />} />

                        <Route path='select-application-type' element={<SelectApplicationType />} />
                        <Route path='submit-application/:typeId' element={<SubmitApplicationForm />} />
                        <Route path='success' element={<SuccessPage />} />

                        <Route path='applications' element={<ApplicationListPage />} />

                        <Route path='prorector' element={<ProrectorPage />} />

                        <Route path='reviewer' element={<ReviewerPage />} />

                        <Route path='chat' element={<SupportPage />} />

                        <Route path='profile' element={<ProfilePage />} />
                        <Route path='login' element={<LoginPage />} />
                        <Route path='register' element={<RegisterPage />} />
                        <Route path='logout' element={<Logout />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default observer(App);
