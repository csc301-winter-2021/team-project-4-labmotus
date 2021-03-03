import {Moment} from "moment";

export interface Assessment {
    id: string
    patientId: string
    date: Moment
    videoUrl?: string
    poseData?: any // TODO: Create type for pose data
    stats?: Array<Stats>
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
    patientIDs?: Array<string> // UserIds
}

export interface Stats {
    name: string
    videoUrl?: string
    joint: string
    currValue: number
    goalValue: number
    minValue?: number
}

export interface Response<T> {
    success: boolean
    error?: string
    body?: T
}
