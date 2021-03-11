import { FunctionComponent } from "react";

export interface TermsOfServiceComponentProps {}

export const PatientTermsOfServiceContent: FunctionComponent<TermsOfServiceComponentProps> = () => {
    return(
        <div className="main-padding">
            <h1>Sample Header</h1>
            <p>Sample test under header. Actual Terms of Service will be written in a future version!</p>
        </div>
    )
}