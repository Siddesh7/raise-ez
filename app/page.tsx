"use client";
import {useEffect, useState, createContext} from "react";
import {SafeEventEmitterProvider, UserInfo} from "@web3auth/base";

import {ethers} from "ethers";
import {CROWDFUNDING_CONTRACT_ABI} from "./constants";
import {smartWalletContext, web3AuthProviderContext} from "./lib/context";
import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from "@gelatonetwork/gasless-onboarding";
import {getChainConfig} from "./lib";
import Home from "./components/Home";
import Footer from "./components/Footer";
import parseEther from "./lib/parseEther";

function App() {
  const {target} = getChainConfig();

  const [gelatoLogin, setGelatoLogin] = useState<
    GaslessOnboarding | undefined
  >();

  const [web3AuthProvider, setWeb3AuthProvider] =
    useState<SafeEventEmitterProvider | null>(null);
  const [smartWallet, setSmartWallet] = useState<GaslessWalletInterface | null>(
    null
  );
  const [crowdfundingContract, setCrowdfundingContract] =
    useState<ethers.Contract | null>(null);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [wallet, setWallet] = useState<{
    address: string;
    balance: string;
    chainId: number;
  } | null>(null);
  const [campaigns, setCampaigns] = useState<object[]>([]);
  const [balance, setBalance] = useState<string>("0");
  const createCampaign = async (
    name: string,
    description: string,
    goal: string,
    beneficiary: string
  ): Promise<void> => {
    console.log("Creating Campaignfrom App.tsx");
    console.log(name, description, goal, beneficiary);
    if (!crowdfundingContract) {
      throw new Error("Crowdfunding Contract is not initiated");
    }
    let {data} = await crowdfundingContract.populateTransaction.createCampaign(
      name,
      description,
      goal,
      beneficiary
    );
    if (!data) {
      throw new Error("Data is not initiated");
    }
    if (!smartWallet) {
      throw new Error("Smart Wallet is not initiated");
    }
    try {
      const {taskId} = await smartWallet.sponsorTransaction(target, data);
      console.log("https://api.gelato.digital/tasks/status/" + taskId);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (error) {
      console.error(error);
    }
  };
  const withdrawFromCampaign = async (campaignId: string): Promise<void> => {
    if (!crowdfundingContract) {
      throw new Error("Crowdfunding Contract is not initiated");
    }
    let {data} = await crowdfundingContract.populateTransaction.withdrawFunds(
      campaignId
    );
    if (!data) {
      throw new Error("Data is not initiated");
    }
    if (!smartWallet) {
      throw new Error("Smart Wallet is not initiated");
    }
    try {
      const {taskId} = await smartWallet.sponsorTransaction(target, data);
      console.log("https://api.gelato.digital/tasks/status/" + taskId);
      setTimeout(() => {
        // Ensure window is defined (i.e., code is running in the browser)
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (error) {
      console.error(error);
    }
  };

  const depositFunds = async (amount: number): Promise<void> => {
    console.log("Depositing Funds from App.tsx");
    console.log(amount);
    if (!crowdfundingContract) {
      throw new Error("Crowdfunding Contract is not initiated");
    }

    // Ensure smartWallet is initialized
    if (!smartWallet) {
      throw new Error("Smart Wallet is not initiated");
    }

    try {
      const value = parseEther(amount.toString());
      console.log(value);

      let {data} =
        await crowdfundingContract.populateTransaction.depositFunds();

      // Ensure data is initialized
      if (!data) {
        throw new Error("Data is not initiated");
      }

      // Send the transaction through the smartWallet
      const {taskId} = await smartWallet.sponsorTransaction(
        target,
        data,
        value
      );
      console.log("https://api.gelato.digital/tasks/status/" + taskId);

      setTimeout(() => {
        // Reload the window after 5 seconds, ensure this code runs in the browser
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const {apiKey, chainId, target, rpcUrl} = getChainConfig();

        const smartWalletConfig: GaslessWalletConfig = {apiKey};
        const loginConfig: LoginConfig = {
          domains: [window.location.origin],
          chain: {
            id: chainId,
            rpcUrl,
          },
          ui: {
            theme: "dark",
          },
          openLogin: {
            redirectUrl: `${window.location.origin}/?chainId=${chainId}`,
          },
        };
        const gelatoLogin = new GaslessOnboarding(
          loginConfig,
          smartWalletConfig
        );

        await gelatoLogin.init();
        setGelatoLogin(gelatoLogin);
        const provider = gelatoLogin.getProvider();
        if (provider) {
          setWeb3AuthProvider(provider as any);
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!gelatoLogin || !web3AuthProvider) {
        return;
      }

      const web3Provider = new ethers.providers.Web3Provider(web3AuthProvider!);
      const signer = web3Provider.getSigner();
      setWallet({
        address: await signer.getAddress(),
        balance: (await signer.getBalance()).toString(),
        chainId: await signer.getChainId(),
      });
      const user = await gelatoLogin.getUserInfo();
      setUser(user);
      const gelatoSmartWallet = gelatoLogin.getGaslessWallet();
      setSmartWallet(gelatoSmartWallet);

      const cfContract = new ethers.Contract(
        target,
        CROWDFUNDING_CONTRACT_ABI,
        new ethers.providers.Web3Provider(web3AuthProvider!).getSigner()
      );
      setCrowdfundingContract(cfContract);
      let creatorAddress = gelatoSmartWallet.getAddress();
      if (ethers.utils.isAddress(creatorAddress)) {
        const campaigns = await cfContract.getCampaignsByCreator(
          creatorAddress
        );
        const balance = await cfContract.getDepositorBalance(creatorAddress);
        console.log(ethers.utils.formatEther(balance).toString());
        setCampaigns(campaigns);
        setBalance(ethers.utils.formatEther(balance).toString());
      } else {
        setCampaigns([]);
      }
    };
    init();
  }, [web3AuthProvider]);

  const login = async () => {
    if (!gelatoLogin) {
      return;
    }
    const web3authProvider = await gelatoLogin.login();
    setWeb3AuthProvider(web3authProvider as any);
  };

  const logout = async () => {
    if (!gelatoLogin) {
      return;
    }
    await gelatoLogin.logout();
    setWeb3AuthProvider(null);
    setWallet(null);
    setUser(null);
    setSmartWallet(null);
    setCrowdfundingContract(null);
  };

  return (
    <>
      <web3AuthProviderContext.Provider value={web3AuthProvider}>
        <smartWalletContext.Provider value={smartWallet}>
          <Home
            login={login}
            logout={logout}
            createCampaign={createCampaign}
            campaigns={campaigns}
            withdrawFromCampaign={withdrawFromCampaign}
            depositFunds={depositFunds}
            balance={balance}
          />
          <Footer />
        </smartWalletContext.Provider>
      </web3AuthProviderContext.Provider>
    </>
  );
}

export default App;
