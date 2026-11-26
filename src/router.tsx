import { Navigate, createHashRouter } from "react-router";
import { RootLayout } from "@/components/layout/RootLayout";
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import { ExerciseBankPage } from "@/pages/fysio/ExerciseBankPage";
import { FysioLayout } from "@/pages/fysio/FysioLayout";
import { InboxPage } from "@/pages/fysio/InboxPage";
import { OverviewPage } from "@/pages/fysio/OverviewPage";
import { PatientsPage } from "@/pages/fysio/PatientsPage";
import { PatientMessagesTab } from "@/pages/fysio/profile/PatientMessagesTab";
import { PatientOverviewTab } from "@/pages/fysio/profile/PatientOverviewTab";
import { PatientProfileLayout } from "@/pages/fysio/profile/PatientProfileLayout";
import { ProgramTab } from "@/pages/fysio/profile/ProgramTab";
import { ChatPage } from "@/pages/patient/ChatPage";
import { PatientLayout } from "@/pages/patient/PatientLayout";
import { ProgressPage } from "@/pages/patient/ProgressPage";
import { TodayPage } from "@/pages/patient/TodayPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { StartPage } from "@/pages/StartPage";

export const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <StartPage /> },
      { path: "patient", element: <Navigate to="/patient/olof" replace /> },
      {
        path: "patient/:patientId",
        element: <PatientLayout />,
        children: [
          { index: true, element: <TodayPage /> },
          { path: "progress", element: <ProgressPage /> },
          { path: "chat", element: <ChatPage /> },
        ],
      },
      {
        path: "fysio",
        element: <FysioLayout />,
        children: [
          { index: true, element: <OverviewPage /> },
          { path: "patients", element: <PatientsPage /> },
          {
            path: "patients/:patientId",
            element: <PatientProfileLayout />,
            children: [
              { index: true, element: <PatientOverviewTab /> },
              { path: "program", element: <ProgramTab /> },
              { path: "messages", element: <PatientMessagesTab /> },
            ],
          },
          { path: "bank", element: <ExerciseBankPage /> },
          { path: "messages", element: <InboxPage /> },
        ],
      },
      { path: "feedback", element: <FeedbackPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
