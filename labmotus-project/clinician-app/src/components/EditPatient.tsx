import {FunctionComponent, useContext, useState} from "react";
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
    email: string;
    setEmail: any;
    phone: string;
    setPhone: any;
    birthday: Moment;
    setBirthday: any;
    setEditPatient: any;
    save: any;
}

export const EditPatient: FunctionComponent<EditPatientProps> = (props: EditPatientProps) => {
    const theme = useContext(getThemeContext());
    const [editName, setEditName] = useState(props.name);
    const [editEmail, setEditEmail] = useState(props.email);
    const [editPhone, setEditPhone] = useState(props.phone);
    const [editBirthday, setEditBirthday] = useState<Moment>(props.birthday);

    // Prevent any changes from automatically updating the DOM while editing
    function editPatient() {
        props.setName(editName);
        props.setEmail(editEmail);
        props.setBirthday(editBirthday);
        props.setPhone(editPhone);
        props.save();
    }

    return (
        <EditPatientDiv theme={theme}>
            <h1>Edit Patient</h1>
            <CenterWrapper>
                <IonInput
                    type="text"
                    clearInput={true}
                    value={editName}
                    onIonChange={(e) => setEditName(e.detail.value!)}
                />
                <IonInput
                    type="email"
                    clearInput={true}
                    value={editEmail}
                    onIonChange={(e) => setEditEmail(e.detail.value!)}
                />
                <IonInput
                    type="tel"
                    clearInput={true}
                    value={editPhone}
                    minlength={10}
                    maxlength={10}
                    onIonChange={(e) => setEditPhone(e.detail.value!)}
                />
                Birthday:
                <DateDisplay date={editBirthday} changeDay={setEditBirthday} displayFormat={"YYYY-MM-DD"}/>
                <div className="buttons">
                    <Button label="Edit Patient" onClick={editPatient} type="primary full"/>
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
  
  .birthday {
    text-align: center;
  }

  ion-input {
    text-align: center;
    margin: 10px 0;
    background-color: ${({theme}: { theme: Theme }) => theme.colors.light};
  }

  .buttons > * {
    margin-top: 10px;
  }
`;

export default EditPatient;
