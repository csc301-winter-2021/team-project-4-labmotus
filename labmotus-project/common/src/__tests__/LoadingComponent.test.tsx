import * as React from "react";
import {act, render, screen, waitFor} from '@testing-library/react';
import LoadingComponent from "../../ui/components/LoadingComponent";
import '@testing-library/jest-dom/extend-expect';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useParams: () => ({}),
    useRouteMatch: () => ({}),
}));

test("Empty Load", async () => {
    render(<LoadingComponent timeout={0}>
        Loaded
    </LoadingComponent>);

    await waitFor(() => expect(screen.getByTestId("LoadingComponent")).toBeInTheDocument());
    expect(screen.getByText("Loaded")).toBeInTheDocument();
});

test("Delayed Load", async () => {
    render(<LoadingComponent timeout={1500}>
        Loaded
    </LoadingComponent>);

    await waitFor(() => expect(screen.getByTestId("LoadingComponent")).toBeInTheDocument());
    expect(screen.queryByText("Loaded")).toBeNull();
    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(screen.getByText("Loaded")).toBeInTheDocument();
});

test("Multiple Loads", async () => {

    const timeouts = [];
    const results = [];

    for (let i = 0; i < 10; i++) {
        results.push(null);
        timeouts.push(async (): Promise<boolean> => {
            return new Promise<boolean>(resolve => setTimeout(() => act(() => {
                results[i] = "Success";
                resolve(true);
            }), i * 250));
        })
    }

    render(<LoadingComponent timeout={0} functors={timeouts}>
        Loaded
    </LoadingComponent>);

    await waitFor(() => expect(screen.getByTestId("LoadingComponent")).toBeInTheDocument());
    expect(screen.queryByText("Loaded")).toBeNull();
    await new Promise(resolve => setTimeout(resolve, 3000));
    expect(screen.getByText("Loaded")).toBeInTheDocument();
    expect(results.every(value => value === "Success")).toBeTruthy();
});

test("Multiple Dependencies", async () => {

    const timeouts = [];
    const results = [0, 1];
    const dependencies = {};

    for (let i = 0; i < 10; i++) {
        results.push(null);
        if (i > 0) dependencies[i] = [i - 1];
        timeouts.push(async (): Promise<boolean> => {
            return new Promise<boolean>(resolve => act(() => {
                results[i + 2] = results[i] + results[i + 1];
                resolve(true);
            }));
        })
    }

    render(<LoadingComponent timeout={0} functors={timeouts} dependencies={dependencies}>
        Loaded
    </LoadingComponent>);

    await waitFor(() => expect(screen.getByText("Loaded")).toBeInTheDocument());
    expect(results[11] === 89).toBeTruthy();
});
