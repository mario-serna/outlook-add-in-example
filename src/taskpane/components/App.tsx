import * as React from "react";
import { Button, ButtonType } from "office-ui-fabric-react";
// import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Progress from "./Progress";
// images references in the manifest
import "../../../assets/icon-16.png";
import "../../../assets/icon-32.png";
import "../../../assets/icon-80.png";
/* global Button, Header, HeroList, HeroListItem, Progress */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: []
    };
  }

  async componentDidMount() {
    try {
      const items = await this.getData();
      console.log(items);
      const body = items.body.slice(0, 50);
      console.log(body)
      this.setState({
        listItems: [
          {
            icon: "ChatBot",
            title: "Subject",
            primaryText: items.subject
          },
          {
            icon: "ChatBot",
            title: "From",
            primaryText: items.from.emailAddress
          },
          {
            icon: "ChatBot",
            title: "to",
            primaryText: items.to.map(to => `${to.displayName} (${to.emailAddress})`).join(", ")
          },
          {
            icon: "ChatBot",
            title: "Body",
            primaryText: body
          }
        ]
      });

    } catch (error) {
      console.log(error);
    }
  }

  click = async () => {
    /**
     * Insert your Outlook code here
     */

  };

  getData = async () => {
    const item = Office.context.mailbox.item;
    const body = await this.getBody();

    return {
      body: body,
      subject: item.subject,
      to: item.to,
      from: item.from
    }
  };

  getBody = (): Promise<any> => {
    console.log("Getting body...");
    return new Promise((resolve) => {
      Office.context.mailbox.item.body.getAsync(Office.CoercionType.Text, (asyncRes) => {
        if (asyncRes.status === Office.AsyncResultStatus.Succeeded) {
          const formatedBody = asyncRes.value.replace(/[\n\r]+/g, " ");
          resolve(formatedBody);
        } else {
          resolve("Problem reading body");
        }
      });
    });
  }



  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <div className="ms-welcome">
        <HeroList message="Email" items={this.state.listItems}>
          <Button
            className="ms-welcome__action"
            buttonType={ButtonType.hero}
            iconProps={{ iconName: "ChevronRight" }}
            onClick={this.click}
          >
            Run
          </Button>
        </HeroList>
      </div>
    );
  }
}
