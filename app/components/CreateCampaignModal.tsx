"use client";
import React, {useContext, useState} from "react";
import parseEther from "../lib/parseEther";
import {smartWalletContext} from "../lib/context";

interface CreateCampaignModalProps {
  createCampaign: (
    name: string,
    description: string,
    goal: string,
    beneficiary: string
  ) => void;
}
const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  createCampaign,
}) => {
  const [open, setOpen] = useState(false);
  const smartWallet = useContext(smartWalletContext);

  const address = smartWallet?.getAddress();
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
    beneficiary: address || "",
  });
  const toggleModal = () => {
    setOpen(!open);
  };
  const createCampaignHandler = async () => {
    await createCampaign(
      form.name,
      form.description,
      parseEther(form.goal),
      form.beneficiary
    );
    setOpen(false);
  };

  return (
    <div>
      <button className="btn btn-success" onClick={toggleModal}>
        Start a Campaign
      </button>
      {open && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card max-w-[60vw] bg-primary text-primary-content">
            <button
              className="btn btn-sm btn-circle absolute right-4 top-4"
              onClick={toggleModal}
            >
              ✕
            </button>
            <div className="card-body text-left">
              <h2 className="card-title">Okaay chief, let&apos;s raiseeee</h2>
              <p>
                Great, so let&apos;s fill out these deets for your new campaign
              </p>
              <input
                type="text"
                placeholder="Let's name your campaign"
                className="input input-bordered input-info placeholder-secondary w-full bg-transparent"
                onChange={(e) => setForm({...form, name: e.target.value})}
                value={form.name}
              />
              <textarea
                placeholder="Describe your campaign"
                className="textarea textarea-bordered textarea-info placeholder-secondary w-full bg-transparent"
                onChange={(e) =>
                  setForm({...form, description: e.target.value})
                }
                value={form.description}
              />{" "}
              <input
                type="number"
                placeholder="How much do you want to raise? 100 $MATIC? 1000 $MATIC?"
                className="input input-bordered input-info placeholder-secondary w-full bg-transparent"
                onChange={(e) => setForm({...form, goal: e.target.value})}
                value={form.goal}
              />{" "}
              <input
                type="text"
                placeholder="Who should receive the funds?"
                className="input input-bordered input-info placeholder-secondary w-full bg-transparent"
                onChange={(e) =>
                  setForm({...form, beneficiary: e.target.value})
                }
                value={form.beneficiary}
              />
              <div className="card-actions justify-center mt-4">
                <button className="btn w-full" onClick={createCampaignHandler}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCampaignModal;
