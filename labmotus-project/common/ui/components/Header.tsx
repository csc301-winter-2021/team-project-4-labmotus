import React, {FunctionComponent, useContext} from "react";
import {IonHeader, IonButtons, IonIcon, IonTitle, IonToolbar} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../theme/Theme";
import {chevronBack} from "ionicons/icons";
import {useHistory} from "react-router";

export interface HeaderProps {
    onBackClick?: any;
    onSaveClick?: () => void;
    title?: string;
}

const Header: FunctionComponent<HeaderProps> = ({onBackClick, onSaveClick, title}) => {
    const theme = useContext(getThemeContext());
    const history = useHistory();

    function back() {
        history.goBack();
    }

    function generateBackButton() {
        if (onBackClick) {
            return (
                <IonButtons slot="start" onClick={back}>
                    <IonIcon icon={chevronBack}/>
                    Back
                </IonButtons>
            );
        }
        return;
    }

    function generateSaveButton() {
        if (onSaveClick) {
            return (
                <IonButtons slot="end" onClick={onSaveClick}>
                    Save
                </IonButtons>
            );
        }
        return;
    }

    function generateTitle() {
        if (title) {
            return <IonTitle>{title}</IonTitle>;
        }
    }

    return (
        <IonHeader>
            <ToolbarStyle theme={theme}>
                {generateBackButton()}
                {generateSaveButton()}
                {generateTitle()}
            </ToolbarStyle>
        </IonHeader>
    );
};

const ToolbarStyle = styled(IonToolbar)`
  ion-buttons {
    color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
    cursor: pointer;

    ion-icon {
      height: 25px;
      width: 25px;
    }
  }
`;

export default Header;
