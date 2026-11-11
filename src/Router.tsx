import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";
import OverviewPage from "@/features/overview/OverviewPage";
import WorkspacePage from "@/features/zustand/components/WorkspacePage";
import TanStackPage from "@/features/tanStack/TanStackPage";
import FormStudioPage from "@/features/formStudio/FormStudioPage";
import FormBuilderPage from "@/features/formBuilder/FormBuilderPage";
import GalleryPage from "@/features/gallery/GalleryPage";


function NotFoundPage() {
  return <div>404 - Page Not Found</div>;
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <OverviewPage /> },
      { path: "/zustand", element: <WorkspacePage /> },
      { path: "/query-explorer", element: <TanStackPage /> },
      { path: "/form-studio", element: <FormStudioPage /> },
      { path: "/form-builder", element: <FormBuilderPage /> },
      { path: "/components", element: <GalleryPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);