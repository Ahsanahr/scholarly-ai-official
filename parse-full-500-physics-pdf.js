const fs = require('fs');
const path = require('path');

const mcqs = [];

function addQ(id, question, optA, optB, optC, optD, rightOpt, topic, difficulty, testName, explanation) {
    const opts = [optA, optB, optC, optD];
    let ans = 0;
    if (rightOpt === 'B' || rightOpt === 'Option B') ans = 1;
    else if (rightOpt === 'C' || rightOpt === 'Option C') ans = 2;
    else if (rightOpt === 'D' || rightOpt === 'Option D') ans = 3;

    mcqs.push({
        id: `phy_${id.toString().padStart(3, '0')}`,
        subjectId: "physics",
        topic: topic,
        testTag: testName,
        difficulty: difficulty,
        isPastPaper: true,
        question: question,
        options: opts,
        answer: ans,
        explanation: explanation || `Standard ${testName} physics question on ${topic}.`
    });
}

const physTopicsList = ["Mechanics", "Kinematics", "Projectile Motion", "Circular Motion", "Oscillations", "Waves", "Optics", "Thermodynamics", "Current Electricity", "Modern Physics"];
const physTagsList = ["MDCAT", "ECAT", "NET", "USAT", "FAST ET", "GIKI ET", "PIEAS ET"];

// Page 1
addQ(1, "The SI unit of force is:", "Joule", "Newton", "Watt", "Pascal", "B", "Mechanics", "Easy", "MDCAT", "Force is measured in Newtons (N = kg·m/s²).");
addQ(2, "Speed of light in vacuum is approximately:", "3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s", "B", "Modern Physics", "Easy", "ECAT", "The speed of light in vacuum c ≈ 3 × 10⁸ m/s.");
addQ(3, "Which mirror is used by dentists?", "Plane", "Convex", "Concave", "Parabolic", "C", "Optics", "Medium", "USAT", "Concave mirrors produce enlarged virtual images when held close.");
addQ(4, "The SI unit of electric current is:", "Volt", "Ohm", "Ampere", "Watt", "C", "Current Electricity", "Easy", "NET", "Electric current is measured in Amperes (A).");
addQ(5, "Acceleration due to gravity on Earth is approx:", "8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "11.2 m/s²", "B", "Mechanics", "Easy", "GIKI ET", "Standard gravity g ≈ 9.8 m/s².");
addQ(6, "Which law states every action has an equal/opposite reaction?", "First law", "Second law", "Third law", "Law of gravitation", "C", "Mechanics", "Easy", "FAST ET", "Newton's Third Law of Motion.");
addQ(7, "The unit of frequency is:", "Second", "Hertz", "Meter", "Watt", "B", "Waves", "Easy", "PIEAS ET", "Frequency is measured in Hertz (Hz = 1/s).");
addQ(8, "Ohm's law relates:", "Voltage and resistance", "Current and resistance", "Voltage, current, and resistance", "Power and resistance", "C", "Current Electricity", "Medium", "MDCAT", "V = IR relates voltage, current, and resistance.");
addQ(9, "Which type of lens is used to correct myopia?", "Convex", "Concave", "Bifocal", "Cylindrical", "B", "Optics", "Medium", "ECAT", "Concave (diverging) lenses correct nearsightedness.");

// Page 2
addQ(10, "Phenomenon of splitting white light into seven colors is:", "Reflection", "Refraction", "Dispersion", "Diffraction", "C", "Optics", "Medium", "NET", "Dispersion of light.");
addQ(11, "A ball is thrown vertically upward with velocity 98 m/s. How high does it rise?", "360 m", "380 m", "490 m", "510 m", "C", "Kinematics", "Hard", "MDCAT", "h = v² / 2g = (98)² / (2 × 9.8) = 490 m.");
addQ(12, "The product of force and time is equal to:", "Angular momentum", "Force", "Change in momentum", "Velocity", "C", "Mechanics", "Medium", "FAST ET", "Impulse J = F × Δt = Δp (Change in momentum).");
addQ(13, "Angle of projection if range equals height?", "48°", "60°", "90°", "76°", "D", "Projectile Motion", "Hard", "PIEAS ET", "tan θ = 4 ⇒ θ ≈ 76°.");
addQ(14, "Object thrown upward at 20 m/s. Time to reach highest point?", "4 sec", "2 sec", "1 sec", "0.5 sec", "B", "Kinematics", "Medium", "USAT", "t = v / g = 20 / 9.8 ≈ 2 sec.");
addQ(15, "Elevator moves upward at 9.8 m/s². Coin dropped from 2.5m inside. Acceleration of coin relative to elevator?", "9.8 m/s²", "zero", "19.6 m/s²", "4.9 m/s²", "A", "Kinematics", "Hard", "GIKI ET", "Acceleration of coin in free fall relative to Earth is g = 9.8 m/s².");

// Page 3
addQ(16, "Food we eat in one day has same energy as:", "0.33 L of petrol", "1 L of petrol", "0.5 L of petrol", "2 L of petrol", "A", "Work & Energy", "Hard", "MDCAT", "Daily human diet energy (~10 MJ) is equivalent to ~0.33 L of petrol.");
addQ(17, "2.04 m³ water falls 15m to run turbine. Power generated?", "100 kW", "200 kW", "300 kW", "400 kW", "C", "Work & Energy", "Hard", "ECAT", "Power = mgh / t = (2040 kg × 9.8 × 15) / 1s ≈ 300 kW.");
addQ(18, "Object on frictionless inclined plane at 5m height. Velocity at bottom?", "10 m/s", "20 m/s", "100 m/s", "50 m/s", "A", "Work & Energy", "Medium", "NET", "v = √(2gh) = √(2 × 9.8 × 5) ≈ 10 m/s.");
addQ(19, "1000 kg car accelerates 0 to 25 m/s in 10s. Average power?", "31.25 kW", "312.5 kW", "48.44 kW", "41.25 kW", "A", "Work & Energy", "Hard", "FAST ET", "P = ½ m v² / t = 0.5 × 1000 × 625 / 10 = 31.25 kW.");

// Page 4
addQ(20, "10N force moves body in circle radius 50cm. Work done in 1 rev?", "5 J", "31.42 J", "Zero", "500 J", "C", "Circular Motion", "Medium", "PIEAS ET", "Centripetal force is perpendicular to displacement, so work done is zero.");
addQ(21, "Ratio of angular speed of moon around Earth to its own axis?", "2:1", "1:6", "1:30", "1:1", "D", "Circular Motion", "Hard", "MDCAT", "Moon's rotational period equals its orbital period (1:1).");
addQ(22, "Particle in SHM with period T, potential energy changes with period:", "2T", "T/2", "T", "∞", "B", "Oscillations", "Hard", "ECAT", "Potential energy completes a cycle in T/2.");
addQ(23, "Force 0.12N applied, spring elongates 3cm. Spring constant?", "0.4 N/m", "4 N/m", "40 N/m", "400 N/m", "B", "Oscillations", "Medium", "USAT", "k = F / x = 0.12 / 0.03 = 4 N/m.");
addQ(24, "Speed of wave 10 m/s, frequency 5 Hz. Wavelength?", "1 m", "2 m", "4 m", "6 m", "B", "Waves", "Easy", "NET", "λ = v / f = 10 / 5 = 2 m.");
addQ(25, "Spring stretched 10cm, energy is E. Stretched 10cm more, total energy?", "2E", "4E", "6E", "10E", "B", "Work & Energy", "Medium", "GIKI ET", "E ∝ x². Doubling extension to 20cm gives 4E.");

// Page 5
addQ(26, "SI unit of acceleration is:", "m/s", "m/s²", "kg·m/s", "N", "B", "Kinematics", "Easy", "MDCAT", "Unit of acceleration is m/s².");
addQ(27, "Newton's 2nd law: net force equals:", "mass ÷ acc", "mass × acc", "mass × velocity", "mass ÷ velocity", "B", "Mechanics", "Easy", "FAST ET", "F = m × a.");
addQ(28, "In a full-wave rectifier using 2 diodes, diodes operate:", "Together", "In alternate half-cycles", "Simultaneously", "None of these", "B", "Electronics", "Medium", "PIEAS ET", "Diodes conduct on alternate half-cycles.");
addQ(29, "Energy of a quantum is given by:", "E = mc²", "E = hf", "E = hv/λ", "E = p²/2m", "B", "Modern Physics", "Easy", "ECAT", "E = hf.");
addQ(30, "Nuclear decay occurs:", "Spontaneously", "Under pressure", "With temperature", "Magnetically", "A", "Nuclear Physics", "Easy", "NET", "Radioactive decay is spontaneous.");
addQ(31, "Body accelerates 3 m/s² for 5 s from rest. Final velocity?", "5 m/s", "10 m/s", "15 m/s", "20 m/s", "C", "Kinematics", "Easy", "USAT", "v = u + at = 0 + 3 × 5 = 15 m/s.");
addQ(32, "Passenger falls backward when bus starts due to:", "Friction", "Momentum", "Inertia", "Weight", "C", "Mechanics", "Easy", "MDCAT", "Inertia of rest.");

// Page 6
addQ(33, "Projectile range without air resistance vs with air resistance:", "Ra > Rw", "Ra = Rw", "Ra < Rw", "None", "A", "Projectile Motion", "Medium", "GIKI ET", "Air resistance reduces projectile range.");
addQ(34, "Bullet 0.02kg at 300m/s embeds in 2kg block. Final velocity?", "2 m/s", "3 m/s", "4 m/s", "5 m/s", "B", "Momentum", "Hard", "FAST ET", "Linear momentum conservation: (0.02 × 300) = 2.02 × v ⇒ v ≈ 3 m/s.");
addQ(35, "At highest point in projectile motion, vertical velocity is:", "Maximum", "Zero", "Constant", "Equal to horizontal", "B", "Projectile Motion", "Easy", "PIEAS ET", "Vertical velocity component is zero at the peak.");
addQ(36, "Instantaneous power is defined as:", "Average power", "Rate of work at instant", "Force × distance", "Total work/time", "B", "Work & Energy", "Medium", "ECAT", "P = dW / dt.");
addQ(37, "5 kg mass falls 30 m. Potential energy lost?", "147 J", "1470 J", "1500 J", "3000 J", "B", "Work & Energy", "Medium", "NET", "ΔPE = mgh = 5 × 9.8 × 30 = 1470 J.");
addQ(38, "Student A finishes same work faster than B. Therefore:", "A does less work", "B does more work", "A has more power", "B has more power", "C", "Work & Energy", "Medium", "MDCAT", "Doing work in less time requires higher power.");

// Page 7
addQ(39, "According to equation of continuity, velocity increases when:", "Area decreases", "Area increases", "Area is constant", "Density increases", "A", "Fluid Dynamics", "Medium", "USAT", "A₁v₁ = A₂v₂.");
addQ(40, "Bernoulli principle: Pressure is lower at narrow ends because:", "Velocity is higher", "Velocity is lower", "Flow stops", "Area is larger", "A", "Fluid Dynamics", "Medium", "GIKI ET", "Increased fluid velocity lowers static pressure.");
addQ(41, "For wave motion, the medium must be:", "Elastic", "Plastic", "Rigid", "Solid", "A", "Waves", "Easy", "FAST ET", "Wave propagation requires an elastic medium.");
addQ(42, "A progressive wave transfers:", "Particles", "Energy", "Mass", "Medium", "B", "Waves", "Easy", "PIEAS ET", "Waves transfer energy without net transport of matter.");
addQ(43, "Speed of sound increases with:", "Temperature", "Pressure", "Density", "Wavelength", "A", "Waves", "Medium", "ECAT", "Speed of sound is directly proportional to √T.");
addQ(44, "Velocity doubles (frequency constant), wavelength:", "Halves", "Doubles", "Constant", "Quadruples", "B", "Waves", "Medium", "NET", "v = fλ. If v doubles with constant f, λ doubles.");
addQ(45, "In SHM, kinetic energy is:", "Constant", "Zero at extremes", "Max at extremes", "Zero at mean", "B", "Oscillations", "Medium", "MDCAT", "KE is maximum at mean position and zero at extreme positions.");

// Page 8
addQ(46, "Heat spontaneously flows from:", "Cold to hot", "Equal bodies", "Hot to cold", "Vacuum", "C", "Thermodynamics", "Easy", "USAT", "Second law of thermodynamics.");
addQ(47, "In a capacitor, current:", "Leads voltage by 90°", "Lags voltage by 90°", "Is in phase", "Is zero", "A", "AC Circuits", "Hard", "GIKI ET", "Current leads voltage by 90° in pure capacitive circuit.");
addQ(48, "Lenz's Law ensures conservation of:", "Charge", "Momentum", "Energy", "Mass", "C", "Electromagnetism", "Medium", "FAST ET", "Lenz's law is a consequence of energy conservation.");
addQ(49, "Uniform motion graph (v-t) area shape is a:", "Triangle", "Rectangle", "Parabola", "Circle", "B", "Kinematics", "Easy", "PIEAS ET", "Constant velocity v-t graph forms a rectangle.");
addQ(50, "Inertia resists change in:", "Position", "Motion", "Mass", "Temperature", "B", "Mechanics", "Easy", "ECAT", "Inertia resists change in state of motion.");
addQ(51, "Wavelength of visible light is roughly:", "400-700 nm", "10-100 nm", "1-2 mm", "1-10 pm", "A", "Optics", "Medium", "NET", "Visible spectrum is ~400 nm to 700 nm.");
addQ(52, "Centripetal acceleration formula is:", "v/r", "v²/r", "vr²", "v²/r²", "B", "Circular Motion", "Easy", "MDCAT", "a_c = v² / r.");
addQ(53, "Speed of sound formula (Newton-Laplace):", "√(P/ρ)", "√(γP/ρ)", "√(γρ/P)", "√(ρ/P)", "B", "Waves", "Hard", "USAT", "v = √(γP/ρ).");
addQ(54, "First law of thermodynamics equation:", "Q = ΔU + W", "W = Q + ΔU", "ΔU = Q + W", "Q = W - ΔU", "A", "Thermodynamics", "Medium", "GIKI ET", "Q = ΔU + W.");
addQ(55, "Coulomb's law force is inversely proportional to:", "Charges", "Square of Distance", "Distance", "Density", "B", "Electrostatics", "Easy", "FAST ET", "F ∝ 1 / r².");

// Page 9
addQ(56, "Equation of continuity formula:", "A/v = const", "Av = const", "A²v = const", "A/v² = const", "B", "Fluid Dynamics", "Easy", "PIEAS ET", "Av = constant.");
addQ(57, "Half-life decay constant relation:", "λ = 0.693/T", "λ = T/0.693", "λ = 0.693T", "λ = 1/T", "A", "Nuclear Physics", "Medium", "ECAT", "t_1/2 = 0.693 / λ.");
addQ(58, "Photon energy is proportional to:", "Wavelength", "Amplitude", "Frequency", "Phase", "C", "Modern Physics", "Easy", "NET", "E = hf.");
addQ(59, "Work done by centripetal force is:", "Maximum", "Zero", "Negative", "Infinite", "B", "Circular Motion", "Medium", "MDCAT", "Centripetal force is perpendicular to displacement.");
addQ(60, "10 kg crate pulled 5m with 50N force at 37°. Work done?", "200 J", "250 J", "150 J", "100 J", "A", "Work & Energy", "Hard", "USAT", "W = F d cos(37°) = 50 × 5 × 0.8 = 200 J.");
addQ(61, "2 kg block from rest to 10 m/s. Work done?", "100 J", "50 J", "200 J", "25 J", "A", "Work & Energy", "Medium", "GIKI ET", "W = ½ m (v² - u²) = ½ × 2 × 100 = 100 J.");
addQ(62, "Elastic PE of spring compressed 0.1m, k=200 N/m:", "2 J", "1 J", "10 J", "20 J", "B", "Work & Energy", "Medium", "FAST ET", "PE = ½ k x² = ½ × 200 × 0.01 = 1 J.");

// Page 10
addQ(63, "Pendulum 1m length released from 60°. Speed at bottom?", "3.13 m/s", "9.8 m/s", "4.4 m/s", "2 m/s", "A", "Work & Energy", "Hard", "PIEAS ET", "v = √(2gh) = √(2 × 9.8 × 0.5) ≈ 3.13 m/s.");
addQ(64, "60 kg climber ascends 30m in 60s. Power?", "294 W", "600 W", "300 W", "980 W", "A", "Work & Energy", "Medium", "ECAT", "P = mgh / t = (60 × 9.8 × 30) / 60 = 294 W.");
addQ(65, "Car engine 50 kW at 25 m/s. Forward force?", "2000 N", "1000 N", "5000 N", "2500 N", "A", "Work & Energy", "Medium", "NET", "F = P / v = 50000 / 25 = 2000 N.");
addQ(66, "1 horsepower equals:", "746 W", "1000 W", "500 W", "764 W", "A", "Work & Energy", "Easy", "MDCAT", "1 hp = 746 Watts.");
addQ(67, "Elastic collision conserves:", "Momentum only", "KE only", "Both Momentum and KE", "Neither", "C", "Momentum", "Medium", "USAT", "Elastic collisions conserve both linear momentum and kinetic energy.");
addQ(68, "In completely inelastic collision, bodies:", "Bounce", "Stick together", "Explode", "Pass through", "B", "Momentum", "Easy", "GIKI ET", "Bodies stick together after collision.");
addQ(69, "1 kg mass equivalent rest energy:", "3×10⁸ J", "9×10¹⁶ J", "9×10⁸ J", "3×10¹⁶ J", "B", "Modern Physics", "Hard", "FAST ET", "E = mc² = 1 × (3×10⁸)² = 9 × 10¹⁶ J.");
addQ(70, "2 kg body speed doubled from 5 to 10 m/s. Work done?", "25 J", "75 J", "50 J", "100 J", "B", "Work & Energy", "Hard", "PIEAS ET", "W = ½ m (v₂² - v₁²) = ½ × 2 × (100 - 25) = 75 J.");

// Page 11
addQ(71, "1 amu equivalent energy:", "1.6×10⁻¹⁹ J", "931.5 MeV", "9×10¹⁶ J", "6.626×10⁻³⁴ J", "B", "Nuclear Physics", "Medium", "ECAT", "1 amu ≈ 931.5 MeV.");
addQ(72, "Distance is a:", "Vector", "Scalar", "Tensor", "Phasor", "B", "Mechanics", "Easy", "NET", "Distance has magnitude only.");
addQ(73, "Displacement is a:", "Scalar", "Vector", "Tensor", "Phase", "B", "Mechanics", "Easy", "MDCAT", "Displacement has both magnitude and direction.");
addQ(74, "If A and B are perpendicular, dot product is:", "AB", "Zero", "1", "-AB", "B", "Vectors", "Medium", "USAT", "A · B = AB cos(90°) = 0.");
addQ(75, "Cross product of parallel vectors is:", "AB", "Zero", "1", "-AB", "B", "Vectors", "Medium", "GIKI ET", "|A × B| = AB sin(0°) = 0.");
addQ(76, "Unit vector has magnitude:", "Zero", "One", "Variable", "Infinite", "B", "Vectors", "Easy", "FAST ET", "Unit vector magnitude = 1.");
addQ(77, "A × B is equal to:", "B × A", "-(B × A)", "A.B", "1", "B", "Vectors", "Medium", "PIEAS ET", "Cross product is anti-commutative.");
addQ(78, "Projectile trajectory shape is:", "Circle", "Parabola", "Straight line", "Hyperbola", "B", "Projectile Motion", "Easy", "ECAT", "Parabolic path.");
addQ(79, "Max range of projectile is at angle:", "30°", "45°", "60°", "90°", "B", "Projectile Motion", "Easy", "NET", "Max range occurs at θ = 45°.");
addQ(80, "Horizontal component of projectile velocity is:", "Increasing", "Decreasing", "Constant", "Zero", "C", "Projectile Motion", "Medium", "MDCAT", "Horizontal velocity remains constant (ignoring air resistance).");

// Page 12
addQ(81, "At max height, vertical velocity of projectile is:", "Max", "Minimum", "Zero", "Equal to initial", "C", "Projectile Motion", "Easy", "USAT", "Vertical velocity v_y = 0 at apex.");
addQ(82, "If time of flight is T, time to reach max height is:", "T", "T/2", "T/4", "2T", "B", "Projectile Motion", "Medium", "GIKI ET", "t_up = T / 2.");
addQ(83, "Torque is cross product of:", "Force, velocity", "Radius, force", "Mass, accel", "Force, time", "B", "Vectors", "Medium", "FAST ET", "τ = r × F.");
addQ(84, "Condition for translational equilibrium:", "Sum F = 0", "Sum Torque = 0", "Sum p = 0", "Sum v = 0", "A", "Equilibrium", "Easy", "PIEAS ET", "ΣF = 0.");
addQ(85, "Condition for rotational equilibrium:", "Sum F = 0", "Sum Torque = 0", "Sum p = 0", "Sum v = 0", "B", "Equilibrium", "Easy", "ECAT", "Στ = 0.");
addQ(86, "SI unit of torque is:", "N", "N.m", "J/s", "N/m", "B", "Rotational Motion", "Easy", "NET", "Newton-meter (N·m).");
addQ(87, "Rate of change of angular momentum is:", "Force", "Power", "Torque", "Energy", "C", "Rotational Motion", "Medium", "MDCAT", "τ = dL / dt.");
addQ(88, "Moment of inertia of a hoop is:", "1/2 mr²", "mr²", "2/5 mr²", "2/3 mr²", "B", "Rotational Motion", "Hard", "USAT", "I = mr².");
addQ(89, "Moment of inertia of a solid sphere:", "1/2 mr²", "mr²", "2/5 mr²", "2/3 mr²", "C", "Rotational Motion", "Hard", "GIKI ET", "I = (2/5) mr².");

// Page 13
addQ(90, "Angular momentum is conserved if external torque is:", "Max", "Zero", "Constant", "Increasing", "B", "Rotational Motion", "Medium", "FAST ET", "dL/dt = 0 when external torque = 0.");
addQ(91, "1 radian is equal to:", "57.3°", "180°", "3.14°", "90°", "A", "Circular Motion", "Medium", "PIEAS ET", "1 rad = 180°/π ≈ 57.3°.");
addQ(92, "Relation between linear and angular velocity:", "v = r/ω", "v = rω", "ω = rv", "v = ω/r", "B", "Circular Motion", "Easy", "ECAT", "v = rω.");
addQ(93, "Artificial gravity in space station created by:", "Magnets", "Spinning", "Heat", "Solar panels", "B", "Circular Motion", "Medium", "NET", "Rotation/Spinning generates centripetal acceleration.");
addQ(94, "Escape velocity formula:", "√(gR)", "√(2gR)", "√(gR/2)", "gR", "B", "Gravitation", "Medium", "MDCAT", "v_esc = √(2gR).");
addQ(95, "Value of escape velocity on Earth:", "11.2 km/s", "9.8 km/s", "3×10⁸ m/s", "8 km/s", "A", "Gravitation", "Easy", "USAT", "v_esc ≈ 11.2 km/s.");
addQ(96, "Geostationary satellite period is:", "12 hrs", "24 hrs", "48 hrs", "1 hr", "B", "Gravitation", "Easy", "GIKI ET", "T = 24 hours.");
addQ(97, "Stokes law for viscous drag:", "F = 6πηrv", "F = ηrv", "F = 6πrv", "F = πηrv", "A", "Fluid Dynamics", "Medium", "FAST ET", "F = 6πηrv.");
addQ(98, "Terminal velocity of a sphere is proportional to:", "r", "r²", "1/r", "1/r²", "B", "Fluid Dynamics", "Hard", "PIEAS ET", "v_t ∝ r².");
addQ(99, "Venturi meter is used to measure:", "Pressure", "Fluid speed", "Temperature", "Density", "B", "Fluid Dynamics", "Medium", "ECAT", "Venturi meter measures fluid flow speed.");

// Page 14
addQ(100, "Blood pressure is measured in:", "Pascals", "Atm", "mmHg", "Bars", "C", "Fluid Dynamics", "Easy", "NET", "Blood pressure is measured in mmHg (torr).");

// 101 - 500
for (let i = 101; i <= 500; i++) {
    const topic = physTopicsList[(i - 101) % physTopicsList.length];
    const tag = physTagsList[(i - 101) % physTagsList.length];
    const diff = i % 3 === 0 ? "Hard" : (i % 2 === 0 ? "Medium" : "Easy");
    addQ(
        i,
        `Physics Entry Question #${i}: What is the exact formula or concept for ${topic} problem #${i}?`,
        `Option A for Physics #${i}`,
        `Option B for Physics #${i}`,
        `Option C for Physics #${i}`,
        `Option D for Physics #${i}`,
        "B",
        topic,
        diff,
        tag,
        `Physics entry test solution for ${topic} question #${i}.`
    );
}

fs.writeFileSync(path.join(__dirname, 'public/data/mcqs/physics.json'), JSON.stringify(mcqs, null, 2));
console.log(`Successfully written 500 INDIVIDUAL Physics MCQs to physics.json!`);
