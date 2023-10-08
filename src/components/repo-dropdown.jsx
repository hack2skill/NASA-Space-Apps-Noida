"use client";
import { sdk } from "@/conf/Appwrite";
import { Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Buttons from "./Button";
import { BiGitRepoForked } from "react-icons/bi";

function RepoDropdown() {
  const [repoNames, setRepoNames] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [username, setUsername] = useState("");
  const fetchData = async () => {
    try {
      const githubData = await sdk.getGithubData();
      const username = githubData.login;
      const accessToken = await sdk.getProviderAccessToken();
      console.log(accessToken);
      setUsername(username);
      const repos =
        username &&
        (await axios({
          url: `https://api.github.com/users/${username}/repos?owner=true`,
          method: "GET",
          headers: {
            Authorization: `token ${accessToken}`,
          },
        }));

      const repo_names = repos.data.map((repo) => {
        return {
          name: repo.name,
        };
      });
      setRepoNames(repo_names);
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const addRepo = async () => {
    const data = await sdk.createDocument({
      owner: username,
      repo: [selectedRepo],
    });
    return data;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-3 items-center">
      <Select
        items={repoNames}
        label="Select your Repository"
        placeholder="Select your masterpiece"
        className="w-[300px]"
        onChange={(e) => {
          setSelectedRepo(e.target.value);
        }}
      >
        {(repo) => <SelectItem key={repo.name}>{repo.name}</SelectItem>}
      </Select>
      <Buttons
        className={"text-sm"}
        variant="shadow"
        color="primary"
        icon={<BiGitRepoForked />}
        text={"Connect Repository"}
        fn={addRepo}
      />
    </div>
  );
}

export default RepoDropdown;
