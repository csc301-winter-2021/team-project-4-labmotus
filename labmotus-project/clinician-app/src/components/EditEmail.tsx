import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";

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
                <button onClick={props.save} className="save-edit button">
                    Edit Email
                </button>
                <button onClick={() => props.setEditEmail(false)} className="cancel button">
                    Cancel
                </button>
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

  .button {
    margin-bottom: 10px;
    width: 100%;
    font-size: 1em;
    padding: 14px;
    outline: none;
  }

  .save-edit {
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    color: white;
  }
`;

export default EditEmail;
