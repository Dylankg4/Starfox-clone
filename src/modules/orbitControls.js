import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

function createControls(camera, canvas){
    const control = new OrbitControls(camera, canvas)

    return control
}

export { createControls }