# Backend Riot Games API

### Links
* [Riot Games Developers](https://developer.riotgames.com/) (Portal)
* [API's](https://developer.riotgames.com/apis) used with token of Riot Games
* Free [ddragon API](https://developer.riotgames.com/docs/lol#data-dragon)

### Packages
    "axios": "0.26.0",
    "cors": "2.8.5",
    "dotenv": "16.0.0",
    "express": "4.17.3",
    "redis": "4.0.4",
    "redis-commander": "0.7.2"
    "eslint-config-standard": "16.0.3",
    "eslint-plugin-import": "2.25.4",
    "eslint-plugin-node": "11.1.0",
    "eslint-plugin-promise": "5.2.0",
    "jest": "^27.5.1",
    "nodemon": "2.0.15",
    "response-time": "^2.3.2"

## Routes (League of Legends)

#### Test Running
* /api/

#### Summoner
> Test running
* /api/summoner

> Return summoner data
* /api/summoner/:region&:name
* /api/summoner/puuid/:region&:name

> Return icon URL
* /api/summoner/icon/:id

#### Matches
> Test running
* /api/matches

> Return matches of summoner
* /api/matches/:region&:puuid&:count

#### Champions
> Test running
* /api/champions

> Get all champs
* /api/champions/all

> Get all info for specific champ
* /api/champions/champ/:name

> Free champions
* /api/champions/free/:region