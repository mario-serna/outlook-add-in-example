import * as React from "react";
import { mergeStyleSets } from "office-ui-fabric-react";
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
// import Header from "./Header";
import Progress from "./Progress";
import Action from './Action';
// images references in the manifest
import "../../../assets/icon-16.png";
import "../../../assets/icon-32.png";
import "../../../assets/icon-80.png";
import { getAccess, getApp, userExist } from '../firebase/firebase';
import MyApps from './MyApps';
import Header from './Header';
import { AppData, AppItem } from './interfaces';
/* global Button, Header, HeroList, HeroListItem, Progress */

interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
  mailItem: any;
}

interface AppState {
  selectedApp: AppItem | null;
  appData?: AppData;
  loadingApps: boolean;
  readingMail: boolean;
  mailData: any;
  apps: AppItem[]
}



const classNames = mergeStyleSets({
  wrapperClass: {
    width: '100%',
    padding: 2,
    selectors: {
      '& > .ms-Shimmer-container': {
        margin: '10px 0',
      },
    }
  }
});

/*const apiResponse: FRIDA_Intents = {
  "None": {
    Name: "None"
  },
  "flight_ticket": {
    Name: "Compra boleto",
    Variables: [
      { ID: 1, Name: "Origen", Type: "text" },
      { ID: 2, Name: "Destino", Type: "text" },
      { ID: 3, Name: "FechaSalida", Type: "date" },
      { ID: 4, Name: "FechaRegreso", Type: "date" },
      { ID: 5, Name: "Pasajero", Type: "email" }
    ]
  },
  "book_room": {
    Name: "Reservar cuarto",
    Variables: [
      { ID: 1, Name: "Lugar", Type: "text" },
      { ID: 2, Name: "FechaInicio", Type: "date" },
      { ID: 3, Name: "FechaFin", Type: "date" },
      { ID: 4, Name: "Cliente", Type: "email" }
    ]
  }
};*/

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      selectedApp: null,
      loadingApps: true,
      readingMail: true,
      mailData: {},
      apps: []
    };
  }

  async componentDidMount() {
    console.log("accessing...")
    await getAccess();
    await this.update();
  }

  shouldComponentUpdate(nextProps: AppProps) {
    const resp = this.props.mailItem !== nextProps.mailItem;

    if (resp) {
      this.toggle();
      this.update();
    }

    return true;
  }

  update = async () => {
    try {
      // console.log(Office.context.mailbox.userProfile)

      let email = btoa(Office.context.mailbox.userProfile.emailAddress);

      this.setState({ loadingApps: true });

      let userData = await userExist(email);

      if (userData) {
        console.log(userData)
        if (userData.Apps.length === 1) {
          await this.onSelectApp(userData.Apps[0]);
        }
        this.setState({ apps: userData.Apps });
      } else {
        console.log("Not exist")
      }

      let mailData = await this.getMailData();
      console.log(mailData);
      
      mailData.body = mailData.body.slice(0, 100);
      this.setState({ mailData: mailData });
      
      this.setState({
        readingMail: false
      });
      this.setState({ loadingApps: false });
      
    } catch (error) {
      console.log(error);
    }
  }

  click = async () => {
    /**
     * Insert your Outlook code here
     */

  };

  onSelectApp = async (item: AppItem) => {
    const data: AppData = await getApp(item.ID);
    this.setState({ selectedApp: item, appData: data });

  }

  onChangeApp = () => {
    this.setState({ selectedApp: null });
  }

  toggle = async () => {
    this.setState({
      readingMail: !this.state.readingMail
    });
    console.log(this.state)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(e)
  }

  getMailData = async () => {
    const item = Office.context.mailbox.item;
    const body = await this.getBody();

    return {
      body: body,
      subject: item.subject,
      to: item.to,
      from: item.from,
      user: Office.context.mailbox.userProfile
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
        {this.state.readingMail && this.state.loadingApps ?
          (
            <main className="ms-welcome__main">
              <h2 className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20">Cargando...</h2>
              <div className={classNames.wrapperClass}>
                <Shimmer />
                <Shimmer width="75%" />
                <Shimmer width="50%" />
              </div>
            </main>
          )
          :
          (
            <>
              { !this.state.selectedApp ?
                <MyApps apps={this.state.apps} onSelectApp={this.onSelectApp} />
                :
                <>
                  <Header onChangeApp={this.onChangeApp} title={this.state.selectedApp.Name} />
                  <Action mailData={this.state.mailData} appData={this.state.appData} />
                </>
              }
            </>
          )
        }
      </div>
    );
  }
}
