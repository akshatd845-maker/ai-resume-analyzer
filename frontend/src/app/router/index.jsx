import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/app/layouts/app-layout'
import { AuthLayout } from '@/app/layouts/auth-layout'
import { RootLayout } from '@/app/layouts/root-layout'
import { AdminRoute } from '@/app/router/admin-route'
import { GuestRoute } from '@/app/router/guest-route'
import { ProtectedRoute } from '@/app/router/protected-route'
import { LoadingState } from '@/components/common'

const HomePage = lazy(() =>
  import('@/features/common/pages/home-page').then((m) => ({ default: m.HomePage })),
)
const LoginPage = lazy(() =>
  import('@/features/auth/pages/login-page').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/register-page').then((m) => ({ default: m.RegisterPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/forgot-password-page').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
)
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/reset-password-page').then((m) => ({
    default: m.ResetPasswordPage,
  })),
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
)
const ResumePage = lazy(() =>
  import('@/features/resume/pages/resume-page').then((m) => ({ default: m.ResumePage })),
)
const AnalysisPage = lazy(() =>
  import('@/features/analysis/pages/analysis-page').then((m) => ({ default: m.AnalysisPage })),
)
const JobsPage = lazy(() =>
  import('@/features/jobs/pages/jobs-page').then((m) => ({ default: m.JobsPage })),
)
const AdminPage = lazy(() =>
  import('@/features/admin/pages/admin-page').then((m) => ({ default: m.AdminPage })),
)
const ProfilePage = lazy(() =>
  import('@/features/profile/pages/profile-page').then((m) => ({ default: m.ProfilePage })),
)
const SettingsPage = lazy(() =>
  import('@/features/profile/pages/settings-page').then((m) => ({ default: m.SettingsPage })),
)
const NotFoundPage = lazy(() =>
  import('@/features/common/pages/not-found-page').then((m) => ({ default: m.NotFoundPage })),
)
const OAuthCallbackPage = lazy(() =>
  import('@/features/auth/pages/oauth-callback-page').then((m) => ({
    default: m.OAuthCallbackPage,
  })),
)

function Lazy({ children }) {
  return <Suspense fallback={<LoadingState />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <Lazy>
        <NotFoundPage />
      </Lazy>
    ),
    children: [
      {
        index: true,
        element: (
          <Lazy>
            <HomePage />
          </Lazy>
        ),
      },
      {
        // OAuth callback — public, no auth guard needed
        path: 'auth/callback',
        element: (
          <Lazy>
            <OAuthCallbackPage />
          </Lazy>
        ),
      },
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: 'login',
                element: (
                  <Lazy>
                    <LoginPage />
                  </Lazy>
                ),
              },
              {
                path: 'register',
                element: (
                  <Lazy>
                    <RegisterPage />
                  </Lazy>
                ),
              },
              {
                path: 'forgot-password',
                element: (
                  <Lazy>
                    <ForgotPasswordPage />
                  </Lazy>
                ),
              },
              {
                path: 'reset-password',
                element: (
                  <Lazy>
                    <ResetPasswordPage />
                  </Lazy>
                ),
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: 'dashboard',
                element: (
                  <Lazy>
                    <DashboardPage />
                  </Lazy>
                ),
              },
              {
                path: 'resumes',
                element: (
                  <Lazy>
                    <ResumePage />
                  </Lazy>
                ),
              },
              {
                path: 'resume',
                element: (
                  <Lazy>
                    <ResumePage />
                  </Lazy>
                ),
              },
              {
                path: 'analysis/:resumeId',
                element: (
                  <Lazy>
                    <AnalysisPage />
                  </Lazy>
                ),
              },
              {
                path: 'analysis',
                element: (
                  <Lazy>
                    <AnalysisPage />
                  </Lazy>
                ),
              },
              {
                path: 'jobs',
                element: (
                  <Lazy>
                    <JobsPage />
                  </Lazy>
                ),
              },
              {
                path: 'profile',
                element: (
                  <Lazy>
                    <ProfilePage />
                  </Lazy>
                ),
              },
              {
                path: 'settings',
                element: (
                  <Lazy>
                    <SettingsPage />
                  </Lazy>
                ),
              },
              {
                element: <AdminRoute />,
                children: [
                  {
                    path: 'admin',
                    element: (
                      <Lazy>
                        <AdminPage />
                      </Lazy>
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: (
          <Lazy>
            <NotFoundPage />
          </Lazy>
        ),
      },
    ],
  },
])
