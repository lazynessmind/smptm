const express = require("express");
const axios = require("axios").default;
const output = require("../month_data/march.json");
const fs = require("fs");

const app = express();
const port = 3001;

axios.defaults.headers.common["Authorization"] = `Basic ${process.env.TOKEN}`;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", async (req, res) => {
    const merged = [];
    for (let i = 0; i < output.length; i++) {
        const pull = output[i];
        if (pull.merged_at !== null) {
            let category = "Unknown";
            let title = pull.title;
            if (pull.title.includes(":")) {
                category = pull.title.split(":")[0].trim();
                title = pull.title.split(":")[1].trim();
            }
            merged.push({
                "merged_at": pull.merged_at,
                "url": pull.html_url,
                "title": title,
                "full_title": pull.title,
                "category": category,
                "author": {
                    "username": pull.user.login,
                    "avatar": pull.user.avatar_url,
                    "url": pull.user.html_url
                }
            });
        }
    }

    let i = 0;
    merged.forEach(it => {
        if (new Date(it.merged_at).getMonth() == new Date().getMonth()) {
            i++;
        }
    });

    console.log("Total:", output.length);
    console.log("Merged:", merged.length);
    console.log("This month:", i);

    res.send(merged);
});

app.get("/gh-month", async (req, res) => {
    const monthData = [];
    if (req.query.m === undefined) {
        res.send("Specify a month from 0 to 11 with [url]/gh-month?m=[month].");
    } else {
        var j = 0;
        while (true) {
            var done = false;
            await axios.get(`https://api.github.com/repos/serenityos/serenity/pulls?state=close&per_page=100&page=${j}`)
                .then(resp => {
                    for (let i = 0; i < resp.data.length; i++) {
                        if (resp.data[i].merged_at != null) {
                            if (new Date(resp.data[i].merged_at).getMonth() == req.query.m) {
                                monthData.push(resp.data[i]);
                            } else {
                                done = true;
                                break;
                            }
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    done = true;
                });
            if (!done) j++;
            else break;
        }
    }

    const jsonContent = JSON.stringify(monthData);
    fs.writeFile("output.json", jsonContent, "utf8", (err) => {
        if (err) return console.log(err);
        console.log("JSON file has been saved.");
    });

    res.send(`${j} pages and ${monthData.length} merged pull requests`);
});

app.get("/chart-data", (req, res) => {
    const categories = new Map();
    output.forEach(it => {
        let category = ["Unknown"];
        if (it.title.includes(":")) {
            category = it.title.split(":")[0].split(/[^A-Za-z]/);
        }
        if (category.length == 1) {
            if (!categories.has(category[0])) {
                categories.set(category[0], 1);
            } else {
                categories.set(category[0], categories.get(category[0]) + 1);
            }
        } else {
            for (let i = 0; i < category.length; i++) {
                if (!categories.has(category[i])) {
                    categories.set(category[i], 1);
                } else {
                    categories.set(category[i], categories.get(category[i]) + 1);
                }
            }
        }

    });

    const x = [];
    const y = [];


    categories.forEach((val, key, map) => {
        x.push(key);
        y.push(val);
    });


    let chartData = {
        "data": [
            {
                "x": x,
                "y": y,
                "type": "bar"
            }
        ]
    };

    res.send(chartData);
});

app.listen(port, () => {
    console.log(`Listennig on ${port}`);
});