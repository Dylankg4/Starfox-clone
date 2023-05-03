import { WebGLRenderer } from 'three'

function createRenderer() {
    const renderer = new WebGLRenderer({antialias: true})

    renderer.physicallyCorrectLights = true

    //Aspect ratio for renderer is about 16 / 9
    let width = window.innerWidth
    let height = Math.floor(window.innerWidth / 1.778)

    //If the aspect ratio is bigger swith to that
    if(width / window.innerHeight > 1.778){
        width = window.innerWidth
        height = window.innerHeight
    }
    
    renderer.setSize(width, height)

    return renderer
}

export { createRenderer }