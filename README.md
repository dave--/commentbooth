# commentbooth
Little tool to show player's cards in hands as overlay for a video of a Game of Thrones LCG game.

## Installation
You need [node.js](https://nodejs.org/) version 6 or higher. And have git installed (to clone this repository). If you have all of that installed follow these steps:

1. Open the command line and navigate to the folder where you would like to install.
2. Run `git clone https://github.com/dave--/commentbooth.git`.
3. Switch into the newly created folder.
4. Run `npm install`.

If you already installed commentbooth as described above and just want to get an update run those commands in the folder you installed it in:

1. `git pull`
2. `npm update`

## Starting up
Open the command line and navigate to the folder you installed commentbooth in. Then run `npm run main`.

You should see some output, with the last line stating `Server started at http://localhost:8080`

## Usage
After commentbooth was started, open up a Browser of your choice. If your choice is Internet Explorer you are a lost soul and need psychological help.

You should be able to navigate to the URL that popped up when you started the server: [http://localhost:8080](http://localhost:8080)

You will be presented with the main navigation.

### Crawler
Currently the only crawler available gets all its data from [ThronesDB.com](http://thronesdb.com).

If you start the crawler for the first time, it doesn't matter which of the two links you click. It is gonna take a few minutes.

This is because it downloads all card images to later on be independent of a working internet connection.

If you follow the link labelled "skip already existing card images" after you already downloaded the card images it will only download new ones and will be way faster.

### Controls
Those four links lead to independent sites controlling different aspects of the commentbooth. Including the actual card handling for both players.

### Showroom
This is where everything will actually be displayed and look halfway decent. Open this site in its own window and make it fullscreen (F11 in most browsers). In your recording tool, select only to record this window.
