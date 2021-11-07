if (typeof init === 'undefined') {
  const init = function () {
    main();
    console.log("serienstream-autoplay-next-episode.js chargé");
  }
  init();
}

function main() {
  const url = window.location.href;
  const season = parseInt(url.split("/").filter(el => el.includes("staffel-"))[0].split("-")[1]);
  const episode = parseInt(url.split("/").filter(el => el.includes("episode-"))[0].split("-")[1]);
  listenForNextEpisode(() => {
    redirect(season, episode);
  })
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
      if (remaningTime >= -10) {
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

function redirect(season, episode) {
  const currentUri = window.location.pathname;
  const oldEpisodePart = currentUri.split("/").filter(el => el.includes("episode-"))[0];
  if (hasNextEpisode(episode)) {
    const nextUriEpisodePart = oldEpisodePart.replace(oldEpisodePart, `${oldEpisodePart}${episode + 1}`);
    const nextUri = currentUri.replace(oldEpisodePart, nextUriEpisodePart);
    const nextUrl = `${window.location.protocol}${window.location.hostname}${nextUri}`;
    window.location = nextUrl;
    autoplay();
  } else if (hasNextSeason(season)) {
    const oldSeasonPart = currentUri.split("/").filter(el => el.includes("staffel-"))[0];
    const nextUriSeasonPart = oldSeasonPart.replace(oldSeasonPart, `${oldSeasonPart}${season + 1}`);
    const nextUriEpisodePart = oldEpisodePart.replace(oldEpisodePart, `${oldEpisodePart}${1}`);
    const nextUri = currentUri.replace(oldSeasonPart, nextUriSeasonPart).replace(oldEpisodePart, nextUriEpisodePart);
    const nextUrl = `${window.location.protocol}${window.location.hostname}${nextUri}`;
    window.location = nextUrl;
    autoplay();
  }
}

function autoplay() {
  VOEPlayer.play();
}

function hasNextSeason(season) {
  const seasonList = Array.from(document
    .querySelectorAll("#stream > ul")[0]
    .querySelectorAll("li > a"))
    .map(s => s.innerText)
    .map(s => parseInt(s));

  return seasonList.pop() > season;
}

function hasNextEpisode(episode) {
  const episodeList = Array.from(document
    .querySelectorAll("#stream > ul")[1]
    .querySelectorAll("li > a"))
    .map(s => s.innerText)
    .map(s => parseInt(s));

  return episodeList.pop() > episode;
}
