import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import SymptomLogPage, {SymptomLogPageProps} from "../../pages/SymptomLogPage";
// @ts-ignore
import styled from 'styled-components';
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import MockAPI from "../../../../patient-app/src/api/MockAPI";
import API from '../../../../patient-app/src/api/API';

import config from "../../../../patient-app/config.json"
import {Moment} from 'moment';
import {getAPIContext} from "../../../api/BaseAPI";

export default {
    title: 'Pages/Symptom Log Page',
    component: SymptomLogPage,
} as Meta;

const UseAPI: API = new MockAPI(config);
const APIContext: React.Context<API> = getAPIContext()
const Template: Story<SymptomLogPageProps> = (args) =>
    <APIContext.Provider value={UseAPI}>
        <RootDiv ref={(ref: any) => {
            if (ref?.parentNode) {
                ref.parentNode.style.width = "100%";
                ref.parentNode.style.height = "100%";
            }
        }}>
            <SymptomLogPage {...args} getAssessments={(week: Moment) => {
                return UseAPI.getCurrUsersAssessments(week)
            }}/>
        </RootDiv>
    </APIContext.Provider>;

const RootDiv = styled.div`
    width: 100%;
    height: 100%;
`;

export const Default = Template.bind({});
Default.args = {};
