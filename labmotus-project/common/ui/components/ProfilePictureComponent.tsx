// @ts-ignore
import { FunctionComponent } from "react";
import {IonAvatar} from "@ionic/react";

export interface ProfilePicProps {
    imageLink: string
}

export const ProfilePictureComponent: FunctionComponent<ProfilePicProps> = (props: ProfilePicProps) => {
    return (
        <IonAvatar>
            <img src={props.imageLink} alt="Profile Picture"/>
        </IonAvatar>
    )
};
