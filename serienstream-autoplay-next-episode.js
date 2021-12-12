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

  chrome.storage.local.set({ data: { url, season, episode } });

  let langOptions = document.querySelectorAll(".changeLanguage img");
  console.log(langOptions)

  for (const lang of langOptions) {
    lang.addEventListener("click", (e) => {
      console.log("Langage: " + lang.src);
      if (lang.classList.contains("selectedLanguage")) {

        const videoUrl = document.querySelector("li:visible .watchEpisode").href;
        console.log("redirect: " + lang.src + " => " + videoUrl);

        // window.location = videoUrl;

      }
    });
  }
}

function onClassChange(element, callback) {
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === "class") {
        callback();
      }
    });
  });
  observer.observe(element, { attributes: true });
}
