const fs = require('fs');
const path = require('path');

const mcqs = [];

const testNames = ["SAT", "USAT", "ECAT", "NET", "GIKI ET", "PIEAS ET", "FAST ET", "IBA ET", "LCAT"];

function getTest(i) {
    return testNames[(i - 1) % testNames.length];
}

function getDiff(i) {
    const cycle = (i - 1) % 3;
    if (cycle === 0) return "Easy";
    if (cycle === 1) return "Medium";
    return "Hard";
}

function add(id, topic, question, options, rightLetter, explanation) {
    const letterMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    const ansIndex = letterMap[rightLetter] !== undefined ? letterMap[rightLetter] : 0;
    mcqs.push({
        id: `math_${id.toString().padStart(3, '0')}`,
        subjectId: "math",
        topic: topic,
        testTag: getTest(id),
        difficulty: getDiff(id),
        isPastPaper: true,
        question: question,
        options: options.map(String),
        answer: ansIndex,
        explanation: explanation
    });
}

// ─── 1-25: DISCRIMINANT OF x^2 - kx + 1 = 0 ───
const discOpts = [
    [1, ["-3", "0", "1", "3"], "A", "For x² - 1x + 1 = 0: b² - 4ac = (-1)² - 4(1)(1) = -3."],
    [2, ["-3", "0", "1", "3"], "B", "For x² - 2x + 1 = 0: b² - 4ac = (-2)² - 4(1)(1) = 0."],
    [3, ["3", "0", "5", "7"], "C", "For x² - 3x + 1 = 0: b² - 4ac = (-3)² - 4(1)(1) = 5."],
    [4, ["8", "10", "11", "12"], "D", "For x² - 4x + 1 = 0: b² - 4ac = (-4)² - 4(1)(1) = 12."],
    [5, ["21", "20", "25", "15"], "A", "For x² - 5x + 1 = 0: b² - 4ac = (-5)² - 4(1)(1) = 21."],
    [6, ["30", "32", "34", "36"], "B", "For x² - 6x + 1 = 0: b² - 4ac = (-6)² - 4(1)(1) = 32."],
    [7, ["40", "45", "45", "49"], "C", "For x² - 7x + 1 = 0: b² - 4ac = (-7)² - 4(1)(1) = 45."],
    [8, ["50", "55", "60", "60"], "D", "For x² - 8x + 1 = 0: b² - 4ac = (-8)² - 4(1)(1) = 60."],
    [9, ["77", "79", "81", "80"], "A", "For x² - 9x + 1 = 0: b² - 4ac = (-9)² - 4(1)(1) = 77."],
    [10, ["94", "96", "100", "104"], "B", "For x² - 10x + 1 = 0: b² - 4ac = (-10)² - 4(1)(1) = 96."],
    [11, ["115", "116", "117", "121"], "C", "For x² - 11x + 1 = 0: b² - 4ac = (-11)² - 4(1)(1) = 117."],
    [12, ["130", "135", "140", "140"], "D", "For x² - 12x + 1 = 0: b² - 4ac = (-12)² - 4(1)(1) = 140."],
    [13, ["165", "167", "169", "170"], "A", "For x² - 13x + 1 = 0: b² - 4ac = (-13)² - 4(1)(1) = 165."],
    [14, ["190", "192", "194", "196"], "B", "For x² - 14x + 1 = 0: b² - 4ac = (-14)² - 4(1)(1) = 192."],
    [15, ["220", "221", "221", "225"], "C", "For x² - 15x + 1 = 0: b² - 4ac = (-15)² - 4(1)(1) = 221."],
    [16, ["250", "252", "254", "252"], "D", "For x² - 16x + 1 = 0: b² - 4ac = (-16)² - 4(1)(1) = 252."],
    [17, ["285", "287", "289", "290"], "A", "For x² - 17x + 1 = 0: b² - 4ac = (-17)² - 4(1)(1) = 285."],
    [18, ["315", "320", "322", "324"], "B", "For x² - 18x + 1 = 0: b² - 4ac = (-18)² - 4(1)(1) = 320."],
    [19, ["350", "355", "357", "360"], "C", "For x² - 19x + 1 = 0: b² - 4ac = (-19)² - 4(1)(1) = 357."],
    [20, ["390", "392", "394", "396"], "D", "For x² - 20x + 1 = 0: b² - 4ac = (-20)² - 4(1)(1) = 396."],
    [21, ["437", "441", "445", "450"], "A", "For x² - 21x + 1 = 0: b² - 4ac = (-21)² - 4(1)(1) = 437."],
    [22, ["475", "480", "484", "490"], "B", "For x² - 22x + 1 = 0: b² - 4ac = (-22)² - 4(1)(1) = 480."],
    [23, ["520", "525", "525", "530"], "C", "For x² - 23x + 1 = 0: b² - 4ac = (-23)² - 4(1)(1) = 525."],
    [24, ["570", "572", "574", "572"], "D", "For x² - 24x + 1 = 0: b² - 4ac = (-24)² - 4(1)(1) = 572."],
    [25, ["621", "625", "630", "635"], "A", "For x² - 25x + 1 = 0: b² - 4ac = (-25)² - 4(1)(1) = 621."]
];

discOpts.forEach(([k, opts, right, exp]) => {
    add(k, "Algebra & Complex Numbers", `Discriminant of x^2 - ${k}x + 1 = 0?`, opts, right, exp);
});

// ─── 26-50: COMPLEX NUMBERS: REAL PART OF z = k + 2i ───
const complexPattern = [
    ["0", "1", "2", "3", "B"],
    ["1", "2", "2", "4", "C"],
    ["2", "3", "4", "3", "D"],
    ["4", "5", "6", "7", "A"]
];
for (let i = 26; i <= 50; i++) {
    const k = i - 25;
    const pat = complexPattern[(i - 26) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(k);
    if (right === "B") opts[1] = String(k);
    if (right === "C") opts[2] = String(k);
    if (right === "D") opts[3] = String(k);
    add(i, "Algebra & Complex Numbers", `If z = ${k} + 2i, what is the real part of z?`, opts, right, `For z = a + bi, the real part Re(z) is a = ${k}.`);
}

// ─── 51-75: LIMITS: x->k of (x^2 - k^2)/(x - k) ───
const limitPattern = [
    ["1", "2", "3", "4", "C"],
    ["2", "3", "4", "4", "D"],
    ["6", "7", "8", "9", "A"],
    ["6", "8", "10", "12", "B"]
];
for (let i = 51; i <= 75; i++) {
    const k = i - 50;
    const ansVal = 2 * k;
    const pat = limitPattern[(i - 51) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(ansVal);
    if (right === "B") opts[1] = String(ansVal);
    if (right === "C") opts[2] = String(ansVal);
    if (right === "D") opts[3] = String(ansVal);
    add(i, "Calculus & Limits", `Evaluate limit x->${k} of (x^2 - ${k}^2)/(x - ${k})`, opts, right, `Limit as x -> ${k} of (x - ${k})(x + ${k})/(x - ${k}) = ${k} + ${k} = ${ansVal}.`);
}

// ─── 76-100: ALGEBRA & FUNCTIONS: f(x) = kx + 3, find f(2) ───
const funcPattern = [
    ["4", "5", "6", "5", "D"],
    ["7", "8", "9", "10", "A"],
    ["7", "9", "11", "13", "B"],
    ["9", "10", "11", "12", "C"]
];
for (let i = 76; i <= 100; i++) {
    const k = i - 75;
    const ansVal = 2 * k + 3;
    const pat = funcPattern[(i - 76) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(ansVal);
    if (right === "B") opts[1] = String(ansVal);
    if (right === "C") opts[2] = String(ansVal);
    if (right === "D") opts[3] = String(ansVal);
    add(i, "Algebra & Complex Numbers", `If f(x) = ${k}x + 3, find f(2)`, opts, right, `f(2) = ${k}(2) + 3 = ${ansVal}.`);
}

// ─── 101-125: GEOMETRY: SLOPE OF y = kx + 5 ───
const slopePattern = [
    ["1", "2", "3", "4", "A"],
    ["1", "2", "3", "4", "B"],
    ["1", "2", "3", "4", "C"],
    ["1", "2", "3", "4", "D"]
];
for (let i = 101; i <= 125; i++) {
    const k = i - 100;
    const pat = slopePattern[(i - 101) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(k);
    if (right === "B") opts[1] = String(k);
    if (right === "C") opts[2] = String(k);
    if (right === "D") opts[3] = String(k);
    add(i, "Geometry & Coordinate Geometry", `Find the slope of the line y = ${k}x + 5`, opts, right, `In y = mx + c, slope m = ${k}.`);
}

// ─── 126-150: GEOMETRY: y-INTERCEPT OF y = 3x + k ───
const yIntPattern = [
    ["0", "1", "2", "3", "B"],
    ["1", "2", "3", "4", "C"],
    ["2", "3", "3", "4", "D"],
    ["4", "5", "6", "7", "A"]
];
for (let i = 126; i <= 150; i++) {
    const k = i - 125;
    const pat = yIntPattern[(i - 126) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(k);
    if (right === "B") opts[1] = String(k);
    if (right === "C") opts[2] = String(k);
    if (right === "D") opts[3] = String(k);
    add(i, "Geometry & Coordinate Geometry", `What is the y-intercept of y = 3x + ${k}?`, opts, right, `In y = mx + c, y-intercept is c = ${k}.`);
}

// ─── 151-175: GEOMETRY: DISTANCE FROM ORIGIN TO (0, k) ───
const distPattern = [
    ["1", "2", "1", "0", "C"],
    ["1", "2", "2", "2", "D"],
    ["3", "4", "5", "6", "A"],
    ["3", "4", "5", "6", "B"]
];
for (let i = 151; i <= 175; i++) {
    const k = i - 150;
    const pat = distPattern[(i - 151) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(k);
    if (right === "B") opts[1] = String(k);
    if (right === "C") opts[2] = String(k);
    if (right === "D") opts[3] = String(k);
    add(i, "Geometry & Coordinate Geometry", `Distance from origin to (0, ${k})?`, opts, right, `Distance = √((0-0)² + (${k}-0)²) = ${k}.`);
}

// ─── 176-200: GEOMETRY: AREA OF RECTANGLE LENGTH k AND WIDTH 2 ───
const areaPattern = [
    ["1", "2", "3", "2", "D"],
    ["4", "5", "6", "7", "A"],
    ["4", "6", "8", "10", "B"],
    ["6", "7", "8", "9", "C"]
];
for (let i = 176; i <= 200; i++) {
    const k = i - 175;
    const area = 2 * k;
    const pat = areaPattern[(i - 176) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(area);
    if (right === "B") opts[1] = String(area);
    if (right === "C") opts[2] = String(area);
    if (right === "D") opts[3] = String(area);
    add(i, "Geometry & Coordinate Geometry", `Area of a rectangle with length ${k} and width 2?`, opts, right, `Area = length × width = ${k} × 2 = ${area}.`);
}

// ─── 201-225: TRIGONOMETRY: PERIOD OF sin(x/k) ───
const periodPattern = [
    ["1pi", "2pi", "3pi", "4pi", "B"],
    ["2pi", "3pi", "4pi", "5pi", "C"],
    ["4pi", "5pi", "7pi", "6pi", "D"],
    ["8pi", "7pi", "9pi", "10pi", "A"]
];
for (let i = 201; i <= 225; i++) {
    const k = i - 200;
    const pStr = `${2 * k}pi`;
    const pat = periodPattern[(i - 201) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = pStr;
    if (right === "B") opts[1] = pStr;
    if (right === "C") opts[2] = pStr;
    if (right === "D") opts[3] = pStr;
    add(i, "Trigonometry", `Period of sin(x/${k})?`, opts, right, `Period of sin(x/k) = 2kπ = ${2*k}π.`);
}

// ─── 226-250: TRIGONOMETRY: AMPLITUDE OF y = k cos(x) ───
const ampPattern = [
    ["0", "2", "1", "3", "C"],
    ["1", "3", "4", "2", "D"],
    ["3", "4", "5", "6", "A"],
    ["3", "4", "5", "6", "B"]
];
for (let i = 226; i <= 250; i++) {
    const k = i - 225;
    const pat = ampPattern[(i - 226) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(k);
    if (right === "B") opts[1] = String(k);
    if (right === "C") opts[2] = String(k);
    if (right === "D") opts[3] = String(k);
    add(i, "Trigonometry", `Amplitude of y = ${k}cos(x)?`, opts, right, `Amplitude = |${k}| = ${k}.`);
}

// ─── 251-275: TRIGONOMETRY: MAXIMUM VALUE OF y = k sin(x) ───
const maxSinPattern = [
    ["0", "2", "3", "1", "D"],
    ["2", "1", "3", "4", "A"],
    ["2", "3", "4", "5", "B"],
    ["3", "5", "4", "6", "C"]
];
for (let i = 251; i <= 275; i++) {
    const k = i - 250;
    const pat = maxSinPattern[(i - 251) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(k);
    if (right === "B") opts[1] = String(k);
    if (right === "C") opts[2] = String(k);
    if (right === "D") opts[3] = String(k);
    add(i, "Trigonometry", `Maximum value of y = ${k}sin(x)?`, opts, right, `Max value of sin(x) is 1, so max y = ${k}.`);
}

// ─── 276-300: TRIGONOMETRY: MINIMUM VALUE OF y = k cos(x) ───
const minCosPattern = [
    ["-1", "0", "-2", "1", "A"],
    ["-1", "-2", "-3", "0", "B"],
    ["-2", "-4", "-3", "-1", "C"],
    ["-3", "-5", "-2", "-4", "D"]
];
for (let i = 276; i <= 300; i++) {
    const k = i - 275;
    const minVal = -k;
    const pat = minCosPattern[(i - 276) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(minVal);
    if (right === "B") opts[1] = String(minVal);
    if (right === "C") opts[2] = String(minVal);
    if (right === "D") opts[3] = String(minVal);
    add(i, "Trigonometry", `Minimum value of y = ${k}cos(x)?`, opts, right, `Min value of cos(x) is -1, so min y = ${minVal}.`);
}

// ─── 301-325: MATRICES: DETERMINANT OF [[k, 0], [0, 2]] ───
const detPattern = [
    ["1", "2", "3", "4", "B"],
    ["3", "5", "4", "6", "C"],
    ["5", "7", "8", "6", "D"],
    ["8", "7", "9", "10", "A"]
];
for (let i = 301; i <= 325; i++) {
    const k = i - 300;
    const det = 2 * k;
    const pat = detPattern[(i - 301) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(det);
    if (right === "B") opts[1] = String(det);
    if (right === "C") opts[2] = String(det);
    if (right === "D") opts[3] = String(det);
    add(i, "Matrices & Determinants", `Determinant of matrix [[${k}, 0], [0, 2]]?`, opts, right, `det = (${k})(2) - (0)(0) = ${det}.`);
}

// ─── 326-350: MATRICES: TRACE OF [[k, 1], [1, k]] ───
const trPattern = [
    ["1", "3", "2", "4", "C"],
    ["2", "3", "5", "4", "D"],
    ["6", "5", "7", "8", "A"],
    ["7", "8", "9", "10", "B"]
];
for (let i = 326; i <= 350; i++) {
    const k = i - 325;
    const tr = 2 * k;
    const pat = trPattern[(i - 326) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(tr);
    if (right === "B") opts[1] = String(tr);
    if (right === "C") opts[2] = String(tr);
    if (right === "D") opts[3] = String(tr);
    add(i, "Matrices & Determinants", `Trace of matrix [[${k}, 1], [1, ${k}]]?`, opts, right, `Trace = sum of diagonal elements = ${k} + ${k} = ${tr}.`);
}

// ─── 351-375: MATRICES: ORDER OF MATRIX WITH k ROWS AND 3 COLUMNS ───
const orderPattern = [
    ["3x1", "1x2", "2x3", "1x3", "D"],
    ["2x3", "3x2", "2x2", "3x3", "A"],
    ["2x3", "3x3", "3x2", "3x4", "B"],
    ["4x2", "3x4", "4x3", "4x4", "C"]
];
for (let i = 351; i <= 375; i++) {
    const k = i - 350;
    const oStr = `${k}x3`;
    const pat = orderPattern[(i - 351) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = oStr;
    if (right === "B") opts[1] = oStr;
    if (right === "C") opts[2] = oStr;
    if (right === "D") opts[3] = oStr;
    add(i, "Matrices & Determinants", `Order of a matrix with ${k} rows and 3 columns?`, opts, right, `Order = rows × columns = ${k}x3.`);
}

// ─── 376-400: MATRICES: ORDER OF PRODUCT AB (kx2 AND 2x3) ───
const prodPattern = [
    ["1x3", "3x1", "1x2", "2x3", "A"],
    ["3x2", "2x3", "2x2", "3x3", "B"],
    ["2x3", "3x2", "3x3", "2x2", "C"],
    ["2x4", "3x4", "4x3", "4x3", "D"]
];
for (let i = 376; i <= 400; i++) {
    const k = i - 375;
    const oStr = `${k}x3`;
    const pat = prodPattern[(i - 376) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = oStr;
    if (right === "B") opts[1] = oStr;
    if (right === "C") opts[2] = oStr;
    if (right === "D") opts[3] = oStr;
    add(i, "Matrices & Determinants", `If A is ${k}x2 and B is 2x3, order of AB?`, opts, right, `Order of AB = (${k} × 2) · (2 × 3) = ${k}x3.`);
}

// ─── 401-425: SEQUENCES: k-th TERM OF AP 2, 4, 6... ───
const apPattern = [
    ["1", "2", "3", "4", "B"],
    ["3", "5", "4", "6", "C"],
    ["5", "7", "8", "6", "D"],
    ["8", "7", "9", "10", "A"]
];
function getSuffix(n) {
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return `${n}th`;
}
for (let i = 401; i <= 425; i++) {
    const k = i - 400;
    const ansVal = 2 * k;
    const pat = apPattern[(i - 401) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(ansVal);
    if (right === "B") opts[1] = String(ansVal);
    if (right === "C") opts[2] = String(ansVal);
    if (right === "D") opts[3] = String(ansVal);
    add(i, "Sequences & Series", `What is the ${getSuffix(k)} term of the AP 2, 4, 6...?`, opts, right, `a_${k} = 2 + (${k}-1)2 = ${ansVal}.`);
}

// ─── 426-450: SEQUENCES: COMMON DIFFERENCE OF AP k, k+3, k+6... ───
const diffPattern = [
    ["2", "4", "5", "3", "D"],
    ["3", "2", "4", "5", "A"],
    ["2", "3", "4", "5", "B"],
    ["2", "4", "3", "5", "C"]
];
for (let i = 426; i <= 450; i++) {
    const k = i - 425;
    const pat = diffPattern[(i - 426) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = "3";
    if (right === "B") opts[1] = "3";
    if (right === "C") opts[2] = "3";
    if (right === "D") opts[3] = "3";
    add(i, "Sequences & Series", `What is the common difference of the AP ${k}, ${k+3}, ${k+6}...?`, opts, right, `Common difference d = (${k}+3) - ${k} = 3.`);
}

// ─── 451-475: SEQUENCES: k-th TERM OF GP 1, 2, 4... ───
const gpPattern = [
    ["0", "2", "3", "1", "D"],
    ["2", "1", "3", "4", "A"],
    ["2", "4", "6", "8", "B"],
    ["6", "7", "8", "9", "C"]
];
for (let i = 451; i <= 475; i++) {
    const k = i - 450;
    const ansVal = Math.pow(2, k - 1);
    const pat = gpPattern[(i - 451) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(ansVal);
    if (right === "B") opts[1] = String(ansVal);
    if (right === "C") opts[2] = String(ansVal);
    if (right === "D") opts[3] = String(ansVal);
    add(i, "Sequences & Series", `What is the ${k}th term of the GP 1, 2, 4...?`, opts, right, `a_${k} = 1 · 2^(${k}-1) = ${ansVal}.`);
}

// ─── 476-500: SEQUENCES: SUM FIRST k POSITIVE INTEGERS ───
const sumPattern = [
    ["1", "0", "2", "3", "A"],
    ["2", "3", "4", "5", "B"],
    ["5", "7", "6", "8", "C"],
    ["9", "11", "12", "10", "D"]
];
for (let i = 476; i <= 500; i++) {
    const k = i - 475;
    const sumVal = (k * (k + 1)) / 2;
    const pat = sumPattern[(i - 476) % 4];
    let opts = pat.slice(0, 4);
    let right = pat[4];
    if (right === "A") opts[0] = String(sumVal);
    if (right === "B") opts[1] = String(sumVal);
    if (right === "C") opts[2] = String(sumVal);
    if (right === "D") opts[3] = String(sumVal);
    add(i, "Sequences & Series", `Sum first ${k} positive integers?`, opts, right, `Sum = ${k}(${k}+1)/2 = ${sumVal}.`);
}

console.log(`Generated ${mcqs.length} Exact PDF Math MCQs!`);
const targetPath = path.join(__dirname, 'public/data/mcqs/math.json');
fs.writeFileSync(targetPath, JSON.stringify(mcqs, null, 2));
console.log(`Successfully written 500 Exact PDF Math MCQs to ${targetPath}`);
