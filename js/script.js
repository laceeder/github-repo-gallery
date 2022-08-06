// targeting the overview class where profile info appears
const overview = document.querySelector(".overview");
const username = "laceeder";
// display the repos list
const repoList = document.querySelector(".repo-list");
// where all repos appears
const allRepos = document.querySelector(".repos");
// where all repo data appears
const repoData = document.querySelector(".repo-data");

const gitUserInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  displayUserInfo(data);
};

gitUserInfo();

const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
  <figure>
    <img alt="user avatar" src= ${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div>
  `;
  overview.append(div);
  gitRepos();
};

const gitRepos = async function () {
  const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await fetchRepos.json();
  displayRepos(repoData);
};

const displayRepos = function (repos) {
  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function(e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    getRepoInfo(repoName);
  }
});

// fetch the specific repo info
const getRepoInfo = async function (repoName) {
  const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await fetchInfo.json();
  console.log(repoInfo);
  // fetch languages
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  // console.log(languageData);

  // make list of languages
  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  }
  
  // console.log(languages);
  displayRepoInfo(repoInfo, languages);
};

// now display the specific repo info
const displayRepoInfo = function (repoInfo, languages) {
  repoData.innerHTML = "";
  repoData.classList.remove("hide");
  allRepos.classList.add("hide");
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
      <p>Description: ${repoInfo.description}</p>
      <p>Default Branch: ${repoInfo.default_branch}</p>
      <p>Languages: ${languages.join(", ")}</p>
      <a class="visit" href=${repoInfo.html_url}" target="_blank" rel="noreerrer noopener">View Repo on GitHub!</a>
  `;
  repoData.append(div);
};