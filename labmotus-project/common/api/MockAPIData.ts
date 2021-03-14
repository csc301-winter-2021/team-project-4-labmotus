import {Clinician, Patient} from "../types";
import moment from "moment";

export const FakeUser: Patient = {
    user: {
        id: "1",
        name: "John Smith"
    },
    birthday: moment(),
    clinicianID: "2",
    phone: "123-456-7890",
};
export const FakeClinician: Clinician = {
    user: {
        id: "2",
        name: "Alfonzo"
    },
    clinic: "UofTears",
    patientIDs: []
};

export const patientList: Patient[] = [
    FakeUser,
    {
        user: {
            id: "3",
            firebaseId: "three",
            name: "Joyce Ma"
        },
        phone: "6474758686",
        birthday: moment().set({'year': 1996, 'month': 5, 'day': 10}),
        clinicianID: "2"
    },
    {
        user: {
            id: "4",
            firebaseId: "four",
            name: "Max Sours"
        },
        phone: "6474558587",
        birthday: moment().set({'year': 1996, 'month': 4, 'day': 23}),
        clinicianID: "2"
    },
    {
        user: {
            id: "5",
            firebaseId: "five",
            name: "Ethan Zhu"
        },
        phone: "6471263956",
        birthday: moment().set({'year': 1996, 'month': 2, 'day': 2}),
        clinicianID: "2"
    }
]
