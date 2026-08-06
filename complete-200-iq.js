const fs = require('fs');
const path = require('path');

const targetScript = path.join(__dirname, 'append-exact-200-iq.js');
let content = fs.readFileSync(targetScript, 'utf8');

const q101_200 = `
// ─── Q101 to Q200 of PDF ───
const q101_200 = [
  // Q101 - Q125: Syllogism
  [601, "Syllogism", "FAST ET", "Moderate", "Statements: All engineers are logical. Some logical people are artists. Conclusion: Some engineers are artists.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "Engineers and artists may not overlap."],
  [602, "Syllogism", "NET", "Hard", "Statements: No stone is metal. All metals are shiny. Conclusion: No stone is shiny.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "Stones could still be shiny without being metal."],
  [603, "Syllogism", "MDCAT", "Easy", "Statements: All pens are books. All books are tables. Conclusion: All pens are tables.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Transitive property."],
  [604, "Syllogism", "NTC", "Moderate", "Statements: Some phones are smart. No smart device is cheap. Conclusion: Some phones are not cheap.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Smart phones cannot be cheap."],
  [605, "Syllogism", "ISSB", "Moderate", "Statements: All mountains are tall. Some tall things are trees. Conclusion: Some trees are mountains.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "Trees and mountains may not overlap."],
  [606, "Syllogism", "FAST ET", "Hard", "Statements: No P is Q. No Q is R. Conclusion: No P is R.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "Two negative premises yield no definite conclusion."],
  [607, "Syllogism", "NET", "Moderate", "Statements: All birds fly. Some flying things are airplanes. Conclusion: Some birds are airplanes.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "Flying things contain birds and airplanes separately."],
  [608, "Syllogism", "MDCAT", "Easy", "Statements: Some students are smart. All smart people are successful. Conclusion: Some students are successful.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Smart students are successful."],
  [609, "Syllogism", "NTC", "Moderate", "Statements: All rivers are water. All water is wet. Conclusion: Some wet things are rivers.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "All rivers are wet, so some wet things are rivers."],
  [610, "Syllogism", "ISSB", "Hard", "Statements: No dark is light. Some light is bright. Conclusion: Some bright is not dark.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Bright things that are light cannot be dark."],
  [611, "Syllogism", "FAST ET", "Hard", "Statements: All X are Y. Some Y are Z. No Z is W. Conclusion: Some X are not W.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "X and W connection is uncertain."],
  [612, "Syllogism", "NET", "Moderate", "Statements: Some desks are chairs. Some chairs are stools. Conclusion: Some desks are stools.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "Two particular premises yield no valid conclusion."],
  [613, "Syllogism", "MDCAT", "Easy", "Statements: All teachers are adults. No adult is a child. Conclusion: No teacher is a child.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Teachers are adults who exclude children."],
  [614, "Syllogism", "NTC", "Moderate", "Statements: All shirts are garments. Some garments are wool. Conclusion: Some wool items are shirts.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "Wool garments may not be shirts."],
  [615, "Syllogism", "ISSB", "Hard", "Statements: Some A are B. All B are C. No C is D. Conclusion: No A is D.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "A items outside B could be D."],
  [616, "Syllogism", "FAST ET", "Moderate", "Statements: All laptops are computers. All computers are machines. Conclusion: Some machines are laptops.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "All laptops are machines."],
  [617, "Syllogism", "NET", "Hard", "Statements: No cloud is a star. Some stars are moons. Conclusion: Some moons are not clouds.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Moons that are stars cannot be clouds."],
  [618, "Syllogism", "MDCAT", "Moderate", "Statements: All dogs are mammals. Some mammals are aquatic. Conclusion: No dog is aquatic.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "Dogs being aquatic is not ruled out, but not guaranteed."],
  [619, "Syllogism", "NTC", "Easy", "Statements: Some math is easy. All easy things are fun. Conclusion: Some math is fun.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Math that is easy is fun."],
  [620, "Syllogism", "ISSB", "Moderate", "Statements: All trains are fast. No fast thing is slow. Conclusion: No train is slow.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Trains are fast which excludes slow."],
  [621, "Syllogism", "FAST ET", "Easy", "Statements: Some cars are buses. Some buses are trucks. Conclusion: All cars are trucks.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 1, "Invalid universal claim."],
  [622, "Syllogism", "NET", "Hard", "Statements: All M are N. No N is O. All O are P. Conclusion: Some P are not M.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "P items that are O cannot be M."],
  [623, "Syllogism", "MDCAT", "Easy", "Statements: All iron is heavy. All heavy things sink. Conclusion: All iron sinks.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Transitive property."],
  [624, "Syllogism", "NTC", "Moderate", "Statements: Some cups are mugs. All mugs are glasses. Conclusion: Some glasses are cups.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Glasses containing mugs contain cups."],
  [625, "Syllogism", "ISSB", "Hard", "Statements: No hot is cold. All cold things freeze. Conclusion: Some freezing things are not hot.", ["Conclusion follows", "Conclusion does not follow", "Either follows", "Data Inadequate"], 0, "Freezing things that are cold cannot be hot."],

  // Q126 - Q150: Logical Deduction
  [626, "Logical Deduction", "MDCAT", "Moderate", "Pointing to a photograph, a man says, 'She is the mother of my brother's son's sister.' How is she related to the man?", ["Sister-in-law", "Aunt", "Niece", "Daughter"], 0, "Brother's son's sister = brother's daughter. Her mother = brother's wife (Sister-in-law)."],
  [627, "Logical Deduction", "NET", "Hard", "If X * Y means X is the husband of Y, and X / Y means X is the mother of Y, what does A * B / C mean?", ["A is the father of C", "A is the brother of C", "A is the uncle of C", "A is the son of C"], 0, "A is husband of B, B is mother of C => A is father of C."],
  [628, "Logical Deduction", "ISSB", "Easy", "Tariq walks 12km East, turns left and walks 5km. What is the shortest distance to his starting point?", ["17km", "13km", "7km", "15km"], 1, "sqrt(12^2 + 5^2) = 13km."],
  [629, "Logical Deduction", "FAST ET", "Moderate", "A woman walks 20m South, turns right and walks 10m, turns left and walks 15m. Which direction is she facing?", ["North", "South", "East", "West"], 1, "Facing South."],
  [630, "Logical Deduction", "NTC", "Easy", "P is heavier than Q. Q is heavier than R. S is heavier than P. Who is the lightest?", ["P", "Q", "R", "S"], 2, "Order: S > P > Q > R. R is lightest."],
  [631, "Logical Deduction", "MDCAT", "Moderate", "M is the sister of N. N is the brother of O. O is the daughter of P. How is M related to P?", ["Aunt", "Mother", "Daughter", "Sister"], 2, "M, N, O are children of P. M is daughter."],
  [632, "Logical Deduction", "NET", "Hard", "A clock shows 6:00. The hour hand points South. In which direction will the minute hand point at 9:15?", ["North", "South", "East", "West"], 3, "At 9:15 minute hand is at 3 (East? Wait, hour hand at 6 points South => 3 points East, 9 points West. At 9:15 minute hand is at 3 = East)."],
  [633, "Logical Deduction", "ISSB", "Moderate", "If A is the uncle of B, and B is the daughter of C, how is C related to A?", ["Brother/Sister", "Husband/Wife", "Father/Mother", "Data Inadequate"], 3, "Data Inadequate (could be sibling or sibling's spouse)."],
  [634, "Logical Deduction", "FAST ET", "Easy", "Sana is ranked 8th from the top and 42nd from the bottom in a class. How many students are in the class?", ["50", "49", "51", "48"], 1, "Total = 8 + 42 - 1 = 49."],
  [635, "Logical Deduction", "NTC", "Hard", "In a certain code, 'P # Q' means P is the sister of Q. If R # S, how is S related to R?", ["Brother", "Sister", "Cousin", "Data Inadequate"], 3, "S's gender is unknown."],
  [636, "Logical Deduction", "MDCAT", "Moderate", "A person walks 15km South, then 20km West. What is the straight-line distance to starting point?", ["35km", "25km", "5km", "30km"], 1, "sqrt(15^2 + 20^2) = 25km."],
  [637, "Logical Deduction", "NET", "Hard", "Looking at a portrait, a woman said, 'Her mother is the only daughter of my mother.' Whose portrait is it?", ["Her sister's", "Her own daughter's", "Her niece's", "Her mother's"], 1, "Only daughter of my mother = myself. Her mother is myself => my daughter."],
  [638, "Logical Deduction", "ISSB", "Moderate", "Five files are stacked. A is above B. C is below D. B is above D. E is at bottom. Which is at top?", ["A", "B", "C", "D"], 0, "Order: A, B, D, C, E. A is at top."],
  [639, "Logical Deduction", "FAST ET", "Easy", "Ahmed is taller than Bilal. Bilal is shorter than Chohan. Chohan is taller than Ahmed. Who is shortest?", ["Ahmed", "Bilal", "Chohan", "Cannot be determined"], 1, "Chohan > Ahmed > Bilal."],
  [640, "Logical Deduction", "NTC", "Hard", "If North-West becomes South, South-West becomes East, what will East become?", ["North-West", "South-East", "North-East", "South-West"], 0, "135 deg rotation makes East become North-West."],
  [641, "Logical Deduction", "MDCAT", "Easy", "P is the brother of Q. R is the father of P. S is the brother of T. T is the daughter of Q. Who is the uncle of S?", ["P", "Q", "R", "T"], 0, "P is brother of Q (parent of S) => P is uncle of S."],
  [642, "Logical Deduction", "NET", "Hard", "A girl rode her bicycle East, turned right and rode 3km, then turned right and rode 4km. She found herself 4km South of starting point. How far did she ride East initially?", ["3km", "4km", "5km", "7km"], 1, "To be 4km West, initial East = 4km."],
  [643, "Logical Deduction", "ISSB", "Moderate", "A is the only daughter of B. B is the wife of C. D is the son of C. How is A related to D?", ["Sister", "Cousin", "Aunt", "Niece"], 0, "A and D are children of B & C => Sister."],
  [644, "Logical Deduction", "FAST ET", "Hard", "In a row of girls facing North, Hira is 12th from left and Sana is 18th from right. If they swap, Hira becomes 25th from left. How many girls?", ["42", "43", "44", "41"], 0, "Total = 25 + 18 - 1 = 42."],
  [645, "Logical Deduction", "NTC", "Moderate", "A compass is damaged and its North pointer shows West. If a person wants to go South, which direction should they follow?", ["North", "South", "East", "West"], 2, "North=West (+90 deg). Actual South = East."],
  [646, "Logical Deduction", "MDCAT", "Hard", "If 'M - N' means M is the son of N, and 'M / N' means M is the wife of N. What does A - B / C mean?", ["A is the daughter of C", "A is the son of C", "A is the nephew of C", "A is the uncle of C"], 1, "B is wife of C, A is son of B => A is son of C."],
  [647, "Logical Deduction", "NET", "Easy", "X starts from point Y and walks 8km North, turns right and walks 6km, turns right and walks 8km. Which direction is he facing?", ["North", "South", "East", "West"], 1, "Facing South."],
  [648, "Logical Deduction", "ISSB", "Moderate", "Apple is sweeter than Banana. Cherry is sweeter than Apple. Banana is sweeter than Cherry. If first two statements are true, 3rd is:", ["True", "False", "Uncertain", "Invalid"], 1, "Cherry > Apple > Banana, so 3rd is False."],
  [649, "Logical Deduction", "FAST ET", "Moderate", "Pointing to a man, a girl says, 'He is the son of my grandfather's only son.' How is he related to the girl?", ["Father", "Brother", "Uncle", "Cousin"], 1, "Grandfather's only son = Father. Father's son = Brother."],
  [650, "Logical Deduction", "NTC", "Moderate", "A cat runs 30m North, turns left and runs 15m, turns left and runs 10m, turns right and runs 5m. Which direction is it facing?", ["North", "South", "East", "West"], 3, "Final turn right facing West."],

  // Q151 - Q175: Analytical Reasoning
  [651, "Analytical Reasoning", "FAST ET", "Hard", "A, B, C, D, E on a wall. A next to B. C next to D. D not with E. E on right end. C 2nd from left. Who sits to left of A?", ["B", "C", "D", "E"], 1, "Order: D, C, B, A, E. Left of A is B/C."],
  [652, "Analytical Reasoning", "NET", "Moderate", "Six students sit around circular table facing center. U between V and W. X between Y and Z. Y opposite V. Who sits opposite W?", ["U", "X", "Y", "Z"], 3, "Opposite W is Z."],
  [653, "Analytical Reasoning", "NTC", "Moderate", "Five houses in a row. Red next to Blue. Green not next to Black. White between Black and Blue. Which house is at far end?", ["Red", "Blue", "Green", "White"], 2, "Green is at far end."],
  [654, "Analytical Reasoning", "FAST ET", "Hard", "Seven exams Mon-Sun. History immediately after Geography. Math on Wed. Science before Geography but not Mon. What day is History?", ["Tuesday", "Thursday", "Friday", "Saturday"], 1, "Thursday."],
  [655, "Analytical Reasoning", "NET", "Hard", "P, Q, R, S, T use computer. 1st gives to R. Last takes from P. T not 1st. Q passes to P. Who uses 1st?", ["P", "Q", "S", "T"], 2, "S uses 1st."],
  [656, "Analytical Reasoning", "NTC", "Moderate", "In a building of 5 floors (1 to 5), X lives on even floor. Y lives immediately above X. Z lives immediately below W. W not on top floor. Who lives on floor 5?", ["X", "Y", "Z", "V"], 1, "Y lives on floor 5."],
  [657, "Analytical Reasoning", "ISSB", "Easy", "Five girls ran a race. Ayesha finished before Bushra but after Dua. Esha finished before Dua but after Fatima. Who won the race?", ["Ayesha", "Bushra", "Dua", "Fatima"], 3, "Fatima won."],
  [658, "Analytical Reasoning", "FAST ET", "Hard", "Three men (P, Q, R) and three women (S, T, U) sit in a row. No two men sit together. P to left of S. R at right end. Who sits next to R?", ["S", "T", "U", "Cannot be determined"], 3, "Cannot be determined."],
  [659, "Analytical Reasoning", "NET", "Hard", "Eight people sit around square table, two on each side. A opposite B. C to right of B. D opposite C. E on same side as A. Who sits next to D?", ["A", "B", "E", "Cannot be determined"], 3, "Cannot be determined."],
  [660, "Analytical Reasoning", "MDCAT", "Moderate", "Four tasks (A, B, C, D) in order. A before B. D after B and before A... Task done last?", ["A", "B", "C", "D"], 2, "Task C."],
  [661, "Analytical Reasoning", "FAST ET", "Hard", "Team of 3 from 3 men (X1,X2,X3) and 2 women (Y1,Y2). X1 and X2 cannot be together. Y1 must be with X3. Valid team?", ["X1, X2, Y1", "X1, X3, Y1", "X2, X3, Y2", "X1, Y1, Y2"], 1, "X1, X3, Y1 is valid."],
  [662, "Analytical Reasoning", "NET", "Moderate", "Books P, Q, R, S, T on shelf. P left of R. Q right of S. T between P and R. S left of P. Which book is in middle?", ["P", "Q", "R", "T"], 0, "Order: S, Q, P, T, R. P is in middle."],
  [663, "Analytical Reasoning", "NTC", "Hard", "Six tasks sequentially. Task 1 not X or Y. Task 6 is Z. W immediately after V. U immediately before X. If Y is task 2, what is task 3?", ["V", "U", "W", "X"], 0, "Task 3 is V."],
  [664, "Analytical Reasoning", "ISSB", "Moderate", "Four friends play game. South passes to West. West passes to North. If Ali passes to Raza, Raza sits North, where does Ali sit?", ["North", "South", "East", "West"], 3, "Ali sits West."],
  [665, "Analytical Reasoning", "MDCAT", "Easy", "Five-letter word. 1st consonant. Last letter E. Middle letter I. R immediately before I. Word is?", ["CRIME", "DRIVE", "PRICE", "SMILE"], 0, "CRIME."],
  [666, "Analytical Reasoning", "FAST ET", "Moderate", "Five boxes (A-E) stacked. C immediately above A. D immediately below B. E at bottom. If B is top, which box is D?", ["Second from top", "Middle", "Second from bottom", "Top"], 0, "D is second from top."],
  [667, "Analytical Reasoning", "NET", "Moderate", "In race, P is 20m ahead of Q. Q is 10m ahead of R. S is 5m behind R. How far is P from S?", ["35m", "30m", "25m", "20m"], 0, "20 + 10 + 5 = 35m."],
  [668, "Analytical Reasoning", "NTC", "Hard", "A-F sit in circle. A facing B. C right of B. D left of A. E between A and C. Who between B and D?", ["A", "C", "E", "F"], 3, "F is between B and D."],
  [669, "Analytical Reasoning", "ISSB", "Moderate", "Machine processes items sequentially. X before Y. Z after W. W before X. What is 1st item?", ["X", "Y", "Z", "W"], 3, "W is 1st item."],
  [670, "Analytical Reasoning", "MDCAT", "Easy", "5 students in a row. Ali right of Bilal. Hira left of Sana. Bilal right of Sana. Zara extreme left. Who in middle?", ["Ali", "Bilal", "Sana", "Hira"], 3, "Hira is in middle."],
  [671, "Analytical Reasoning", "FAST ET", "Moderate", "Seven people (P-V) present Mon-Sun. P on Tue. R 2 days after P (Thu). Q day before V. V on Sun. When does R present?", ["Thursday", "Friday", "Saturday", "Wednesday"], 0, "R presents on Thursday."],
  [672, "Analytical Reasoning", "NET", "Moderate", "Lock 3 digits. 2nd digit twice 1st. 3rd is sum of first two. Valid combination?", ["246", "426", "369", "Both 246 and 369"], 3, "Both 246 and 369 are valid."],
  [673, "Analytical Reasoning", "NTC", "Hard", "Six colored balls in row. Red not at ends. Blue immediately left of Green. Yellow right of Black. White between Red and Yellow. If Green far right, what is 5th ball?", ["Red", "Blue", "White", "Yellow"], 1, "Blue is 5th ball."],
  [674, "Analytical Reasoning", "ISSB", "Moderate", "Four cars stop. Car W South facing North. Car X West facing East. Car Y first. Car W last. Car X before Z. Who goes second?", ["W", "X", "Y", "Z"], 1, "Car X goes second."],
  [675, "Analytical Reasoning", "MDCAT", "Moderate", "Five projects. A > B. C < D. E = B. A < C. Which project has lowest score?", ["B", "E", "Both B and E", "D"], 2, "Both B and E."],

  // Q176 - Q200: Non-Verbal Reasoning
  [676, "Non-Verbal Reasoning", "ISSB", "Easy", "Sequence of shapes: pentagon (5), hexagon (6), heptagon (7). What is the 8th shape in sequence?", ["Octagon", "Nonagon", "Decagon", "Dodecagon"], 2, "Decagon."],
  [677, "Non-Verbal Reasoning", "NET", "Moderate", "Matrix row: square, square with line, square with cross. Next row: circle, circle with line. What comes next?", ["A triangle", "A circle with a cross", "A square with a line", "A plain circle"], 1, "Circle with cross."],
  [678, "Non-Verbal Reasoning", "FAST ET", "Hard", "Figure points South. Step 1 rotates 90 deg anti-clockwise. Step 2 rotates 180 deg. Step 3 rotates 90 deg clockwise. Where points?", ["North", "South", "East", "West"], 0, "Points North."],
  [679, "Non-Verbal Reasoning", "MDCAT", "Easy", "Grid water: Box 1: 100%, Box 2: 75%, Box 3: 50%. What does Box 4 display?", ["0% full", "100% full", "25% full", "50% full"], 2, "25% full."],
  [680, "Non-Verbal Reasoning", "NTC", "Moderate", "Arrow series: 1 left, 2 right, 3 left, 4 right. Next visual representation?", ["Five pointing left", "Five pointing right", "Four pointing left", "Six pointing right"], 0, "Five pointing left."],
  [681, "Non-Verbal Reasoning", "ISSB", "Moderate", "Shape central dot & lines: Fig 1 (3 lines), Fig 2 (6 lines), Fig 3 (12 lines). Lines in Fig 4?", ["15", "18", "24", "36"], 2, "Doubling: 3, 6, 12, 24."],
  [682, "Non-Verbal Reasoning", "NET", "Hard", "3x3 matrix: Row 1 (vert, horiz, cross), Row 2 (diag left, diag right, X), Row 3 (vert, horiz). Missing shape?", ["Horizontal line", "Cross", "Star", "Asterisk"], 3, "Asterisk."],
  [683, "Non-Verbal Reasoning", "FAST ET", "Moderate", "Square dot sequence: Step 1 bottom-right, Step 2 bottom-left, Step 3 top-left. Step 4 dot location?", ["Top-left", "Bottom-left", "Center", "Top-right"], 3, "Clockwise corner movement => Top-right."],
  [684, "Non-Verbal Reasoning", "MDCAT", "Moderate", "Image sequence: full square, square missing a quarter, half square. 4th image?", ["A full square", "A quarter square", "A completely blank space", "A half square"], 1, "A quarter square."],
  [685, "Non-Verbal Reasoning", "NTC", "Hard", "Fig 1: Circle in Triangle. Fig 2: Triangle in Square. Fig 3: Square in Pentagon. Fig 4?", ["Pentagon inside a Hexagon", "Pentagon inside a Heptagon", "Hexagon inside a Pentagon", "Circle inside a Hexagon"], 0, "Pentagon inside a Hexagon."],
  [686, "Non-Verbal Reasoning", "ISSB", "Hard", "A die rotated: Front shows 2 dots. Rotated 90 deg right shows 3 dots. Rotated 90 deg right again shows 5 dots. What is opposite to 2?", ["3", "4", "5", "6"], 2, "5 is opposite to 2."],
  [687, "Non-Verbal Reasoning", "NET", "Hard", "Overlapping squares: Step 1 (2 squares, 2 intersections), Step 2 (3 squares, 4 intersections), Step 3 (4 squares, 6 intersections). Step 4 (5 squares)?", ["8", "9", "10", "12"], 0, "8 intersections."],
  [688, "Non-Verbal Reasoning", "FAST ET", "Easy", "Visual analogy: A caterpillar is to a chrysalis as a tadpole is to a...", ["Frog", "Pond", "Lily pad", "Egg"], 0, "Frog."],
  [689, "Non-Verbal Reasoning", "MDCAT", "Moderate", "Circle matrix shaded quadrants: Box 1 Bottom-Left, Box 2 Top-Left, Box 3 Top-Right. Box 4?", ["Top-Right", "Top-Left", "Bottom-Right", "Bottom-Left"], 2, "Bottom-Right quadrant."],
  [690, "Non-Verbal Reasoning", "NTC", "Moderate", "Sequence lines: -, --, ---, ----. Second sequence: |, ||, |||, ||||. Combined 2nd figure?", ["2x2 grid", "3x3 grid", "4x4 grid", "2 vertical, 3 horizontal"], 0, "2x2 grid."],
  [691, "Non-Verbal Reasoning", "ISSB", "Hard", "Fig A triangle into 3 smaller, Fig B square into 4 smaller, Fig C pentagon into 5 smaller. Common property?", ["Center intersection", "Parallel lines", "Curved edges", "No symmetry"], 0, "Center intersection."],
  [692, "Non-Verbal Reasoning", "NET", "Moderate", "Paper folded in half three times (into an eighth), hole punched in center. Unfolded holes visible?", ["2", "4", "8", "16"], 2, "8 holes."],
  [693, "Non-Verbal Reasoning", "FAST ET", "Moderate", "Digital clock: 09:00, then 10:30, then 12:00. Next display?", ["13:00", "13:30", "14:00", "14:30"], 1, "Adding 1 hr 30 mins => 13:30."],
  [694, "Non-Verbal Reasoning", "MDCAT", "Hard", "Scale balance: 3 triangles = 1 square. 2 squares = 1 hexagon. How many triangles balance 1 hexagon?", ["3", "4", "5", "6"], 3, "1 hexagon = 2 squares = 6 triangles."],
  [695, "Non-Verbal Reasoning", "NTC", "Easy", "Transparent sheet vertical line over sheet horizontal line. Shape formed?", ["Cross (X)", "Square", "Plus (+)", "Triangle"], 2, "Plus (+)."],
  [696, "Non-Verbal Reasoning", "ISSB", "Hard", "3D pyramids: Pyramid 1 (1x1 base = 1), Pyramid 2 (2x2 base = 5 total), Pyramid 3 (3x3 base). How many total blocks in Pyramid 3?", ["9", "14", "27", "30"], 1, "1 + 4 + 9 = 14 blocks."],
  [697, "Non-Verbal Reasoning", "NET", "Easy", "Metronome swings: Img 1 extreme right, Img 2 center, Img 3 extreme left. Img 4?", ["Extreme right", "Center", "Extreme left", "Stopping"], 1, "Returns to center."],
  [698, "Non-Verbal Reasoning", "FAST ET", "Moderate", "Regular pentagon rotated 72 deg clockwise. Resulting image vs original?", ["Upside down", "Tilted right", "Tilted left", "Identical"], 3, "72 deg rotation of 5-gon is Identical."],
  [699, "Non-Verbal Reasoning", "MDCAT", "Moderate", "Matrix stick figure: sitting, standing, jumping. Seed, sprout, 3rd image?", ["Tree", "Flower", "Dead leaf", "Fruit"], 0, "Tree."],
  [700, "Non-Verbal Reasoning", "NTC", "Hard", "White square morphs into black circle into grey triangle. White hexagon morphs into?", ["Black heptagon", "Grey octagon", "White pentagon", "Black circle"], 0, "Black heptagon (n+1 sides, black color)."]
];

q101_200.forEach(([id, topic, testTag, difficulty, q, opts, ans, exp]) => {
    addIQ(id, topic, testTag, difficulty, q, opts, ans, exp);
});

console.log("Q101-Q200 added. New IQ count:", newIQ.length);

const combined = [...base500, ...newIQ];

// Deduplicate by question text
const seen = new Set();
const cleanCombined = [];
combined.forEach(q => {
  const norm = q.question.toLowerCase().trim().replace(/\\s+/g, ' ');
  if (!seen.has(norm)) {
    seen.add(norm);
    cleanCombined.push(q);
  }
});

// Re-index IDs cleanly from iq_0001 to iq_0700
cleanCombined.forEach((q, idx) => {
  q.id = 'iq_' + (idx + 1).toString().padStart(4, '0');
});

console.log("Final clean combined IQ count:", cleanCombined.length);
fs.writeFileSync(iqFile, JSON.stringify(cleanCombined, null, 2));
console.log("Successfully written clean IQ dataset to public/data/mcqs/iq.json");
`;

content += "\n" + q101_200;
fs.writeFileSync(targetScript, content);
console.log('Successfully written complete append-exact-200-iq.js script!');
