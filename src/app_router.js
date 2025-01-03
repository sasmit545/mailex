import { BrowserRouter as HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import MarketingPage from './pages/marketings'
import NewMarketing from './pages/new_marketing'

export const routes = {
    root: '/',
    login: '/login',
    marketings: '/marketings',
    newMarketing: '/marketings/new',
}

const AppRouter = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path={routes.root} element={<Navigate to={routes.login} />} />
                <Route path={routes.login} element={<LoginPage />} />
                <Route path={routes.marketings} element={<MarketingPage />} />
                <Route path={routes.newMarketing} element={<NewMarketing />} />
            </Routes>
        </HashRouter>
    )
}

export default AppRouter
