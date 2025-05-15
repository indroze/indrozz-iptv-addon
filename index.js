const { addonBuilder } = require("stremio-addon-sdk");
const m3uParser = require("iptv-playlist-parser");
const fetch = require("node-fetch");

const IPTV_M3U_URL = "http://puritv.biz.id:80/playlist/indrozz/indrozz321/m3u";

const builder = new addonBuilder({
    id: "org.indrozz.iptv",
    version: "1.0.0",
    name: "Indrozz IPTV",
    description: "Addon IPTV khusus dari Indrozz untuk Stremio",
    types: ["tv"],
    catalogs: [
        {
            type: "tv",
            id: "iptv_catalog",
            name: "Indrozz Channels"
        }
    ],
    resources: ["catalog", "stream"]
});

let channels = [];

async function fetchChannels() {
    const res = await fetch(IPTV_M3U_URL);
    const text = await res.text();
    const parsed = m3uParser.parse(text);
    channels = parsed.items.map((item, i) => ({
        id: `iptv_${i}`,
        type: "tv",
        name: item.name || `Channel ${i}`,
        poster: item.tvg.logo || null,
        description: item.group.title || "IPTV Channel",
        url: item.url
    }));
}

builder.defineCatalogHandler(async () => {
    if (!channels.length) await fetchChannels();

    return {
        metas: channels.map(ch => ({
            id: ch.id,
            type: "tv",
            name: ch.name,
            poster: ch.poster,
            description: ch.description
        }))
    };
});

builder.defineStreamHandler((args) => {
    const ch = channels.find(c => c.id === args.id);
    if (!ch) return Promise.resolve({ streams: [] });

    return Promise.resolve({
        streams: [{
            title: ch.name,
            url: ch.url
        }]
    });
});

module.exports = builder.getInterface();