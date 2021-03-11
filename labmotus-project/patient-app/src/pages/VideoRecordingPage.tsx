import React, {FunctionComponent, useContext, useEffect, useState} from "react";
// @ts-ignore
import styled from 'styled-components';
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import '@teamhive/capacitor-video-recorder';
import {VideoRecorderCamera, VideoRecorderPreviewFrame} from '@teamhive/capacitor-video-recorder';
import {Plugins} from "@capacitor/core";
import {IonIcon} from "@ionic/react";
// @ts-ignore
import {sync} from "ionicons/icons";
import {useHistory, useParams} from "react-router";
import API, { getAPIContext } from "../api/API";

export interface VideoRecordingPageProps {
}

const {VideoRecorder} = Plugins;

const config: VideoRecorderPreviewFrame = {
    id: 'video-record',
    stackPosition: 'back', // 'front' overlays your app', 'back' places behind your app.
    width: 'fill',
    height: 'fill',
    x: 0,
    y: 0,
    borderRadius: 0
};

const VideoRecordingPage: FunctionComponent<VideoRecordingPageProps> = ({}) => {
    const theme = useContext(getThemeContext());
    const UseAPI: API = useContext(getAPIContext());
    const [recording, setRecording] = useState(null);
    const [camera, setCamera] = useState(0);
    const {id} = useParams<{ id: string }>();
    const history = useHistory();

    useEffect(() => {
        VideoRecorder.initialize({
            camera: camera % 2 === 0 ? VideoRecorderCamera.FRONT : VideoRecorderCamera.BACK,
            previewFrames: [config]
        });
        return () => {
            VideoRecorder.destroy();
        }
    }, [camera]);

    useEffect(() => {
        if (recording === true) {
            VideoRecorder.startRecording();
        } else if (recording === false) {
            VideoRecorder.stopRecording().then(({videoUrl}: { videoUrl: string }) => {
                UseAPI.uploadVideo(id, videoUrl);
                history.goBack();
            });
        }
    }, [recording]);

    return (<VideoRecordingDiv className="video-recording" recording={recording} theme={theme}>
        <Controls>
            <RecordButton onClick={() => setRecording(!recording)}>
                <RecordBackground theme={theme}>
                    <RecordImage/>
                </RecordBackground>
                <RecordCenter recording={recording} theme={theme}>
                    <RecordCenterImage/>
                </RecordCenter>
            </RecordButton>
            <ChangeDiv>
                <ChangeButton camera={camera} theme={theme} onClick={() => setCamera(camera + 1)}>
                    <ChangeBackground theme={theme}>
                        <ChangeImage/>
                        <IonIcon icon={sync}/>
                    </ChangeBackground>
                </ChangeButton>
            </ChangeDiv>
        </Controls>
    </VideoRecordingDiv>)
};

const VideoRecordingDiv = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    border-style: solid;
    border: ${({recording, theme}: { recording: boolean, theme: Theme }) => "solid " + theme.colors.alert + (recording ? " 5px" : " 0px")};
    transition: border-width 0.3s;
`;

const Controls = styled.div`
    width: 100%;
    height: 20%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
`;

const RecordButton = styled.div`
    cursor: pointer;
`;

const RecordImage = styled.img`
    height: 100%;
    aspect-ratio: 1;
    opacity: 0;
`;

const RecordBackground = styled.div`
    margin: auto;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    width: fit-content;
    height: 50%;
    border-radius: 100%;
    background: ${({theme}: { theme: Theme }) => {
    return theme.colors.light
}};
`;

const RecordCenterImage = styled.img`
    height: 100%;
    aspect-ratio: 1;
    opacity: 0;
`;

const RecordCenter = styled.div`
    margin: auto;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    width: fit-content;
    height: ${({recording}: { recording: boolean }) => recording ? "15%" : "45%"};
    border-radius: ${({recording}: { recording: boolean }) => recording ? "20%" : "100%"};
    transition: height 0.3s, border-radius 0.3s;
    background: ${({theme}: { theme: Theme }) => theme.colors.alert};
`;

const ChangeDiv = styled.div`
    position: absolute;
    top: 0; left: 50%; bottom: 0; right: 0;
    pointer-events: none;
`;

const ChangeButton = styled.div`
    cursor: pointer;
    overflow: hidden;
    pointer-events: auto;
    ion-icon {
        margin: auto;
        position: absolute;
        top: 0; left: 0; bottom: 0; right: 0;
        width: 55%;
        height: 55%;
        color: ${({theme}: { theme: Theme }) => theme.colors.light};
        transform: rotate(${({camera}: { camera: number }) => camera * 180}deg);
        transition: transform 0.3s;
    }
`;

const ChangeImage = styled.img`
    height: 100%;
    aspect-ratio: 1;
    opacity: 0;
`;

const ChangeBackground = styled.div`
    margin: auto;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    height: 35%;
    border-radius: 100%;
    -webkit-background-clip: padding-box;
    overflow: hidden;
    padding: 1px;
    width: fit-content;
    background: ${({theme}: { theme: Theme }) => theme.colors.mediumShade};
`;

export default VideoRecordingPage
