import { Box3 } from "three"


//add bullets to scene then Move and update/Delete bullets
function updatePlayerBullets(delta, bulletArr, scene, enemies){
    //If any bullets exist move or delete them
    if(bulletArr.length){
        const speed = 50 * delta 
        bulletArr.forEach(b => {
            let idx = bulletArr.indexOf(b)
            scene.add(b)
            //Create bounding box of individual bullet
            const bulletBox = new Box3().setFromObject(b)
            //Move forward based on local z axis
            let move = -speed
            b.translateZ(move)
            b.distance += move
            
            //update bullet bounding box position
            bulletBox.copy( b.geometry.boundingBox ).applyMatrix4(b.matrixWorld)
            //Bullet collisions
            enemies.forEach(enemy => {
            if(bulletBox.intersectsBox(enemy.box) && !enemy.type.userData.consumed){
                bulletCollison(b, enemy.type, idx, bulletArr, scene)
            }
            })

            //Remove bullet from array and parent
            if(b.distance < -200){
                if(idx > 0) bulletArr.splice(idx, 1)
                else bulletArr.shift()
                //console.log(bulletArr) - Check bullets in array
                scene.remove(b)
            }
        })
    }
}

function bulletCollison(bullet, enemy, idx, bulletArr, scene){
    if(idx > 0) bulletArr.splice(idx, 1)
    else bulletArr.shift()
    scene.remove(enemy, bullet)
    enemy.userData.consumed = true
    enemy = null
}

export { updatePlayerBullets }