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
    const [loaded, setLoaded] = useState(functors.map(() => false));
    useEffect(() => {
        if (!loaded.every(value => value !== false)) {
            let new_loaded = undefined;
            for (let i = 0; i < loaded.length; i++) {
                if (loaded[i] === false) {
                    if (new_loaded === undefined)
                        new_loaded = [...loaded];
                    new_loaded[i] = undefined;
                    functors[i]().then(value => {
                        setLoaded(prevLoaded => {
                            const n = [...prevLoaded];
                            n[i] = value;
                            return n;
                        })
                    });
                }
            }
            if (new_loaded !== undefined)
                setLoaded(new_loaded);
        }
    });

    if (!loaded.every(value => value === true)) {
        return <LoadingDiv className="loading-div">
            {loadingScreen !== undefined ? loadingScreen() : <IonSpinner/>}
        </LoadingDiv>;
    } else {
        return <LoadingDiv className="loading-div">
            {children}
        </LoadingDiv>;
    }
};

const LoadingDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default LoadingComponent;
