import { 
    MeshStandardMaterial,
    RingBufferGeometry,
    ConeBufferGeometry,
    OctahedronBufferGeometry,
    Mesh,
    } from "three"

const material1 = new MeshStandardMaterial({color: 'gray', wireframe: true})
const material2 = new MeshStandardMaterial({color: 'red', wireframe: true})
const material3 = new MeshStandardMaterial({color: 'yellow'})
const mat4 = new MeshStandardMaterial({color: 'dimgray'})

//Crosshair
const ringGeomtery = new RingBufferGeometry(.5,.75,4)
const crosshair = new Mesh(ringGeomtery, material2)

// Cockpit
const cone = new ConeBufferGeometry(5,10,3)
const cockpit = new Mesh(cone, material2)
cockpit.scale.set(.25,.25,.25)

//const {cockpit} = await loadModels()

// Projectile/Cone
const octGeometry = new OctahedronBufferGeometry(.25 ,1)
const bullet = new Mesh(octGeometry, material3)

export {crosshair, cockpit, bullet}