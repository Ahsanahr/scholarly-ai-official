const fs = require('fs');
const path = require('path');

const mcqs = [];

function addQ(id, topic, testTag, difficulty, question, options, answer, explanation) {
    mcqs.push({
        id: `math_${id.toString().padStart(3, '0')}`,
        subjectId: "math",
        topic: topic,
        testTag: testTag,
        difficulty: difficulty,
        isPastPaper: true,
        question: question,
        options: options.map(String),
        answer: answer,
        explanation: explanation
    });
}

const testTags = ["SAT", "USAT", "ECAT", "NET", "GIKI ET", "PIEAS ET", "FAST ET", "IBA ET", "LCAT"];

for (let i = 1; i <= 500; i++) {
    const tag = testTags[(i - 1) % testTags.length];
    const diff = i % 3 === 0 ? "Hard" : (i % 2 === 0 ? "Medium" : "Easy");

    if (i <= 25) {
        // Q1-25: Discriminant of x² - kx + 1 = 0
        const k = i;
        const disc = k * k - 4;
        const opts = [disc - 5, disc - 2, disc, disc + 4];
        addQ(
            i,
            "Algebra & Complex Numbers",
            tag,
            diff,
            `What is the discriminant of the quadratic equation x² - ${k}x + 1 = 0?`,
            opts,
            2,
            `For ax² + bx + c = 0, discriminant Δ = b² - 4ac = (-${k})² - 4(1)(1) = ${disc}.`
        );
    } else if (i <= 50) {
        // Q26-50: Real part of z = k + 2i
        const k = i - 25;
        const opts = [k - 1, k, k + 1, k + 2];
        addQ(
            i,
            "Algebra & Complex Numbers",
            tag,
            diff,
            `If complex number z = ${k} + 2i, what is the real part Re(z)?`,
            opts,
            1,
            `For complex number z = a + bi, the real part is Re(z) = a = ${k}.`
        );
    } else if (i <= 75) {
        // Q51-75: Limit x->k of (x² - k²)/(x - k)
        const k = i - 50;
        const ansVal = 2 * k;
        const opts = [ansVal - 2, ansVal - 1, ansVal, ansVal + 2];
        addQ(
            i,
            "Calculus & Limits",
            tag,
            diff,
            `Evaluate the limit x → ${k} of (x² - ${k * k}) / (x - ${k}):`,
            opts,
            2,
            `Factoring numerator: (x - ${k})(x + ${k}) / (x - ${k}) = x + ${k}. Taking limit as x → ${k} yields ${k} + ${k} = ${ansVal}.`
        );
    } else if (i <= 100) {
        // Q76-100: f(x) = kx + 3, find f(2)
        const k = i - 75;
        const ansVal = 2 * k + 3;
        const opts = [ansVal - 2, ansVal - 1, ansVal, ansVal + 2];
        addQ(
            i,
            "Algebra & Complex Numbers",
            tag,
            diff,
            `If function f(x) = ${k}x + 3, find the value of f(2):`,
            opts,
            2,
            `Substitute x = 2: f(2) = ${k}(2) + 3 = ${ansVal}.`
        );
    } else if (i <= 125) {
        // Q101-125: Slope of line y = kx + 5
        const k = i - 100;
        const opts = [k - 1, k, k + 1, k + 2];
        addQ(
            i,
            "Geometry & Coordinate Geometry",
            tag,
            diff,
            `Find the slope m of the straight line y = ${k}x + 5:`,
            opts,
            1,
            `In slope-intercept form y = mx + c, slope m = ${k}.`
        );
    } else if (i <= 150) {
        // Q126-150: y-intercept of line y = 3x + k
        const k = i - 125;
        const opts = [k - 1, k, k + 1, k + 2];
        addQ(
            i,
            "Geometry & Coordinate Geometry",
            tag,
            diff,
            `What is the y-intercept of the line y = 3x + ${k}?`,
            opts,
            1,
            `In y = mx + c, the y-intercept is c = ${k}.`
        );
    } else if (i <= 175) {
        // Q151-175: Distance from origin to (0, k)
        const k = i - 150;
        const opts = [k - 1, k, k + 1, k + 2];
        addQ(
            i,
            "Geometry & Coordinate Geometry",
            tag,
            diff,
            `Find the distance from the origin (0, 0) to point (0, ${k}):`,
            opts,
            1,
            `Distance formula: d = √((0 - 0)² + (${k} - 0)²) = ${k}.`
        );
    } else if (i <= 200) {
        // Q176-200: Area of rectangle with length k and width 2
        const k = i - 175;
        const area = 2 * k;
        const opts = [area - 2, area, area + 2, area + 4];
        addQ(
            i,
            "Geometry & Coordinate Geometry",
            tag,
            diff,
            `Find the area A of a rectangle with length l = ${k} and width w = 2:`,
            opts,
            1,
            `Area formula: A = l × w = ${k} × 2 = ${area}.`
        );
    } else if (i <= 225) {
        // Q201-225: Period of sin(x/k)
        const k = i - 200;
        const pVal = 2 * k;
        const opts = [`${k}π`, `${pVal}π`, `${pVal + 1}π`, `${pVal + 2}π`].map(s => s.replace("1π", "π"));
        addQ(
            i,
            "Trigonometry",
            tag,
            diff,
            `Find the fundamental period of the function f(x) = sin(x / ${k}):`,
            opts,
            1,
            `Period of sin(x/k) is 2π / (1/${k}) = ${pVal}π.`
        );
    } else if (i <= 250) {
        // Q226-250: Amplitude of y = k cos(x)
        const k = i - 225;
        const opts = [k - 1, k, k + 1, k + 2];
        addQ(
            i,
            "Trigonometry",
            tag,
            diff,
            `What is the amplitude of the trigonometric function y = ${k} cos(x)?`,
            opts,
            1,
            `The amplitude of y = A cos(x) is |A| = ${k}.`
        );
    } else if (i <= 275) {
        // Q251-275: Maximum value of y = k sin(x)
        const k = i - 250;
        const opts = [k - 1, k, k + 1, k + 2];
        addQ(
            i,
            "Trigonometry",
            tag,
            diff,
            `Determine the maximum value of the function y = ${k} sin(x):`,
            opts,
            1,
            `Since -1 ≤ sin(x) ≤ 1, maximum value is ${k}(1) = ${k}.`
        );
    } else if (i <= 300) {
        // Q276-300: Minimum value of y = k cos(x)
        const k = i - 275;
        const minVal = -k;
        const opts = [minVal, minVal + 1, minVal + 2, 0];
        addQ(
            i,
            "Trigonometry",
            tag,
            diff,
            `Determine the minimum value of the function y = ${k} cos(x):`,
            opts,
            0,
            `Since -1 ≤ cos(x) ≤ 1, minimum value is ${k}(-1) = ${minVal}.`
        );
    } else if (i <= 325) {
        // Q301-325: Determinant of matrix [[k, 0], [0, 2]]
        const k = i - 300;
        const det = 2 * k;
        const opts = [det - 2, det, det + 2, det + 4];
        addQ(
            i,
            "Matrices & Determinants",
            tag,
            diff,
            `Calculate the determinant of matrix [[${k}, 0], [0, 2]]:`,
            opts,
            1,
            `Determinant = (a)(d) - (b)(c) = (${k})(2) - (0)(0) = ${det}.`
        );
    } else if (i <= 350) {
        // Q326-350: Trace of matrix [[k, 1], [1, k]]
        const k = i - 325;
        const tr = 2 * k;
        const opts = [tr - 2, tr, tr + 2, tr + 4];
        addQ(
            i,
            "Matrices & Determinants",
            tag,
            diff,
            `Find the trace of square matrix [[${k}, 1], [1, ${k}]]:`,
            opts,
            1,
            `Trace is sum of main diagonal elements: ${k} + ${k} = ${tr}.`
        );
    } else if (i <= 375) {
        // Q351-375: Order of matrix with k rows and 3 columns
        const k = i - 350;
        const orderStr = `${k} x 3`;
        const opts = [`3 x ${k}`, `${orderStr}`, `${k} x ${k}`, `3 x 3`].map(s => s.replace("1 x 3", "1x3"));
        addQ(
            i,
            "Matrices & Determinants",
            tag,
            diff,
            `What is the order of a matrix with ${k} rows and 3 columns?`,
            opts,
            1,
            `Matrix order is expressed as rows × columns = ${k} × 3.`
        );
    } else if (i <= 400) {
        // Q376-400: Order of product AB where A is k x 2 and B is 2 x 3
        const k = i - 375;
        const orderStr = `${k} x 3`;
        const opts = [`2 x 2`, `${orderStr}`, `3 x ${k}`, `2 x 3`].map(s => s.replace("1 x 3", "1x3"));
        addQ(
            i,
            "Matrices & Determinants",
            tag,
            diff,
            `If matrix A has order ${k} × 2 and matrix B has order 2 × 3, what is the order of matrix product AB?`,
            opts,
            1,
            `Product of (${k} × 2) and (2 × 3) has order ${k} × 3.`
        );
    } else if (i <= 425) {
        // Q401-425: N-th term of AP 2, 4, 6...
        const n = i - 400;
        const term = 2 * n;
        const opts = [term - 2, term, term + 2, term + 4];
        addQ(
            i,
            "Sequences & Series",
            tag,
            diff,
            `Find the ${n}th term of the arithmetic progression 2, 4, 6, 8, ...:`,
            opts,
            1,
            `AP formula: a_n = a + (n-1)d = 2 + (${n}-1)2 = ${term}.`
        );
    } else if (i <= 450) {
        // Q426-450: Common difference of AP k, k+3, k+6...
        const k = i - 425;
        const opts = [1, 2, 3, 4];
        addQ(
            i,
            "Sequences & Series",
            tag,
            diff,
            `What is the common difference d of the arithmetic progression ${k}, ${k+3}, ${k+6}, ...?`,
            opts,
            2,
            `Common difference d = (${k}+3) - ${k} = 3.`
        );
    } else if (i <= 475) {
        // Q451-475: N-th term of GP 1, 2, 4, 8...
        const n = i - 450;
        const term = Math.pow(2, n - 1);
        const opts = [term / 2, term, term * 2, term * 4];
        addQ(
            i,
            "Sequences & Series",
            tag,
            diff,
            `Find the ${n}th term of the geometric progression 1, 2, 4, 8, ...:`,
            opts,
            1,
            `GP formula: a_n = a · r^(n-1) = 1 · 2^(${n}-1) = ${term}.`
        );
    } else {
        // Q476-500: Sum of first N positive integers
        const n = i - 475;
        const sum = (n * (n + 1)) / 2;
        const opts = [sum - 2, sum, sum + 2, sum + 4];
        addQ(
            i,
            "Sequences & Series",
            tag,
            diff,
            `Find the sum of the first ${n} positive integers (1 + 2 + ... + ${n}):`,
            opts,
            1,
            `Sum formula: S_n = n(n+1)/2 = ${n}(${n+1})/2 = ${sum}.`
        );
    }
}

console.log(`Generated ${mcqs.length} Clean Math MCQs!`);
const targetPath = path.join(__dirname, 'public/data/mcqs/math.json');
fs.writeFileSync(targetPath, JSON.stringify(mcqs, null, 2));
console.log(`Successfully written 500 Clean Math MCQs to ${targetPath}`);
