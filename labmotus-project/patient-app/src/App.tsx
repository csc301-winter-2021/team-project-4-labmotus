import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import {IonApp} from '@ionic/react';
import Home from './pages/Home';
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

const App: React.FC = () => {
    let APIInstance = null;

    async function loadAPI(): Promise<boolean> {
        if (!config.mock) {
            APIInstance = new API();
        } else {
            APIInstance = new MockAPI();
        }
        return true;
    }

    return (
        <IonApp>
            <APIContext.Provider value={APIInstance}>
                <RootDiv>
                    <LoadingComponent functors={[loadAPI]} loadingScreen={() => <LoadingScreen/>}>
                        <Router>
                            <Switch>
                                <Route exact path="/home" render={() =>
                                    <Home/>
                                }/>
                                <Redirect from="/" to="/home"/>
                            </Switch>
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
    }
`;

export default App;
