import { MenuContextProvider } from '@context/MenuContextProvider';
import { UserContextProvider } from '@context/UserContextProvider';
import { ConstantDataContextProvider } from './ConstantDataContextProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContextProvider } from './ToastContextProvider';
import { PermissionsContextProvider } from './PermissionsContextProvider';

export default function GlobalContext({ children }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContextProvider>
        <MenuContextProvider>
          <ConstantDataContextProvider>
            <UserContextProvider>
              <PermissionsContextProvider>{children}</PermissionsContextProvider>
            </UserContextProvider>
          </ConstantDataContextProvider>
        </MenuContextProvider>
      </ToastContextProvider>
    </QueryClientProvider>
  );
}
