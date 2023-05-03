import { Box3 } from "three"

function updateEnemyB(delta, enemyBullets, scene, damage, playerBox){
    //If any bullets exist move or delete them
    if(enemyBullets.length){
        const speed = 20 * delta 
        enemyBullets.forEach(b => {
            let idx = enemyBullets.indexOf(b)
            scene.add(b)
            //Create bounding box of individual bullet
            const bulletBox = new Box3().setFromObject(b)
            //Move forward based on local z axis
            b.translateX(speed)
            b.distance += speed
            
            //update bullet bounding box position
            bulletBox.copy( b.geometry.boundingBox ).applyMatrix4(b.matrixWorld)
            //Bullet collisions
            if(bulletBox.intersectsBox(playerBox)){
                enemyBulletCollision(b, enemyBullets, idx, scene, damage)
            }

            //Remove bullet from array and parent
            if(b.distance < -200){
                if(idx > 0) enemyBullets.splice(idx, 1)
                else enemyBullets.shift()
                //console.log(bulletArr) - Check bullets in array
                scene.remove(b)
            }
        })
    }
}

function enemyBulletCollision(bullet, enemyBullets, idx, scene, damage){
    if(idx > 0) enemyBullets.splice(idx, 1)
    else enemyBullets.shift()
    scene.remove(bullet)
    damage()
}

export  {
    updateEnemyB
}