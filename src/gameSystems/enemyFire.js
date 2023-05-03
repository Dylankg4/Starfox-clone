async function enemyFire(delta, enemy, bullet, enemyBullets){
    const bulletClone = bullet.clone()
    bulletClone.position.copy(enemy.position)
    bulletClone.rotation.copy(enemy.rotation)
    //Bullet rotates with cockpit even after shooting --> bulletClone.rotation.copy(cockpit.rotation)
    bulletClone.translateX(1)
    bulletClone.distance = 0
    enemyBullets.push(bulletClone)
}

export { enemyFire }