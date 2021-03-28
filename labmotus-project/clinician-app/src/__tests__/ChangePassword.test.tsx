import * as React from "react";
import '@testing-library/jest-dom/extend-expect';
import {ionFireEvent as fireEvent} from '@ionic/react-test-utils';
import {render, screen, waitFor} from "@testing-library/react";
import ChangePassword from "../components/ChangePassword";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useParams: () => ({}),
    useRouteMatch: () => ({}),
}));

test("Controlled Values", async () => {
    let currPassword = "a";
    const setCurrPassword = (password: string) => currPassword = password;
    let newPassword = "b";
    const setNewPassword = (password: string) => newPassword = password;
    let confirmPassword = "c";
    const setConfirmPassword = (password: string) => confirmPassword = password;
    let changed = false;
    const setChangePassword = () => changed = true;
    let saved = false;
    const save = () => saved = true;
    render(<ChangePassword currPassword={currPassword}
                           setCurrPassword={setCurrPassword}
                           newPassword={newPassword}
                           setNewPassword={setNewPassword}
                           confirmPassword={confirmPassword}
                           setConfirmPassword={setConfirmPassword}
                           setChangePassword={setChangePassword}
                           save={save}
    />);

    await waitFor(() => expect(screen.getByTestId("ChangePasswordComponent")).toBeInTheDocument());
    expect(screen.getByTestId("current-password").getAttribute("value")).toBe(currPassword);
    expect(screen.getByTestId("new-password").getAttribute("value")).toBe(newPassword);
    expect(screen.getByTestId("confirm-password").getAttribute("value")).toBe(confirmPassword);
});

test("Modify Values", async () => {
    let currPassword = "a";
    const setCurrPassword = (password: string) => currPassword = password;
    let newPassword = "b";
    const setNewPassword = (password: string) => newPassword = password;
    let confirmPassword = "c";
    const setConfirmPassword = (password: string) => confirmPassword = password;
    let changed = false;
    const setChangePassword = () => changed = true;
    let saved = false;
    const save = () => saved = true;
    render(<ChangePassword currPassword={currPassword}
                           setCurrPassword={setCurrPassword}
                           newPassword={newPassword}
                           setNewPassword={setNewPassword}
                           confirmPassword={confirmPassword}
                           setConfirmPassword={setConfirmPassword}
                           setChangePassword={setChangePassword}
                           save={save}
    />);

    await waitFor(() => expect(screen.getByTestId("ChangePasswordComponent")).toBeInTheDocument());
    const currPasswordComp = screen.getByTestId("current-password");
    const newPasswordComp = screen.getByTestId("new-password");
    const confirmPasswordComp = screen.getByTestId("confirm-password");
    fireEvent.ionChange(currPasswordComp, 'current-password');
    fireEvent.ionChange(newPasswordComp, 'new-password');
    fireEvent.ionChange(confirmPasswordComp, 'confirm-password');
    expect(screen.getByTestId("current-password").getAttribute("value") !== currPassword).toBeTruthy();
    expect(screen.getByTestId("new-password").getAttribute("value") !== newPassword).toBeTruthy();
    expect(screen.getByTestId("confirm-password").getAttribute("value") !== confirmPassword).toBeTruthy();
});

test("Test Buttons", async () => {
    let currPassword = "a";
    const setCurrPassword = (password: string) => currPassword = password;
    let newPassword = "b";
    const setNewPassword = (password: string) => newPassword = password;
    let confirmPassword = "c";
    const setConfirmPassword = (password: string) => confirmPassword = password;
    let changed = false;
    const setChangePassword = () => changed = true;
    let saved = false;
    const save = () => saved = true;
    render(<ChangePassword currPassword={currPassword}
                           setCurrPassword={setCurrPassword}
                           newPassword={newPassword}
                           setNewPassword={setNewPassword}
                           confirmPassword={confirmPassword}
                           setConfirmPassword={setConfirmPassword}
                           setChangePassword={setChangePassword}
                           save={save}
    />);

    await waitFor(() => expect(screen.getByTestId("ChangePasswordComponent")).toBeInTheDocument());
    const changePassword = screen.getByTestId("change-password");
    const cancel = screen.getByTestId("cancel");
    fireEvent.click(changePassword);
    fireEvent.click(cancel);
    expect(changed).toBeTruthy();
    expect(saved).toBeTruthy();
});
