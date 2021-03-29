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
    joints: Joints[]
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
    name: string
    email?: string
}

export interface Patient {
    user: User
    patientCode?: string
    clinicianID: string
    phone: string
    birthday: Moment
    incomplete?: boolean
}

export interface Clinician {
    user: User
    clinic: string
    patientIDs: string[] // UserIds
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

export interface SignUpParams {
    oobCode: string
    email: string
}

export enum Joints {
    ShoulderL_Flexion,
    ShoulderL_Extension,
    ShoulderL_Abduction,
    ShoulderL_MedialRotation,
    ShoulderL_LateralRotation,
    ShoulderR_Flexion,
    ShoulderR_Extension,
    ShoulderR_Abduction,
    ShoulderR_MedialRotation,
    ShoulderR_LateralRotation,
    Elbow_Flexion,
    Elbow_Extension,
    Wrist_Extension,
    Wrist_Flexion,
    Wrist_RadialDeviation,
    Wrist_UlnarDeviation,
    ThumbCMC_Abduction,
    ThumbCMC_Flexion,
    ThumbCMC_Extension,
    ThumbCMC_Opposition,
    ThumbCMP_Flexion,
    ThumbIP_Flexion,
    DigitsMCP_FLexion,
    PIP_Flexion,
    DIP_Flexion,
    DIP_Hyperextension,
    Hip_FLexion,
    Hip_Extension,
    Hip_Abduction,
    Hip_Adduction,
    Hip_LateralRotation,
    Hip_MedialRotation,
    Hip_TrunkL,
    Hip_TrunkR,
    KneeL_Flexion,
    KneeL_ValgusVarus,
    KneeR_Flexion,
    KneeR_ValgusVarus,
    AnkleL_Dorsiflexion,
    AnkleL_Plantarflexion,
    AnkleR_Dorsiflexion,
    AnkleR_Plantarflexion,
    AnkleFoot_Inversion,
    AnkleFoot_Eversion
}
