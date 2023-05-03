import { Box3 } from "three"

import { enemyFire } from "./enemyFire.js"
import { loadModels } from './loadModels.js'

async function loadEnemies(level){
const {enemy, enemyClone} = await loadModels()

let enemiesArray = []
const enemyType = {
    standard: enemy,
    noShoot: enemyClone,
    line: [enemy, enemyClone, enemyClone]
}

const enemies1 = [
    {
        type: enemy,
        state: {
            leftMove: true,
            xMove: 0,
            yMove: 0,
            downMove: true,
            },
        start: {
            X: -1.5,
            Y: -1.5,
            Z: 0,
        },
        path: [2,2,2,2],
        X: -5,
        Y: -5,
        bullets: [],
        box: new Box3().setFromObject(enemy),
        fireRate: 0,
        destroyed: false,
        inScene: false,
    },
    {
        type: enemyClone,
        state: {
            leftMove: true,
            xMove: 0,
            downMove: true,
            yMove: 0,
            },
        start: {
                X: 1.5,
                Y: 1.5,
                Z: 0,
        },
        path: [2,0,2,0],
        X: 5,
        Y: 5,
        bullets: [],
        box: new Box3().setFromObject(enemyClone),
        fireRate: 0,
        destroyed: false,
        inScene: false,
    }
]

enemies1[0].type.position.set(
    enemies1[0].start.X,
    enemies1[0].start.Y,
    enemies1[0].start.Z,
)

enemies1[1].type.position.set(
    enemies1[1].start.X,
    enemies1[1].start.Y,
    enemies1[1].start.Z,
)

if(level === 1) enemiesArray = enemies1
if(level === 2) enemiesArray = null

return {enemiesArray}
}

async function enemyMove(delta, bullet, enemy){
        const speed = 1 * delta
        if(enemy.type.position.x <= -3) enemy.state.leftMove = false
        if(enemy.type.position.x >= 3) enemy.state.leftMove = true
        
        if(enemy.state.leftMove){
            enemy.type.position.x -= speed
        } else {
            enemy.type.position.x += speed
        }
        
        enemy.fireRate += delta
        if(enemy.fireRate >= 2 && !enemy.type.userData.consumed) {
        enemyFire(delta, enemy.type, bullet, enemy.bullets)
        enemy.fireRate = 0
        }
}

export { enemyMove, loadEnemies }