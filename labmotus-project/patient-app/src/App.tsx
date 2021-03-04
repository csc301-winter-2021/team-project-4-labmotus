import React, {useState} from "react";
import {IonApp} from '@ionic/react';
// @ts-ignore
import styled from 'styled-components';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
import LoadingComponent from "./components/LoadingComponent";
import LoadingScreen from "./pages/LoadingScreen";
import config from "../config.json";
import API, {APIContext} from "./api/API";
import MockAPI from "./mock/MockAPI";
import Routes from "./routes/Routes";

const App: React.FC = () => {
    const [APIInstance, setAPIInstance] = useState<API>(null);

    async function loadAPI(): Promise<API> {
        const api = !config.mock ? new API() : new MockAPI();
        setAPIInstance(api);
        return api;
    }

    async function login([api]: [API]): Promise<void> {
        try {
            await api.cachedLogin();
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <IonApp>
            <APIContext.Provider value={APIInstance}>
                <RootDiv>
                    <LoadingComponent functors={[loadAPI, login]} dependencies={{1: [0]}}
                                      loadingScreen={() => <LoadingScreen/>}>
                        <Routes/>
                    </LoadingComponent>
                </RootDiv>
            </APIContext.Provider>
        </IonApp>
    );
};

const RootDiv = styled.div`
    width: 100%;
    height: 100%;
    .loading-div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
`;

export default App;
