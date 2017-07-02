import * as THREE from "three";
const OrbitControls = require('three-orbit-controls')(THREE)
const content = document.querySelector("#content");
const preview = document.querySelector("#preview");
const ratio = content.clientWidth / content.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, ratio, 0.1, 1000);
camera.position.set(50, 40, 120);
camera.lookAt(new THREE.Vector3(0 , 0, 0));

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
const controls = new OrbitControls( camera, renderer.domElement );

let mouse = null;
const raycaster = new THREE.Raycaster();

const light = new THREE.DirectionalLight(new THREE.Color("rgb(255, 255, 255)"));
light.position.set(0, 5, 5);
light.castShadow = true;


function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    if (mouse === null) {
        mouse = new THREE.Vector2();
    }
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
window.addEventListener( 'mousemove', onMouseMove, false );

function drawCoordinates(targetScene) {
    const dist = 5;
    const length = 20;
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    for (let key = 0; key < 5; key++) {

        const step = dist * key;

        const xLinePositive = new THREE.Geometry();
        const xLineNegative = new THREE.Geometry();
        const zLinePositive = new THREE.Geometry();
        const zLineNegative = new THREE.Geometry();

        xLinePositive.vertices.push(new THREE.Vector3(step, 0, -(length)));
        xLinePositive.vertices.push(new THREE.Vector3(step, 0, length));
        xLineNegative.vertices.push(new THREE.Vector3(step * -1, 0, -(length)));
        xLineNegative.vertices.push(new THREE.Vector3(step * -1, 0, length));

        zLinePositive.vertices.push(new THREE.Vector3(length, 0, step));
        zLinePositive.vertices.push(new THREE.Vector3(-(length), 0, step));
        zLineNegative.vertices.push(new THREE.Vector3(length, 0, step * -1));
        zLineNegative.vertices.push(new THREE.Vector3(-(length), 0, step * -1));

        targetScene.add(new THREE.Line(xLinePositive, lineMaterial ));
        targetScene.add(new THREE.Line(xLineNegative, lineMaterial ));
        targetScene.add(new THREE.Line(zLinePositive, lineMaterial ));
        targetScene.add(new THREE.Line(zLineNegative, lineMaterial ));

    }
}

function drawAxis(targetScene) {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const xAxis = new THREE.Geometry();
    const zAxis = new THREE.Geometry();
    xAxis.vertices.push(
        new THREE.Vector3(20, 0, 0),
        new THREE.Vector3(-20, 0, 0)
    );
    zAxis.vertices.push(
        new THREE.Vector3(0, 0, 20),
        new THREE.Vector3(0, 0, -20)
    );
    targetScene.add(new THREE.Line(xAxis, lineMaterial ));
    targetScene.add(new THREE.Line(zAxis, lineMaterial ));
}

function createCabinet(x, z, color, name) {
    const material = new THREE.MeshPhongMaterial({color: color? color : 0xcccccc});
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(5, 5,  5), material);
    cabinet.position.set((x*5) + 2.5, 2.5, (z*5) + 2.5);
    cabinet._info = {
        color: color? color : 0xcccccc,
        name: name
    };
    return cabinet;
}

let previousHover = [];
function handleHoverObject(intersects) {
    // console.log(previousHover, intersects);
    previousHover.forEach((item) => {
        if (item.object._info) {
            // const color = item.object._info.color;
            // item.object.material.color.set(color);
            item.object.material.opacity = 1;
            // item.object.material.wireframe = false;
        }
    });
    [intersects].forEach((item) => {
        // item.object.material.color.set(0xffffff);
        if (item.object._info) {
            item.object.material.opacity = 0.1;
            // item.object.material.wireframe = true;
        }
    });
    previousHover = [intersects];
}
drawCoordinates(scene);
// drawAxis(scene);

camera.add(light);

scene.add(
    camera,
    createCabinet(-4, -4, 0x00ff00, "Cabinet 1"),
    createCabinet(-4, -2 , null, "Cabinet 2"),
    createCabinet(-4, 0 , 0x00ff00, "Cabinet 3"),
    createCabinet(-4, 2, null, "Cabinet 4"),
    createCabinet(-2, -4 , 0x00ff00, "Cabinet 5"),
    createCabinet(-2, -2 , 0x00ff00, "Cabinet 6"),
    createCabinet(-2, 0 , 0x00ff00, "Cabinet 7"),
    createCabinet(-2, 2 , 0x00ff00, "Cabinet 8"),
    createCabinet(0, -4 , 0x00ff00, "Cabinet 9"),
    createCabinet(0, -2 , 0xff0000, "Cabinet 10"),
    createCabinet(0, 0, 0xffa500, "Cabinet 11"),
    createCabinet(0, 2, 0xffa500, "Cabinet 12")
);
camera.position.z = 20;

const loop = () => {
    setTimeout(() => {
        requestAnimationFrame(loop);
    }, 100);
    controls.update();
    if (mouse !== null) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects( scene.children );
        if (intersects.length > 0) {
            handleHoverObject(intersects[0]);
            if (intersects[0].object._info) {
                preview.innerHTML = `
                    <h3>${(intersects[0]).object._info.name}</h3>
                `;
            } else {
                preview.innerHTML = "";
            }

        } else {
            preview.innerHTML = "";
            if (previousHover.length > 0) {
                previousHover.forEach((item) => {
                    if (item.object._info) {
                        // const color = item.object._info.color;
                        // item.object.material.color.set(color);
                        item.object.material.opacity = 1;
                        // item.object.material.wireframe = false;
                    }
                });
                previousHover = [];
            }
        }
    }
    renderer.render(scene, camera);
    // mesh.rotation.y += 0.1;
};

loop();

renderer.setSize(content.clientWidth, content.clientHeight);

content.appendChild(renderer.domElement);