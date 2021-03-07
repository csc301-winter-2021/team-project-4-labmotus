import React, {FunctionComponent, ReactElement, useEffect, useRef, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {IonSpinner} from "@ionic/react";

export interface LoadingComponentProps {
    loadingScreen?: () => ReactElement;
    timeout?: number;
    functors?: ((dep?: any[]) => Promise<any>)[];
    dependencies?: { [key: number]: number[] };
}

function timeoutFunctor(timeout: number) {
    return async (): Promise<boolean> => {
        return new Promise<boolean>(resolve => setTimeout(() => resolve(true), timeout));
    }
}

const LoadingComponent: FunctionComponent<LoadingComponentProps> = ({
                                                                        loadingScreen,
                                                                        functors = [],
                                                                        timeout = 1500,
                                                                        dependencies = {},
                                                                        children
                                                                    }) => {
    const [loadedItems, setLoadedItems] = useState(functors.map(() => false));
    const loadedResult = useRef<any[]>(functors.map(() => null));
    const [loaded, setLoaded] = useState(false);
    const timeoutRef = useRef(timeout);
    const functorsRef = useRef([...functors]);
    useEffect(() => {
        if (timeoutRef.current > 0) {
            functorsRef.current.push(timeoutFunctor(timeoutRef.current));
            setLoadedItems([...loadedItems, false]);
            loadedResult.current.push(null);
            timeoutRef.current = -1;
        } else if (!loaded && !loadedItems.every(value => value !== false)) {
            let newLoaded;
            for (let i = 0; i < loadedItems.length; i++) {
                if (loadedItems[i] === false && (!dependencies.hasOwnProperty(i) || dependencies[i].every(v => loadedItems[v] === true))) {
                    if (newLoaded === undefined)
                        newLoaded = [...loadedItems];
                    newLoaded[i] = undefined;
                    const params = dependencies.hasOwnProperty(i) ? dependencies[i].map(v => loadedResult.current[v]) : [];
                    functorsRef.current[i](params).then((value) => {
                        setLoadedItems(prevLoaded => {
                            const n = [...prevLoaded];
                            n[i] = true;
                            return n;
                        });
                        loadedResult.current[i] = value;
                    }, (value) => {
                        setLoadedItems(prevLoaded => {
                            const n = [...prevLoaded];
                            n[i] = false;
                            return n;
                        });
                        loadedResult.current[i] = value;
                    });
                }
            }
            if (newLoaded !== undefined)
                setLoadedItems(newLoaded);
        }
    });

    useEffect(() => {
        if (loadedItems.every(value => value === true))
            setLoaded(true);
    }, [loadedItems]);
    //
    // useEffect(() => {
    //     console.log(loaded)
    // }, [loadedItems]);

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
