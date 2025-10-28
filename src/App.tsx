import Page from "@/app/payments/page";
import AddUserTable from "./app/payments/AddUser";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

function App() {
  return (
    <>
     <QueryClientProvider client={queryClient}>
      <Page />
      </QueryClientProvider>
      <AddUserTable />
    </>
  );
}

export default App;
