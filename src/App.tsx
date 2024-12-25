import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { NotificationProvider } from './components/notifications/NotificationProvider';

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </BrowserRouter>
  );
}