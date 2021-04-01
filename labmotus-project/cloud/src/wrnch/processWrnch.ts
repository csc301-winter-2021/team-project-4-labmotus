// import sampleData from "./json-assessment_0.json"
// @ts-ignore
// @ts-ignore
import {Vector3} from 'three';
import {Joints, PoseData, Stats} from "../../../common/types/types";
import JOINTS from "./processJoints";

export interface WrnchData {
    file_info: {
        duration: number,
        frame_rate: number,
        joint_definitions: {
            hands: string,
            head: string,
            pose2d: string,
            pose3d_ik: string,
            pose3d_raw: string
        }
    }
    frames: {
        frame_time: number,
        height: number,
        width: number,
        persons: {
            id: number,
            pose2d: {
                is_main: boolean,
            },
            pose_3d_raw: {
                positions: number[]
            }
        }[]
    }[]
}

function processRawWrnchData(data: WrnchData): PoseData {
    return data.frames.filter(frame => {
        const people = frame.persons.filter(person => person.pose2d.is_main);
        if (people.length === 0) return false;
        return people[0]?.pose_3d_raw != null
    }).map(frame => {
        const people = frame.persons.filter(person => person.pose2d.is_main);
        if (people.length === 0) return null;
        const raw = people[0].pose_3d_raw.positions;
        const processed: number[][] = [];
        for (let i = 0; i < raw.length; i += 3) {
            processed.push([raw[i], raw[i + 1], raw[i + 2]])
        }
        return {
            frame_time: frame.frame_time,
            positions: processed
        };
    });
}

function computeJoints(poseData: PoseData, joints: Joints[]): { joint: Joints, value: number }[] {
    const res = [];
    joints.forEach(joint => {
        const values = poseData
            .map(frame => JOINTS[joint].computer(frame.positions.map(p => new Vector3(p[0], p[1], p[2]))))
            .map(value => Number(value.toFixed(2)));
        const reducer = JOINTS[joint].minmax === 'max' ? Math.max : Math.min;
        res.push({
            joint,
            value: values.reduce((c, n) => n != null ? reducer(c, n) : c, values[0])
        });
    });
    return res;
}

function processWrnchData(data: WrnchData, joints: Joints[]): { poseData: PoseData, stats: Stats[] } {
    const poseData: PoseData = processRawWrnchData(data);
    const jointData = computeJoints(poseData, joints);
    return {
        poseData,
        stats: jointData.map(({joint, value}) => ({
            name: JOINTS[joint].movement,
            joint: JOINTS[joint].joint,
            currValue: value,
            goalValue: JOINTS[joint].max,
            unit: JOINTS[joint].unit,
            minValue: JOINTS[joint].min
        }))
    };
}

export default processWrnchData;
