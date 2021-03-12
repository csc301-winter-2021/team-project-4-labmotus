import {Clinician, Patient} from "../types";
import moment from "moment";

export const FakeUser: Patient = {
    user: {
        id: "1",
        name: "John Smith",
        username: "john"
    },
    birthday: moment(),
    clinicianID: "2",
    phone: "123-456-7890",
};
export const FakeClinician: Clinician = {
    user: {
        id: "2",
        name: "Alfonzo",
        username: "alfonzo_poggers"
    },
    clinic: "UofTears",
    patientIDs: []
};