import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/sidebar/sidebar';
import { Login } from '../pages/login/login';
import { Schedule } from '../pages/schedule/schedule';
import { Clients } from '../pages/clients/client';
import { Logs } from '../pages/logs/logs';
import { LoginClient } from '../pages/loginClient/loginClient';
import { CreateUser } from '../pages/createUser/createUser';
import { MyAccount } from '../pages/myAccount/myAccount';

interface LayoutProps {
    children: React.ReactNode;
    role: 'admin' | 'client';
}

const DashboardLayout = ({ children, role }: LayoutProps) => {
    return (
        <div className="layoutContainer">
            <Sidebar role={role} />
            <main className="mainContent">
                {children}
            </main>
        </div>
    );
};

export default function App() {
    return (
        <BrowserRouter basename="/tech">
            <Routes>
                <Route path="admin/login" element={<Login />} />

                <Route
                    path="admin/schedule"
                    element={
                        <DashboardLayout role='admin'>
                            <Schedule />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="admin/client"
                    element={
                        <DashboardLayout role='admin'>
                            <Clients />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="admin/logs"
                    element={
                        <DashboardLayout role='admin'>
                            <Logs />
                        </DashboardLayout>
                    }
                />
                <Route
                    path="/logs"
                    element={
                        <DashboardLayout role='client'>
                            <Logs />
                        </DashboardLayout>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <LoginClient />
                    }
                />
                <Route
                    path='/create'
                    element={
                        <CreateUser />
                    }
                />
                <Route
                    path='/my-schedule'
                    element={
                        <DashboardLayout role='client'>
                            <Schedule />
                        </DashboardLayout>
                    }
                />


                <Route
                    path='/account'
                    element={
                        <DashboardLayout role='client'>
                            <MyAccount />
                        </DashboardLayout>
                    }
                />

                  <Route
                    path='admin/account'
                    element={
                        <DashboardLayout role='admin'>
                            <MyAccount />
                        </DashboardLayout>
                    }
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}