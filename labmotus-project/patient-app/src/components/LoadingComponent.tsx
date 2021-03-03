import React, {FunctionComponent, ReactElement, useEffect, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {IonSpinner} from "@ionic/react";

export interface LoadingComponentProps {
    loadingScreen?: () => ReactElement;
    timeout?: number;
    functors?: (() => Promise<boolean>)[];
}

function timeoutFunctor(timeout: number) {
    return async function (): Promise<boolean> {
        return new Promise<boolean>(resolve => setTimeout(() => resolve(true), timeout));
    }
}

const LoadingComponent: FunctionComponent<LoadingComponentProps> = ({
                                                                        loadingScreen,
                                                                        functors = [],
                                                                        timeout = 1500,
                                                                        children
                                                                    }) => {
    if (timeout > 0) {
        functors.push(timeoutFunctor(timeout))
    }
    const [loadedItems, setLoadedItems] = useState(functors.map(() => false));
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (!loaded && !loadedItems.every(value => value !== false)) {
            let new_loaded = undefined;
            for (let i = 0; i < loadedItems.length; i++) {
                if (loadedItems[i] === false) {
                    if (new_loaded === undefined)
                        new_loaded = [...loadedItems];
                    new_loaded[i] = undefined;
                    functors[i]().then(value => {
                        setLoadedItems(prevLoaded => {
                            const n = [...prevLoaded];
                            n[i] = value;
                            return n;
                        })
                    });
                }
            }
            if (new_loaded !== undefined)
                setLoadedItems(new_loaded);
        }
    });

    if (!loaded) {
        return <LoadingDiv className="loading-div" loaded={loadedItems.every(value => value === true)}
                           onTransitionEnd={() => setLoaded(loadedItems.every(value => value === true))}>
            {loadingScreen !== undefined ? loadingScreen() : <IonSpinner/>}
        </LoadingDiv>;
    } else {
        return <LoadingDiv className="loading-div">
            {children}
        </LoadingDiv>;
    }
};

interface LoadingProps {
    loaded: boolean;
}

const LoadingDiv = styled.div`
    display: flex;
    transition: opacity 0.3s;
    opacity: ${({loaded}: LoadingProps) => loaded ? "0" : "1"};
    align-items: center;
    justify-content: center;
`;

export default LoadingComponent;
