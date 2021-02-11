import { getFocusStyle, getTheme, List, mergeStyleSets, normalize } from 'office-ui-fabric-react';
import * as React from "react";
import { AppItem } from './interfaces';

export interface MyAppsProps {
    apps: AppItem[];
    onSelectApp?: Function;
}

export interface MyAppsState {
    selectedApp: string;
}

const theme = getTheme();
const { palette, semanticColors, fonts } = theme;
const styles = mergeStyleSets({
    container: [
        {
            width: "100%"
        }
    ],
    itemCell: [
        getFocusStyle(theme, { inset: -1 }),
        {
            minHeight: 54,
            padding: 10,
            boxSizing: 'border-box',
            borderBottom: `1px solid ${semanticColors.bodyDivider}`,
            display: 'flex',
            selectors: {
                '&:hover': {
                    background: palette.neutralLighter,
                    cursor: "pointer"
                },
                '&:active': {
                    background: palette.neutralLight,
                }
            },
        },
    ],
    itemContent: [
        fonts.large,
        normalize,
        {
            position: 'relative',
            boxSizing: 'border-box',
            display: 'block',
            borderLeft: '3px solid ' + theme.palette.themePrimary,
            paddingLeft: 27,
        },
    ],
});

export default class MyApps extends React.Component<MyAppsProps, MyAppsState> {

    constructor(props: MyAppsProps) {
        super(props);

        this.state = {
            selectedApp: ""
        }
    }

    handleOnClick = (id: string) => {
        this.setState({ selectedApp: id });
        console.log(id)
    }

    onRenderCell = (item: AppItem, _index: number): JSX.Element => {
        return (
            <div onClick={() => this.props.onSelectApp(item)} className={styles.itemCell} data-is-focusable>
                <div className={styles.itemContent}>
                    {item.Name}
                </div>
            </div>
        );
    };

    render() {
        const { apps } = this.props;

        return (
            apps.length > 0 ?
                <section className="ms-welcome__main ms-u-fadeIn500">
                    <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary">Apps</h1>
                    <h3 className="ms-fontWeight-light ms-fontColor-neutralPrimary">Selecione una aplicación para analizar el correo</h3>
                    <List className={styles.container} items={apps} onRenderCell={this.onRenderCell} />
                </section>

                :
                <section className="ms-welcome__main ms-u-fadeIn500">
                    <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary">Apps</h1>
                    <h2 className="ms-fontWeight-light ms-fontColor-neutralPrimary">No cuenta con aplicaciones registradas</h2>
                </section>
        );
    }
}
