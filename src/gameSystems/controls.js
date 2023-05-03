import fire from "./playerFire.js"

function playerControls(keyStates, cockpit, bullet, bulletArr, camera, gameState) {
    //Controls for movement and firing
window.addEventListener('keydown', (event)=>{
    if(event.key === 'ArrowRight' || event.key === 'd'){
        keyStates.right = true
    }
    if(event.key === 'ArrowLeft' || event.keyCode === 65){
        keyStates.left = true
    }
    if(event.key === 'ArrowUp' || event.key === 'w'){
        keyStates.up = true
    }
    if(event.key === 'ArrowDown' || event.key === 's'){
        keyStates.down = true
    }
    if(event.key === 'Escape'){
        if(gameState.play){
        gameState.paused = true
        gameState.play = false
        }
    }
    //Spacebar firing. Does not allow automatic firing.
    if(event.key === ' ' && !event.repeat){
        fire(cockpit, bullet, bulletArr, camera)
    }
})

//Checks when key is released allowing smooth movement simulating multiple key presses at once.
window.addEventListener('keyup', (event)=> {
    if(event.key === 'ArrowRight' || event.key === 'd') keyStates.right = false
    if(event.key === 'ArrowLeft' || event.key === 'a') keyStates.left = false
    if(event.key === "ArrowUp" || event.key === 'w') keyStates.up = false
    if(event.key === 'ArrowDown' || event.key === 's') keyStates.down = false
})

}

//Applies movement to pressed or unpressed keys
function pressed(delta, keyStates, cockpit, camera){
    //Turning speed in every direction
    const turnSpeed = .4 * delta
    const moveSpeed  = 2 * delta
    const xMove = 3 * camera.aspect 
    const yMove = 3
    //Amount of rotation for turn
    const turn = 0.4

    //Movement
    if(keyStates.up){
        if(cockpit.rotation.x < turn) cockpit.rotation.x += turnSpeed
        if(cockpit.position.y <= yMove) cockpit.position.y += moveSpeed
    }
    if(keyStates.down){
        if(cockpit.rotation.x > -turn) cockpit.rotation.x -= turnSpeed
        if(cockpit.position.y >= -yMove) cockpit.position.y -= moveSpeed
    }
    if(keyStates.left){
        if(cockpit.rotation.y < turn) {
            cockpit.rotation.y += turnSpeed
            cockpit.rotation.z += turnSpeed
        }
        if(cockpit.position.x >= -xMove) cockpit.position.x -= moveSpeed
    }
    if(keyStates.right){
        if(cockpit.rotation.y > -turn) {
            cockpit.rotation.y -= turnSpeed
            cockpit.rotation.z -= turnSpeed
        }
        if(cockpit.position.x <= xMove) cockpit.position.x += moveSpeed
    }
    //If rotation is greater than 0 slowly move back to 0
    if(!keyStates.up && cockpit.rotation.x > 0){
        cockpit.rotation.x -= turnSpeed / 2
    }
    if(!keyStates.down && cockpit.rotation.x < 0){
        cockpit.rotation.x += turnSpeed / 2
    }
    if(!keyStates.left && cockpit.rotation.y > 0){
        cockpit.rotation.y -= turnSpeed / 2
        if(cockpit.rotation.z > 0) cockpit.rotation.z -= turnSpeed / 2
    }
    if(!keyStates.right && cockpit.rotation.y < 0){
        cockpit.rotation.y += turnSpeed / 2
        if(cockpit.rotation.z < 0) cockpit.rotation.z += turnSpeed / 2
    }
}

export { playerControls, pressed }