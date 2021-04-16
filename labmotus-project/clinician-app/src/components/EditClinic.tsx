import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import Button from "../../../common/ui/components/Button";
import CenterWrapper from "../../../common/ui/components/CenterWrapper";

export interface EditClinicProps {
    clinic: string;
    setClinic: any;
    setEditClinic: any;
    save: any;
}

export const EditClinic: FunctionComponent<EditClinicProps> = (props: EditClinicProps) => {
    const theme = useContext(getThemeContext());

    return (
        <EditClinicDiv theme={theme}>
            <h1>Edit Clinic</h1>
            <CenterWrapper>
                <IonInput
                    type="text"
                    clearInput={true}
                    value={props.clinic}
                    onIonChange={(e) => props.setClinic(e.detail.value!)}
                />
                <div className="buttons">
                    <Button label="Edit Clinic Name" onClick={props.save} type="primary full"/>
                    <Button label="Cancel" onClick={() => props.setEditClinic(false)} type="full"/>
                </div>
            </CenterWrapper>
        </EditClinicDiv>
    );
};

const EditClinicDiv = styled.div`
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

export default EditClinic;
