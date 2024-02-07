import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";

interface HomeProps {
  login: () => void;
  logout: () => void;
  createCampaign: (
    name: string,
    description: string,
    goal: string,
    beneficiary: string
  ) => void;
  campaigns: object[];
  withdrawFromCampaign: (campaignId: string) => void;
  depositFunds: (amount: number) => void;
  balance: string;
}
const Home: React.FC<HomeProps> = ({
  login,
  logout,
  createCampaign,
  campaigns,
  withdrawFromCampaign,
  depositFunds,
  balance,
}) => {
  return (
    <div className="relative">
      <Navbar login={login} logout={logout} balance={balance} />
      <Hero
        createCampaign={createCampaign}
        campaigns={campaigns}
        withdrawFromCampaign={withdrawFromCampaign}
        depositFunds={depositFunds}
      />
    </div>
  );
};

export default Home;
