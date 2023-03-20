# Post Message Example

This is an example of using `window.postMessage` for secure communication between origins using a popup.

**NOTE: This is not meant to be used in production and has several bad practices, this is only a POC.**

## Setup

```bash
# clone this repo
git clone git@github.com:verbanicm/post-message-example.git && cd post-message-example

# install nodejs deps
npm install

# start both WEBAPP and TOKEN servers
npm start
```

Output:

```bash
[0] WEBAPP app listening on port 3000
[1] TOKEN app listening on port 4000
```

## Testing

- Navigate to http://localhost:3000 and click the `Request Access` button to show the Token popup.
- In the Token popup, click the `Submit` button to send back a token response to the opener.
- The developer console should show the token response and the HTML should show a success message `Token response successful!`.
