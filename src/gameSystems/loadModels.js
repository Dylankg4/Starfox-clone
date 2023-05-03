import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { setupModel } from '../modules/setUpModel'

let enemy, enemyClone

async function loadModels() {
    const loader = new GLTFLoader()

    //Cockpit
    const cockpitData = await loader.loadAsync('../models/cockpit.glb')
    const cockpit = setupModel(cockpitData)

    //enemy
    const enemyData = await loader.loadAsync('../models/enemy.glb')
    enemy = setupModel(enemyData)
    enemy.scale.set(.5,.5,.5)
    enemy.userData.consumed = false
    enemyClone = enemy.clone()
    enemyClone.scale.set(.5,.5,.5)
    enemyClone.userData.consumed = false
    return { enemy, enemyClone }
}

export { loadModels }