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
        normalizedName: account.normalizedName,
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
    const regex = new RegExp(`.*${searchKey}.*`, "i");
    const results = await Account.find({ normalizedName: regex });

    // Sort results: prioritize matches that start with the search term
    results.sort((a, b) => {
      const startsWithA = a.normalizedName
        .toLowerCase()
        .startsWith(searchKey.toLowerCase());
      const startsWithB = b.normalizedName
        .toLowerCase()
        .startsWith(searchKey.toLowerCase());

      if (startsWithA && !startsWithB) return -1; // a comes before b
      if (!startsWithA && startsWithB) return 1; // b comes before a
      return 0; // no change if both or neither start with search term
    });
    return results;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const accountsRepo = {
  saveToDb,
  search,
};
