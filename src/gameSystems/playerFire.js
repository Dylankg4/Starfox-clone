//Creates bullets and adds them to the scene
export default function fire(cockpit, bullet, bulletArr) {
    const bulletClone = bullet.clone()
    bulletClone.position.copy(cockpit.position)
    bulletClone.rotation.copy(cockpit.rotation)
    //Bullet rotates with cockpit even after shooting --> bulletClone.rotation.copy(cockpit.rotation)
    //bulletClone.translateZ(-2)
    bulletClone.distance = 0
    bulletArr.push(bulletClone)
}