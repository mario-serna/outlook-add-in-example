import "office-ui-fabric-react/dist/css/fabric.min.css";
import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import * as React from "react";
import * as ReactDOM from "react-dom";
/* global AppContainer, Component, document, Office, module, require */

initializeIcons();

let isOfficeInitialized = false;
let mailItem = null;

const title = "Contoso Task Pane Add-in";

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component title={title} isOfficeInitialized={isOfficeInitialized} mailItem={mailItem} />
    </AppContainer>,
    document.getElementById("container")
  );
};

const itemChanged = (eventArgs) => {
  console.log(eventArgs)
  // Update UI based on the new current item
  UpdateTaskPaneUI(Office.context.mailbox.item);
}

// Example implementation
const UpdateTaskPaneUI = (item) => {
  // Assuming that item is always a read item (instead of a compose item).
  if (item != null) {
    console.log(item)
    mailItem = item;
    render(App);
  }
}

/* Render application after Office initializes */
Office.initialize = async () => {
  // Set up ItemChanged event
  Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, itemChanged);

  isOfficeInitialized = true;
  render(App);
};

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}
