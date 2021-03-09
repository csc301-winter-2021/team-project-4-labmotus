import {Moment} from "moment";

export interface Assessment {
    id: string
    patientId: string
    name: string
    date: Moment
    state: AssessmentState
    videoUrl?: string
    wrnchJob?: string
    poseData?: any // TODO: Create type for pose data
    stats?: Stats[]
}

export enum AssessmentState {
    "COMPLETE",
    "PENDING",
    "MISSING"
}

export interface User {
    id: string
    firebaseId?: string
    username: string
    name: string
    email?: string
}

export interface Patient {
    user: User
    patientCode?: string
    clinicianID: string;
    phone: string
    birthday: Moment
}

export interface Clinician {
    user: User
    clinic: string
    patientIDs?: string[] // UserIds
}

export interface Stats {
    name: string
    joint: string
    currValue: number
    goalValue: number
    unit: string;
    minValue?: number
}

export interface Response<T> {
    success: boolean
    error?: string
    body?: T
}
