const modeTranslator = {
    "team": "Team Mode",
    "survival": "Survival Mode",
    "deathmatch": "Deathmatch",
    "modding": "Modding Space",
    "invasion": "Invasion Mode",
    "custom": "Custom Game"
}

const modeIcons = {
    "team": `<i class="bi bi-people-fill"></i>`,
    "survival": `<i class="bi bi-bullseye"></i>`,
    "deathmatch": `<i class="bi bi-trophy-fill"></i>`,
    "modding": `<i class="bi bi-code-slash"></i>`,
    "invasion": `<i class="bi bi-border"></i>`,
    "custom": `<i class="bi bi-wrench"></i>`
}

const moddingTranslator = {
    "racing": "Racing",
    "useries": "U-Series",
    "battleroyale": "Battle Royale",
    "alienintrusion": "Alien Intrusion",
    "nauticseries": "Nautic Series",
    "prototypes": "Prototypes",
    "src": "SRC 1",
    "src2": "SRC",
    "rumble": "Rumble",
    "ctf": "Capture the Flag",
    "dtm": "Destroy the Mothership",
    "mcst": "MCST",
    "sdc": "SDC",
    "megarumble": "Mega Rumble",
    "aow_lost_sector": "AOW Lost Sector",
    "escalation": "Escalation",
    "unknown": "Unknown Mod"
}

let fallbackCopyTextToClipboard = function(text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

let copyTextToClipboard = function(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

let translateMode = function(system) {
    if (system.mode === "modding") {
        system.mod_id = system.mod_id || "unknown";
        let translate = moddingTranslator[system.mod_id];
        if (!translate) {
            translate = "Unknown Mod";
        }
        return "Modding - " + translate;
    }
    if (system.mode === "custom") {
        if (system.modName !== "") {
            return "Custom Game - " + system.modName;
        }
        return "Custom Game"
    }
    return modeTranslator[system.mode];
}

let getSimstatus = async function() {
    let response = await axios.get("https://starblast.io/simstatus.json");
    return response.data;
}

let getSystemNames = function(systems) {
    let result = [];
    for (let system of systems) {
        result.push(system.name)
    }
    return result;
}

window.systems = {};

let getCustomGameInfo = async function(systemURL) {
    let systemID = systemURL.split("#")[1];
    let systemInfo = await StarblastAPI.getSystemInfo(systemID);
    console.log(systemInfo);
    if (!systemInfo.mode) {
        return alert("Unable to fetch info for that system. Perhaps it is full or has expired?");
    }
    systemInfo.servertime = systemInfo.servertime || -60;
    await showInfo({
        id: systemID,
        mode: systemInfo.mode.id,
        name: systemInfo.name,
        players: Object.keys(systemInfo.players).length,
        time: systemInfo.servertime / 1000,
        criminal_activity: "unable to fetch",
        dontDoPlayerFetch: true,
        playerList: systemInfo.players,
        region: systemInfo.region
    });
}

let showInfo = async function(system) {
    console.log(system);
    system.criminal_activity = system.criminal_activity || 0;
    document.getElementById("systemReportCard").setAttribute("style", "display: inherit;");
    if (!system.region) {
        document.getElementById("systemReportRegion").innerText = getFilters().region;
    } else {
        document.getElementById("systemReportRegion").innerText = system.region;
    }
    document.getElementById("systemReportMode").innerText = translateMode(system);
    document.getElementById("systemReportSystemName").innerText = system.name;
    document.getElementById("systemReportID").innerText = system.id;
    document.getElementById("systemReportCriminality").innerText = system.criminal_activity + " crimes";
    document.getElementById("systemReportPlayerCount").innerText = system.players;
    document.getElementById("systemReportTime").innerText = Math.round(system.time / 60) + " min";
    window.cachedSystemAge = system.time;
    document.getElementById("systemReportECPCount").innerText = "-";
    document.getElementById("systemReportPlayerList").innerText = "loading...";
    document.getElementById("teamScoresSpan").style.display = "none";
    // document.getElementById("systemReportStackRating").innerText = "loading...";
    document.getElementById("systemReportLink").setAttribute("href", getFilters().copyFullLinks ? `https://starblast.io/#${system.id}@${system.address}` : `https://starblast.io/#${system.id}`);
    document.getElementById("systemCopyLink").onclick = getCopyBinder(getFilters().copyFullLinks ? `https://starblast.io/#${system.id}@${system.address}` : `https://starblast.io/#${system.id}`);
    if (document.getElementById("systemViewInfo")) document.getElementById("systemViewInfo").style.display = "none";
    let playerList = [];
    setTimeout(() => {
        if (playerList.length === 0) {
            document.getElementById("systemReportPlayerList").innerText = "Failed to fetch player list. Perhaps the system is full/empty or has expired? It is also possible SL+ has gotten rate-limited by the Starblast servers.";
        }
    }, 2000);
    let status;
    if (!system.dontDoPlayerFetch) {
        console.log("Fetching players...");
        status = await StarblastAPI.getSystemInfo(system.id);
    } else {
        console.log("Not fetching players...");
        status = {};
        status.players = system.playerList;
    }
    window.cachedInfo = status;
    status.players = status.players || {};
    if (system.dontDoPlayerFetch) {
        document.getElementById("systemReportPlayerCount").innerText = String(Object.keys(status.players).length);
    }
    let ecpCount = 0;
    for (let playerId of Object.keys(status.players)) {
        if (status.players[playerId].custom) {
            ecpCount++;
        }
        playerList.push(status.players[playerId].player_name);
    }
    if ((status.mode.id === "team" || (status.mode.id === "modding" && status.mode.root_mode === "team")) && status.mode.teams[0].color) {
        let teamECPCount = [];
        for (let team of status.mode.teams) {
            teamECPCount.push(`${team.ecpCount} ${team.color}`);
        }
        document.getElementById("systemReportECPCount").innerText = teamECPCount.join(", ");
        document.getElementById("teamScoresSpan").style.display = "";
        let teamTRs = [];
        for (let team of status.mode.teams) {
            teamTRs.push(`${Math.round(team.totalScore / 1000)}k ${team.color}`);
        }
        document.getElementById("systemReportTeamScores").innerText = teamTRs.join(", ");
        document.getElementById("systemViewInfo").style.display = "";
    } else {
        document.getElementById("systemViewInfo").style.display = "";

        document.getElementById("systemReportECPCount").innerText = String(ecpCount);
        document.getElementById("teamScoresSpan").style.display = "none";
    }
    console.log(playerList);
    document.getElementById("systemReportPlayerList").innerText = playerList.join(", ").replaceAll("\u202E", "");
    // document.getElementById("systemReportStackRating").innerText = status.stackRating;
}

let getBinder = function(system) {
    window.systems[system.id] = system;
    return async() => {
        await showInfo(window.systems[system.id]);
    }
}

let getCopyBinder = function(url) {
    return () => {
        copyTextToClipboard(url);
        document.getElementById("clipboard").className = "bi bi-clipboard-check";
        setTimeout(() => {
            document.getElementById("clipboard").className = "bi bi-clipboard";
        }, 500);
    }
}

let getFilters = function() {
    let region = document.querySelector('input[name="region"]:checked').labels[0].textContent;
    let modes = [];
    if (document.getElementById("teamMode").checked) {
        modes.push("team");
    }
    if (document.getElementById("survivalMode").checked) {
        modes.push("survival");
    }
    if (document.getElementById("deathmatchMode").checked) {
        modes.push("deathmatch");
    }
    if (document.getElementById("moddingMode").checked) {
        modes.push("modding");
    }
    if (document.getElementById("invasionMode").checked) {
        modes.push("invasion");
    }
    if (document.getElementById("customMode").checked) {
        modes.push("custom");
    }
    let copyFullLinks = document.getElementById("copyFullLinks").checked;
    return {
        region: region,
        modes: modes,
        copyFullLinks: copyFullLinks
    }
}

let modeInputs = {
    "team": document.getElementById("teamMode"),
    "survival": document.getElementById("survivalMode"),
    "modding": document.getElementById("moddingMode"),
    "deathmatch": document.getElementById("deathmatchMode"),
    "invasion": document.getElementById("invasionMode"),
    "custom": document.getElementById("customMode")
}

let setFilters = function(filters) {
    for (let mode of ["team", "survival", "modding", "deathmatch", "invasion", "custom"]) {
        modeInputs[mode].checked = filters.modes.includes(mode);
    }
    if (!filters.region || filters.region === "Total") {
        filters.region = "America";
    }
    document.getElementById(filters.region).checked = true;
    document.getElementById("copyFullLinks").checked = filters.copyFullLinks;
}

let equalArrays = function(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let x=0; x<a.length; x++) {
        if (a[x] !== b[x]) {
            return false;
        }
    }
    return true;
}

let lastList = [];

let lastFilters = getFilters();

let updateList = async function() {
    let simstatus = await getSimstatus();
    let filters = getFilters();
    window.localStorage.setItem("filters", JSON.stringify(filters));
    let systems = [];
    let systemsList = document.getElementById("systemsList");
    let countAmerica = 0;
    let countEurope = 0;
    let countAsia = 0;
    let countBrazil = 0;
    let countGlobal = 0;
    for (let location of simstatus) {
        location.systems = location.systems || [];
        location.location = location.location || "Mars";
        location.current_players = location.current_players || 0;
        countGlobal += location.current_players;
        switch (location.location) {
            case "Europe":
                countEurope += location.current_players;
                break;
            case "America":
                countAmerica += location.current_players;
                break;
            case "Asia":
                countAsia += location.current_players;
                break;
            case "Brazil":
                countBrazil += location.current_players;
                break;
        }
        if (location.location !== filters.region) {
            continue;
        }
        for (const system of location.systems) {
            window.systems[system.id] = system;
            if (filters.modes.includes(system.mode) && !system.survival && location.location) {
                system.address = location.address;
                systems.push(system);
            }
        }
    }
    if (filters.modes.includes("custom")) {
        systems = systems.concat(window.customGameList);
    }
    systems.sort((a, b) => {
        if (a.time < b.time) {
            return -1;
        }
        return 1;
    });
    if (equalArrays(getSystemNames(systems), lastList)) {
        for (let x=0; x<systems.length; x++) {
            let system = systems[x];
            systemsList.childNodes[x].innerHTML = `<div class="card-body">
                    <h3 class="nunito-sans-bold mb-0">${system.name} <span class="float-end">${Math.round(system.time / 60)} min</span></h3>
                    <span>${modeIcons[system.mode]} <i>${translateMode(system)}</i> <b class="float-end">${system.players} players</b></span>
                </div>`
            // systemsList.childNodes[x].onclick = getBinder(system);
        }
        return;
    }
    if (equalArrays(getFilters().modes, lastFilters.modes) && getFilters().region === lastFilters.region && document.getElementById("newServerAlert").checked === true && systems.length > lastList.length) {
        (async() => {
            let permission = Notification.permission;
            if (["denied", "default"].includes(permission)) {
                return;
            }
            let notification = new Notification('New Server Alert!');
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible') {
                    notification.close();
                }
            });
        })().then();
        let permission = Notification.permission;
        if (permission === "denied" || permission === "default") {
            await Notification.requestPermission();
        }

    }
    systemsList.innerHTML = "";
    for (const system of systems) {
        let card = document.createElement("div");
        card.setAttribute("class", "card system-card mb-3");
        systems.players = systems.players || 0;
        card.innerHTML = `<div class="card-body">
                    <h3 class="nunito-sans-bold mb-0">${system.name} <span class="float-end">${Math.round(system.time / 60)} min</span></h3>
                    <span>${modeIcons[system.mode]} <i>${translateMode(system)}</i> <b class="float-end">${system.players} players</b></span>
                </div>`
        if (window.darkmode) {
            card.classList.add("bg-dark");
            //card.setAttribute("style", "border-color: white;");
        }
        card.onclick = getBinder(system);
        systemsList.appendChild(card);
    }
    lastList = getSystemNames(systems);
    lastFilters = getFilters();

    // Update player count per region
    document.getElementById("countAmerica").innerHTML = `<i class="bi bi-person-fill"></i> ${countAmerica}`;
    document.getElementById("countEurope").innerHTML = `<i class="bi bi-person-fill"></i> ${countEurope}`;
    document.getElementById("countAsia").innerHTML = `<i class="bi bi-person-fill"></i> ${countAsia}`;
    document.getElementById("countBrazil").innerHTML = `<i class="bi bi-person-fill"></i> ${countBrazil}`;
    document.getElementById("countTotal").innerHTML = `<i class="bi bi-person-fill"></i> ${countGlobal}`;
}

let updateCustomList = async function() {
    // let customGameList = await axios.get("https://starblast.dankdmitron.dev/games.json");
    // window.customGameList = customGameList.data;
}

window.customGameList = [];
updateList().then();
setInterval(updateList, 5000);
setInterval(updateCustomList, 5000);
updateCustomList().then();

document.getElementById("newServerAlert").addEventListener("change", () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then();
    }
});

if (window.localStorage.getItem("filters")) {
    setFilters(JSON.parse(window.localStorage.getItem("filters")));
}

document.querySelectorAll("input[type=radio]").forEach((input) => {
    input.addEventListener("change", updateList);
});
document.querySelectorAll("input[type=checkbox]").forEach((input) => {
    input.addEventListener("change", updateList);
});

document.getElementById("customSystemButton").addEventListener("click", (evt) => {
    let url = document.getElementById("customSystemURLInput").value;
    if (!url.startsWith("https://starblast.io/#")) {
        alert("Please enter a valid system link");
        evt.preventDefault();
        return;
    }
    getCustomGameInfo(url).then();
    evt.preventDefault();
});

document.getElementById("customGameShareButton").addEventListener("click", (evt) => {
    bootstrap.Popover.getOrCreateInstance(document.getElementById("criminalityPopover")).hide();
    if (window.localStorage.getItem("customGameModName")) {
        document.getElementById("customGameNameInput").value = window.localStorage.getItem("customGameModName");
    }
});

let getGameLink = function(link) {
    let filter = /starblast\.io\/*(index\.html)*(\?[^\t\r\n\s#\/\\]*)*#(\d{1,4})@(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})*:(\d{1,4})*/;
    let match = link.match(filter);
    if (!match) {
        return "";
    }
    return `https://starblast.io/#${match[3]}@${match[4]}:${match[5]}`;
}

document.getElementById("customGameSubmitButton").addEventListener("click", async(evt) => {
    window.customGameProcessing = window.customGameProcessing || false;
    if (window.customGameProcessing) {
        return;
    }
    window.customGameProcessing = true;
    // Freeze modal
    let submitButton = document.getElementById("customGameSubmitButton");
    submitButton.innerText = "Processing...";
    let shareButton = document.getElementById("customGameShareButton");
    let modalFreezeLoop = function() {
        if (submitButton.offsetParent === null) {
            shareButton.click();
        }
        if (window.customGameProcessing) {
            requestAnimationFrame(modalFreezeLoop);
        }
    };
    requestAnimationFrame(modalFreezeLoop);
    // Save Mod Name for convenience
    window.localStorage.setItem("customGameModName", document.getElementById("customGameNameInput").value);
    // Validate input
    let customGameURL = document.getElementById("customGameLinkInput").value;
    let customGameName = document.getElementById("customGameNameInput").value;
    if (customGameName.length === 2) {
        customGameName = "";
    }
    if (!getGameLink(customGameURL)) {
        window.customGameProcessing = false;
        alert("Please enter a valid system link");
        submitButton.innerText = "Share";
        return;
    }
    customGameURL = getGameLink(customGameURL);
    // name: customGameName
    let serverResponse = await axios.post(`/post`, {url: customGameURL, name: ""});
    window.customGameProcessing = false;
    if (serverResponse.data.success) {
        setTimeout(() => {
            let cancelButton = document.getElementById("cancelButton");
            cancelButton.click();
        }, 100);
    } else if (serverResponse.data.cantPing) {
        alert("Error! Unfortunately we could not ping your private game. Are you sure you've entered the link correctly?");
    } else if (serverResponse.data.invalid) {
        alert("Error! It seems you have entered an invalid link or mod name");
    } else if (serverResponse.data.exists) {
        alert("Error! The link you have entered has already been posted!");
    } else {
        alert("Error! Please report this on the Discord");
    }
    submitButton.innerText = "Share";
    updateCustomList().then();
});

window.hsv2rgb = function (h, s, v) {
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5), f(3), f(1)];
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        let defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (let side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}

let cachedBadges = new Map();

let renderSystemAnalysis = async () => {
    let canvas = document.getElementById("systemAnalysisRadar");
    canvas.setAttribute("width", String(2 * canvas.parentElement.clientWidth)), canvas.setAttribute("height", String(2 * canvas.parentElement.clientWidth)), canvas.style.width = canvas.parentElement.clientWidth + "px", canvas.style.height = canvas.parentElement.clientWidth + "px";
    let context2D = canvas.getContext("2d");
    context2D.fillStyle = "#121212", context2D.fillRect(0, 0, canvas.width, canvas.height);
    let mapSize = cachedInfo.mode.map_size,
        mapData;
    mapData = cachedInfo.mode.custom_map ? cachedInfo.mode.custom_map : getMap(cachedInfo.seed, cachedInfo.mode.map_size, "modding" === cachedInfo.mode.id ? cachedInfo.mode.root_mode : cachedInfo.mode.id);
    let radarCellSize = canvas.width / mapSize,
        halfCellSize = radarCellSize / 2,
        rowCount = 0;
    for (let mapRow of mapData.split("\n")) {
        let colCount = 0;
        for (let cellValue of mapRow) {
            let drawPosX = colCount * radarCellSize + halfCellSize,
                drawPosY = rowCount * radarCellSize + halfCellSize,
                drawRadius = Number(cellValue) / 10 * halfCellSize;
            context2D.beginPath(), context2D.fillStyle = "#ffffff", context2D.arc(drawPosX, drawPosY, drawRadius, 0, 2 * Math.PI), context2D.fill(), colCount++
        }
        rowCount++
    }
    let satValue = 0.8,
        brightValue = 0.8;
    if(!cachedInfo.mode.root_mode === "survival") {
        for (let team of cachedInfo.mode.teams) {
            let stationPhase = team.station.phase,
                maxRadius = Math.sqrt(2) / 2 * canvas.width / 2,
                rotation = (cachedInfo.servertime + (Date.now() - cachedInfo.obtained)) / 1e3 * 60 / 60 / 3600 % 1 * Math.PI * 2,
                offsetX = maxRadius * Math.cos(rotation + stationPhase),
                offsetY = -(maxRadius * Math.sin(rotation + stationPhase)),
                rgbColor = hsv2rgb(team.hue, satValue, brightValue);
            context2D.fillStyle = `rgb(${255*rgbColor[0]}, ${255*rgbColor[1]}, ${255*rgbColor[2]})`, context2D.beginPath(), roundRect(context2D, canvas.width / 2 + offsetX - 4 * halfCellSize, canvas.width / 2 + offsetY - 4 * halfCellSize, 8 * halfCellSize, 8 * halfCellSize, halfCellSize, true), context2D.fill()
        }
    }
    for (let playerKey of Object.keys(cachedInfo.players)) {
        let player = cachedInfo.players[playerKey],
            posX = player.x / (5 * cachedInfo.mode.map_size) * (canvas.width / 2),
            posY = -(player.y / (5 * cachedInfo.mode.map_size)) * (canvas.height / 2),
            rgbColor = hsv2rgb(player.hue, satValue, brightValue);
        if (context2D.fillStyle = `rgb(${255*rgbColor[0]}, ${255*rgbColor[1]}, ${255*rgbColor[2]})`, context2D.strokeStyle = `rgb(${255*rgbColor[0]}, ${255*rgbColor[1]}, ${255*rgbColor[2]})`, context2D.lineWidth = 1.5 * halfCellSize, void 0 != player.custom) {
            let drawPos = [canvas.width / 2 + posX - 0 * halfCellSize + 0, canvas.width / 2 + posY - 0.5 * halfCellSize];
            context2D.beginPath(), context2D.strokeStyle = "WHITE", context2D.arc(drawPos[0], drawPos[1], 10, 0, 360, false), context2D.arc(drawPos[0], drawPos[1], 7, 0, 360, false), context2D.stroke()
        } else {
            let lineStartPos = [canvas.width / 2 + posX - 1.5 * halfCellSize, canvas.width / 2 + posY - 1.5 * halfCellSize, canvas.width / 2 + posX + 1.5 * halfCellSize, canvas.width / 2 + posY + 1.5 * halfCellSize];
            context2D.beginPath(), context2D.moveTo(lineStartPos[0], lineStartPos[1]), context2D.lineTo(lineStartPos[2], lineStartPos[3]), context2D.stroke(), context2D.beginPath(), context2D.moveTo(lineStartPos[0], lineStartPos[3]), context2D.lineTo(lineStartPos[2], lineStartPos[1]), context2D.stroke()
        }
        let shipTypeMap = {
            "101": "fly",
            "201": "delta",
            "202": "trident",
            "301": "pulse",
            "302": "sidef",
            "303": "x-1",
            "304": "y-def",
            "401": "vanguard",
            "402": "merc",
            "403": "x-war",
            "404": "intercept",
            "405": "pioneer",
            "406": "crusader",
            "501": "u-snipe",
            "502": "fury",
            "503": "t-war",
            "504": "aetos",
            "505": "x-2",
            "506": "howler",
            "507": "bat def",
            "601": "advf",
            "602": "scorp",
            "603": "marauder",
            "604": "condor",
            "605": "a-speed",
            "606": "rt",
            "607": "barricuda",
            "608": "o-def",
            "701": "oddy",
            "702": "x-3",
            "703": "bastion",
            "704": "aries"
        };
        context2D.font = "bold 15px serif", context2D.fillStyle = `rgb(${255*rgbColor[0]}, ${255*rgbColor[1]}, ${255*rgbColor[2]})`, context2D.textAlign = "center", context2D.fillText(player.player_name, canvas.width / 2 + posX + halfCellSize - 8, canvas.width / 2 + posY + halfCellSize + 30), context2D.font = "bold 15px serif", context2D.fillStyle = `rgb(${255*rgbColor[0]}, ${255*rgbColor[1]}, ${255*rgbColor[2]})`, context2D.textAlign = "center", context2D.fillText(shipTypeMap[player.type], canvas.width / 2 + posX + halfCellSize - 8, canvas.width / 2 + posY + halfCellSize - 35), context2D.fill()
    }
    document.getElementById("analysisModalTitle").innerText = `Detailed System Report: ${cachedInfo.name}`;
    let analysisRow = document.getElementById("analysisRow"),
        scrollTops = [];
    for (; analysisRow.childElementCount > 1;) scrollTops[scrollTops.length] = analysisRow.lastChild.scrollTop, analysisRow.removeChild(analysisRow.lastChild);
    let colClass = "col-sm-2 analysis-col";
    2 === cachedInfo.mode.friendly_colors && (colClass = "col-sm-3 analysis-col");
    let scrollTopIndex = scrollTops.length - 1;
    if(!cachedInfo.mode.root_mode === "survival") {
        for (let teamInfo of cachedInfo.mode.teams) {
            let teamColumn = document.createElement("div");
            teamColumn.className = colClass, teamColumn.style.overflowY = "scroll", teamColumn.style.overflowX = "hidden", teamColumn.style.height = canvas.height / 2 + "px";
            let teamHeader = document.createElement("h5");
            teamHeader.innerText = teamInfo.color, teamHeader.className = "nunito-sans-bold text-center m-0", teamColumn.appendChild(teamHeader);
            let teamSeparator = document.createElement("hr");
            teamSeparator.className = "m-1", teamColumn.appendChild(teamSeparator), analysisRow.appendChild(teamColumn), teamColumn.insertAdjacentHTML("beforeend", `
            <span><b class="float-start">Level</b> <p class="float-end m-0">${teamInfo.level}</p><br></span>
            <span><b class="float-start">Gems</b> <p class="float-end m-0">${teamInfo.crystals}</p><br></span>
            <span><b class="float-start">Score</b> <p class="float-end m-0">${teamInfo.totalScore}</p><br></span>
            <hr class="m-1">
            `);
            let matchingPlayers = [];
            for (let playerKey of Object.keys(cachedInfo.players)) {
                let currentPlayer = cachedInfo.players[playerKey];
                currentPlayer.hue === teamInfo.hue && matchingPlayers.push(currentPlayer)
            }
            let shipSeries = "vanilla"
            let isSeriesVisible = false,
            shipData;
        for (let playerInfo of ("modding" === cachedInfo.mode.id && (shipData = JSON.parse(cachedInfo.mode.ships[0])), "team" === cachedInfo.mode.id ? isSeriesVisible = true : "U-Sniper Mk 2" === shipData.name ? (shipSeries = "useries", isSeriesVisible = true) : "Snail" === shipData.name ? (shipSeries = "nautic", isSeriesVisible = true) : "Fly_V2" === shipData.name && (shipSeries = "intrusion", isSeriesVisible = true), matchingPlayers.sort((a, b) => b.score - a.score), matchingPlayers)) {
            let hasCustomAppearance = false,
                customFilter, badgeImageSrc, hasECPIcon = false;
            if (playerInfo.custom) {
                let playerColor = hsv2rgb(playerInfo.hue, satValue, brightValue);
                if (customFilter = new Solver(new Color(255 * playerColor[0], 255 * playerColor[1], 255 * playerColor[2])).solve().filter, hasCustomAppearance = true, "blank" !== playerInfo.custom.badge) {
                    let customComponents = `${playerInfo.custom.badge},${playerInfo.custom.finish},${playerInfo.custom.laser}`;
                    cachedBadges.has(customComponents) ? badgeImageSrc = cachedBadges.get(customComponents) : (badgeImageSrc = (await getECPIcon(playerInfo.custom)).toDataURL(), cachedBadges.set(customComponents, badgeImageSrc)), hasECPIcon = true
                }
            }
            let shipImgTag = "";
            isSeriesVisible && hasCustomAppearance ? shipImgTag = `<img style="height:0.65rem; width:0.65rem; margin-bottom: 0.1rem; ${customFilter}" src="/img/ships/${shipSeries}/${playerInfo.type}.png" alt="" class="ship-image">` : isSeriesVisible ? shipImgTag = `<img style="height:0.65rem; width:0.65rem; margin-bottom: 0.1rem;" src="/img/ships/${shipSeries}/${playerInfo.type}.png" alt="" class="ship-image">` : !isSeriesVisible && hasCustomAppearance && (shipImgTag = `<img style="height:0.65rem; width:0.65rem; margin-bottom: 0.1rem; ${customFilter}" src="/starblast-ships/000.png" alt="" class="ship-image">`);
            let playerNameSpan = document.createElement("span");
            playerNameSpan.setAttribute("style", "font-size: 0.65rem; overflow: hidden; white-space: nowrap;"), playerNameSpan.setAttribute("class", "float-start"), playerNameSpan.innerHTML += "&nbsp", hasCustomAppearance && hasECPIcon && (playerNameSpan.innerHTML += `<img src=${badgeImageSrc} style="height: 0.65rem; width:1.3rem; margin-bottom: 0.1rem;"> `), playerNameSpan.innerHTML += playerInfo.player_name.replace("<", "&lt").replace(">", "&gt"), teamColumn.appendChild(playerNameSpan), teamColumn.insertAdjacentHTML("beforeend", `
                <span class="float-end" style="font-size: 0.65rem">
                    ${playerInfo.score}
                    ${shipImgTag}
                </span>
                <br>
                `)
            }
            teamColumn.scrollTop = scrollTops[scrollTopIndex], scrollTopIndex--
        }
    } else {
        let teamColumn = document.createElement("div");
        teamColumn.className = colClass, teamColumn.style.overflowY = "scroll", teamColumn.style.overflowX = "hidden", teamColumn.style.height = canvas.height / 2 + "px";
        let teamHeader = document.createElement("h5");
        teamHeader.innerText = "Survival Players", teamHeader.className = "nunito-sans-bold text-center m-0", teamColumn.appendChild(teamHeader);
        let teamSeparator = document.createElement("hr");
        teamSeparator.className = "m-1", teamColumn.appendChild(teamSeparator), analysisRow.appendChild(teamColumn);

        let playersInSurvival = Object.values(cachedInfo.players);
        playersInSurvival.sort((a, b) => b.score - a.score);

        for (let playerInfo of playersInSurvival) {
            let hasCustomAppearance = false,
                customFilter, badgeImageSrc, hasECPIcon = false;

            if (playerInfo.custom) {
                let playerColor = hsv2rgb(playerInfo.hue, satValue, brightValue);
                if (customFilter = new Solver(new Color(255 * playerColor[0], 255 * playerColor[1], 255 * playerColor[2])).solve().filter, hasCustomAppearance = true, "blank" !== playerInfo.custom.badge) {
                    let customComponents = `${playerInfo.custom.badge},${playerInfo.custom.finish},${playerInfo.custom.laser}`;
                    cachedBadges.has(customComponents) ? badgeImageSrc = cachedBadges.get(customComponents) : (badgeImageSrc = (await getECPIcon(playerInfo.custom)).toDataURL(), cachedBadges.set(customComponents, badgeImageSrc)), hasECPIcon = true
                }
            }

            let shipImgTag = "";
            hasCustomAppearance ? shipImgTag = `<img style="height:0.65rem; width:0.65rem; margin-bottom: 0.1rem; ${customFilter}" src="/img/ships/vanilla/${playerInfo.type}.png" alt="" class="ship-image">` : shipImgTag = `<img style="height:0.65rem; width:0.65rem; margin-bottom: 0.1rem;" src="/img/ships/vanilla/${playerInfo.type}.png" alt="" class="ship-image">`;

            let playerNameSpan = document.createElement("span");
            playerNameSpan.setAttribute("style", "font-size: 0.65rem; overflow: hidden; white-space: nowrap;"), playerNameSpan.setAttribute("class", "float-start"), playerNameSpan.innerHTML += "&nbsp", hasCustomAppearance && hasECPIcon && (playerNameSpan.innerHTML += `<img src=${badgeImageSrc} style="height: 0.65rem; width:1.3rem; margin-bottom: 0.1rem;"> `), playerNameSpan.innerHTML += playerInfo.player_name.replace("<", "&lt").replace(">", "&gt"), teamColumn.appendChild(playerNameSpan), teamColumn.insertAdjacentHTML("beforeend", `
                <span class="float-end" style="font-size: 0.65rem">
                    ${playerInfo.score}
                    ${shipImgTag}
                </span>
                <br>
            `);
            document.querySelector(`#analysisRow > div.col-sm-2.analysis-col`).style.width = "46.66666667%";
        }
        teamColumn.scrollTop = scrollTops[scrollTopIndex], scrollTopIndex--;
    }


    document.getElementById("saveSystemInfo").onclick = function() {
        let jsonFile = new File([JSON.stringify(cachedInfo)], `${cachedInfo.name}-${Date.now()}.json`, {
                type: "application/json"
            }),
            downloadLink = document.createElement("a"),
            fileURL = URL.createObjectURL(jsonFile);
        downloadLink.href = fileURL, downloadLink.download = jsonFile.name, document.body.appendChild(downloadLink), downloadLink.click(), document.body.removeChild(downloadLink), window.URL.revokeObjectURL(fileURL)
    }, setTimeout(async () => {
        if (!cachedInfo.mode.unlisted && cachedInfo.api.live && "true" === document.getElementById("analysisModal").getAttribute("aria-modal")) {
            let newInfo = await StarblastAPI.getSystemInfo(cachedInfo.systemid);
            newInfo.api && newInfo.api.live && (window.cachedInfo = newInfo, renderSystemAnalysis())
        }
    }, 500)
}
document.getElementById("systemViewInfo").addEventListener("click", renderSystemAnalysis);