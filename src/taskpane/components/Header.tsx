import { IconButton } from 'office-ui-fabric-react';
import * as React from "react";

export interface HeaderProps {
  title: string;
  onChangeApp?: Function;
}

export default class Header extends React.Component<HeaderProps> {
  render() {
    const { title, onChangeApp } = this.props;

    return (
      <section className="ms-welcome__header ms-u-fadeIn500">
        <IconButton onClick={() => onChangeApp()} iconProps={{ iconName: "chromeBack" }} title="Cambiar App" />
        <h2 className="ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20" style={{ margin: "auto", paddingRight: "40px" }}>{title}</h2>
      </section>
    );
  }
}
