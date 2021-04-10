import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import Button from "../../../common/ui/components/Button";

export interface EditEmailProps {
    email: string;
    setEmail: any;
    setEditEmail: any;
    save: any;
}

export const EditEmail: FunctionComponent<EditEmailProps> = (props: EditEmailProps) => {
    const theme = useContext(getThemeContext());


    return (
        <EditEmailDiv theme={theme}>
            <h1>Edit Email</h1>
            <div className="main-padding">
                <IonInput
                    type="email"
                    clearInput={true}
                    value={props.email}
                    onIonChange={(e) => props.setEmail(e.detail.value!)}
                />
                <Button label="Edit Email" onClick={props.save} type="primary"/>
                <Button label="Cancel" onClick={props.setEditEmail(false)}/>
            </div>
        </EditEmailDiv>
    );
};

const EditEmailDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 5%;

  .main-padding {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding: 5%;
    box-sizing: border-box;
  }

  ion-input {
    text-align: center;
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }
`;

export default EditEmail;
