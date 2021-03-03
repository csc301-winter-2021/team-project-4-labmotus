import React, {FunctionComponent} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, ThemeContext} from "../theme/Theme";
import {useHistory, useLocation} from "react-router";
import {IonIcon} from "@ionic/react";

export interface NavigationEntry {
    icon: string;
    name: string;
    navigation: string;
}

export interface NavigationBarProps {
    entries: NavigationEntry[]
}

const NavigationBar: FunctionComponent<NavigationBarProps> = ({entries}) => {
    const theme = React.useContext(ThemeContext);
    const location = useLocation();
    const history = useHistory();

    function generateButtons() {
        return entries.map((value, index) => {
            const here = location.pathname === value.navigation;
            return (
                <ButtonDiv key={index} onClick={() => history.push(value.navigation)}>
                    <IconDiv here={here} {...theme}>
                        <IonIcon icon={value.icon}/>
                    </IconDiv>
                    <LabelDiv here={here} {...theme}>
                        {value.name}
                    </LabelDiv>
                </ButtonDiv>
            )
        })
    }

    return (<NavigationBarDiv className="navigation-bar">
        {generateButtons()}
    </NavigationBarDiv>)
};

const NavigationBarDiv = styled.div`
    padding: 1%;
    width: 100%;
    display: flex;
    flex-direction: row;
    position: absolute;
    bottom: 0;
`;

const ButtonDiv = styled.div`
    flex: 1;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    cursor: pointer;
`;

const IconDiv = styled.div`
    align-items: center;
    justify-content: center;
    ion-icon {
        color: ${(props: Theme & { here: boolean }) => props.here ? props.colors.primary : props.colors.mediumShade};
    }
`;

const LabelDiv = styled.div`
    font-size: ${(props: Theme) => props.secondaryFontSize};
    font-family: ${(props: Theme) => props.secondaryFontFamily};
    color: ${(props: Theme & { here: boolean }) => props.here ? props.colors.primary : props.colors.mediumShade};
    text-align: center;
`;

export default NavigationBar;
