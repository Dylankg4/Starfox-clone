import { 
    Box3,
    Vector3,
} from "three"

import { createScene } from "./modules/scene.js"
import { createRenderer } from "./modules/renderer.js"
import { createCamera } from "./modules/camera.js"
import { createLights } from "./modules/lights.js"
import { createControls } from "./modules/orbitControls.js"

import { playerControls, pressed } from "./gameSystems/controls.js"
import { 
    crosshair, 
    cockpit,
    bullet,
} from "./gameSystems/3dObjects.js"

import { enemyMove, loadEnemies } from "./gameSystems/enemy.js"
import { updateEnemyB } from "./gameSystems/enemyBullets.js"
import { updatePlayerBullets } from "./gameSystems/playerBullets.js"

//HTML element that everything is happening in
const container = document.getElementById("scene-container")
const startScreen = document.getElementById('start')
const pauseScreen = document.getElementById('pause')
const gameOverScreen = document.getElementById('game-over')
const hud = document.getElementById('hud')

const playEl = document.getElementById('play')
const resumeEl = document.getElementById('resume')
const restartEl = document.getElementById('restart')
const mainMenuEl = document.querySelectorAll("#main-menu")

async function main(){
// ! Modules ************************************
const scene = createScene()
const camera = createCamera()
const renderer = createRenderer()
const {ambientLight, mainLight} = createLights()
const orbitControls = createControls(camera, renderer.domElement)

//Add Three.js Canvas to HTML container
container.append(renderer.domElement)

// ! gameSystems*********************************

// Bounding objects
const playerBox = new Box3().setFromObject(cockpit)
const playerSize = playerBox.getSize(new Vector3).length()
const playerCenter = playerBox.getCenter(new Vector3())

/*const enemyBox = new Box3().setFromObject(enemy)
const enemySize = enemyBox.getSize(new Vector3()).length()
const enemyCenter = enemyBox.getCenter(new Vector3())*/

// ! Game Variables *****************************
const keyStates = {
    up: false,
    down: false,
    left: false,
    right: false,
}

const gameState = {
    paused: false,
    died: false,
    mainMenu: true,
    play: false,
    level: 1,
}

const {enemiesArray} = await loadEnemies(gameState.level)


// ! Player object and variables***************
let healthBars = document.querySelectorAll('.bar')
const energy = document.querySelector('.energy')
const bar = document.createElement('div')
bar.classList.add('bar')

// Health will equal energy.length - 1

const bulletArr = []

const player = {
    health: 5,
    hitBox: playerBox,
    controls: playerControls,
    damage: playerDamage,
}

const level1 = {
    player: {
        startX: 0,
        startY: 0,
        startZ: camera.position.z - 10,
    }
}

//Lowers player health
function playerDamage() {
    healthBars[player.health].remove()
    player.health -=1
    if(player.health <=-1) gameState.died = true
}

// Run controls****************************
player.controls(keyStates,cockpit,bullet,bulletArr,camera, gameState)

// ! Add objects to scene*******************
scene.add(
    mainLight, 
    ambientLight,
    camera, 
    cockpit,
    enemiesArray[0].type,
    enemiesArray[1].type,
    )

cockpit.add(crosshair)
crosshair.translateZ(-10)

cockpit.position.z = camera.position.z - 10

// ! Resize threejs canvas automatically************
//Keep aspect ratio at 16 / 9 or wider
let width;
let height;
window.addEventListener('resize', ()=>{
    width = window.innerWidth
    height = Math.floor(width / 1.7777)

    if(window.innerWidth / window.innerHeight > 1.777){
        width = window.innerWidth
        height = window.innerHeight
    }

    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
})


// ! Updates each object ****************************
async function updateables(delta){
    updatePlayerBullets(delta, bulletArr, scene, enemiesArray)
    
    playerBox.copy(cockpit.geometry.boundingBox).applyMatrix4(cockpit.matrixWorld)

    enemiesArray.forEach(enemy => {
        /*if(!enemy.destroyed) scene.add(enemy)*/

        if(!enemy.type.userData.consumed){
            enemy.box.copy(enemy.type.children[0].geometry.boundingBox).applyMatrix4(enemy.type.matrixWorld)
        }
        enemyMove(delta, bullet, enemy)

        updateEnemyB(delta, enemy.bullets, scene, player.damage, playerBox)
    })
}

let animId
let prevFrameTime = performance.now();
// ! Animation loop. Renders and animates everything.***
function animation(){
    if(gameState.mainMenu){
        start(animId)
    } else if(gameState.died){
        gameOver(animId)
    } else if (gameState.paused){
        pause(animId)
    } else {
        //Compute time difference of last frame and current frame to have smooth gameplay and pausing/resuming.
        const currentFrameTime = performance.now()
        const elapsedTime = currentFrameTime - prevFrameTime
        prevFrameTime = currentFrameTime
        const delta = elapsedTime / 1000
        updateables(delta)
        pressed(delta, keyStates, cockpit, camera)
        
        //Render everything
        renderer.render(scene, camera)

        //reassign animation id to current animation frame.
        animId = requestAnimationFrame( animation )
    }
}

//Function tied to main menu.
function start(animId){
    gameState.mainMenu = true
    gameState.died = false
    gameState.paused = false
    gameState.play = false
    if(animId) cancelAnimationFrame(animId)
    hud.style.visibility = 'hidden'
    startScreen.style.visibility = 'visible'
}

// ! Non-gameplay funtions and menu functionality 
//Function for pausing the game.
function pause(animId) {
    gameState.mainMenu = false
    gameState.died = false
    gameState.paused = true
    gameState.play = false
    cancelAnimationFrame(animId)
    animId = undefined
    pauseScreen.style.visibility = 'visible'
    hud.style.visibility = 'hidden'
}

//function for resuming game after pausing
function resume(){
    gameState.mainMenu = false
    gameState.died = false
    gameState.paused = false
    gameState.play = true
    prevFrameTime = performance.now()
    animation()
    hud.style.visibility = 'visible'
    pauseScreen.style.visibility = 'hidden'
}

//Function whe player loses the game.
function gameOver(animId){
    gameState.mainMenu = false
    gameState.died = true
    gameState.paused = false
    gameState.play = false
    cancelAnimationFrame(animId)
    animId = undefined
    gameOverScreen.style.visibility = 'visible'
    hud.style.visibility = 'hidden'
}

function restart() {
    gameState.died = false
    gameState.play = true
    recharge()
    animation()
    hud.style.visibility = 'visible'
    gameOverScreen.style.visibility = 'hidden'
}

function recharge(){
    player.health = 5
    for(let i=0; energy.childElementCount <= player.health; i++){
        energy.appendChild(bar.cloneNode())
    }
    healthBars = document.querySelectorAll('.bar')
}

playEl.onclick = () =>{
    prevFrameTime = performance.now()
    hud.style.visibility = 'visible'
    startScreen.style.visibility = 'hidden'
    gameState.mainMenu = false
    gameState.play = true
    cockpit.position.set(level1.player.startX, level1.player.startY, level1.player.startZ)
    recharge()
    animation()
}

//Button click to resume from pause menu.
resumeEl.onclick = resume
//resumeEl.addEventListener('click', resume)

//Button click to restart game from game-over menu
restartEl.onclick = restart
//restartEl.addEventListener('click', restart)

//All main menu buttons change gamestate to main menu
mainMenuEl.forEach(button=>{
    button.addEventListener('click', ()=>{
        pauseScreen.style.visibility = 'hidden'
        gameOverScreen.style.visibility = 'hidden'
        start()
    })
})

//Pauses game when player changes tab.
document.addEventListener("visibilitychange", ()=>{
    if(gameState.play){
        pause()
    }
})

start()

}

main().catch((err) => {
    console.error(err)
})