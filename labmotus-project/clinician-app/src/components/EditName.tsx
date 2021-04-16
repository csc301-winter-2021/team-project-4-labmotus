import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";

import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import Button from "../../../common/ui/components/Button";
import CenterWrapper from "../../../common/ui/components/CenterWrapper";

export interface EditNameProps {
    name: string;
    setName: any;
    setEditName: any;
    save: any;
}

export const EditName: FunctionComponent<EditNameProps> = (props: EditNameProps) => {
    const theme = useContext(getThemeContext());

    return (
        <EditNameDiv theme={theme}>
            <h1>Edit Name</h1>
            <CenterWrapper>
                <IonInput
                    type="text"
                    clearInput={true}
                    value={props.name}
                    onIonChange={(e) => props.setName(e.detail.value!)}
                />
                <div className="buttons">
                    <Button label="Edit Name" onClick={props.save} type="primary full"/>
                    <Button label="Cancel" onClick={() => props.setEditName(false)} type="full"/>
                </div>
            </CenterWrapper>
        </EditNameDiv>
    );
};

const EditNameDiv = styled.div`
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

export default EditName;
