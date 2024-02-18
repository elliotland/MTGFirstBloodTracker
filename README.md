# Magic: The Gathering Attack Tracker Chrome Extension

## Overview
This Chrome Extension allows Magic: The Gathering players to record who attacked whom first in their games and to note the emotional responses to these interactions. It provides an easy-to-use interface for entering and viewing this data, which is stored in a MongoDB database.

## Features
- **Attack and Emotional Response Recording:** Log details about game interactions, including the attacker, the attacked, and emotional responses.
- **Statistics Dashboard:** View statistics on the most common attackers, the most attacked players, and prevalent emotional responses.

![Magic: The Gathering Attack Tracker Chrome Extension Screenshot](https://i.postimg.cc/x8kgVN2d/screenshot.jpg "Magic: The Gathering Attack Tracker")

## Prerequisites
Before using this extension, users need to set up their own MongoDB instance. This involves creating a MongoDB database and collection to store the game data.

### Setting Up MongoDB
1. Sign up for a MongoDB account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project and build a new database cluster.
3. Within your cluster, create a new database and collection. Note the names as you'll need them for configuring the extension.
4. Go to the "Network Access" section and ensure your IP address is whitelisted to allow connections to your database.
5. Create a database user with read and write permissions in the "Database Access" section.
6. Obtain your MongoDB connection string and API key by navigating to the "Clusters" section, clicking "Connect" on your cluster, and selecting "Connect your application."

## Configuration
To connect the extension to your MongoDB instance, you will need to modify the placeholders in the JavaScript code with your actual database endpoint and API token.

### Steps to Configure
1. Locate the `fetch` requests in `popup.js` and replace `<database_url>` with your MongoDB API endpoint.
2. Replace `<api_key>` with your actual MongoDB API key.
3. Ensure the `"dataSource"`, `"database"`, and `"collection"` fields in the JSON payload of the `fetch` requests match your MongoDB configuration.

### Update manifest.json
Additionally, you may need to update the `manifest.json` file with specific information related to your project or database as required. This could include adjusting permissions, content scripts, or other extension settings to match your deployment environment.

## Installation
1. Clone this repository or download the ZIP file.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable Developer Mode at the top right.
4. Click "Load unpacked" and select the directory where the extension files are located.

## Usage
- **Recording a Game:** Navigate to the "Record game" tab, enter player names, and log attack and emotional response details.
- **Viewing Statistics:** Switch to the "See Stats" tab to view aggregated data on game interactions.

## Contributing
This repo will not be frequently monitored. Bugs and pull requests are welcome, as are forks to improve it yourself.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
