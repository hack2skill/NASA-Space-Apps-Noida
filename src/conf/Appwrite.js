import { Client, Account, Databases } from "appwrite";
import conf from "./config";
import { ID } from "appwrite";
const client = new Client();

client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);

const account = new Account(client);

const databases = new Databases(client);

export const sdk = {
  register: async (success, failure) => {
    // Register by creating an OAuth2 session
    account.createOAuth2Session("github", success, failure, [
      "user",
      "repo",
      "admin:repo_hook",
      "account",
    ]);
  },

  createDocument: async (data) => {
    //create a new document
    return await databases.createDocument(
      ["652191983e91f2abdaab"],
      ["6521970637c5c35faf2e"],
      ID.unique(),
      data
    );
  },

  getAccount: async () => {
    //get account data
    return await account.get();
  },

  getSession: async () => {
    //get current session data
    return await account.getSession("current");
  },

  getProviderAccessToken: async () => {
    //get user's provider access token
    const promise = await account.getSession("current");

    return promise.providerAccessToken;
  },

  getGithubData: async () => {
    //get user's provider access token
    const promise = await account.getSession("current");

    const providerAccessToken = promise.providerAccessToken;
    //make a request to github api
    const response = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${providerAccessToken}` },
    });
    return await response.json();
  },

  logout: async () => {
    // Delete the session
    await account.deleteSession("current");
  },
};
