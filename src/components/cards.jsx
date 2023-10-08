"use client";
import { sdk } from "@/conf/Appwrite";
import { cn } from "@/lib/utils";

import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Chip,
  ScrollShadow,
} from "@nextui-org/react";
import { Skeleton } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export function RepoCards() {
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true);
      const accessToken = await sdk.getProviderAccessToken();
      const repos = await axios({
        url: "https://api.github.com/orgs/nasa/repos",
        method: "GET",
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });

      // select only first 18 repos
      const filteredRepos = await repos.data.splice(0, 20).map(async (repo) => {
        try {
          const languages = await fetchLanguages(repo, accessToken);
          return {
            name: repo.name,
            description: repo.description,
            full_name: repo.full_name,
            owner: repo.owner.login,
            languages: { ...languages },
          };
        } catch (error) {
          console.log(error);
          return {
            name: repo.name,
            full_name: repo.full_name,
            owner: repo.owner.login,
            description: repo.description,
            languages: [],
          };
        }
      });

      // wait for all of the promises to resolve
      const resolvedFilteredRepos = await Promise.all(filteredRepos);

      const filteredReposWithLanguages = resolvedFilteredRepos.filter(
        (repo) =>
          Object.keys(repo.languages).length > 0 && repo.description !== ""
      );

      // print the results
      setRepos(filteredReposWithLanguages);
      setIsLoading(false);
    };
    fetchRepos();
  }, []);

  const fetchLanguages = async (repo, accessToken) => {
    const languages = await axios({
      url: `https://api.github.com/repos/${repo.full_name}/languages`,
      method: "GET",
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    return languages.data;
  };

  return (
    <div className="">
      {isLoading && <CardsSkeleton />}
      <div className="grid grid-cols-3 gap-3">
        {repos &&
          repos.map((repo, i) => (
            <Link href={`/repo/${repo.owner}`} key={i}>
              <Card key={i}>
                {/* TODO: Add Repo Name */}
                <CardHeader title={repo.name} />

                <CardBody className="flex flex-col">
                  <h4 className="font-semibold text-lg">{repo.name}</h4>
                  {repo.description !== "" && (
                    <ScrollShadow className="flex flex-col gap-3 h-15">
                      <p
                        // shorten description to 400 characters
                        className="text-sm overflow-hidden overflow-ellipsis h-16"
                      >
                        {repo.description}
                      </p>
                    </ScrollShadow>
                  )}

                  {repo.languages && (
                    <div className="flex gap-2 items-center flex-wrap mt-3">
                      {Object.keys(repo.languages).map((language, i) => (
                        <Chip
                          key={i}
                          color="success"
                          variant="faded"
                          className="mt-2"
                        >
                          {language}
                        </Chip>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}

export function UserRepoCards() {
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true);
      const accessToken = await sdk.getProviderAccessToken();
      const repos = await axios({
        url: "https://api.github.com/orgs/nasa/repos",
        method: "GET",
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });

      // select only first 18 repos
      const filteredRepos = await repos.data.splice(0, 20).map(async (repo) => {
        try {
          const languages = await fetchLanguages(repo, accessToken);
          return {
            name: repo.name,
            full_name: repo.full_name,
            owner: repo.owner.login,
            description: repo.description,
            languages: { ...languages },
          };
        } catch (error) {
          console.log(error);
          return {
            name: repo.name,
            full_name: repo.full_name,
            owner: repo.owner.login,
            description: repo.description,
            languages: [],
          };
        }
      });

      // wait for all of the promises to resolve
      const resolvedFilteredRepos = await Promise.all(filteredRepos);

      const filteredReposWithLanguages = resolvedFilteredRepos.filter(
        (repo) =>
          Object.keys(repo.languages).length > 0 && repo.description !== ""
      );

      // print the results
      setRepos(filteredReposWithLanguages);
      setIsLoading(false);
    };
    fetchRepos();
  }, []);

  const fetchLanguages = async (repo, accessToken) => {
    const languages = await axios({
      url: `https://api.github.com/repos/${repo.full_name}/languages`,
      method: "GET",
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    return languages.data;
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 col-span-2">
        {repos &&
          repos.map((repo, i) => (
            <Link href={`/repo/${repo.owner}`} key={i}>
              <Card key={i}>
                {/* TODO: Add Repo Name */}
                <CardHeader title="Repo Name" />

                <CardBody className="flex flex-col">
                  <h4 className="font-semibold text-lg">{repo.full_name}</h4>
                  <p>{repo.description}</p>
                  <div className="flex gap-3 items-center flex-wrap">
                    {Object.keys(repo.languages).map((language, i) => (
                      <Chip key={i} color="success" className="mt-2">
                        {language}
                      </Chip>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
      </div>
      {isLoading && <CardsSkeleton className={"grid grid-cols-2 col-span-2"} />}
    </>
  );
}

const CardsSkeleton = ({ className }) => {
  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {Array(18)
        .fill()
        .map((_, i) => (
          <Card key={i} className="w-full space-y-5 p-4" radius="lg">
            <Skeleton className="rounded-lg">
              <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </Card>
        ))}
    </div>
  );
};
