import { MDXProvider } from "@mdx-js/react";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ledgerWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import "../styles/globals.css";

// Import known recommended wallets
import {
  CeloTerminal,
  CeloWallet,
  Valora,
} from "@celo/rainbowkit-celo/wallets";

// Import CELO chain information
import { UserProvider } from "@/context/userContext";
import { components } from "@/utils/mdx";
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import Layout from "../components/Layout";

const { chains, provider } = configureChains(
  [Alfajores, Celo],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Celo Native",
    wallets: [
      Valora({ chains }),
      CeloWallet({ chains }),
      CeloTerminal({ chains }),
    ],
  },
  {
    groupName: "Supports Celo",
    wallets: [
      walletConnectWallet({ chains }),
      metaMaskWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} coolMode={true}>
          <UserProvider>
            <Layout>
              <MDXProvider components={components}>
                <Component {...pageProps} />
              </MDXProvider>
            </Layout>
          </UserProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
