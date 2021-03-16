import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import {DateDisplay} from "../../../common/ui/components/DateDisplay";
import {Moment} from "moment";

export interface EditPatientProps {
    name: string;
    setName: any;
    email: string;
    setEmail: any;
    phone: string;
    setPhone: any;
    birthday: Moment;
    setBirthday: any;
    save: any;
}

export const EditPatient: FunctionComponent<EditPatientProps> = (props: EditPatientProps) => {
    const theme = useContext(getThemeContext());

    return (
        <EditPatientDiv theme={theme}>
            <h1>Edit Patient</h1>
            <div className="main-padding">
                <IonInput
                    type="text"
                    clearInput={true}
                    value={props.name}
                    onIonChange={(e) => props.setName(e.detail.value!)}
                />
                <div>
                    <span>Birthday:</span>
                    <DateDisplay date={props.birthday} changeDay={props.setBirthday} displayFormat={"YYYY-MM-DD"}/>
                </div>
                <IonInput
                    type="email"
                    clearInput={true}
                    value={props.email}
                    onIonChange={(e) => props.setEmail(e.detail.value!)}
                />
                <IonInput
                    type="tel"
                    clearInput={true}
                    value={props.phone}
                    minlength={10}
                    maxlength={10}
                    onIonChange={(e) => props.setPhone(e.detail.value!)}
                />
                <button onClick={props.save} className="save-edit-button">
                    Edit Patient
                </button>
            </div>
        </EditPatientDiv>
    );
};

const EditPatientDiv = styled.div`
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

  .save-edit-button {
    width: 100%;
    font-size: 1em;
    padding: 14px;
    outline: none;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    color: white;
  }
`;

export default EditPatient;
