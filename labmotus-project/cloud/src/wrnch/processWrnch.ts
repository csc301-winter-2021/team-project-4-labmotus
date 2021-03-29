// @ts-nocheck
// import sampleData from "./json-assessment_0.json"
// @ts-ignore
// @ts-ignore
import * as THREE from 'three';
import {Vector3} from 'three';
import {Assessment, Joints} from "../../../common/types/types";
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

function processRawWrnchData(data: WrnchData) {
    const positions: Vector3[][] = data.frames.filter(frame => {
        const people = frame.persons.filter(person => person.pose2d.is_main);
        if (people.length === 0) return false;
        return people[0]?.pose_3d_raw != null
    }).map(frame => {
        const people = frame.persons.filter(person => person.pose2d.is_main);
        if (people.length === 0) return null;
        const raw = people[0].pose_3d_raw.positions;
        const processed: Vector3[] = [];
        for (let i = 0; i < raw.length; i += 3) {
            processed.push(new Vector3(raw[i], raw[i + 1], raw[i + 2]))
        }
        return processed;
    });
    return positions
}

function computeJoints(positions: Vector3[][], joints: Joints[]) {
    const res = {};
    joints.forEach(joint => {
        const reducer = JOINTS[joint].minmax === 'max' ? Math.max : Math.min;
        res[joint] = positions.map(position => JOINTS[joint].computer(position)).reduce(
            (c, n) => n != null ? reducer(c, n) : c,
            JOINTS[joint].min);
    });
    return res;
}

function processWrenchData(data: WrnchData, assessment: Assessment) {
    const positions: Vector3[][] = processRawWrnchData(data);
    const jointData = computeJoints(positions, assessment.joints);
    assessment.stats = Object.values(jointData).map((joint) => ({
        name: JOINTS[joint].movement,
        joint: JOINTS[joint].joint,
        currValue: jointData[joint],
        goalValue: JOINTS[joint].max,
        unit: JOINTS[joint].unit,
        minValue: JOINTS[joint].min
    }))
}

export default processWrenchData;

function main() {
    console.log("Processing...");
    const positions = null; // processRawWrnchData(sampleData);

    let camera: any;
    let scene: any;
    let renderer: any;
    let geometry: any;
    let material: any;
    let material2: any;

    function animation(time: any) {
        const frame = Math.floor(time / 33) % positions.length;
        meshes.forEach((mesh, i) => {
            if (positions[frame] != null) {
                mesh.position.copy(positions[frame][i]);
                mesh.position.y *= -1;
            }
        });
        // console.log(pj.processHipTrunkR(positions[frame]));
        // outmesh.position.copy(pj.processHipTrunkR(positions[frame]));
        // outmesh.position.y *= -1;
        renderer.render(scene, camera);
    }

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.SphereGeometry(0.025, 32, 32);
    material = new THREE.MeshMatcapMaterial({color: "#ff0000"});
    material2 = new THREE.MeshMatcapMaterial({color: "#00ff00"});

    const meshes = positions[0].map(_ => new THREE.Mesh(geometry, material));
    meshes.forEach(mesh => scene.add(mesh));
    const outmesh = new THREE.Mesh(geometry, material2);
    scene.add(outmesh);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
    renderer.setAnimationLoop(animation);
    // renderer.render( scene, camera );
    document.body.appendChild(renderer.domElement);
}

export default main;
