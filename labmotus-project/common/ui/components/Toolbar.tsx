import {FunctionComponent, useContext} from "react";
import {
    IonButtons,
    IonIcon,
    IonTitle,
    IonToolbar
} from "@ionic/react";
// @ts-ignore
import styled from 'styled-components';
import {getThemeContext, Theme} from "../theme/Theme";
import {chevronBack} from "ionicons/icons";


export interface ToolbarProps {
    onBackClick?: () => void;
    onSaveClick?: () => void;
    title?: string;
}

// For 
const Toolbar: FunctionComponent<ToolbarProps> = ({onBackClick, onSaveClick, title}) => {

    const theme = useContext(getThemeContext());

    function generateBackButton() {
        if (onBackClick) {
            return (
                <IonButtons slot="start" onClick={onBackClick}>
                    <IonIcon icon={chevronBack}/>
                    Back
                </IonButtons>
            )    
        }
        return;
    }
    function generateSaveButton() {
        if (onSaveClick) {
            return (
                <IonButtons slot="start" onClick={onSaveClick}>
                    Save
                </IonButtons>
            )    
        }
        return;
    }
    function generateTitle() {
        if (title) {
            return (<IonTitle >{title}</IonTitle>)
        }
    }
    return (
        <ToolbarStyle theme={theme}>
            {generateBackButton()}
            {generateSaveButton()}
            {generateTitle()}
        </ToolbarStyle>
    )
};

const ToolbarStyle = styled(IonToolbar)`
  ion-buttons {
    color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    cursor: pointer;

    ion-icon {
      height: 25px;
      width: 25px;
    }
  }
`;

export default Toolbar;

