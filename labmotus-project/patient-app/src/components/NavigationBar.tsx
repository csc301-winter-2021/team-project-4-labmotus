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
            const here = location.pathname.startsWith(value.navigation);
            return (
                <ButtonDiv key={index} onClick={() => history.push(value.navigation)}>
                    <IconDiv here={here} theme={theme}>
                        <IonIcon icon={value.icon}/>
                    </IconDiv>
                    <LabelDiv here={here} theme={theme}>
                        {value.name}
                    </LabelDiv>
                </ButtonDiv>
            )
        })
    }

    return (<NavigationBarDiv className="navigation-bar"
                              inNav={!entries.every((e: NavigationEntry) => !location.pathname.startsWith(e.navigation))}>
        {generateButtons()}
    </NavigationBarDiv>)
};

const NavigationBarDiv = styled.div`
    display: ${({inNav}: { inNav: boolean }) => inNav ? 'unset' : 'none !important'};
    padding: 1%;
    width: 100%;
    display: flex;
    flex-direction: row;
    z-index: 1;
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
        color: ${({theme, here}: { theme: Theme, here: boolean }) => here ? theme.colors.primary : theme.colors.mediumShade};
    }
`;

const LabelDiv = styled.div`
    font-size: ${({theme}: { theme: Theme }) => theme.secondaryFontSize};
    font-family: ${({theme}: { theme: Theme }) => theme.secondaryFontFamily};
    color: ${({theme, here}: { theme: Theme, here: boolean }) => here ? theme.colors.primary : theme.colors.mediumShade};
    text-align: center;
`;

export default NavigationBar;
