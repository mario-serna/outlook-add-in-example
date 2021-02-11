import { ButtonType, Dropdown, IDropdownOption, mergeStyles, PrimaryButton, ResponsiveMode, Shimmer } from 'office-ui-fabric-react';
import * as React from "react";
import { AppData, FRIDA_Intent } from './interfaces';
import TextFieldList from './TextFieldList';

interface ActionProps {
    mailData: any;
    appData?: AppData;
}

interface ActionState {
    appData: FRIDA_Intent[];
    process: FRIDA_Intent;
    intentProcess: FRIDA_Intent;
    loading: boolean;
    options: IDropdownOption[];
}

const wrapperClass = mergeStyles({
    width: '100%',
    padding: 2,
    selectors: {
        '& > .ms-Shimmer-container': {
            margin: '10px 0',
        },
    },
});

export default class Action extends React.Component<ActionProps, ActionState> {

    constructor(props: ActionProps) {
        super(props);

        let appData = Object.entries(this.props.appData.FRIDA.Processes).map(([key, value]) => ({
            ID: key,
            ...value
        }));

        appData.push({ ID: "None", Name: "None" });

        const options = appData.map((item) => (
            {
                key: `${item.ID}`,
                text: item.Name
            }
        ));

        console.log(options)

        this.state = {
            appData,
            options,
            process: { ID: "None", Name: "None" },
            intentProcess: { ID: "None", Name: "None" },
            loading: true
        };
    }

    componentDidMount = async () => {
        const entities = await this.getEntities();
        /*{
            entities: [
                { type: "Origen", entity: "text" },
                { type: "Destino", entity: "text" },
                { type: "FechaSalida", entity: "text" },
                { type: "FechaRegreso", entity: "text" },
                { type: "Pasajero", entity: "text" }
            ], topScoringIntent: { intent: "flight_ticket" }
        }*/
        // console.table(entities.entities);

        let intent = "None";
        if (entities) {
            intent = entities.topScoringIntent.intent;
        }

        console.log(intent)

        const resp = await this.getProcess(intent);

        if (resp) {
            if (entities.entities) {
                resp.Variables.forEach(element => {
                    const item = entities.entities.find((item) => item.type === element.ID);
                    element.Value = item ? item.entity : "";
                    if (['email', 'mail', 'correo'].includes(element.ID.toLowerCase())) {
                        element.Value = this.props.mailData.user.emailAddress;
                    }

                });
            }
            const resp2 = JSON.parse(JSON.stringify(resp));
            console.log(resp);
            setTimeout(() => {
                this.setState({ process: resp, intentProcess: resp2, loading: false });

            }, 1500);
        } else {
            this.setState({ loading: false });
        }
    }

    getEntities = async (): Promise<any> => {
        const { LuisAPIKey, LuisAppId, LuisEndpointURL } = this.props.appData;
        const { body } = this.props.mailData;

        console.log("Aquí no funciona",this.props.mailData)

        const url = `${LuisEndpointURL}/luis/v2.0/apps/${LuisAppId}`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': `${LuisAPIKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const entities = await resp.json();

        console.log(entities)
        return entities;
    }

    getProcess = (pID: any): Promise<FRIDA_Intent> => {
        console.log(pID);
        const res = this.state.appData.find((item) => item.ID === pID);
        console.log(res)
        return new Promise(resolve => {
            setTimeout(() => {

                resolve(res)
            }, 0);
        })
    }

    handleDropdownchange = async (_e: any, option: IDropdownOption) => {
        const process = await this.getProcess(option.key);
        if (process.ID !== "None") {

            process.Variables.forEach(element => {
                element.Value = "";
            });
            if (process.ID === this.state.intentProcess.ID) {
                this.setState({ process: this.state.intentProcess });
            } else {
                this.setState({ process: process });
            }
        } else {
            this.setState({ process: process });

        }

        console.log(process, this.state.intentProcess)
    }

    handlerInputChange = (e: any) => {
        this.state.process.Variables[e.target.name].Value = e.target.value;
        console.log(this.state.process.Variables[e.target.name]);
        this.setState({ process: this.state.process });
    }

    handleOnSubmit = (_e: any) => {
        // e.preventDefault();
        console.log(this.state.process);
    }

    render() {

        return (
            this.state.loading ?
                (
                    <main className="ms-welcome__main">
                        <h2 className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20">Analizando...</h2>
                        <div className={wrapperClass}>
                            <Shimmer />
                            <Shimmer width="75%" />
                            <Shimmer width="50%" />
                        </div>
                    </main>
                )
                :
                (
                    <main className="ms-welcome__main">
                        <Dropdown
                            placeholder="Select an option"
                            label="Acción"
                            options={this.state.options}
                            selectedKey={this.state.process.ID}
                            responsiveMode={ResponsiveMode.large}
                            onChange={this.handleDropdownchange}
                        />

                        {
                            this.state.process.ID === "" || this.state.process.ID === "None" ?
                                (<h4>Seleccione una opción disponible</h4>)
                                :
                                this.state.process.Variables &&
                                <>
                                    <TextFieldList Entities={this.state.process.Variables} onChangeValue={this.handlerInputChange} />
                                    <PrimaryButton
                                        className="ms-welcome__action"
                                        buttonType={ButtonType.hero}
                                        iconProps={{ iconName: "ChevronRight" }}
                                        onClick={this.handleOnSubmit}
                                    >
                                        Ejecutar
                                </PrimaryButton>
                                </>
                        }
                    </main>

                )
        );
    }
}