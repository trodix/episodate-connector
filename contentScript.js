if (typeof init === 'undefined') {
  const init = function () {
    const toWatchElementList = document.querySelectorAll(".cd-timeline-block");
    for (const toWatchElement of toWatchElementList) {
      const serie = toWatchElement.querySelector(".cd-timeline-content-title-small").parentElement.getAttribute("href").split("/").pop();
      const metadata = toWatchElement.querySelector("span.title b").textContent;
      const season = metadata.split("E")[0].replace('S', '').replace(/^0+/, '');
      const episode = metadata.split("E")[1].replace(/^0+/, '');

      const buttonsContainer = toWatchElement.querySelector(".cd-timeline-content-buttons");
      const button = buildButton({ serie, season, episode });
      buttonsContainer.appendChild(button);
    }
  }
  init();
}

function buildButton({ serie, season, episode }) {
  const icon = document.createElement("img");
  icon.src = chrome.runtime.getURL("images/tv-retro.svg");
  icon.width = 24;

  const button = document.createElement("button");
  button.classList.add("ui", "circular", "button", "connector-watch");
  button.appendChild(icon);

  button.addEventListener('click', (e) => {
    const url = serienstreamConnector({ serie, season, episode });
    window.open(url, '_blank');
  });

  return button;
}

function serienstreamConnector({ serie, season, episode }) {
  return `https://serienstream.sx/serie/stream/${serie}/staffel-${season}/episode-${episode}`;
}
