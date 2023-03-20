class Helper {
  popupRef;
  popupUrl;
  popupName;

  constructor({ url, name }) {
    // assign a name to this popup window, the JVS will send this value back in the response as an additional 
    // security measure that this calling application should validate
    this.popupName = name;
    this.popupUrl = new URL(url);

    // tells the JVS which mode to use, currently the UI supports a popup mode only
    this.popupUrl.searchParams.set("mode", encodeURIComponent("popup"));

    // tells the JVS which origin should receive the response, for non local development this value should 
    // exist in the ALLOWLIST for the JVS UI instance you are running
    this.popupUrl.searchParams.set(
      "origin",
      encodeURIComponent(window.location.origin)
    );
  }

  // receiveMessage validates the validity of the popup response origin and returns the token
  #receiveMessage = (event) => {
    // only trust the origin we opened
    console.log(`${event.origin} == ${this.popupUrl.origin}`)
    if (event.origin !== this.popupUrl.origin) {
      throw new Error("invalid popup origin");
    }

    // parse the response data
    const data = JSON.parse(event.data);

    // only trust valid source variable
    if (data.source !== this.popupName) {
      throw new Error("invalid popup source");
    }

    return data.payload
  };

  // requestToken checks for a existing listeners and handles the response from the JVS UI
  requestToken = () => {
    return new Promise((resolve, reject) => {
      //remove existing event listener
      window.removeEventListener(
        "message",
        (event) => {
          try {
            resolve(this.#receiveMessage(event));
          } catch (err) {
            reject(err);
          }
        },
        false
      );

      // popup never created or was closed
      if (!this.popupRef || this.popupRef.closed) {
        this.popupRef = window.open(
          this.popupUrl.toString(),
          this.popupName,
          "popup=true,width=500,height=600"
        );
      }
      // popup exists, show it
      else {
        this.popupRef.focus();
      }

      // listen for response
      window.addEventListener(
        "message",
        (event) => {
          try {
            resolve(this.#receiveMessage(event));
          } catch (err) {
            reject(err);
          }
        },
        false
      );
    });
  };
}
