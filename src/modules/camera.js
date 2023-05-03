import { PerspectiveCamera } from 'three'

function createCamera() {
    const aspect = 16 / 9
    const camera = new PerspectiveCamera(60, aspect, .1, 200)

    camera.position.set(0,0,20)

    return camera
}

export { createCamera }