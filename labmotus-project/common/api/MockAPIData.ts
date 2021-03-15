import {Clinician, Patient} from "../types";
import moment from "moment";

export const FakeUser: Patient = {
    user: {
        id: "1",
        name: "John Smith",
        email: "johnsmith@gmail.com"
    },
    birthday: moment(),
    clinicianID: "2",
    phone: "123-456-7890",
};

export const FakeClinician: Clinician = {
    user: {
        id: "2",
        name: "Alfonzo Bonzo",
        email: "alfonzo@uoftears.com"
    },
    clinic: "UofTears",
    patientIDs: ["1", "3", "4", "5"]
};

export const patientList: Patient[] = [
    FakeUser,
    {
        user: {
            id: "3",
            firebaseId: "three",
            name: "Joyce Ma",
            email: "joyce@ma.com"
        },
        phone: "647-475-8686",
        birthday: moment().set({'year': 1996, 'month': 5, 'day': 10}),
        clinicianID: "2"
    },
    {
        user: {
            id: "4",
            firebaseId: "four",
            name: "Max Sours",
            email: "max@sours.com"
        },
        phone: "647-455-8587",
        birthday: moment().set({'year': 1996, 'month': 4, 'day': 23}),
        clinicianID: "2"
    },
    {
        user: {
            id: "5",
            firebaseId: "five",
            name: "Ethan Zhu",
            email: "ethan@zhu.com"
        },
        phone: "647-126-3956",
        birthday: moment().set({'year': 1996, 'month': 2, 'day': 2}),
        clinicianID: "2"
    }
]
