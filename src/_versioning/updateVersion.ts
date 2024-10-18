import Account from "../_types/Account";

export const CurrentVersion = 2;

export default function updateVersion(account:Account):Account{
    if(account.version === CurrentVersion)
        return account;
    if(account.version > CurrentVersion)
        throw new Error(`Unreckognized Account Version '${account.version}'`);

    let updatedAccount: Account = account;
    
    if(!account.version)
        updatedAccount = {...updatedAccount, version: 1};
    if(account.version === 1)
        updatedAccount = {...updatedAccount, version: 2, preferences:{studentLabeling:""}};
    

    return updatedAccount;
}