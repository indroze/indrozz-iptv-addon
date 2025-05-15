const express = require("express");
const addonInterface = require("./index");

const app = express();
const port = process.env.PORT || 7000;

app.get("/manifest.json", (req, res) => {
    res.send(addonInterface.manifest);
});

app.get("/:resource/:type/:id.json", (req, res) => {
    addonInterface.get(req.params).then(resp => res.send(resp)).catch(err => res.status(500).send(err));
});

app.listen(port, () => {
    console.log(`Indrozz IPTV Addon running at http://localhost:${port}/manifest.json`);
});