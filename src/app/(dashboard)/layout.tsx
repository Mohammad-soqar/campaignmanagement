import TRPCProvider from './trpc-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TRPCProvider>{children}</TRPCProvider>;
}
