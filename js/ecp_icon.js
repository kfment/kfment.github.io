let ECPIconManager = window.initECPSetup({});

let ECPIcons = {
    "star": {
        "name": "Star",
        "id": "star",
        "active": true,
        "decoration": {"unicode": 83, "fill": "hsl(200,50%,20%)", "stroke": "hsl(50,100%,70%)"}
    },
    "reddit": {
        "name": "Reddit",
        "id": "reddit",
        "active": true,
        "decoration": {"unicode": 126, "fill": "#246", "stroke": "#FFF"}
    },
    "pirate": {
        "name": "Pirate",
        "id": "pirate",
        "active": true,
        "decoration": {"unicode": 127, "fill": "#111", "stroke": "#FFF"}
    },
    "csf": {"name": "Centauri Space Force", "id": "csf", "active": true, "url": "csf.png"},
    "pmf": {"name": "Proxima Mining Front", "id": "pmf", "active": true, "url": "pmf.png"},
    "nwac": {"name": "New World Army Citizens", "id": "nwac", "active": true, "url": "nwac.png"},
    "unge": {"name": "United Nations Green Eagles", "id": "unge", "active": true, "url": "unge.png"},
    "halo": {"name": "Halo Corsairs", "id": "halo", "active": true, "url": "halo.png"},
    "youtube": {
        "name": "Youtube",
        "id": "youtube",
        "active": true,
        "decoration": {"unicode": 90, "fill": "#B11", "stroke": "#FFF"}
    },
    "twitch": {"name": "Twitch", "id": "twitch", "active": true, "url": "twitch.png"},
    "invader": {
        "name": "Invader",
        "id": "invader",
        "active": true,
        "decoration": {
            "custom": [[0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0], [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1], [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0]],
            "fill": "#111",
            "stroke": "hsl(120,100%,50%)"
        }
    },
    "empire": {
        "name": "Galactic Empire",
        "id": "empire",
        "active": true,
        "decoration": {"unicode": 82, "fill": "#111", "stroke": "#FFF"}
    },
    "alliance": {
        "name": "Rebel Alliance",
        "id": "alliance",
        "active": true,
        "decoration": {"unicode": 88, "fill": "#111", "stroke": "#F00"}
    },
    "sdf": {
        "name": "Soloist Defence Force",
        "id": "sdf",
        "active": true,
        "decoration": {"unicode": 89, "fill": "#111", "stroke": "#FFF"}
    },
    "paw": {
        "name": "Paw",
        "id": "paw",
        "active": true,
        "decoration": {"unicode": 86, "fill": "#DA5", "stroke": "#000"}
    },
    "gamepedia": {"name": "Gamepedia", "id": "gamepedia", "active": true, "url": "gamepedia.png"},
    "discord": {"name": "Discord", "id": "discord", "active": true, "url": "discord.png"},
    "medic": {"name": "Medic", "id": "medic", "active": true, "url": "medic.jpg"},
    "blank": {"name": "Blank", "id": "blank", "active": true},
    "seasonal": {"name": "Seasonal", "id": "seasonal", "active": true, "url": "seasonal.png"},
    "halloween_2021": {
        "name": "Seasonal - Halloween 2021",
        "id": "halloween_2021",
        "active": true,
        "url": "halloween.png"
    },
    "christmas_2021": {
        "name": "Seasonal - Christmas 2021",
        "id": "christmas_2021",
        "active": false,
        "url": "christmas_2021.png"
    },
    "summer_2022": {"name": "Seasonal - Summer 2022", "id": "summer_2022", "active": false, "url": "summer_2022.png"},
    "fall_2022": {"name": "Seasonal - Fall 2022", "id": "fall_2022", "active": false, "url": "fall_2022.png"},
    "http://starblast.io/ecp/dev.png": {"name": "Developer", "id": "dev", "active": true, "url": "dev.png"},
    "http://starblast.io/ecp/translator.png": {"name": "Translator", "id": "translator", "active": true, "url": "translator.png"},
    "http://starblast.io/ecp/shipdesigner.jpg": {"name": "Shipwright", "id": "shipdesigner", "active": true, "url": "shipdesigner.jpg"},
    "http://starblast.io/ecp/srcchamp.png": {"name": "SRC Champion", "id": "srcchamp", "active": true, "url": "srcchamp.png"},
    "http://starblast.io/ecp/sdcchamp.png": {"name": "SDC Champion", "id": "sdcchamp", "active": true, "url": "sdcchamp.png"},
    "http://starblast.io/ecp/x27.png": {"name": "X-27", "id": "x27", "active": true, "url": "x27.png"},
    "http://starblast.io/ecp/loveship.png": {"name": "Loveship", "id": "loveship", "active": true, "url": "loveship.png"},
    "http://starblast.io/ecp/paralx.jpg": {"name": "Paralx", "id": "paralx", "active": true, "url": "paralx.jpg"},
    "http://starblast.io/ecp/iridium_ore.jpg": {"name": "Iridium Ore", "id": "iridium", "active": true, "url": "iridium_ore.jpg"},
    "http://starblast.io/ecp/carme.jpg": {"name": "Carme", "id": "carme", "active": true, "url": "carme.jpg"},
    "http://starblast.io/ecp/pudding.jpg": {"name": "Pudding Ship", "id": "pudding", "active": true, "url": "pudding.jpg"},
    "http://starblast.io/ecp/acarii.jpg": {"name": "Acarii", "id": "acarii", "active": true, "url": "acarii.jpg"},
    "http://starblast.io/ecp/scarn.jpg": {"name": "Scarn", "id": "scarn", "active": true, "url": "scarn.jpg"},
    "http://starblast.io/ecp/tournebulle.png": {"name": "Tournebulle", "id": "tournebulle", "active": true, "url": "tournebulle.png"},
    "http://starblast.io/ecp/blackstar.jpg": {"name": "Blackstar", "id": "blackstar", "active": true, "url": "blackstar.jpg"},
    "http://starblast.io/ecp/oh.jpg": {"name": "Oh_", "id": "oh", "active": true, "url": "oh.jpg"},
    "http://starblast.io/ecp/ancientsky.jpg": {"name": "Ancient Sky", "id": "ancientsky", "active": true, "url": "ancientsky.jpg"},
    "http://starblast.io/ecp/kleinem.jpg": {"name": "Kleinem", "id": "kleinem", "active": true, "url": "kleinem.jpg"},
    "http://starblast.io/ecp/2k.jpg": {"name": "Double K", "id": "2k", "active": true, "url": "2k.jpg"},
    "http://starblast.io/ecp/xcommander.jpg": {"name": "X-Commander", "id": "xcommander", "active": true, "url": "xcommander.jpg"},
    "http://starblast.io/ecp/fady.jpg": {"name": "Fady", "id": "fady", "active": true, "url": "fady.jpg"},
    "http://starblast.io/ecp/andromeda.jpg": {"name": "Andromeda", "id": "andromeda", "active": true, "url": "andromeda.jpg"},
    "http://starblast.io/ecp/mortyrules.jpg": {"name": "MortyRules", "id": "mortyrules", "active": true, "url": "mortyrules.jpg"},
    "http://starblast.io/ecp/pell.jpg": {"name": "Pell", "id": "pell", "active": true, "url": "pell.jpg"},
    "http://starblast.io/ecp/dimed.jpg": {"name": "Dimed", "id": "dimed", "active": true, "url": "dimed.jpg"},
    "http://starblast.io/ecp/finalizer.jpg": {"name": "Finalizer", "id": "finalizer", "active": true, "url": "finalizer.jpg"},
    "http://starblast.io/ecp/mikr.jpg": {"name": "Mikr Pollock", "id": "mikr", "active": true, "url": "mikr.jpg"},
    "http://starblast.io/ecp/goldman.jpg": {"name": "Goldman", "id": "goldman", "active": true, "url": "goldman.jpg"},
    "http://starblast.io/ecp/uranus.jpg": {"name": "Uranus", "id": "uranus", "active": true, "url": "uranus.jpg"},
    "http://starblast.io/ecp/nova.jpg": {"name": "Nova", "id": "nova", "active": true, "url": "nova.jpg"},
    "http://starblast.io/ecp/45rfew.jpg": {"name": "45rfew", "id": "45rfew", "active": true, "url": "45rfew.jpg"},
    "http://starblast.io/ecp/bhpsngum.png": {"name": "Bhpsngum", "id": "bhpsngum", "active": true, "url": "bhpsngum.png"},
    "http://starblast.io/ecp/valiant.jpg": {"name": "Valiant", "id": "valiant", "active": true, "url": "valiant.jpg"},
    "http://starblast.io/ecp/notus.png": {"name": "Notus", "id": "notus", "active": true, "url": "notus.png"},
    "http://starblast.io/ecp/destroy.png": {"name": "Destroy", "id": "destroy", "active": true, "url": "destroy.png"},
    "http://starblast.io/ecp/schickenman.png": {"name": "SChickenMan", "id": "schickenman", "active": true, "url": "schickenman.png"}
}

for (let key of Object.keys(ECPIcons)) {
    if (ECPIcons[key].url) {
        ECPIcons[key].url = `https://starblast.io/ecp/${ECPIcons[key].url}`;
    }
}

let getECPIcon = function (custom) {
    return new Promise((resolve) => {
        console.log(custom);
        let query = ECPIcons[custom.badge];
        if (!query) query = ECPIcons["star"];
        ECPIconManager.loadBadge(64, query, custom.finish, custom.laser, Math.random(), (canvas) => {
            setTimeout(() => {resolve(canvas);}, 100);
        });
    });
}