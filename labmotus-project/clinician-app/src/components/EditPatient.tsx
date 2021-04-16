import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import Button from "../../../common/ui/components/Button";
import {DateDisplay} from "../../../common/ui/components/DateDisplay";
import {Moment} from "moment";
import CenterWrapper from "../../../common/ui/components/CenterWrapper";

export interface EditPatientProps {
    name: string;
    setName: any;
    phone: string;
    setPhone: any;
    birthday: Moment;
    setBirthday: any;
    setEditPatient: any;
    save: any;
}

export const EditPatient: FunctionComponent<EditPatientProps> = (props: EditPatientProps) => {
    const theme = useContext(getThemeContext());

    return (
        <EditPatientDiv theme={theme}>
            <h1>Edit Patient</h1>
            <CenterWrapper>
                <IonInput
                    type="text"
                    clearInput={true}
                    value={props.name}
                    onIonChange={(e) => props.setName(e.detail.value!)}
                />
                <IonInput
                    type="tel"
                    clearInput={true}
                    value={props.phone}
                    minlength={10}
                    maxlength={10}
                    onIonChange={(e) => props.setPhone(e.detail.value!)}
                />
                Birthday:
                <DateDisplay date={props.birthday} changeDay={props.setBirthday} displayFormat={"YYYY-MM-DD"}/>
                <div className="buttons">
                    <Button label="Edit Patient" onClick={props.save} type="primary full"/>
                    <Button label="Cancel" onClick={() => props.setEditPatient(false)} type="full"/>
                </div>
            </CenterWrapper>
        </EditPatientDiv>
    );
};

const EditPatientDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 5%;
  text-align: center;

  ion-input {
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
    --padding-start: 20px;
  }

  .buttons > * {
    margin-top: 10px;
  }
`;

export default EditPatient;
