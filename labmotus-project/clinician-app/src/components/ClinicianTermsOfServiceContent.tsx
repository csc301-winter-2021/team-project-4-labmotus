import { FunctionComponent } from "react";

export interface TermsOfServiceComponentProps {}

export const ClinicianTermsOfServiceContent: FunctionComponent<TermsOfServiceComponentProps> = () => {
    return(
        <div className="main-padding">
            <h1>LabMotus Clinician Portal: Terms of Service</h1>
            <p>Sample test under header. Actual Terms of Service will be written in a future version!</p>
        </div>
    )
}