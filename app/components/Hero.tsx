import React, {useContext, useState} from "react";
import {web3AuthProviderContext} from "../lib/context";
import CreateCampaignModal from "./CreateCampaignModal";
import Campaigns from "./Campaigns";
import {ethers} from "ethers";
interface HeroProps {
  createCampaign: (
    name: string,
    description: string,
    goal: string,
    beneficiary: string
  ) => void;
  campaigns: object[];
  withdrawFromCampaign: (campaignId: string) => void;
  depositFunds: (amount: number) => void;
}
const Hero: React.FC<HeroProps> = ({
  createCampaign,
  campaigns,
  withdrawFromCampaign,
  depositFunds,
}) => {
  const web3AuthProvider = useContext(web3AuthProviderContext);
  const [value, setValue] = useState<number>();
  return (
    <div className="hero relative min-h-[90vh] bg-base-100 mt-[100px]">
      <div className="hero-content text-center">
        <div className="max-w-[60vw] mt-[20vh] flex flex-col items-center">
          <div className="min-h-[70vh]">
            {" "}
            <h1 className="text-5xl font-bold">
              Start a crypto crowdfunding with just your email!
            </h1>
            <p className="py-6 text-primary">
              Don&apos;t worry about installing another extension or having to
              pay for gas. Create a campaign, post the link on warpcast
              <span className="text-success mx-1">
                https://raise-ez.vercel.app/campaign/campaignId
              </span>
              and peace out.
            </p>
            {web3AuthProvider && (
              <div className="flex flex-col gap-4">
                {" "}
                <CreateCampaignModal createCampaign={createCampaign} />
              </div>
            )}
          </div>
          {web3AuthProvider && (
            <Campaigns
              depositFunds={depositFunds}
              campaigns={campaigns}
              withdrawFromCampaign={withdrawFromCampaign}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
