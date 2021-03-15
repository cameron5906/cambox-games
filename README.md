# cambox-games
(README in progress)

You'll need two environment variables:
- CAMBOX_GAMES_SIGNING_KEY (any string of text)
- CAMBOX_GAMES_SLACK_TOKEN (a Slack bot token)

## React Flow
- User authenticates via REST, is given back a JWT from the Web Service
- User joins or creates a room via REST, is given back a new JWT containing room information
- Upon joining a room, a Websocket connection is initialized
- The Websocket authenticates using the stored room JWT
- Commands from UI interactions are sent via Websocket to the Web Service
- UI and player roster are communicated back via Websocket to the UI
- Websocket data from the Web Service is injected into the Redux store
- Rendering occurs
