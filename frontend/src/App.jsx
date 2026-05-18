import { AuthProvider } from './auth/AuthContext.jsx';
import AppRouter from './router/AppRouter.jsx';
import { ToastProvider } from './shared/components/Toast.jsx';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}
