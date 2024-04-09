import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <RouterProvider router={router} />
      <Toaster />
    </Suspense>
  );
}

export default App;
