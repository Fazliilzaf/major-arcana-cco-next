import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "./layouts/main-layout";
import { InboxPage } from "./pages/inbox-page";
import { InboxPageNew } from "./pages/inbox-page-new";
import { InboxPageFinal } from "./pages/inbox-page-final";
import { LaterPage } from "./pages/later-page";
import { SentPage } from "./pages/sent-page";
import { CustomerIdentityPage } from "./components/customer-identity-page";
import { AnalyticsPage } from "./pages/analytics-page";
import { IntegrationsPage } from "./pages/integrations-page";
import { TemplateStudioPage } from "./pages/template-studio-page";
import { SettingsPage } from "./pages/settings-page";
import { MacrosPage } from "./pages/macros-page";
import { ShowcasePage } from "./pages/showcase-page";
import { WorkflowBuilderPage } from "./pages/workflow-builder-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { 
        index: true, 
        Component: InboxPageFinal  // ✅ FINAL LAYOUT MED TOGGLEBARA FILTER!
      },
      { 
        path: "later", 
        Component: LaterPage 
      },
      { 
        path: "sent", 
        Component: SentPage 
      },
      {
        path: "customers",
        Component: CustomerIdentityPage
      },
      {
        path: "analytics",
        Component: AnalyticsPage
      },
      {
        path: "integrations",
        Component: IntegrationsPage
      },
      {
        path: "templates",
        Component: TemplateStudioPage
      },
      {
        path: "macros",
        Component: MacrosPage
      },
      {
        path: "workflows",
        Component: WorkflowBuilderPage
      },
      {
        path: "settings",
        Component: SettingsPage
      },
      {
        path: "showcase",
        Component: ShowcasePage
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);