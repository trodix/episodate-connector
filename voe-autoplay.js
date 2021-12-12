const db = chrome.storage.local;

const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
        resolve(result[key]);
      }
    });
  });
};

if (typeof init === 'undefined') {
  const init = () => {
    main();
    console.log("serienstream-autoplay-next-episode.js chargé");
  }
  init();
}

function main() {
  //autoplay();
  listenForNextEpisode(() => {
    redirectToNextEpisode();
  });
}

function listenForNextEpisode(callback) {
  let counter = 0;
  const timerId = setInterval(() => {
    try {
      const currentWatchTimeText = document.querySelector(".plyr__time--current").innerText;
      const durationText = document.querySelector(".plyr__time--duration").innerText;

      const currentWatchTime = currentWatchTimeText.split(":")[0] * 60 + currentWatchTimeText.split(":")[1];
      const duration = durationText.split(":")[0] * 60 + durationText.split(":")[1];

      const remaningTime = currentWatchTime - duration;
      if (duration > 0 && remaningTime >= -10) {
        callback();
      }
    } catch (error) {
      console.log(error);
      counter++;

      if (counter >= 30) {
        clearInterval(timerId);
      }
    }
  }, 1000);
}

async function redirectToNextEpisode() {
  const data = await readLocalStorage("data");
  const currentUri = data.url;
  const serienstrem = await getPage(currentUri);

  const oldEpisodePart = currentUri.split("/").filter(el => el.includes("episode-"))[0];

  if (hasNextEpisode(serienstrem, data.episode)) {
    const nextUriEpisodePart = oldEpisodePart.replace(oldEpisodePart, `${oldEpisodePart}${data.episode + 1}`);
    const nextUri = currentUri.replace(oldEpisodePart, nextUriEpisodePart);
    const nextUrl = `${window.location.protocol}://${window.location.hostname}/${nextUri}`;
    window.location = nextUrl;
  } else if (hasNextSeason(serienstrem, data.season)) {
    const oldSeasonPart = currentUri.split("/").filter(el => el.includes("staffel-"))[0];
    const nextUriSeasonPart = oldSeasonPart.replace(oldSeasonPart, `${oldSeasonPart}${data.season + 1}`);
    const nextUriEpisodePart = oldEpisodePart.replace(oldEpisodePart, `${oldEpisodePart}${1}`);
    const nextUri = currentUri.replace(oldSeasonPart, nextUriSeasonPart).replace(oldEpisodePart, nextUriEpisodePart);
    const nextUrl = `${window.location.protocol}://${window.location.hostname}/${nextUri}`;
    window.location = nextUrl;
  }
}

function autoplay() {
  window.VOEPlayer.play();
}

function hasNextSeason(page, season) {
  const seasonList = Array.from(page
    .querySelectorAll("#stream ul")[0]
    .querySelectorAll("li > a"))
    .map(s => s.innerText)
    .map(s => parseInt(s));

  return seasonList.pop() > season;
}

function hasNextEpisode(page, episode) {
  console.log(page);
  const episodeList = Array.from(page
    .querySelectorAll("#stream ul")[1]
    .querySelectorAll("li > a"))
    .map(s => s.innerText)
    .map(s => parseInt(s));

  return episodeList.pop() > episode;
}

async function getPage(url) {
  console.log(url);
  return fetch(url, { mode: "no-cors" })
    .then(response => {
      console.log(response);
      return response.text();
    })
    .then(text => {
      console.log(text);
      const parser = new DOMParser();
      return parser.parseFromString(text, "text/html");
    });
}
