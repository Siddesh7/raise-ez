import {ethers} from "ethers";
import React, {useContext, useState} from "react";
import {getBlockExplorerUrl} from "../lib";
import {smartWalletContext} from "../lib/context";
interface CampaignsProps {
  campaigns: any;
  withdrawFromCampaign: (campaignId: string) => void;
  depositFunds: (amount: number) => void;
}
const Campaigns: React.FC<CampaignsProps> = ({
  campaigns,
  withdrawFromCampaign,
  depositFunds,
}) => {
  const smartWallet: any = useContext(smartWalletContext);
  const [value, setValue] = useState<number>();

  return (
    <div className="overflow-x-auto mt-[40px]">
      <div className="flex flex-row justify-between items-center">
        {" "}
        <h3 className="font-bold text-xl text-primary my-[30px]">
          Your Active Campaigns
        </h3>{" "}
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="1 Matic"
            className="input input-bordered input-primary w-full max-w-xs"
            onChange={(e) => {
              setValue(Number(e.target.value));
            }}
            value={value}
          />
          <button
            className="btn btn-info"
            onClick={() => {
              depositFunds(value!);
            }}
            disabled={value === 0}
          >
            Deposit Funds
          </button>
        </div>
      </div>
      {campaigns.length > 0 ? (
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th></th>

              <th>Name</th>
              <th>Description</th>
              <th>Goal</th>
              <th>Raised</th>
              <th>Balance</th>
              <th>Beneficiary</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign: any, index: number) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="badge badge-outline badge-success">
                      Active
                    </div>
                  </td>

                  <td>{campaign.name}</td>
                  <td className="max-w-[25vw] overflow-x-auto">
                    {campaign.description}
                  </td>
                  <td className="max-w-[10vw] overflow-x-auto">
                    {ethers.utils.formatEther(campaign.goal)} Matic
                  </td>
                  <td className="max-w-[10vw] overflow-x-auto">
                    {ethers.utils.formatEther(campaign.fundsRaised)} Matic
                  </td>
                  <td className="max-w-[10vw] overflow-x-auto">
                    {ethers.utils.formatEther(campaign.campaignBalance)} Matic
                  </td>

                  <td>
                    <a
                      href={`${getBlockExplorerUrl(campaign.beneficiary)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      {campaign.beneficiary.substring(0, 4)}.....
                      {campaign.beneficiary.substring(
                        campaign.beneficiary.length - 4
                      )}
                    </a>
                  </td>
                  <td>
                    {
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          withdrawFromCampaign(campaign.id.toString());
                        }}
                        disabled={
                          smartWallet.getAddress() !== campaign.beneficiary ||
                          ethers.utils.formatEther(campaign.campaignBalance) ===
                            "0.0"
                        }
                      >
                        Withdraw
                      </button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-primary">No active campaigns</div>
      )}
    </div>
  );
};

export default Campaigns;
