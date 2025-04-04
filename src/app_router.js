import { BrowserRouter as HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import MarketingsPage from './pages/marketings'
import NewMarketing from './pages/new_marketing'
import MarketingLeadsPage from './pages/marketing_leads'
import MarketingEmailsPage from './pages/marketing_emails'

export const routes = {
    root: '/',
    login: '/login',
    marketings: '/marketings',
    newMarketing: '/marketings/new',
    marketingLeads: '/marketings/:id/leads',
    marketingEmails: '/marketings/:id/emails',
}

const AppRouter = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path={routes.root} element={<Navigate to={routes.login} />} />
                <Route path={routes.login} element={<LoginPage />} />
                <Route path={routes.marketings} element={<MarketingsPage />} />
                <Route path={routes.newMarketing} element={<NewMarketing />} />
                <Route path={routes.marketingLeads} element={<MarketingLeadsPage />} />
                <Route path={routes.marketingEmails} element={<MarketingEmailsPage />} />
            </Routes>
        </HashRouter>
    )
}

export default AppRouter
