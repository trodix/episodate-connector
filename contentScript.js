if (typeof init === 'undefined') {
  const init = function () {
    executeInternal();
  }
  init();
}

async function executeInternal() {
  const toWatchElementList = document.querySelectorAll(".cd-timeline-block:not(.cd-inactive)");
  for (const toWatchElement of toWatchElementList) {
    const serieRaw = toWatchElement.querySelector(".cd-timeline-content-title-small").innerHTML.split("<small>")[0];
    const serie = serieRaw.replace(/(&amp;)/, " ").trim();
    const metadata = toWatchElement.querySelector("span.title b").textContent;
    const season = metadata.split("E")[0].replace('S', '').replace(/^0+/, '');
    const episode = metadata.split("E")[1].replace(/^0+/, '');

    const buttonsContainer = toWatchElement.querySelector(".cd-timeline-content-buttons");

    const items = await findEpisode({ serie, season, episode });

    if (items.length > 0) {
      buildDropdown(buttonsContainer, items)
    }
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

async function findEpisode({ serie, season, episode }) {

  const result = [];

  try {
    const response = await fetch(`https://episodate.trodix.com/api/v1/public/series/search?serieName=${serie}&season=${season}&episode=${episode}`);
    const data = await response.json();

    data.urls.forEach(url => result.push({ name: new URL(url).hostname, url }));

  } catch (e) {
    console.error(`Error while searching for the serie ${serie}, season ${season}, episode ${episode}`, e)
  }

  return result;
}
