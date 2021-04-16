import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import Button from "../../../common/ui/components/Button";
import CenterWrapper from "../../../common/ui/components/CenterWrapper";

export interface EditEmailProps {
    email: string;
    setEmail: any;
    setEditEmail: any;
    currPassword: string;
    setCurrPassword: any;
    save: any;
}

export const EditEmail: FunctionComponent<EditEmailProps> = (props: EditEmailProps) => {
    
    const theme = useContext(getThemeContext());

    return (
        <EditEmailDiv theme={theme}>
            <h1>Edit Email</h1>
            <CenterWrapper>
                <IonInput
                    type="email"
                    clearInput={true}
                    value={props.email}
                    onIonChange={(e) => props.setEmail(e.detail.value!)}
                />
                <IonInput
                    type="password"
                    placeholder="Current Password"
                    value={props.currPassword}
                    onIonChange={(e) => props.setCurrPassword(e.detail.value!)}
                />
                <div className="buttons">
                    <Button label="Edit Email" onClick={props.save} type="primary full"/>
                    <Button label="Cancel" onClick={() => props.setEditEmail(false)} type="full"/>
                </div>
            </CenterWrapper>
        </EditEmailDiv>
    );
};

const EditEmailDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 5%;

  ion-input {
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
    --padding-start: 10px;
  }

  .buttons > * {
    margin-top: 10px;
  }
`;

export default EditEmail;
