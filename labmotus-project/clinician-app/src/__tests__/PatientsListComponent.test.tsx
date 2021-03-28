import * as React from "react";
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor} from "@testing-library/react";
import {PatientListComponent} from "../components/PatientsListComponent";
import {Patient} from "../../../common/types";
import moment from "moment";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useParams: () => ({}),
    useRouteMatch: () => ({}),
}));

test("Test Patient Lists", async () => {
    const patients: Patient[] = [
        {user: {id: '1', name: "patient-1"}, clinicianID: "", phone: "phone-1", birthday: moment()},
        {user: {id: '2', name: "patient-2"}, clinicianID: "", phone: "phone-2", birthday: moment()},
    ];


    render(<PatientListComponent patientList={patients}/>);

    await waitFor(() => expect(screen.getAllByTestId("patient-listing")[0]).toBeInTheDocument());
    const names = screen.getAllByTestId('patient-name').map(e => e.textContent);
    const phones = screen.getAllByTestId('patient-phone').map(e => e.textContent);
    expect(patients.every(value => names.includes(value.user.name)));
    expect(patients.every(value => phones.includes(value.phone)));
});
