import { Account } from "../../models/Account.js";

async function saveToDb(account) {
  try {
    const returnAccount = await Account.findOneAndUpdate(
      { puuid: account.puuid },
      {
        puuid: account.puuid,
        gameName: account.gameName,
        tagLine: account.tagLine,
        profileIconId: account.profileIconId,
        summonerLevel: account.summonerLevel,
        rank: account.rank || [],
      },
      { upsert: true, new: true, runValidators: true } // runValidators ensures data is valid
    );
    return returnAccount;
  } catch (error) {
    throw new Error(`Error saving account: ${error.message}`);
  }
}

async function search(searchKey) {
  try {
    const regex = new RegExp(searchKey, "i");
    const results = await Account.find({ gameName: regex });
    return results;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const accountsRepo = {
  saveToDb,
  search,
};
