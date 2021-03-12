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
import '../../common/ui/theme/variables.css';
import LoadingComponent from "../src/components/LoadingComponent";
import LoadingScreen from "../src/pages/LoadingScreen";
import MockAPI from "./api/MockAPI";
import Routes from "./routes/Routes";
import {BrowserRouter as Router} from "react-router-dom";

import config from "../config.json";
import firebaseConfig from "../firebase.json"
import API, {getAPIContext} from "./api/API";

const App: React.FC = () => {
    const [APIInstance, setAPIInstance] = useState<API>(null);
    const APIContext: React.Context<API> = getAPIContext()

    async function loadAPI(): Promise<API> {
        if (!APIInstance) {
            const api = !config.mock ? new API(firebaseConfig, config) : new MockAPI(config);
            setAPIInstance(api);
            return api;
        }
        return APIInstance;
    }

    return (
        <IonApp>
            <APIContext.Provider value={APIInstance}>
                <RootDiv>
                    <LoadingComponent functors={[loadAPI]}
                                      loadingScreen={() => <LoadingScreen />} timeout={1500}>
                        <Router>
                            <Routes/>
                        </Router>
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
