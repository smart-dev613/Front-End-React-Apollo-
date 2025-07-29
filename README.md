# events-frontend
### Running locally
To run the frontend locally:


1. Install required packages with `npm i`
2. Run the server with `npm start`

### Auth flow
When you are on a valid event page on your locally-ran events frontend, you should see the text **"You must login or signup to access this event."**. Clicking one of the buttons on this page redirects you through LBI to login, but this won't work correctly locally.

Instead, do this:

1. Login to https://my-dev.synkd.life with valid credentials
2. Open Chrome's developer tools with `CTRL + SHIFT + I`, then go to the Application tab
3. On the left panel, under Storage click Cookies, then the my-dev.synkd.life domain
4. Find the cookie named `FenixToken`, then copy the "Value" field of it
5. Switch back to your events frontend running locally, open dev tools again, and then go to the Console tab
6. Enter `document.cookie = "FenixToken=<PASTE HERE>;"` and then press enter

Repeat the steps above from 2-6 but with the `CurrentCompany` cookie instead of `FenixToken`. After that, you should be able to use your account on the local events platform.
