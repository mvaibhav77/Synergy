import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import store from "./store";
import { Provider } from "react-redux";
import HomeScreen from "@/screens/HomeScreen.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen.tsx";
import GitHubCallback from "./components/GithubLogin.js";
import PrivateRoute from "./components/PrivateRoute.js";
import ProfileScreen from "./screens/ProfileScreen.js";
import Recommendations from "./screens/RecommendationScreen.js";
import ChatScreen from "./screens/ChatScreen.js";
import ConnectionsScreen from "./screens/ConnectionsScreen.js";
import Notifications from "./screens/Notifications.js";
import Page from "./components/Page.js";
import { MIN_SECTION_HEIGHT } from "./utils/constants.js";
import { Toaster } from "./components/ui/toaster.js";
// import ProfileScreen from '@/screens/ProfileScreen.tsx';
// import PrivateRoute from '@/components/PrivateRoute.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      {/* github redirect url */}
      <Route path="/login-success" element={<GitHubCallback />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/:username" element={<ProfileScreen />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/messages" element={<ChatScreen />} />
        <Route path="/messages/:conversationId" element={<ChatScreen />} />
        <Route path="/connections" element={<ConnectionsScreen />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route
          path="settings"
          element={
            <>
              <Page>
                <div
                  className={`w-full ${MIN_SECTION_HEIGHT} border-x-[1px] border-white-700 flex items-center justify-center`}
                >
                  COMING SOON...
                </div>
              </Page>
            </>
          }
        />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <RouterProvider router={router} />
    </ThemeProvider>
  </Provider>
);
