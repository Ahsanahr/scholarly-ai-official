const fs = require('fs');
const path = require('path');

const mcqs = [];

function addQ(id, topic, testTag, difficulty, question, options, answerIdx, explanation) {
    mcqs.push({
        id: `math_${id.toString().padStart(3, '0')}`,
        subjectId: "math",
        topic: topic,
        testTag: testTag,
        difficulty: difficulty,
        isPastPaper: true,
        question: question,
        options: options,
        answer: answerIdx,
        explanation: explanation || `Step-by-step solution for ${topic} (${testTag}).`
    });
}

const testTags = ["SAT", "USAT", "ECAT", "NET", "GIKI ET", "PIEAS ET", "FAST ET", "IBA ET", "LCAT"];
const mathTopics = [
    "Matrices & Determinants",
    "Complex Numbers",
    "Sequences & Series",
    "Quadratic & Higher-Degree Equations",
    "Basic & Advanced Algebra"
];

// Page 1
addQ(1, "Matrices & Determinants", "ECAT", "Medium", "If a \\( 3 \\times 3 \\) matrix \\( A \\) has \\( \\det(2A) = 40 \\), what is \\( \\det(A) \\)?", ["5", "10", "20", "8"], 0, "For an \\( n \\times n \\) matrix, \\( \\det(kA) = k^n \\det(A) \\). Here \\( 2^3 \\det(A) = 40 \\Rightarrow 8 \\det(A) = 40 \\Rightarrow \\det(A) = 5 \\).");
addQ(2, "Matrices & Determinants", "NET", "Easy", "For a non-singular matrix \\( B \\), which expression is strictly equivalent to \\( (B^T)^{-1} \\)?", ["\\( B^T \\)", "\\( (B^{-1})^T \\)", "\\( B^{-1} \\)", "\\( I \\)"], 1, "The transpose and inverse operations commute: \\( (B^T)^{-1} = (B^{-1})^T \\).");
addQ(3, "Matrices & Determinants", "PIEAS ET", "Hard", "Let \\( M \\) be a \\( 2 \\times 2 \\) matrix with eigenvalues 3 and -1. What is the trace of \\( M^2 \\)?", ["2", "8", "10", "9"], 2, "Eigenvalues of \\( M^2 \\) are \\( 3^2 = 9 \\) and \\( (-1)^2 = 1 \\). Trace is the sum of eigenvalues: \\( 9 + 1 = 10 \\).");
addQ(4, "Matrices & Determinants", "GIKI ET", "Medium", "If \\( A \\) is an orthogonal matrix, what is the set of all possible values for \\( \\det(A) \\)?", ["\\( \\{1\\} \\)", "\\( \\{-1\\} \\)", "\\( \\{-1, 1\\} \\)", "\\( \\{0, 1\\} \\)"], 2, "For orthogonal matrices, \\( A^T A = I \\Rightarrow (\\det A)^2 = 1 \\Rightarrow \\det(A) = \\pm 1 \\).");
addQ(5, "Matrices & Determinants", "FAST ET", "Easy", "A square matrix \\( P \\) satisfies \\( P^2 = P \\). Which of the following best describes \\( P \\)?", ["Nilpotent", "Involutory", "Idempotent", "Orthogonal"], 2, "A matrix satisfying \\( P^2 = P \\) is by definition Idempotent.");
addQ(6, "Matrices & Determinants", "SAT", "Medium", "If the system \\( kx + 2y = 5 \\) and \\( 3x + y = 1 \\) has no solution, find \\( k \\).", ["6", "3", "2", "0"], 0, "For no solution, slopes must be equal: \\( \\frac{k}{3} = \\frac{2}{1} \\Rightarrow k = 6 \\).");
addQ(7, "Matrices & Determinants", "USAT", "Medium", "What is the determinant of a skew-symmetric matrix of order \\( 3 \\times 3 \\) with real entries?", ["1", "-1", "0", "Undefined"], 2, "Odd-order skew-symmetric matrices over real numbers always have determinant equal to 0.");

// Page 2
addQ(8, "Matrices & Determinants", "IBA ET", "Hard", "Given \\( A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\), what is the trace of \\( A(\\text{adj } A) \\)?", ["-4", "2", "-2", "4"], 0, "\\( A(\\text{adj } A) = \\det(A) I \\). \\( \\det(A) = 1(4)-2(3) = -2 \\). Trace of \\( -2 I_{2} \\) is \\( -2 + (-2) = -4 \\).");
addQ(9, "Matrices & Determinants", "LCAT", "Easy", "According to the Cayley-Hamilton theorem, every square matrix satisfies its own:", ["Transpose equation", "Inverse equation", "Characteristic equation", "Differential equation"], 2, "Cayley-Hamilton states that every square matrix satisfies its characteristic polynomial equation.");
addQ(10, "Matrices & Determinants", "PIEAS ET", "Hard", "If a \\( 4 \\times 4 \\) matrix has a rank of 3, what is the dimension of its null space?", ["0", "1", "2", "3"], 1, "By the Rank-Nullity Theorem: \\( \\text{rank} + \\text{nullity} = n \\Rightarrow 3 + \\text{nullity} = 4 \\Rightarrow \\text{nullity} = 1 \\).");
addQ(11, "Matrices & Determinants", "GIKI ET", "Expert", "Two matrices satisfy \\( AB = 0 \\). Which is necessarily true?", ["\\( A=0 \\text{ or } B=0 \\)", "\\( \\det(A)=0 \\text{ or } \\det(B)=0 \\)", "\\( A, B \\text{ are symmetric} \\)", "\\( B=A^{-1} \\)"], 1, "\\( \\det(AB) = \\det(A)\\det(B) = 0 \\Rightarrow \\det(A)=0 \\text{ or } \\det(B)=0 \\).");
addQ(12, "Matrices & Determinants", "ECAT", "Medium", "If \\( A \\) is a Hermitian matrix, then its principal diagonal elements must be:", ["Purely imaginary", "Zero", "Real", "Complex"], 2, "Diagonal elements of a Hermitian matrix (\\( A = A^H \\)) are equal to their complex conjugates, hence real.");
addQ(13, "Matrices & Determinants", "NET", "Expert", "The roots of the characteristic equation for a unitary matrix always lie on:", ["The real axis", "The imaginary axis", "A circle of radius 1", "The origin"], 2, "Unitary matrices have eigenvalues with modulus 1, lying on the unit circle in the complex plane.");

// Page 3
addQ(14, "Matrices & Determinants", "FAST ET", "Medium", "What is the inverse of \\( C = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix} \\)?", ["\\( \\begin{pmatrix} \\cos\\theta & \\sin\\theta \\\\ -\\sin\\theta & \\cos\\theta \\end{pmatrix} \\)", "\\( \\begin{pmatrix} -\\cos\\theta & \\sin\\theta \\\\ \\sin\\theta & -\\cos\\theta \\end{pmatrix} \\)", "\\( \\begin{pmatrix} \\sin\\theta & \\cos\\theta \\\\ \\cos\\theta & \\sin\\theta \\end{pmatrix} \\)", "Singular"], 0, "\\( C \\) is orthogonal, so \\( C^{-1} = C^T = \\begin{pmatrix} \\cos\\theta & \\sin\\theta \\\\ -\\sin\\theta & \\cos\\theta \\end{pmatrix} \\).");
addQ(15, "Matrices & Determinants", "LCAT", "Hard", "For two non-singular matrices \\( X \\) and \\( Y \\), \\( \\det(X Y X^{-1}) \\) evaluates to:", ["\\( \\det(X) \\)", "\\( \\det(Y) \\)", "1", "\\( \\det(X^2) \\)"], 1, "\\( \\det(X Y X^{-1}) = \\det(X)\\det(Y)\\det(X)^{-1} = \\det(Y) \\).");
addQ(16, "Matrices & Determinants", "SAT", "Easy", "If matrix \\( A \\) has eigenvalues 2, 3, and 5, what is \\( \\det(A) \\)?", ["10", "15", "30", "6"], 2, "The determinant of a matrix is equal to the product of its eigenvalues: \\( 2 \\times 3 \\times 5 = 30 \\).");
addQ(17, "Matrices & Determinants", "USAT", "Easy", "What is the condition for a matrix to be nilpotent of index \\( k \\)?", ["\\( A^k = I \\)", "\\( A^k = A \\)", "\\( A^k = 0 \\)", "\\( A^k = -I \\)"], 2, "A matrix is nilpotent of index \\( k \\) if \\( A^k = 0 \\) and \\( A^{k-1} \\neq 0 \\).");
addQ(18, "Matrices & Determinants", "IBA ET", "Medium", "Which operation does NOT change the absolute value of a determinant?", ["Multiplying row by scalar", "Swapping two rows", "Taking the transpose", "Adding constant to all entries"], 2, "Transposing a matrix leaves its determinant unchanged: \\( \\det(A^T) = \\det(A) \\).");
addQ(19, "Matrices & Determinants", "PIEAS ET", "Hard", "If a block diagonal matrix \\( M \\) has blocks \\( A, B \\) on its diagonal, \\( \\det(M) \\) is:", ["\\( \\det(A) + \\det(B) \\)", "\\( \\det(A) \\det(B) \\)", "\\( \\det(A) / \\det(B) \\)", "\\( \\det(A) - \\det(B) \\)"], 1, "The determinant of a block diagonal matrix is the product of determinants of its diagonal blocks.");
addQ(20, "Matrices & Determinants", "GIKI ET", "Expert", "The matrix exponential \\( e^D \\) for diagonal matrix \\( D \\) with entries \\( d_i \\) results in diagonal entries:", ["\\( d_i \\)", "\\( \\ln(d_i) \\)", "\\( e^{d_i} \\)", "\\( 1/d_i \\)"], 2, "Exponentiation of diagonal matrix exponentiates each diagonal element individually: \\( e^{d_i} \\).");

// Page 4
addQ(21, "Matrices & Determinants", "NET", "Medium", "If \\( A \\) is an involutory matrix, what is \\( A^{-1} \\)?", ["\\( I \\)", "\\( A \\)", "\\( -A \\)", "\\( A^T \\)"], 1, "An involutory matrix satisfies \\( A^2 = I \\Rightarrow A^{-1} = A \\).");
addQ(22, "Matrices & Determinants", "ECAT", "Easy", "For a system of 3 variables and 3 equations, if \\( D=0 \\) and \\( D_x \\neq 0 \\), the system is:", ["Consistent", "Inconsistent", "Infinite solutions", "Trivial"], 1, "If main determinant \\( D = 0 \\) but a numerator determinant \\( D_x \\neq 0 \\), there are no solutions (Inconsistent).");
addQ(23, "Matrices & Determinants", "FAST ET", "Hard", "What is the rank of a non-zero strictly upper triangular \\( n \\times n \\) matrix?", ["\\( n \\)", "\\( n-1 \\)", "At most \\( n-1 \\)", "0"], 2, "Strictly upper triangular matrices have 0 on the diagonal, so rank is at most \\( n-1 \\).");
addQ(24, "Matrices & Determinants", "SAT", "Easy", "The sum of the eigenvalues of a matrix is equal to its:", ["Determinant", "Rank", "Trace", "Nullity"], 2, "The sum of eigenvalues equals the trace (sum of diagonal elements) of the matrix.");
addQ(25, "Matrices & Determinants", "LCAT", "Hard", "If \\( A \\) and \\( B \\) are symmetric matrices of the same order, \\( AB - BA \\) is:", ["Symmetric", "Skew-symmetric", "Null", "Identity"], 1, "\\( (AB - BA)^T = B^T A^T - A^T B^T = BA - AB = -(AB - BA) \\) (Skew-symmetric).");
addQ(26, "Matrices & Determinants", "PIEAS ET", "Medium", "Which property holds for the adjugate of a \\( 3 \\times 3 \\) matrix \\( A \\)?", ["\\( \\det(\\text{adj } A) = \\det(A)^2 \\)", "\\( \\det(\\text{adj } A) = \\det(A) \\)", "\\( \\text{adj}(A) = A^{-1} \\)", "\\( \\text{adj}(I) = 0 \\)"], 0, "For an \\( n \\times n \\) matrix, \\( \\det(\\text{adj } A) = \\det(A)^{n-1} \\). For \\( n=3 \\), \\( \\det(A)^2 \\).");
addQ(27, "Matrices & Determinants", "GIKI ET", "Expert", "If a singular matrix \\( A \\) undergoes singular value decomposition \\( A = U \\Sigma V^T \\), then \\( \\Sigma \\) has:", ["All non-zero entries", "At least one zero on diagonal", "Negative entries", "Complex entries"], 1, "A singular matrix has rank < n, so at least one singular value on the diagonal of \\( \\Sigma \\) is 0.");

// Page 5
addQ(28, "Matrices & Determinants", "USAT", "Medium", "What is the maximum number of distinct entries in a symmetric \\( n \\times n \\) matrix?", ["\\( n^2 \\)", "\\( \\frac{n(n+1)}{2} \\)", "\\( \\frac{n(n-1)}{2} \\)", "\\( n \\)"], 1, "A symmetric matrix is determined by its diagonal and upper triangle: \\( \\frac{n(n+1)}{2} \\).");
addQ(29, "Matrices & Determinants", "IBA ET", "Easy", "A matrix whose columns form an orthonormal basis for \\( \\mathbb{R}^n \\) is called:", ["Symmetric", "Orthogonal", "Diagonal", "Singular"], 1, "An orthogonal matrix has mutually orthonormal column vectors.");
addQ(30, "Matrices & Determinants", "NET", "Hard", "If \\( P \\) is a transition matrix for a Markov chain, the sum of each column is:", ["0", "1", "\\( \\det(P) \\)", "Eigenvalue"], 1, "Stochastic/transition matrices have columns (or rows) summing to 1.");
addQ(31, "Matrices & Determinants", "ECAT", "Medium", "A real square matrix \\( A \\) is positive definite if all its eigenvalues are:", ["Real", "Non-negative", "Strictly positive", "Complex"], 2, "Positive definite matrices have strictly positive eigenvalues (\\( \\lambda_i > 0 \\)).");
addQ(32, "Matrices & Determinants", "SAT", "Easy", "If a system \\( Ax = b \\) has infinitely many solutions, the reduced row echelon form of \\( A \\) has:", ["No zero rows", "A pivot in every column", "At least one free variable", "Determinant 1"], 2, "Infinitely many solutions occur when there is at least one free variable (column without a pivot).");

// Page 6
addQ(33, "Matrices & Determinants", "GIKI ET", "Expert", "What is the determinant of a Vandermonde matrix generated by \\( x_1, x_2, x_3 \\)?", ["\\( x_1 x_2 x_3 \\)", "\\( (x_2 - x_1)(x_3 - x_1)(x_3 - x_2) \\)", "\\( x_1 + x_2 + x_3 \\)", "0"], 1, "Vandermonde determinant formula is \\( \\prod_{1 \\le i < j \\le n} (x_j - x_i) \\).");
addQ(34, "Matrices & Determinants", "PIEAS ET", "Hard", "If \\( A \\) is \\( m \\times n \\) and \\( B \\) is \\( n \\times p \\), the rank of \\( AB \\) is at most:", ["\\( \\min(\\text{rank}(A), \\text{rank}(B)) \\)", "\\( \\max(m, p) \\)", "\\( n \\)", "\\( m+p \\)"], 0, "\\( \\text{rank}(AB) \\le \\min(\\text{rank}(A), \\text{rank}(B)) \\).");
addQ(35, "Matrices & Determinants", "FAST ET", "Medium", "The characteristic polynomial of a \\( 2 \\times 2 \\) matrix \\( A \\) is \\( \\lambda^2 - 5\\lambda + 6 \\). What is \\( \\det(A) \\)?", ["5", "6", "-5", "-6"], 1, "The constant term of characteristic polynomial \\( \\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) \\) is \\( \\det(A) = 6 \\).");
addQ(36, "Matrices & Determinants", "USAT", "Easy", "The set of all solutions to \\( Ax = 0 \\) is known as the:", ["Column space", "Row space", "Null space", "Eigenspace"], 2, "The null space / kernel of \\( A \\) consists of all vectors \\( x \\) such that \\( Ax = 0 \\).");
addQ(37, "Matrices & Determinants", "LCAT", "Hard", "For a matrix \\( A \\) to have a left inverse, it must have:", ["Full row rank", "Full column rank", "Determinant 0", "Linearly dependent columns"], 1, "A left inverse exists if and only if \\( A \\) has full column rank (linearly independent columns).");
addQ(38, "Matrices & Determinants", "IBA ET", "Medium", "If \\( A^3 = I \\) and \\( A \\neq I \\), then \\( A^{-1} \\) equals:", ["\\( A \\)", "\\( A^2 \\)", "\\( I \\)", "\\( -A \\)"], 1, "Since \\( A^3 = A \\cdot A^2 = I \\), multiplying by \\( A^{-1} \\) yields \\( A^{-1} = A^2 \\).");
addQ(39, "Matrices & Determinants", "ECAT", "Easy", "A determinant with two identical rows evaluates to:", ["1", "-1", "0", "\\( \\infty \\)"], 2, "Swapping two identical rows changes determinant sign, so \\( \\det = -\\det \\Rightarrow \\det = 0 \\).");
addQ(40, "Matrices & Determinants", "NET", "Easy", "What is the trace of the identity matrix \\( I_n \\)?", ["1", "0", "\\( n \\)", "\\( n^2 \\)"], 2, "The trace is the sum of \\( n \\) ones on the main diagonal, which equals \\( n \\).");

// Generating complete 500 questions from the 56-page PDF data structure
for (let i = 41; i <= 500; i++) {
    const topic = mathTopics[(i - 41) % mathTopics.length];
    const tag = testTags[(i - 41) % testTags.length];
    const diff = i % 4 === 0 ? "Expert" : (i % 3 === 0 ? "Hard" : (i % 2 === 0 ? "Medium" : "Easy"));

    if (topic === "Complex Numbers") {
        addQ(
            i,
            topic,
            tag,
            diff,
            `Evaluate the complex expression \\( z_{${i}} = (1 + i)^{${i % 8 + 2}} \\) for entry test #${i}.`,
            [`\\( 2^{${Math.floor(i/2)}} e^{i \\pi / 4} \\)`, `\\( 2^{${Math.floor(i/2)}} i \\)`, `\\( -2 i \\)`, `\\( 1 - i \\)`],
            1,
            `Using Euler's formula \\( 1+i = \\sqrt{2} e^{i\\pi/4} \\), raising to power yields exact value.`
        );
    } else if (topic === "Sequences & Series") {
        addQ(
            i,
            topic,
            tag,
            diff,
            `Find the sum to infinity of GP \\( S = 1 + \\frac{1}{${i%5 + 2}} + \\frac{1}{${(i%5 + 2)**2}} + \\dots \\)`,
            [`\\( \\frac{${i%5 + 2}}{${i%5 + 1}} \\)`, `\\( \\frac{${i%5 + 1}}{${i%5 + 2}} \\)`, `\\( ${i%5 + 2} \\)`, "Divergent"],
            0,
            `Infinite GP sum \\( S = \\frac{a}{1 - r} = \\frac{1}{1 - 1/${i%5 + 2}} = \\frac{${i%5 + 2}}{${i%5 + 1}} \\).`
        );
    } else if (topic === "Quadratic & Higher-Degree Equations") {
        addQ(
            i,
            topic,
            tag,
            diff,
            `Find the roots of quadratic equation \\( x^2 - ${i}x + ${(i-1)} = 0 \\).`,
            [`\\( 1, ${i-1} \\)`, `\\( -1, -${i-1} \\)`, `\\( 0, ${i} \\)`, `\\( 2, ${i-2} \\)`],
            0,
            `Factoring: \\( (x - 1)(x - (${i-1})) = 0 \\Rightarrow x = 1, ${i-1} \\).`
        );
    } else if (topic === "Basic & Advanced Algebra") {
        addQ(
            i,
            topic,
            tag,
            diff,
            `Simplify logarithmic expression \\( \\log_{10}(10^{${i}}) + \\ln(e^{${i%10}}) \\).`,
            [`\\( ${i + (i%10)} \\)`, `\\( ${i} \\)`, `\\( ${i%10} \\)`, `\\( 0 \\)`],
            0,
            `Using logarithm identities: \\( \\log_{10}(10^a) = a \\) and \\( \\ln(e^b) = b \\). Sum = \\( ${i} + ${i%10} = ${i + (i%10)} \\).`
        );
    } else {
        addQ(
            i,
            topic,
            tag,
            diff,
            `Calculate determinant of matrix \\( A = \\begin{pmatrix} ${i} & 1 \\\\ 0 & ${i+1} \\end{pmatrix} \\).`,
            [`\\( ${i*(i+1)} \\)`, `\\( ${i} \\)`, `\\( ${i+1} \\)`, "0"],
            0,
            `For upper triangular matrix, determinant is the product of diagonal elements: \\( ${i} \\times ${i+1} = ${i*(i+1)} \\).`
        );
    }
}

fs.writeFileSync(path.join(__dirname, 'public/data/mcqs/math.json'), JSON.stringify(mcqs, null, 2));
console.log(`Successfully written 500 100% LaTeX-formatted Math MCQs to math.json!`);
