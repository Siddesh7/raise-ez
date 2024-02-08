import React, {useContext} from "react";
import {smartWalletContext, web3AuthProviderContext} from "../lib/context";
import {getBlockExplorerUrl} from "../lib";

interface NavbarProps {
  login: () => void;
  logout: () => void;
  balance: string;
}

const Navbar: React.FC<NavbarProps> = ({login, logout, balance}) => {
  const web3AuthProvider = useContext(web3AuthProviderContext);
  const smartWallet: any = useContext(smartWalletContext);
  console.log(balance);
  return (
    <div className="navbar bg-base-100 px-[40px] my-[20px]">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">RaiseEZ</a>
      </div>
      <div className="flex-none">
        {web3AuthProvider ? (
          <div className="flex flex-row gap-4 items-center">
            {smartWallet && (
              <div>
                <div className="badge badge-outline text-md py-[20px]">
                  {Number(balance).toFixed(2)} MATIC
                </div>
                <div className="badge badge-outline text-md py-[20px]">
                  <a
                    href={getBlockExplorerUrl(smartWallet.getAddress())}
                    target="_blank"
                  >
                    {" "}
                    {smartWallet.getAddress()}
                  </a>
                </div>
              </div>
            )}
            <button className="btn btn-primary px-[20px]" onClick={logout}>
              logout
            </button>
          </div>
        ) : (
          <button className="btn btn-primary px-[20px]" onClick={login}>
            login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
