import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Page from '@/app/payments/page';
import AddUserTable from './app/payments/AddUser';
import Navigation from '@/components/Navigation';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/add-user" element={<AddUserTable />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
