import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import AuthLayout from "@/components/organisms/AuthLayout";
import Layout from "@/components/organisms/Layout";
// Auth Pages
const Login = lazy(() => import("@/components/pages/auth/Login"))
const Signup = lazy(() => import("@/components/pages/auth/Signup"))
const ForgotPassword = lazy(() => import("@/components/pages/auth/ForgotPassword"))
const ResetPassword = lazy(() => import("@/components/pages/auth/ResetPassword"))
const EmailVerification = lazy(() => import("@/components/pages/auth/EmailVerification"))

// Main Pages
const Dashboard = lazy(() => import("@/components/pages/Dashboard"))
const TaskBoard = lazy(() => import("@/components/pages/TaskBoard"))
const Today = lazy(() => import("@/components/pages/Today"))
const Upcoming = lazy(() => import("@/components/pages/Upcoming"))
const Completed = lazy(() => import("@/components/pages/Completed"))
const Projects = lazy(() => import("@/components/pages/Projects"))
const Calendar = lazy(() => import("@/components/pages/Calendar"))
const Settings = lazy(() => import("@/components/pages/Settings"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const LoadingFallback = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    </div>
  }>
    {children}
  </Suspense>
)
// Auth routes
const authRoutes = [
  {
    path: "",
    index: true,
    element: <LoadingFallback><Login /></LoadingFallback>
  },
  {
    path: "signup",
    element: <LoadingFallback><Signup /></LoadingFallback>
  },
  {
    path: "forgot-password",
    element: <LoadingFallback><ForgotPassword /></LoadingFallback>
  },
  {
    path: "reset-password",
    element: <LoadingFallback><ResetPassword /></LoadingFallback>
  },
  {
    path: "verify-email",
    element: <LoadingFallback><EmailVerification /></LoadingFallback>
  }
]

// Main application routes (protected)
const mainRoutes = [
  {
    path: "",
    index: true,
    element: <LoadingFallback><Dashboard /></LoadingFallback>
  },
  {
    path: "tasks",
    element: <LoadingFallback><TaskBoard /></LoadingFallback>
  },
  {
    path: "today",
    element: <LoadingFallback><Today /></LoadingFallback>
  },
  {
    path: "upcoming",
    element: <LoadingFallback><Upcoming /></LoadingFallback>
  },
  {
    path: "completed",
    element: <LoadingFallback><Completed /></LoadingFallback>
  },
  {
    path: "projects",
    element: <LoadingFallback><Projects /></LoadingFallback>
  },
{
    path: "calendar",
    element: <LoadingFallback><Calendar /></LoadingFallback>
  },
  {
    path: "settings",
    element: <LoadingFallback><Settings /></LoadingFallback>
  },
  {
    path: "*",
    element: <LoadingFallback><NotFound /></LoadingFallback>
  }
]

const routes = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: authRoutes
  },
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
]

export const router = createBrowserRouter(routes)