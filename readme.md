# SMPTM - Serentity Most Popular Topics by Month

Simple react app and express.js server that uses the Gihub API to get all the merged PR's in the serenityOS project and creates a simple Plotly graph with the most frequent topics.

# Server:

```bash
$ cd server
$ npm start
```
#### `localhost:3001/`
Returns an simplified list of PRs objects with less noise.

 ```json
{
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
}
 ```
#### `localhost:3001/chart-data`
Gathers data from the generated json and creates a object with the necessary data for a bar plotly chart.

 ```json
{
    "data": [
        {
            "x": [x],
            "y": [y],
            "type": "bar"
        }
    ]
}
 ```
#### `localhost:3001/gh-month?m=[month]`
Call the api page by page until the month isn't equal to the specified month and gathers the merged PRs. At the end a file is generated called output.json.

In the current implementation the server is almost useless since I'm using an generated json with all the month entries calling the `gh-month?m=[month]`. This can be done using only the Gihub API, but since this is a monthly tool, I don't need the realtime data.

## App:
```bash
$ cd server
$ npm start
```
Using some basic css and react-plotly, the app gathers all the data and displays some graphics. Nothing fancy.

## Notes:

The server needs a personal Github token! This happens due to rate limit calls to the api. Without the token you can only make 60 calls per hour, with the token, this is changed to 5000 calls.