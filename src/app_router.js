import { BrowserRouter as HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import MarketingsPage from './pages/marketings'
import NewMarketing from './pages/new_marketing'
import MarketingLeadsPage from './pages/marketing_leads'
import MarketingEmailsPage from './pages/marketing_emails'
import CreateCampaign from './pages/campaigns'
import Navbar from './components/navbar'
import HomePage from './pages/home'
export const routes = {
    root: '/',
    home: '/home',
    login: '/login',
    marketings: '/marketings',
    newMarketing: '/marketings/new',
    marketingLeads: '/marketings/:id/leads',
    marketingEmails: '/marketings/:id/emails',
    createcampaign: '/campaigns/create'
}

const AppRouter = () => {
    return (
        <HashRouter>
            <Navbar />
            <Routes>
                <Route path={routes.root} element={<Navigate to={routes.login} />} />
                <Route path={routes.home} element={<HomePage />} />
                <Route path={routes.login} element={<LoginPage />} />
                <Route path={routes.marketings} element={<MarketingsPage />} />
                <Route path={routes.newMarketing} element={<NewMarketing />} />
                <Route path={routes.marketingLeads} element={<MarketingLeadsPage />} />
                <Route path={routes.marketingEmails} element={<MarketingEmailsPage />} />
                <Route path={routes.createcampaign} element={<CreateCampaign />} />

            </Routes>
        </HashRouter>
    )
}

export default AppRouter
