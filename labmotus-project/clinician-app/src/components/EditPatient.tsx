import {FunctionComponent, useContext, useState} from "react";
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
            <div className="main-padding">
                <IonInput
                    type="text"
                    clearInput={true}
                    value={editName}
                    onIonChange={(e) => setEditName(e.detail.value!)}
                />
                <div>
                    <span>Birthday:</span>
                    <DateDisplay date={editBirthday} changeDay={setEditBirthday} displayFormat={"YYYY-MM-DD"}/>
                </div>
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
                <button onClick={editPatient} className="edit-patient button">
                    Edit Patient
                </button>
                <button onClick={() => props.setEditPatient(false)} className="cancel button">
                    Cancel
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

  .button {
    margin-bottom: 10px;
    width: 100%;
    font-size: 1em;
    padding: 14px;
    outline: none;
  }

  .edit-patient {
    background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    color: white;
  }
`;

export default EditPatient;
