import React from "react";
import { IonAvatar } from "@ionic/react";

export interface ProfilePicProps {
  imageLink: string
}

export const ProfilePictureComponent: React.FC<ProfilePicProps> = (props: ProfilePicProps) => {
  return (
    <IonAvatar>
      <img src={props.imageLink} />
    </IonAvatar>
  )
}