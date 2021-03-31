// @ts-ignore
// @ts-ignore
import * as THREE from "three"
import {Vector3} from "three"
import {Joints} from "../../../common/types/types";
import WrnchJoints from "./wrnchJoints";


export function processShoulderRFlexion(positions: Vector3[]): number {
    const shoulderLine: any = new Vector3().subVectors(positions[WrnchJoints.NECK], positions[WrnchJoints.RSHOULDER]);
    const hipLine: any = new Vector3().subVectors(positions[WrnchJoints.RHIP], positions[WrnchJoints.RSHOULDER]);
    const armLine: any = new Vector3().subVectors(positions[WrnchJoints.RELBOW], positions[WrnchJoints.RSHOULDER]);
    const correct = shoulderLine.dot(hipLine) / (shoulderLine.length() * hipLine.length());
    const reference = new Vector3().subVectors(hipLine, new Vector3().copy(shoulderLine).multiplyScalar(correct));
    return THREE.MathUtils.radToDeg(reference.angleTo(armLine))
}

export function processShoulderLFlexion(positions: Vector3[]): number {
    const shoulderLine: any = new Vector3().subVectors(positions[WrnchJoints.NECK], positions[WrnchJoints.LSHOULDER]);
    const hipLine: any = new Vector3().subVectors(positions[WrnchJoints.LHIP], positions[WrnchJoints.LSHOULDER]);
    const armLine: any = new Vector3().subVectors(positions[WrnchJoints.LELBOW], positions[WrnchJoints.LSHOULDER]);
    const correct = shoulderLine.dot(hipLine) / (shoulderLine.length() * hipLine.length());
    const reference = new Vector3().subVectors(hipLine, new Vector3().copy(shoulderLine).multiplyScalar(correct));
    return THREE.MathUtils.radToDeg(reference.angleTo(armLine))
}

export function processHipTrunkR(positions: Vector3[]): number {
    const hipLine: any = new Vector3().subVectors(positions[WrnchJoints.PELV], positions[WrnchJoints.RHIP]);
    const trunkLine: any = new Vector3().subVectors(positions[WrnchJoints.RSHOULDER], positions[WrnchJoints.RHIP]);
    const legLine: any = new Vector3().subVectors(positions[WrnchJoints.RKNEE], positions[WrnchJoints.RHIP]);
    const correctTrunk = trunkLine.dot(hipLine) / (trunkLine.length() * hipLine.length());
    const correctLeg = legLine.dot(hipLine) / (legLine.length() * hipLine.length());
    const correctedTrunkLine = new Vector3().subVectors(trunkLine, new Vector3().copy(hipLine).multiplyScalar(correctTrunk));
    const correctedLegLine = new Vector3().subVectors(legLine, new Vector3().copy(hipLine).multiplyScalar(correctLeg));
    return 180 - THREE.MathUtils.radToDeg(correctedTrunkLine.angleTo(correctedLegLine))
}

export function processHipTrunkL(positions: Vector3[]): number {
    const hipLine: any = new Vector3().subVectors(positions[WrnchJoints.PELV], positions[WrnchJoints.LHIP]);
    const trunkLine: any = new Vector3().subVectors(positions[WrnchJoints.LSHOULDER], positions[WrnchJoints.LHIP]);
    const legLine: any = new Vector3().subVectors(positions[WrnchJoints.LKNEE], positions[WrnchJoints.LHIP]);
    const correctTrunk = trunkLine.dot(hipLine) / (trunkLine.length() * hipLine.length());
    const correctLeg = legLine.dot(hipLine) / (legLine.length() * hipLine.length());
    const correctedTrunkLine = new Vector3().subVectors(trunkLine, new Vector3().copy(hipLine).multiplyScalar(correctTrunk));
    const correctedLegLine = new Vector3().subVectors(legLine, new Vector3().copy(hipLine).multiplyScalar(correctLeg));
    return THREE.MathUtils.radToDeg(correctedTrunkLine.angleTo(correctedLegLine))
}

export function processKneeLFlexion(positions: Vector3[]): number {
    const hipLine: any = new Vector3().subVectors(positions[WrnchJoints.LHIP], positions[WrnchJoints.LKNEE]);
    const shinLine: any = new Vector3().subVectors(positions[WrnchJoints.LANKLE], positions[WrnchJoints.LKNEE]);
    return THREE.MathUtils.radToDeg(hipLine.angleTo(shinLine))
}

export function processKneeRFlexion(positions: Vector3[]): number {
    const hipLine: any = new Vector3().subVectors(positions[WrnchJoints.RHIP], positions[WrnchJoints.RKNEE]);
    const shinLine: any = new Vector3().subVectors(positions[WrnchJoints.RANKLE], positions[WrnchJoints.RKNEE]);
    return THREE.MathUtils.radToDeg(hipLine.angleTo(shinLine))
}

export function processKneeLValgusVarus(positions: Vector3[]): number {
    const hipLine: any = new Vector3().subVectors(positions[WrnchJoints.LHIP], positions[WrnchJoints.PELV]);
    const legLine: any = new Vector3().subVectors(positions[WrnchJoints.LKNEE], positions[WrnchJoints.LHIP]);
    const refLine: any = new Vector3().subVectors(positions[WrnchJoints.LANKLE], positions[WrnchJoints.LHIP]);
    const valgDeg = THREE.MathUtils.radToDeg(legLine.angleTo(refLine));
    return Math.sign(legLine.sub(refLine).dot(hipLine)) * valgDeg;
}

export function processKneeRValgusVarus(positions: Vector3[]): number {
    const hipLine: any = new Vector3().subVectors(positions[WrnchJoints.RHIP], positions[WrnchJoints.PELV]);
    const legLine: any = new Vector3().subVectors(positions[WrnchJoints.RKNEE], positions[WrnchJoints.RHIP]);
    const refLine: any = new Vector3().subVectors(positions[WrnchJoints.RANKLE], positions[WrnchJoints.RHIP]);
    const valgDeg = THREE.MathUtils.radToDeg(legLine.angleTo(refLine));
    return Math.sign(legLine.sub(refLine).dot(hipLine)) * valgDeg;
}

export function processAnkleLDorsiflexion(positions: Vector3[]): number {
    const legLine: any = new Vector3().subVectors(positions[WrnchJoints.LKNEE], positions[WrnchJoints.LANKLE]);
    const refLine: any = new Vector3().subVectors(positions[WrnchJoints.LTOE], positions[WrnchJoints.LHEEL]);
    const flexDeg = 90 - THREE.MathUtils.radToDeg(legLine.angleTo(refLine));
    return Math.max(flexDeg, 0);
}

export function processAnkleLPlantarflexion(positions: Vector3[]): number {
    const legLine: any = new Vector3().subVectors(positions[WrnchJoints.LKNEE], positions[WrnchJoints.LANKLE]);
    const refLine: any = new Vector3().subVectors(positions[WrnchJoints.LTOE], positions[WrnchJoints.LHEEL]);
    const flexDeg = THREE.MathUtils.radToDeg(legLine.angleTo(refLine)) - 90;
    return Math.max(flexDeg, 0);
}

export function processAnkleRDorsiflexion(positions: Vector3[]): number {
    const legLine: any = new Vector3().subVectors(positions[WrnchJoints.RKNEE], positions[WrnchJoints.RANKLE]);
    const refLine: any = new Vector3().subVectors(positions[WrnchJoints.RTOE], positions[WrnchJoints.RHEEL]);
    const flexDeg = 90 - THREE.MathUtils.radToDeg(legLine.angleTo(refLine));
    return Math.max(flexDeg, 0);
}

export function processAnkleRPlantarflexion(positions: Vector3[]): number {
    const legLine: any = new Vector3().subVectors(positions[WrnchJoints.RKNEE], positions[WrnchJoints.RANKLE]);
    const refLine: any = new Vector3().subVectors(positions[WrnchJoints.RTOE], positions[WrnchJoints.RHEEL]);
    const flexDeg = THREE.MathUtils.radToDeg(legLine.angleTo(refLine)) - 90;
    return Math.max(flexDeg, 0);
}

export interface Joint {
    joint: string,
    movement: string,
    min: number,
    max: number,
    unit: string,
    minmax: 'min' | 'max',
    computer?: (positions: Vector3[]) => number
}

const JOINTS: { [key in Joints]?: Joint } = {
    [Joints.ShoulderR_Flexion]: {
        joint: "Shoulder Right",
        movement: "Flexion",
        min: 0,
        max: 180,
        unit: "\xb0",
        minmax: "max",
        computer: processShoulderRFlexion
    },
    [Joints.ShoulderL_Flexion]: {
        joint: "Shoulder Left",
        movement: "Flexion",
        min: 0,
        max: 180,
        unit: "\xb0",
        minmax: "max",
        computer: processShoulderLFlexion
    },
    [Joints.Hip_TrunkR]: {
        joint: "Hip",
        movement: "Trunk Right",
        min: 180,
        max: 0,
        unit: "\xb0",
        minmax: "min",
        computer: processHipTrunkR
    },
    [Joints.Hip_TrunkR]: {
        joint: "Hip",
        movement: "Trunk Left",
        min: 0,
        max: 180,
        unit: "\xb0",
        minmax: "min",
        computer: processHipTrunkL
    },
    [Joints.KneeL_Flexion]: {
        joint: "Knee Left",
        movement: "Flexion",
        min: 0,
        max: 180,
        unit: "\xb0",
        minmax: "max",
        computer: processKneeLFlexion
    },
    [Joints.KneeR_Flexion]: {
        joint: "Knee Right",
        movement: "Flexion",
        min: 0,
        max: 180,
        unit: "\xb0",
        minmax: "max",
        computer: processKneeRFlexion
    },
    [Joints.KneeL_ValgusVarus]: {
        joint: "Knee Left",
        movement: "Valgus/Varus (+/-)",
        min: 0,
        max: 180,
        unit: "\xb0",
        minmax: "max",
        computer: processKneeLValgusVarus
    },
    [Joints.KneeR_ValgusVarus]: {
        joint: "Knee Right",
        movement: "Valgus/Varus (+/-)",
        min: 0,
        max: 180,
        unit: "\xb0",
        minmax: "max",
        computer: processKneeRValgusVarus
    },
    [Joints.AnkleL_Dorsiflexion]: {
        joint: "Ankle Left",
        movement: "Dorsiflexion",
        min: 0,
        max: 90,
        unit: "\xb0",
        minmax: "max",
        computer: processAnkleLDorsiflexion
    },
    [Joints.AnkleL_Plantarflexion]: {
        joint: "Ankle Left",
        movement: "Plantarflexion",
        min: 0,
        max: 90,
        unit: "\xb0",
        minmax: "max",
        computer: processAnkleLPlantarflexion
    },
    [Joints.AnkleL_Dorsiflexion]: {
        joint: "Ankle Left",
        movement: "Dorsiflexion",
        min: 0,
        max: 90,
        unit: "\xb0",
        minmax: "max",
        computer: processAnkleRDorsiflexion
    },
    [Joints.AnkleL_Plantarflexion]: {
        joint: "Ankle Left",
        movement: "Plantarflexion",
        min: 0,
        max: 90,
        unit: "\xb0",
        minmax: "max",
        computer: processAnkleRPlantarflexion
    },
};
export default JOINTS
