const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.updateProjectionMatrix();
});

const pointLight1 = new THREE.PointLight(0xffffff);
pointLight1.position.set(30, 25, 25);

const pointLight2 = new THREE.PointLight(0xffffff);
pointLight2.position.set(30, 30, -10);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight1, pointLight2, ambientLight);

const loader = new THREE.TextureLoader();

//////////////////////////////////////////////////////////
/////////////////////virus////////////////////////////////
//////////////////////////////////////////////////////////
const sphereVirus = new THREE.SphereGeometry(2, 8, 8);

const materialVirus = new THREE.MeshStandardMaterial({
  map: loader.load("./../images/corona-virus.png"),
  normalMap: loader.load("./../images/corona-virus.png"),
});

const virus = new THREE.Mesh(sphereVirus, materialVirus);

scene.add(virus);
if (window.innerWidth < 1100) {
  virus.position.z = -10;
  virus.position.x = 10;
  camera.position.x = -3;
} else {
  virus.position.z = -10;
  virus.position.x = 20;
}
// camera.position.z = -35;

//////////////////////////////////////////////////////////
/////////////////////virus////////////////////////////////
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
/////////////////////Globe////////////////////////////////
//////////////////////////////////////////////////////////

const sphereGlobe = new THREE.SphereGeometry(20, 20, 20);

const materialGlobe = new THREE.MeshStandardMaterial({
  map: loader.load("./../images/globe.jpg"),
  normalMap: loader.load("./../images/globe.jpg"),
});

const globe = new THREE.Mesh(sphereGlobe, materialGlobe);

scene.add(globe);

globe.position.z = 10;

//////////////////////////////////////////////////////////
/////////////////////Globe////////////////////////////////
//////////////////////////////////////////////////////////

function addStar() {
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("./../images/space3.jpg");
scene.background = spaceTexture;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  // console.log(t);

  if (t < -1000) {
    globe.position.x = 40;
    virus.position.x = 30;
    camera.position.z = t * -0.04;
  } else {
    camera.position.z = t * -0.01;
    virus.position.x = 7;
  }
  // virus.position.x += t * 0.0001;
  // camera.position.x = t * -0.0002;
  // camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // globe.rotation.x += 0.005;
  globe.rotation.y += 0.0075;
  virus.rotation.y += 0.0075;
}
animate();
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const cases = document.querySelector(".cases");
const vaccine = document.querySelector(".vaccine");
let confirmedCases = 0;
let deceased = 0;
let recovered = 0;
let dose1 = 0;
let dose2 = 0;

const showCases = async function () {
  try {
    const res = await fetch(
      "https://api.covid19india.org/v4/min/data.min.json"
    );
    const data = await res.json();
    // console.log(data);

    for (const key in data) {
      confirmedCases += data[key]["total"]["confirmed"];
      deceased += data[key]["total"]["deceased"];
      recovered += data[key]["total"]["recovered"];
      dose1 += data[key]["total"]["vaccinated1"];
      dose2 += data[key]["total"]["vaccinated2"];
    }

    const markup1 = `
  
  <div class="totalCases">
    <h4>Total Cases</h4>
   <h4>
    ${confirmedCases}
   </h4>
   
  </div>
  <div class="recovered">
    <h4>Recovered</h4>
    <h4>
    ${recovered}
   </h4>
  </div>
  <div class="deaths">
    <h4>Deaths</h4>
    <h4>
    ${deceased}
   </h4>
  </div>

`;

    cases.insertAdjacentHTML("afterbegin", markup1);

    const markup2 = `
  <div class="dose1">
    <h4>Dose 1</h4>
    <h4>${dose1}</h4>
    </div>
    <div class="dose2">
    <h4>Dose 2</h4>
    <h4>${dose2}</h4>
  </div>
    `;
    vaccine.insertAdjacentHTML("afterbegin", markup2);
    // console.log("cc : ", dose1, dose2);
  } catch (err) {
    console.log(err);
  }
};
showCases();
