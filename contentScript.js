if (typeof init === 'undefined') {
  const init = function () {
    executeInternal();
  }
  init();
}

function executeInternal() {
  const toWatchElementList = document.querySelectorAll(".cd-timeline-block:not(.cd-inactive)");
  for (const toWatchElement of toWatchElementList) {
    const serieRaw = toWatchElement.querySelector(".cd-timeline-content-title-small").innerHTML.split("<small>")[0];
    const serie = slugify(serieRaw, { remove: /[':]/g, lower: true });
    const metadata = toWatchElement.querySelector("span.title b").textContent;
    const season = metadata.split("E")[0].replace('S', '').replace(/^0+/, '');
    const episode = metadata.split("E")[1].replace(/^0+/, '');

    const buttonsContainer = toWatchElement.querySelector(".cd-timeline-content-buttons");

    buildDropdown(buttonsContainer, getConnectorList({ serie, season, episode }));
  }
}

function buildDropdown(buttonsContainer, items) {
  const dropdown = document.createElement("div");
  dropdown.classList.add("connector-watch-dropdown");

  const icon = document.createElement("img");
  icon.src = chrome.runtime.getURL("images/tv-retro.svg");
  icon.width = 24;

  const button = document.createElement("button");
  button.classList.add("connector-watch-btn");
  button.appendChild(icon);

  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("connector-watch-dropdown-content");

  buttonsContainer.appendChild(dropdown);
  dropdown.appendChild(button);
  dropdown.appendChild(dropdownContent);

  items.forEach(item => {
    const link = buildLink(item);
    dropdownContent.appendChild(link);
  });
}

function buildLink({ name, url }) {

  const a = document.createElement("a");
  a.classList.add("connector-watch-dropdown-item");
  a.innerHTML = name;
  a.href = url;
  a.target = "_blank"

  return a;
}

function getConnectorList({ serie, season, episode }) {
  return [
    { name: "SerienStream", url: serienstreamConnector({ serie, season, episode }) },
    { name: "tvshows88", url: tvshows88Connector({ serie, season, episode }) },
  ]
}

function serienstreamConnector({ serie, season, episode }) {
  return `https://serienstream.sx/serie/stream/${serie}/staffel-${season}/episode-${episode}`;
}

function tvshows88Connector({ serie, season, episode }) {
  return `https://tvshows88.org/episode/${serie}-season-${season}-episode-${episode}`;
}
