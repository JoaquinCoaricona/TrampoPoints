import * as THREE from 'three';

/**
 * Generador de modelos 3D detallados para Combis y Minibuses con Three.js
 * Crea un ensamble completo de carrocería PBR, interiores, ruedas, espejos y luces.
 */
export function buildCombi3D(preset, options = {}) {
  const {
    carColor = '#f8fafc',
    licensePlate = 'AF 482 TP',
    headlightsOn = true,
    doorOpen = false
  } = options;

  const group = new THREE.Group();
  group.name = 'CombiVehicleGroup';

  const geom = preset.geom;
  const L = geom.length;       // ej: 6.8m
  const W = geom.width;        // ej: 2.2m
  const H = geom.height;       // ej: 2.7m
  const hoodL = geom.hoodLength; // ej: 1.3m
  const cabinL = L - hoodL;

  // ==========================================
  // 1. MATERIALES PBR FOTORREALISTAS
  // ==========================================

  // Pintura automotriz con laca transparente de alto brillo (Clearcoat)
  const paintMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(carColor),
    metalness: 0.25,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 0.9,
    envMapIntensity: 1.2
  });

  // Plástico oscuro para molduras protectoras y paragolpes
  const blackTrimMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.75,
    metalness: 0.1
  });

  // Vidrios panorámicos tintados con refracción y transparencia
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    transmission: 0.85,
    opacity: 0.48,
    transparent: true,
    roughness: 0.05,
    metalness: 0.1,
    ior: 1.52,
    reflectivity: 0.95
  });

  // Cromado de alta reflexión para insignias, molduras y parrilla
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.98,
    roughness: 0.04
  });

  // Neumáticos de caucho vulcanizado
  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.88,
    metalness: 0.05
  });

  // Llantas de aleación metalizadas
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.85,
    roughness: 0.22
  });

  // Discos de freno de acero ventilados
  const brakeDiscMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.2
  });

  // Cálipers de freno deportivos
  const caliperMaterial = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    metalness: 0.3,
    roughness: 0.4
  });

  // Faros LED emisivos
  const ledHeadlightMaterial = new THREE.MeshStandardMaterial({
    color: headlightsOn ? 0xffffff : 0x94a3b8,
    emissive: headlightsOn ? new THREE.Color(0x93c5fd) : new THREE.Color(0x000000),
    emissiveIntensity: headlightsOn ? 2.5 : 0,
    roughness: 0.1,
    metalness: 0.9
  });

  // Luces traseras LED
  const taillightRedMaterial = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    emissive: new THREE.Color(0x7f1d1d),
    emissiveIntensity: 0.6,
    roughness: 0.2
  });

  const taillightAmberMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2
  });

  // Interior: tapicería de asientos
  const seatFabricMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8,
    metalness: 0.05
  });

  const dashboardMaterial = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.7,
    metalness: 0.1
  });

  // ==========================================
  // 2. CARROCERÍA PRINCIPAL (CHASIS Y CABINA)
  // ==========================================

  const wheelRadius = 0.42;
  const groundClearance = 0.45;
  const bodyCenterY = groundClearance + (H * 0.45);
  const cabinCenterZ = -(hoodL / 2) * 0.5;

  // A. Cabina de Pasajeros y Techo Aerodinámico
  const mainCabinHeight = H - groundClearance;
  const cabinGeom = new THREE.BoxGeometry(W, mainCabinHeight, cabinL, 2, 2, 4);
  const mainCabin = new THREE.Mesh(cabinGeom, paintMaterial);
  mainCabin.position.set(0, bodyCenterY, -hoodL * 0.3);
  mainCabin.castShadow = true;
  mainCabin.receiveShadow = true;
  group.add(mainCabin);

  // Techo redondeado y sobreelevado
  const roofGeom = new THREE.CylinderGeometry(W * 0.49, W * 0.49, cabinL, 16);
  const roofMesh = new THREE.Mesh(roofGeom, paintMaterial);
  roofMesh.rotation.x = Math.PI / 2;
  roofMesh.position.set(0, bodyCenterY + mainCabinHeight * 0.48, -hoodL * 0.3);
  group.add(roofMesh);

  // B. Trompa / Capó esculpido
  const hoodHeight = mainCabinHeight * 0.52;
  const hoodGeom = new THREE.BoxGeometry(W * 0.96, hoodHeight, hoodL);
  const hoodMesh = new THREE.Mesh(hoodGeom, paintMaterial);
  hoodMesh.position.set(0, groundClearance + hoodHeight * 0.5, cabinL * 0.5 - hoodL * 0.3 + hoodL * 0.48);
  hoodMesh.castShadow = true;
  group.add(hoodMesh);

  // Inclinación del capó delantero
  const hoodSlopeGeom = new THREE.BoxGeometry(W * 0.94, hoodHeight * 0.45, hoodL * 0.9);
  const hoodSlope = new THREE.Mesh(hoodSlopeGeom, paintMaterial);
  hoodSlope.rotation.x = -geom.hoodSlope;
  hoodSlope.position.set(0, groundClearance + hoodHeight * 0.85, hoodMesh.position.z - 0.1);
  group.add(hoodSlope);

  // C. Molduras inferiores de protección (Faldón negro perimetral)
  const trimHeight = 0.28;
  const trimGeom = new THREE.BoxGeometry(W * 1.02, trimHeight, L * 0.98);
  const lowerTrim = new THREE.Mesh(trimGeom, blackTrimMaterial);
  lowerTrim.position.set(0, groundClearance + trimHeight * 0.5, 0);
  group.add(lowerTrim);

  // D. Paragolpes delantero esculpido
  const frontBumperGeom = new THREE.BoxGeometry(W * 0.98, 0.45, 0.35);
  const frontBumper = new THREE.Mesh(frontBumperGeom, blackTrimMaterial);
  frontBumper.position.set(0, groundClearance + 0.22, hoodMesh.position.z + hoodL * 0.5);
  group.add(frontBumper);

  // Entrada de aire central del paragolpes
  const airIntakeGeom = new THREE.BoxGeometry(W * 0.55, 0.15, 0.1);
  const airIntake = new THREE.Mesh(airIntakeGeom, blackTrimMaterial);
  airIntake.position.set(0, groundClearance + 0.18, frontBumper.position.z + 0.14);
  group.add(airIntake);

  // ==========================================
  // 3. PARABRISAS Y CRISTALES PANORÁMICOS
  // ==========================================

  // Parabrisas delantero inclinado
  const windshieldW = W * 0.92;
  const windshieldH = mainCabinHeight * 0.48;
  const windshieldGeom = new THREE.PlaneGeometry(windshieldW, windshieldH);
  const windshield = new THREE.Mesh(windshieldGeom, glassMaterial);
  windshield.rotation.x = -0.42;
  windshield.position.set(0, bodyCenterY + 0.25, hoodMesh.position.z - hoodL * 0.25);
  group.add(windshield);

  // Ventanillas laterales panorámicas de pasajeros
  const winRows = geom.windowRows || 4;
  const sideWinLength = (cabinL * 0.85) / winRows;
  const sideWinHeight = mainCabinHeight * 0.38;

  for (let r = 0; r < winRows; r++) {
    const winZ = mainCabin.position.z + (cabinL * 0.38) - (r * sideWinLength * 1.05);

    // Ventana lateral izquierda
    const leftWinGeom = new THREE.PlaneGeometry(sideWinLength * 0.92, sideWinHeight);
    const leftWin = new THREE.Mesh(leftWinGeom, glassMaterial);
    leftWin.rotation.y = -Math.PI / 2;
    leftWin.position.set(-W * 0.505, bodyCenterY + 0.2, winZ);
    group.add(leftWin);

    // Ventana lateral derecha
    const rightWinGeom = new THREE.PlaneGeometry(sideWinLength * 0.92, sideWinHeight);
    const rightWin = new THREE.Mesh(rightWinGeom, glassMaterial);
    rightWin.rotation.y = Math.PI / 2;
    rightWin.position.set(W * 0.505, bodyCenterY + 0.2, winZ);
    group.add(rightWin);
  }

  // Cristales de puertas traseras dobles
  const rearWinW = W * 0.38;
  const rearWinH = sideWinHeight * 0.9;
  [-rearWinW * 0.55, rearWinW * 0.55].forEach((rx) => {
    const rearWinGeom = new THREE.PlaneGeometry(rearWinW * 0.88, rearWinH);
    const rearWin = new THREE.Mesh(rearWinGeom, glassMaterial);
    rearWin.rotation.y = Math.PI;
    rearWin.position.set(rx, bodyCenterY + 0.25, mainCabin.position.z - cabinL * 0.502);
    group.add(rearWin);
  });

  // ==========================================
  // 4. INTERIOR VISIBLE (BUTACAS, TABLERO Y VOLANTE)
  // ==========================================

  const interiorGroup = new THREE.Group();

  // Tablero / Torpedo delantero
  const dashGeom = new THREE.BoxGeometry(W * 0.88, 0.35, 0.55);
  const dashboard = new THREE.Mesh(dashGeom, dashboardMaterial);
  dashboard.position.set(0, bodyCenterY - 0.15, windshield.position.z - 0.25);
  interiorGroup.add(dashboard);

  // Volante de conducción en el puesto izquierdo
  const wheelTorusGeom = new THREE.TorusGeometry(0.16, 0.025, 8, 20);
  const steeringWheel = new THREE.Mesh(wheelTorusGeom, blackTrimMaterial);
  steeringWheel.rotation.x = -Math.PI / 3;
  steeringWheel.position.set(-W * 0.26, bodyCenterY, dashboard.position.z - 0.2);
  interiorGroup.add(steeringWheel);

  // Asientos: Butacas de conductor y acompañante
  [-W * 0.26, W * 0.26].forEach((sx) => {
    const seatGroup = createRealisticSeat(seatFabricMaterial, blackTrimMaterial);
    seatGroup.position.set(sx, groundClearance + 0.35, dashboard.position.z - 0.65);
    interiorGroup.add(seatGroup);
  });

  // Filas de asientos de pasajeros con pasillo central
  const seatRowsCount = geom.seatRows || 4;
  const seatSpacing = (cabinL * 0.65) / seatRowsCount;

  for (let row = 0; row < seatRowsCount; row++) {
    const rowZ = dashboard.position.z - 1.25 - (row * seatSpacing);

    // Asiento doble izquierdo
    const seatLeft = createRealisticSeat(seatFabricMaterial, blackTrimMaterial, true);
    seatLeft.position.set(-W * 0.25, groundClearance + 0.35, rowZ);
    interiorGroup.add(seatLeft);

    // Asiento individual derecho
    const seatRight = createRealisticSeat(seatFabricMaterial, blackTrimMaterial, false);
    seatRight.position.set(W * 0.25, groundClearance + 0.35, rowZ);
    interiorGroup.add(seatRight);
  }

  group.add(interiorGroup);

  // ==========================================
  // 5. PARRILLA FRONTAL Y LOGOS 3D DE MARCA
  // ==========================================

  const grilleW = W * 0.72;
  const grilleH = 0.32;
  const grilleGeom = new THREE.BoxGeometry(grilleW, grilleH, 0.08);
  const grilleMesh = new THREE.Mesh(grilleGeom, blackTrimMaterial);
  grilleMesh.position.set(0, groundClearance + 0.58, hoodMesh.position.z + hoodL * 0.5 + 0.02);
  group.add(grilleMesh);

  // Franjas cromadas de parrilla
  [-0.07, 0.07].forEach((gy) => {
    const slatGeom = new THREE.BoxGeometry(grilleW * 0.95, 0.025, 0.02);
    const slat = new THREE.Mesh(slatGeom, chromeMaterial);
    slat.position.set(0, grilleMesh.position.y + gy, grilleMesh.position.z + 0.04);
    group.add(slat);
  });

  // Emblema 3D específico por marca
  const logoCenterZ = grilleMesh.position.z + 0.05;
  const logoCenterY = grilleMesh.position.y;

  if (geom.grilleType === 'MERCEDES_STAR') {
    // Estrella Mercedes-Benz de 3 puntas en anillo cromado
    const ringGeom = new THREE.TorusGeometry(0.12, 0.016, 12, 24);
    const ring = new THREE.Mesh(ringGeom, chromeMaterial);
    ring.position.set(0, logoCenterY, logoCenterZ);
    group.add(ring);

    for (let i = 0; i < 3; i++) {
      const angle = (i * 120 - 90) * (Math.PI / 180);
      const starPointGeom = new THREE.CylinderGeometry(0.008, 0.018, 0.11, 4);
      const starPoint = new THREE.Mesh(starPointGeom, chromeMaterial);
      starPoint.rotation.z = -angle - Math.PI / 2;
      starPoint.position.set(Math.cos(angle) * 0.05, logoCenterY + Math.sin(angle) * 0.05, logoCenterZ);
      group.add(starPoint);
    }
  } else if (geom.grilleType === 'RENAULT_DIAMOND') {
    // Rombo Renault cromado
    const diamondShape = new THREE.Shape();
    diamondShape.moveTo(0, 0.12);
    diamondShape.lineTo(0.08, 0);
    diamondShape.lineTo(0, -0.12);
    diamondShape.lineTo(-0.08, 0);
    diamondShape.closePath();
    const extrudeSettings = { depth: 0.03, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
    const diamondGeom = new THREE.ExtrudeGeometry(diamondShape, extrudeSettings);
    const diamond = new THREE.Mesh(diamondGeom, chromeMaterial);
    diamond.position.set(0, logoCenterY, logoCenterZ);
    group.add(diamond);
  } else if (geom.grilleType === 'FORD_HEX') {
    // Óvalo Ford cromado/azul
    const ovalGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16);
    const oval = new THREE.Mesh(ovalGeom, chromeMaterial);
    oval.rotation.x = Math.PI / 2;
    oval.scale.set(1.6, 1, 0.9);
    oval.position.set(0, logoCenterY, logoCenterZ);
    group.add(oval);
  } else {
    // Logo genérico de chapa pulida
    const badgeGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.03, 20);
    const badge = new THREE.Mesh(badgeGeom, chromeMaterial);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(0, logoCenterY, logoCenterZ);
    group.add(badge);
  }

  // ==========================================
  // 6. FAROS DELANTEROS LED CON PROFUNDIDAD
  // ==========================================

  [-W * 0.40, W * 0.40].forEach((hx) => {
    // Carcasa del faro
    const housingGeom = new THREE.BoxGeometry(0.28, 0.22, 0.15);
    const housing = new THREE.Mesh(housingGeom, chromeMaterial);
    housing.position.set(hx, groundClearance + 0.58, hoodMesh.position.z + hoodL * 0.49);
    housing.rotation.y = (hx > 0 ? 1 : -1) * 0.15;
    group.add(housing);

    // Lente LED emisivo interior
    const lensGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16);
    const lens = new THREE.Mesh(lensGeom, ledHeadlightMaterial);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(hx, groundClearance + 0.58, housing.position.z + 0.08);
    group.add(lens);

    // Cubierta exterior de vidrio transparente del faro
    const coverGeom = new THREE.PlaneGeometry(0.26, 0.20);
    const cover = new THREE.Mesh(coverGeom, glassMaterial);
    cover.position.set(hx, groundClearance + 0.58, housing.position.z + 0.09);
    cover.rotation.y = (hx > 0 ? 1 : -1) * 0.15;
    group.add(cover);
  });

  // ==========================================
  // 7. LUCES TRASERAS VERTICALES
  // ==========================================

  [-W * 0.45, W * 0.45].forEach((tx) => {
    const tailH = 0.55;
    const tailW = 0.14;
    const tailZ = mainCabin.position.z - cabinL * 0.505;

    // Sector rojo de freno
    const redGeom = new THREE.BoxGeometry(tailW, tailH * 0.55, 0.04);
    const redLight = new THREE.Mesh(redGeom, taillightRedMaterial);
    redLight.position.set(tx, bodyCenterY + 0.1, tailZ);
    group.add(redLight);

    // Sector ámbar de giro
    const ambGeom = new THREE.BoxGeometry(tailW, tailH * 0.4, 0.04);
    const ambLight = new THREE.Mesh(ambGeom, taillightAmberMaterial);
    ambLight.position.set(tx, bodyCenterY - 0.16, tailZ);
    group.add(ambLight);
  });

  // ==========================================
  // 8. ESPEJOS RETROVISORES AERODINÁMICOS
  // ==========================================

  [-1, 1].forEach((side) => {
    const mirrorGroup = new THREE.Group();
    const mirrorX = (W * 0.53) * side;
    const mirrorY = bodyCenterY + 0.15;
    const mirrorZ = hoodMesh.position.z - hoodL * 0.18;

    // Brazo de soporte del espejo
    const armGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8);
    const arm = new THREE.Mesh(armGeom, blackTrimMaterial);
    arm.rotation.z = Math.PI / 2 * side;
    arm.position.set(side * 0.07, 0, 0);
    mirrorGroup.add(arm);

    // Carcasa aerodinámica exterior
    const bodyGeom = new THREE.BoxGeometry(0.12, 0.24, 0.16);
    const mBody = new THREE.Mesh(bodyGeom, blackTrimMaterial);
    mBody.position.set(side * 0.15, 0, 0);
    mirrorGroup.add(mBody);

    // Cristal reflectivo interior del espejo
    const glassMirrorGeom = new THREE.PlaneGeometry(0.1, 0.22);
    const glassMirror = new THREE.Mesh(glassMirrorGeom, chromeMaterial);
    glassMirror.rotation.y = side === 1 ? -Math.PI / 2 - 0.2 : Math.PI / 2 + 0.2;
    glassMirror.position.set(side * 0.14, 0, -0.01);
    mirrorGroup.add(glassMirror);

    mirrorGroup.position.set(mirrorX, mirrorY, mirrorZ);
    group.add(mirrorGroup);
  });

  // ==========================================
  // 9. LLANTAS DE ALEACIÓN, DISCOS Y NEUMÁTICOS
  // ==========================================

  const wheelbase = L * 0.62;
  const frontAxleZ = hoodMesh.position.z - hoodL * 0.15;
  const rearAxleZ = frontAxleZ - wheelbase;

  // Ruedas delanteras
  [-W * 0.48, W * 0.48].forEach((wx) => {
    const wheel = createRealisticAlloyWheel(wheelRadius, tireMaterial, rimMaterial, brakeDiscMaterial, caliperMaterial, wx > 0);
    wheel.position.set(wx, wheelRadius, frontAxleZ);
    group.add(wheel);
  });

  // Ruedas traseras (simples o dobles para Iveco Daily)
  [-W * 0.48, W * 0.48].forEach((wx) => {
    const wheel = createRealisticAlloyWheel(wheelRadius, tireMaterial, rimMaterial, brakeDiscMaterial, caliperMaterial, wx > 0);
    wheel.position.set(wx, wheelRadius, rearAxleZ);
    group.add(wheel);

    if (geom.dualRearWheels) {
      const innerWheel = createRealisticAlloyWheel(wheelRadius, tireMaterial, rimMaterial, brakeDiscMaterial, caliperMaterial, wx > 0);
      innerWheel.position.set(wx - (wx > 0 ? 0.22 : -0.22), wheelRadius, rearAxleZ);
      group.add(innerWheel);
    }
  });

  // ==========================================
  // 10. CHAPA PATENTE MERCOSUR / ARGENTINA 3D
  // ==========================================

  // Patente delantera
  const frontPlate = createMercosurLicensePlate(licensePlate);
  frontPlate.position.set(0, groundClearance + 0.22, frontBumper.position.z + 0.18);
  group.add(frontPlate);

  // Patente trasera
  const rearPlate = createMercosurLicensePlate(licensePlate);
  rearPlate.rotation.y = Math.PI;
  rearPlate.position.set(0, groundClearance + 0.45, mainCabin.position.z - cabinL * 0.505);
  group.add(rearPlate);

  // ==========================================
  // 11. PUERTA CORREDIZA DE PASAJEROS ANIMADA
  // ==========================================

  const slidingDoorGroup = new THREE.Group();
  slidingDoorGroup.name = 'SlidingPassengerDoor';

  const doorW = cabinL * 0.28;
  const doorH = mainCabinHeight * 0.85;
  const doorGeom = new THREE.BoxGeometry(0.04, doorH, doorW);
  const doorMesh = new THREE.Mesh(doorGeom, paintMaterial);
  slidingDoorGroup.add(doorMesh);

  // Manija de puerta
  const handleGeom = new THREE.BoxGeometry(0.03, 0.04, 0.12);
  const handleMesh = new THREE.Mesh(handleGeom, blackTrimMaterial);
  handleMesh.position.set(0.03, 0, -doorW * 0.35);
  slidingDoorGroup.add(handleMesh);

  // Posición inicial cerrada vs abierta
  const doorClosedX = W * 0.502;
  const doorClosedY = bodyCenterY - 0.05;
  const doorClosedZ = mainCabin.position.z + cabinL * 0.22;

  if (doorOpen) {
    slidingDoorGroup.position.set(doorClosedX + 0.12, doorClosedY, doorClosedZ - doorW * 0.85);
  } else {
    slidingDoorGroup.position.set(doorClosedX, doorClosedY, doorClosedZ);
  }

  group.add(slidingDoorGroup);

  // ==========================================
  // 12. EQUIPO DE CLIMATIZACIÓN EN TECHO (A/C)
  // ==========================================

  const acGeom = new THREE.BoxGeometry(W * 0.55, 0.18, cabinL * 0.35);
  const acMesh = new THREE.Mesh(acGeom, paintMaterial);
  acMesh.position.set(0, bodyCenterY + mainCabinHeight * 0.5 + 0.1, mainCabin.position.z);
  group.add(acMesh);

  return {
    group,
    slidingDoorGroup,
    doorClosedPos: new THREE.Vector3(doorClosedX, doorClosedY, doorClosedZ),
    doorOpenPos: new THREE.Vector3(doorClosedX + 0.12, doorClosedY, doorClosedZ - doorW * 0.85),
    materials: {
      paintMaterial,
      ledHeadlightMaterial
    }
  };
}

// =========================================================================
// HELPERS PARA RUEDAS, ASIENTOS Y PATENTES
// =========================================================================

function createRealisticAlloyWheel(radius, tireMat, rimMat, discMat, caliperMat, isRightSide) {
  const wheel = new THREE.Group();
  const width = 0.24;

  // Neumático de goma
  const tireGeom = new THREE.CylinderGeometry(radius, radius, width, 24);
  const tire = new THREE.Mesh(tireGeom, tireMat);
  tire.rotation.z = Math.PI / 2;
  tire.castShadow = true;
  wheel.add(tire);

  // Llanta de aleación exterior
  const rimRadius = radius * 0.65;
  const rimGeom = new THREE.CylinderGeometry(rimRadius, rimRadius, width * 1.02, 20);
  const rim = new THREE.Mesh(rimGeom, rimMat);
  rim.rotation.z = Math.PI / 2;
  wheel.add(rim);

  // Rayos de aleación deportiva (5 rayos dobles)
  for (let s = 0; s < 5; s++) {
    const angle = (s * 72) * (Math.PI / 180);
    const spokeGeom = new THREE.BoxGeometry(0.035, rimRadius * 0.85, width * 1.04);
    const spoke = new THREE.Mesh(spokeGeom, rimMat);
    spoke.rotation.x = angle;
    spoke.position.set((isRightSide ? 0.02 : -0.02), Math.sin(angle) * rimRadius * 0.35, Math.cos(angle) * rimRadius * 0.35);
    wheel.add(spoke);
  }

  // Disco de freno ventilado interior
  const discGeom = new THREE.CylinderGeometry(rimRadius * 0.78, rimRadius * 0.78, 0.02, 16);
  const disc = new THREE.Mesh(discGeom, discMat);
  disc.rotation.z = Math.PI / 2;
  disc.position.set((isRightSide ? -0.04 : 0.04), 0, 0);
  wheel.add(disc);

  // Cáliper de freno deportivo rojo
  const caliperGeom = new THREE.BoxGeometry(0.04, 0.12, 0.08);
  const caliper = new THREE.Mesh(caliperGeom, caliperMat);
  caliper.position.set((isRightSide ? -0.04 : 0.04), rimRadius * 0.45, 0);
  wheel.add(caliper);

  return wheel;
}

function createRealisticSeat(fabricMat, frameMat, isDouble = false) {
  const seat = new THREE.Group();
  const seatWidth = isDouble ? 0.85 : 0.45;

  // Base y cojín inferior
  const baseGeom = new THREE.BoxGeometry(seatWidth, 0.12, 0.42);
  const base = new THREE.Mesh(baseGeom, fabricMat);
  base.position.y = 0.28;
  seat.add(base);

  // Respaldo ergonómico alto
  const backGeom = new THREE.BoxGeometry(seatWidth, 0.55, 0.1);
  const back = new THREE.Mesh(backGeom, fabricMat);
  back.rotation.x = -0.1;
  back.position.set(0, 0.58, -0.16);
  seat.add(back);

  // Apoyacabezas
  const headrestGeom = new THREE.BoxGeometry(isDouble ? 0.35 : 0.26, 0.14, 0.08);
  const headrest = new THREE.Mesh(headrestGeom, fabricMat);
  headrest.position.set(0, 0.92, -0.18);
  seat.add(headrest);

  // Pedestal / patas de soporte
  const legGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.28, 8);
  const leg = new THREE.Mesh(legGeom, frameMat);
  leg.position.y = 0.14;
  seat.add(leg);

  return seat;
}

function createMercosurLicensePlate(plateText = 'AF 482 TP') {
  const plateGroup = new THREE.Group();
  const width = 0.42;
  const height = 0.14;

  // Placa base blanca
  const plateBaseGeom = new THREE.BoxGeometry(width, height, 0.015);
  const plateBaseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const plateBase = new THREE.Mesh(plateBaseGeom, plateBaseMat);
  plateGroup.add(plateBase);

  // Banda azul superior Mercosur
  const blueBandGeom = new THREE.BoxGeometry(width, 0.035, 0.018);
  const blueBandMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 });
  const blueBand = new THREE.Mesh(blueBandGeom, blueBandMat);
  blueBand.position.y = (height / 2) - 0.018;
  plateGroup.add(blueBand);

  // Marco negro exterior
  const frameGeom = new THREE.BoxGeometry(width * 1.02, height * 1.04, 0.01);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const frame = new THREE.Mesh(frameGeom, frameMat);
  frame.position.z = -0.005;
  plateGroup.add(frame);

  // Letras de la patente mediante canvas texture nítida
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(0, 0, 256, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('REPUBLICA ARGENTINA', 128, 13);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(plateText || 'AF 482 TP', 128, 52);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  const textMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.96, height * 0.92), textMat);
  textMesh.position.z = 0.01;
  plateGroup.add(textMesh);

  return plateGroup;
}
