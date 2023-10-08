import axios from "axios";
import React from "react";

async function page({ params }) {
  const { id } = params;
  const divideParamsToRepoAndOwner = (id) => {
    return id.split("__");
  };
  const [owner, repo] = divideParamsToRepoAndOwner(id);
  const repoData = await axios({
    url: `https://api.github.com/repos/${owner}/${repo}`,
    method: "GET",
  });
  return (
    <div className="container mt-4">
      <h1 className="text-3xl">
        {owner} / {repo}
      </h1>
      <div className="flex gap-3">
        <p>CreatedAt: {new Date(repoData.data.created_at).toDateString()}</p>
        <p>UpdatedAt: {new Date(repoData.data.updated_at).toDateString()}</p>
        <p>PushedAt: {new Date(repoData.data.pushed_at).toDateString()}</p>
      </div>
    </div>
  );
}

export default page;
