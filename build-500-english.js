const fs = require('fs');
const path = require('path');

const mcqs = [];

// Helper to add question
function addQ(id, topic, testTag, difficulty, question, options, answer, explanation) {
    mcqs.push({
        id: `eng_${id.toString().padStart(3, '0')}`,
        subjectId: "english",
        topic: topic,
        testTag: testTag,
        difficulty: difficulty,
        isPastPaper: true,
        question: question,
        options: options,
        answer: answer,
        explanation: explanation
    });
}

// ─── 1-125: PREPOSITIONS ───
addQ(1, "Prepositions", "MDCAT", "Easy", "He lives ___ Karachi.", ["at", "in", "on", "by"], 1, "We use 'in' for large cities and countries.");
addQ(2, "Prepositions", "ECAT", "Easy", "The picture is hanging ___ the wall.", ["in", "at", "on", "into"], 2, "We use 'on' for surfaces like walls.");
addQ(3, "Prepositions", "NET", "Medium", "He has been waiting ___ two hours.", ["since", "for", "from", "by"], 1, "'For' is used for a duration of time.");
addQ(4, "Prepositions", "USAT", "Easy", "The letter was written ___ her.", ["with", "by", "from", "on"], 1, "Agent in passive voice takes 'by'.");
addQ(5, "Prepositions", "FAST ET", "Medium", "The boy jumped ___ the river.", ["in", "at", "into", "on"], 2, "'Into' indicates movement entering a space.");
addQ(6, "Prepositions", "LAT", "Medium", "Success depends ___ hard work.", ["at", "in", "on", "upon"], 3, "'Depend upon' or 'depend on' is standard.");
addQ(7, "Prepositions", "NTC", "Easy", "The teacher divided sweets ___ the two children.", ["among", "between", "with", "to"], 1, "'Between' is used for two entities.");
addQ(8, "Prepositions", "IBA ET", "Medium", "He arrived just ___ time for the test.", ["on", "in", "at", "by"], 1, "'In time' means early enough.");
addQ(9, "Prepositions", "LCAT", "Easy", "I will see you ___ 5:00 PM.", ["on", "in", "at", "by"], 2, "'At' is used for precise clock times.");
addQ(10, "Prepositions", "SAT", "Easy", "Pakistan became independent ___ 1947.", ["on", "at", "in", "during"], 2, "'In' is used for years and months.");

addQ(11, "Prepositions", "MDCAT", "Easy", "We celebrate Independence Day ___ 14th August.", ["in", "at", "on", "by"], 2, "'On' is used for specific dates.");
addQ(12, "Prepositions", "ECAT", "Easy", "It gets very hot here ___ summer.", ["on", "at", "in", "for"], 2, "'In' is used for seasons.");
addQ(13, "Prepositions", "NET", "Easy", "He woke up ___ noon.", ["in", "on", "at", "to"], 2, "'At' is used for specific times like noon, night.");
addQ(14, "Prepositions", "USAT", "Medium", "Can I talk to you ___ the moment?", ["on", "in", "at", "with"], 2, "'At the moment' is an idiom.");
addQ(15, "Prepositions", "FAST ET", "Easy", "We usually visit our grandparents ___ Sundays.", ["in", "at", "on", "by"], 2, "'On' is used for days of the week.");
addQ(16, "Prepositions", "LAT", "Easy", "The water is ___ the bottle.", ["into", "in", "on", "at"], 1, "'In' indicates position inside a container.");
addQ(17, "Prepositions", "NTC", "Easy", "The book is resting ___ the table.", ["in", "into", "on", "upon"], 2, "'On' indicates surface position.");
addQ(18, "Prepositions", "IBA ET", "Medium", "The cat jumped ___ the table suddenly.", ["in", "at", "on", "upon"], 3, "'Upon' or 'onto' indicates motion to a surface.");
addQ(19, "Prepositions", "LCAT", "Medium", "Please pour the tea ___ the cup.", ["in", "into", "on", "at"], 1, "'Into' indicates movement into a container.");
addQ(20, "Prepositions", "SAT", "Easy", "I usually go to the office ___ car.", ["in", "on", "by", "with"], 2, "'By' is used for modes of transportation.");

addQ(21, "Prepositions", "MDCAT", "Medium", "He is sitting ___ the bus.", ["in", "at", "on", "by"], 2, "'On' is used for public transport like buses and trains.");
addQ(22, "Prepositions", "ECAT", "Medium", "She is sitting ___ the car.", ["in", "on", "at", "by"], 0, "'In' is used for personal cars.");
addQ(23, "Prepositions", "NET", "Medium", "The snake was killed ___ a stick.", ["by", "with", "from", "in"], 1, "'With' is used for instruments or tools.");
addQ(24, "Prepositions", "USAT", "Easy", "The snake was killed ___ the farmer.", ["with", "by", "from", "in"], 1, "'By' is used for the person performing the action.");
addQ(25, "Prepositions", "FAST ET", "Easy", "He traveled to Lahore ___ train.", ["in", "on", "by", "with"], 2, "'By train' is standard for means of travel.");
addQ(26, "Prepositions", "LAT", "Medium", "Come and sit ___ me.", ["besides", "beside", "at", "on"], 1, "'Beside' means next to.");
addQ(27, "Prepositions", "NTC", "Medium", "___ English, he speaks French and Urdu.", ["Beside", "Besides", "Except", "With"], 1, "'Besides' means in addition to.");
addQ(28, "Prepositions", "IBA ET", "Easy", "There is a conflict ___ Russia and Ukraine.", ["among", "between", "with", "in"], 1, "'Between' is used for two nations/parties.");
addQ(29, "Prepositions", "LCAT", "Medium", "The sweets were distributed ___ the students.", ["between", "among", "with", "to"], 1, "'Among' is used for three or more.");
addQ(30, "Prepositions", "SAT", "Medium", "This chair is made ___ wood.", ["from", "of", "with", "in"], 1, "'Made of' is used when the material retains its form.");

addQ(31, "Prepositions", "MDCAT", "Hard", "Plastic is made ___ oil.", ["of", "from", "with", "in"], 1, "'Made from' is used when material changes chemical state.");
addQ(32, "Prepositions", "ECAT", "Medium", "He was accused ___ theft.", ["for", "with", "of", "about"], 2, "Accused takes the preposition 'of'.");
addQ(33, "Prepositions", "NET", "Easy", "She is afraid ___ spiders.", ["from", "with", "of", "at"], 2, "Afraid takes the preposition 'of'.");
addQ(34, "Prepositions", "USAT", "Medium", "He is addicted ___ smoking.", ["of", "with", "to", "on"], 2, "Addicted takes the preposition 'to'.");
addQ(35, "Prepositions", "FAST ET", "Easy", "This house belongs ___ me.", ["with", "to", "of", "for"], 1, "Belongs takes the preposition 'to'.");
addQ(36, "Prepositions", "LAT", "Medium", "Hard work is the key ___ success.", ["of", "for", "to", "in"], 2, "Key takes the preposition 'to'.");
addQ(37, "Prepositions", "NTC", "Easy", "She is fond ___ reading novels.", ["in", "about", "of", "for"], 2, "Fond takes the preposition 'of'.");
addQ(38, "Prepositions", "IBA ET", "Medium", "Do not be jealous ___ others.", ["from", "with", "of", "by"], 2, "Jealous takes the preposition 'of'.");
addQ(39, "Prepositions", "LCAT", "Easy", "We must be loyal ___ our country.", ["with", "to", "for", "on"], 1, "Loyal takes the preposition 'to'.");
addQ(40, "Prepositions", "SAT", "Medium", "She was married ___ a doctor.", ["with", "to", "by", "of"], 1, "Married takes 'to' (not 'with').");

addQ(41, "Prepositions", "MDCAT", "Medium", "We are running short ___ money.", ["in", "of", "at", "with"], 1, "Short of is the standard phrase.");
addQ(42, "Prepositions", "ECAT", "Medium", "He died ___ cancer.", ["from", "with", "of", "by"], 2, "Die of a disease; die from an injury/hunger.");
addQ(43, "Prepositions", "NET", "Medium", "You must abide ___ the rules.", ["with", "to", "by", "on"], 2, "Abide takes the preposition 'by'.");
addQ(44, "Prepositions", "USAT", "Medium", "This brand is superior ___ that one.", ["than", "from", "to", "over"], 2, "Adjectives ending in -ior take 'to'.");
addQ(45, "Prepositions", "FAST ET", "Medium", "He was deprived ___ his rights.", ["from", "of", "with", "by"], 1, "Deprived takes the preposition 'of'.");
addQ(46, "Prepositions", "LAT", "Easy", "Please look ___ my bag while I am gone.", ["for", "after", "into", "at"], 1, "'Look after' means to take care of.");
addQ(47, "Prepositions", "NTC", "Medium", "I am good ___ mathematics.", ["in", "at", "with", "on"], 1, "Good at a subject/activity.");
addQ(48, "Prepositions", "IBA ET", "Hard", "He is confident ___ his success.", ["about", "in", "of", "for"], 2, "Confident of one's success.");
addQ(49, "Prepositions", "LCAT", "Medium", "She is angry ___ her brother.", ["at", "with", "on", "from"], 1, "Angry with a person; angry at a situation.");
addQ(50, "Prepositions", "SAT", "Hard", "They are angry ___ the delay.", ["at", "with", "on", "in"], 0, "Angry at a circumstance or delay.");

addQ(51, "Prepositions", "MDCAT", "Medium", "She smiled ___ my mistake.", ["on", "at", "over", "upon"], 1, "Smile at something.");
addQ(52, "Prepositions", "ECAT", "Easy", "We should not laugh ___ the poor.", ["on", "at", "over", "with"], 1, "Laugh at someone.");
addQ(53, "Prepositions", "NET", "Medium", "He agreed ___ my proposal.", ["with", "to", "on", "at"], 1, "Agree to a proposal; agree with a person.");
addQ(54, "Prepositions", "USAT", "Easy", "I agree ___ you completely.", ["with", "to", "on", "at"], 0, "Agree with a person.");
addQ(55, "Prepositions", "FAST ET", "Medium", "The teacher was satisfied ___ the student's work.", ["by", "with", "from", "at"], 1, "Satisfied with something.");
addQ(56, "Prepositions", "LAT", "Hard", "He deals ___ garments.", ["with", "in", "at", "on"], 1, "Deal in business/trade; deal with a person/problem.");
addQ(57, "Prepositions", "NTC", "Medium", "I cannot deal ___ this problem.", ["with", "in", "at", "on"], 0, "Deal with a problem.");
addQ(58, "Prepositions", "IBA ET", "Easy", "She apologized ___ the teacher.", ["with", "to", "at", "from"], 1, "Apologize to a person.");
addQ(59, "Prepositions", "LCAT", "Medium", "She apologized ___ arriving late.", ["about", "for", "on", "at"], 1, "Apologize for a reason/action.");
addQ(60, "Prepositions", "SAT", "Hard", "He is indifferent ___ pain and pleasure.", ["of", "to", "with", "at"], 1, "Indifferent takes 'to'.");

addQ(61, "Prepositions", "MDCAT", "Medium", "They congratulated him ___ his success.", ["for", "on", "at", "over"], 1, "Congratulate on something.");
addQ(62, "Prepositions", "ECAT", "Easy", "The room was filled ___ smoke.", ["by", "with", "of", "in"], 1, "Filled with something.");
addQ(63, "Prepositions", "NET", "Medium", "The bucket is full ___ water.", ["with", "of", "from", "by"], 1, "Full of something.");
addQ(64, "Prepositions", "USAT", "Medium", "He is junior ___ me in age.", ["than", "to", "from", "with"], 1, "Junior takes 'to'.");
addQ(65, "Prepositions", "FAST ET", "Medium", "She arrived prior ___ the deadline.", ["than", "to", "from", "of"], 1, "Prior takes 'to'.");
addQ(66, "Prepositions", "LAT", "Medium", "I prefer tea ___ coffee.", ["than", "over", "to", "from"], 2, "Prefer takes 'to'.");
addQ(67, "Prepositions", "NTC", "Easy", "He was absent ___ the class.", ["to", "from", "in", "of"], 1, "Absent from somewhere.");
addQ(68, "Prepositions", "IBA ET", "Medium", "You should abstain ___ smoking.", ["of", "from", "with", "to"], 1, "Abstain takes 'from'.");
addQ(69, "Prepositions", "LCAT", "Easy", "We are entirely dependent ___ him.", ["on", "of", "with", "to"], 0, "Dependent on someone.");
addQ(70, "Prepositions", "SAT", "Hard", "The climate is favorable ___ agriculture.", ["for", "to", "with", "in"], 1, "Favorable to something.");

addQ(71, "Prepositions", "MDCAT", "Medium", "He was completely absorbed ___ his work.", ["in", "at", "with", "on"], 0, "Absorbed in work.");
addQ(72, "Prepositions", "ECAT", "Medium", "She is accustomed ___ waking up early.", ["of", "to", "with", "in"], 1, "Accustomed takes 'to'.");
addQ(73, "Prepositions", "NET", "Hard", "I am not acquainted ___ that author.", ["of", "to", "with", "about"], 2, "Acquainted takes 'with'.");
addQ(74, "Prepositions", "USAT", "Hard", "The judge acquitted him ___ the crime.", ["from", "of", "with", "off"], 1, "Acquit takes 'of'.");
addQ(75, "Prepositions", "FAST ET", "Easy", "He is fully aware ___ the danger.", ["about", "of", "from", "with"], 1, "Aware takes 'of'.");
addQ(76, "Prepositions", "LAT", "Easy", "Beware ___ the dog!", ["from", "of", "with", "off"], 1, "Beware takes 'of'.");
addQ(77, "Prepositions", "NTC", "Medium", "She boasts ___ her wealth.", ["about", "of", "on", "for"], 1, "Boast takes 'of' or 'about'.");
addQ(78, "Prepositions", "IBA ET", "Hard", "He is blind ___ one eye.", ["of", "in", "with", "to"], 0, "Blind of/in an eye.");
addQ(79, "Prepositions", "LCAT", "Hard", "The mother is blind ___ her son's faults.", ["of", "in", "with", "to"], 3, "Blind to faults (figurative).");
addQ(80, "Prepositions", "SAT", "Easy", "The committee consists ___ five members.", ["from", "of", "with", "in"], 1, "Consist takes 'of'.");

addQ(81, "Prepositions", "MDCAT", "Medium", "He was cured ___ his illness.", ["from", "of", "with", "by"], 1, "Cured of an illness.");
addQ(82, "Prepositions", "ECAT", "Medium", "The medicine is a cure ___ malaria.", ["of", "for", "against", "to"], 1, "Cure for a disease.");
addQ(83, "Prepositions", "NET", "Medium", "I have no desire ___ fame.", ["of", "for", "to", "about"], 1, "Desire for something.");
addQ(84, "Prepositions", "USAT", "Hard", "She is desirous ___ going abroad.", ["for", "of", "to", "about"], 1, "Desirous of something.");
addQ(85, "Prepositions", "FAST ET", "Easy", "He is eligible ___ this post.", ["to", "for", "of", "in"], 1, "Eligible for a post.");
addQ(86, "Prepositions", "LAT", "Medium", "She is exempt ___ paying the tax.", ["of", "from", "to", "with"], 1, "Exempt from something.");
addQ(87, "Prepositions", "NTC", "Medium", "They were found guilty ___ murder.", ["for", "of", "in", "with"], 1, "Guilty of a crime.");
addQ(88, "Prepositions", "IBA ET", "Medium", "He is ignorant ___ the facts.", ["about", "of", "from", "to"], 1, "Ignorant of something.");
addQ(89, "Prepositions", "LCAT", "Medium", "The workers insisted ___ a pay rise.", ["on", "for", "to", "at"], 0, "Insist on something.");
addQ(90, "Prepositions", "SAT", "Easy", "She is interested ___ learning French.", ["on", "in", "at", "about"], 1, "Interested in something.");

addQ(91, "Prepositions", "MDCAT", "Medium", "He is notoriously known ___ his bad temper.", ["for", "by", "with", "to"], 0, "Known/Notorious for a quality.");
addQ(92, "Prepositions", "ECAT", "Hard", "A man is known ___ the company he keeps.", ["for", "by", "with", "from"], 1, "Known by his associates.");
addQ(93, "Prepositions", "NET", "Medium", "He leaned ___ the wall.", ["on", "against", "by", "at"], 1, "Lean against a wall.");
addQ(94, "Prepositions", "USAT", "Easy", "Listen ___ your parents.", ["at", "to", "for", "on"], 1, "Listen to someone.");
addQ(95, "Prepositions", "FAST ET", "Medium", "I have no objection ___ your going there.", ["for", "to", "against", "on"], 1, "Objection to something.");
addQ(96, "Prepositions", "LAT", "Hard", "They parted ___ their friends at the station.", ["from", "with", "of", "away"], 0, "Part from people; part with things.");
addQ(97, "Prepositions", "NTC", "Hard", "He cannot part ___ his money.", ["from", "with", "of", "away"], 1, "Part with possessions.");
addQ(98, "Prepositions", "IBA ET", "Medium", "The manager presided ___ the meeting.", ["on", "at", "over", "in"], 2, "Preside over a meeting.");
addQ(99, "Prepositions", "LCAT", "Medium", "He was prohibited ___ entering the building.", ["to", "from", "against", "for"], 1, "Prohibit takes 'from'.");
addQ(100, "Prepositions", "SAT", "Medium", "She takes pride ___ her beauty.", ["of", "in", "on", "about"], 1, "Take pride in something.");

addQ(101, "Prepositions", "MDCAT", "Easy", "He is proud ___ his achievements.", ["of", "in", "on", "about"], 0, "Proud of something.");
addQ(102, "Prepositions", "ECAT", "Hard", "They rejoiced ___ his success.", ["at", "on", "with", "for"], 0, "Rejoice at/in something.");
addQ(103, "Prepositions", "NET", "Medium", "He is related ___ me by blood.", ["with", "to", "from", "by"], 1, "Related to someone.");
addQ(104, "Prepositions", "USAT", "Easy", "The student relied ___ his memory.", ["in", "on", "to", "with"], 1, "Rely on something.");
addQ(105, "Prepositions", "FAST ET", "Medium", "Please remind me ___ the meeting.", ["about", "of", "for", "on"], 1, "Remind of something.");
addQ(106, "Prepositions", "LAT", "Hard", "He repented ___ his sins.", ["for", "of", "on", "from"], 1, "Repent of sins.");
addQ(107, "Prepositions", "NTC", "Medium", "Are you sure ___ your facts?", ["about", "of", "for", "on"], 1, "Sure of facts.");
addQ(108, "Prepositions", "IBA ET", "Easy", "I deeply sympathize ___ you.", ["to", "with", "for", "on"], 1, "Sympathize with a person.");
addQ(109, "Prepositions", "LCAT", "Medium", "He has no taste ___ music.", ["in", "for", "of", "with"], 1, "Taste for art/music.");
addQ(110, "Prepositions", "SAT", "Medium", "I am tired ___ walking.", ["from", "with", "of", "by"], 2, "Tired of an activity.");

addQ(111, "Prepositions", "MDCAT", "Easy", "Trust ___ God and do the right.", ["on", "in", "with", "to"], 1, "Trust in God.");
addQ(112, "Prepositions", "ECAT", "Medium", "This book is useful ___ the students.", ["for", "to", "with", "in"], 1, "Useful to someone; useful for a purpose.");
addQ(113, "Prepositions", "NET", "Hard", "She was vexed ___ his behavior.", ["at", "with", "on", "from"], 0, "Vexed at behavior; vexed with a person.");
addQ(114, "Prepositions", "USAT", "Hard", "I am vexed ___ my brother.", ["at", "with", "on", "from"], 1, "Vexed with a person.");
addQ(115, "Prepositions", "FAST ET", "Medium", "He yielded ___ the pressure.", ["to", "under", "by", "with"], 0, "Yield to pressure.");
addQ(116, "Prepositions", "LAT", "Medium", "The dog sprang ___ the table.", ["on", "upon", "at", "over"], 1, "Sprang upon a surface.");
addQ(117, "Prepositions", "NTC", "Easy", "We will travel ___ night.", ["in", "on", "at", "by"], 2, "'At night' is standard.");
addQ(118, "Prepositions", "IBA ET", "Hard", "She sat ___ the shade of the tree.", ["under", "in", "beneath", "on"], 1, "'In the shade' (under the tree, but in the shade).");
addQ(119, "Prepositions", "LCAT", "Medium", "He jumped ___ the conclusion too quickly.", ["to", "at", "on", "in"], 0, "Jump to conclusions.");
addQ(120, "Prepositions", "SAT", "Hard", "She has a strong antipathy ___ dogs.", ["for", "against", "to", "with"], 2, "Antipathy to/towards something.");

addQ(121, "Prepositions", "MDCAT", "Hard", "He is averse ___ hard work.", ["from", "to", "against", "of"], 1, "Averse to something.");
addQ(122, "Prepositions", "ECAT", "Medium", "I was astonished ___ his failure.", ["by", "at", "with", "on"], 1, "Astonished at something.");
addQ(123, "Prepositions", "NET", "Easy", "The cat is hiding ___ the bed.", ["below", "under", "beneath", "behind"], 1, "Hiding under the bed.");
addQ(124, "Prepositions", "USAT", "Medium", "The plane flew ___ our heads.", ["above", "over", "across", "on"], 1, "Flew over our heads.");
addQ(125, "Prepositions", "FAST ET", "Medium", "He walked ___ the bridge.", ["across", "through", "above", "on"], 0, "Walk across a bridge.");

// ─── 126-250: VOCABULARY (SYNONYMS & ANTONYMS) ───
addQ(126, "Vocabulary", "LAT", "Medium", "Synonym of ABATE:", ["Diminish", "Increase", "Intensify", "Expand"], 0, "'Abate' means to reduce or diminish.");
addQ(127, "Vocabulary", "NTC", "Easy", "Synonym of BENEVOLENT:", ["Cruel", "Malevolent", "Kind", "Haughty"], 2, "'Benevolent' means well-meaning and kind.");
addQ(128, "Vocabulary", "IBA ET", "Easy", "Synonym of CANDID:", ["Reserved", "Frank", "Evasive", "Deceitful"], 1, "'Candid' means truthful and straightforward.");
addQ(129, "Vocabulary", "LCAT", "Easy", "Synonym of DILIGENT:", ["Lazy", "Hardworking", "Indolent", "Lethargic"], 1, "'Diligent' means showing care and effort.");
addQ(130, "Vocabulary", "SAT", "Medium", "Synonym of ELOQUENT:", ["Articulate", "Inarticulate", "Silent", "Reticent"], 0, "'Eloquent' means fluent or persuasive in speaking.");
addQ(131, "Vocabulary", "MDCAT", "Medium", "Synonym of FRUGAL:", ["Wasteful", "Thrifty", "Extravagant", "Generous"], 1, "'Frugal' means economical or thrifty.");
addQ(132, "Vocabulary", "ECAT", "Medium", "Synonym of GREGARIOUS:", ["Solitary", "Reclusive", "Sociable", "Introverted"], 2, "'Gregarious' means fond of company; sociable.");
addQ(133, "Vocabulary", "NET", "Hard", "Synonym of HAPLESS:", ["Fortunate", "Unlucky", "Happy", "Blessed"], 1, "'Hapless' means unfortunate or unlucky.");
addQ(134, "Vocabulary", "USAT", "Medium", "Synonym of INDIFFERENT:", ["Concerned", "Apathetic", "Enthusiastic", "Zealous"], 1, "'Indifferent' means having no interest or concern.");
addQ(135, "Vocabulary", "FAST ET", "Easy", "Synonym of JUBILANT:", ["Sad", "Joyful", "Morose", "Somber"], 1, "'Jubilant' means feeling or expressing great happiness.");

addQ(136, "Vocabulary", "LAT", "Medium", "Synonym of HAUGHTY:", ["Humble", "Arrogant", "Modest", "Meek"], 1, "'Haughty' means arrogantly superior.");
addQ(137, "Vocabulary", "NTC", "Hard", "Synonym of INDOLENT:", ["Industrious", "Slothful", "Active", "Diligent"], 1, "'Indolent' means wanting to avoid activity; lazy.");
addQ(138, "Vocabulary", "IBA ET", "Easy", "Synonym of JOVIAL:", ["Morose", "Jolly", "Sad", "Angry"], 1, "'Jovial' means cheerful and friendly.");
addQ(139, "Vocabulary", "LCAT", "Medium", "Synonym of KINDLE:", ["Extinguish", "Ignite", "Suppress", "Quell"], 1, "'Kindle' means to light or set on fire.");
addQ(140, "Vocabulary", "SAT", "Hard", "Synonym of LETHARGIC:", ["Energetic", "Torpid", "Active", "Brisk"], 1, "'Lethargic' means sluggish and apathetic.");
addQ(141, "Vocabulary", "MDCAT", "Hard", "Synonym of METICULOUS:", ["Careless", "Scrupulous", "Sloppy", "Negligent"], 1, "'Meticulous' means showing great attention to detail.");
addQ(142, "Vocabulary", "ECAT", "Hard", "Synonym of NOVICE:", ["Veteran", "Tyro", "Expert", "Master"], 1, "'Novice' means a beginner (tyro).");
addQ(143, "Vocabulary", "NET", "Medium", "Synonym of OBSOLETE:", ["Current", "Antiquated", "Modern", "New"], 1, "'Obsolete' means no longer produced or used.");
addQ(144, "Vocabulary", "USAT", "Hard", "Synonym of PRUDENT:", ["Rash", "Judicious", "Careless", "Foolish"], 1, "'Prudent' means acting with care and thought.");
addQ(145, "Vocabulary", "FAST ET", "Hard", "Synonym of QUELL:", ["Incite", "Subdue", "Encourage", "Provoke"], 1, "'Quell' means to put an end to or subdue.");

addQ(146, "Vocabulary", "LAT", "Hard", "Synonym of RETICENT:", ["Garrulous", "Taciturn", "Talkative", "Loquacious"], 1, "'Reticent' means not revealing thoughts readily; reserved.");
addQ(147, "Vocabulary", "NTC", "Hard", "Synonym of SAGACIOUS:", ["Foolish", "Astute", "Ignorant", "Stupid"], 1, "'Sagacious' means showing keen mental discernment.");
addQ(148, "Vocabulary", "IBA ET", "Medium", "Synonym of TENACIOUS:", ["Yielding", "Persistent", "Weak", "Flimsy"], 1, "'Tenacious' means tending to keep a firm hold.");
addQ(149, "Vocabulary", "LCAT", "Hard", "Synonym of UBIQUITOUS:", ["Rare", "Omnipresent", "Scarce", "Hidden"], 1, "'Ubiquitous' means present everywhere.");
addQ(150, "Vocabulary", "SAT", "Medium", "Synonym of VEX:", ["Soothe", "Irritate", "Calm", "Comfort"], 1, "'Vex' means to make someone feel annoyed.");
addQ(151, "Vocabulary", "MDCAT", "Hard", "Synonym of WARY:", ["Reckless", "Circumspect", "Careless", "Rash"], 1, "'Wary' means feeling or showing caution (circumspect).");
addQ(152, "Vocabulary", "ECAT", "Hard", "Synonym of ZEALOUS:", ["Apathetic", "Ardent", "Indifferent", "Uncaring"], 1, "'Zealous' means great energy or enthusiasm.");
addQ(153, "Vocabulary", "NET", "Medium", "Synonym of YEARN:", ["Dread", "Crave", "Dislike", "Hate"], 1, "'Yearn' means to have an intense feeling of longing.");
addQ(154, "Vocabulary", "USAT", "Medium", "Synonym of APPALLING:", ["Horrific", "Appealing", "Delightful", "Pleasant"], 0, "'Appalling' means causing shock or dismay.");
addQ(155, "Vocabulary", "FAST ET", "Easy", "Synonym of ASTOUNDED:", ["Bored", "Unimpressed", "Amazed", "Calm"], 2, "'Astounded' means greatly surprised or amazed.");

addQ(156, "Vocabulary", "LAT", "Medium", "Synonym of BOON:", ["Curse", "Disadvantage", "Blessing", "Hindrance"], 2, "'Boon' means a thing that is helpful or beneficial.");
addQ(157, "Vocabulary", "NTC", "Medium", "Synonym of BEWILDERMENT:", ["Clarity", "Confusion", "Certainty", "Understanding"], 1, "'Bewilderment' means a feeling of being confused.");
addQ(158, "Vocabulary", "IBA ET", "Medium", "Synonym of BRISKLY:", ["Sluggishly", "Rapidly", "Slowly", "Lethargically"], 1, "'Briskly' means active, fast, and energetic.");
addQ(159, "Vocabulary", "LCAT", "Medium", "Synonym of BAFFLING:", ["Clear", "Perplexing", "Lucid", "Obvious"], 1, "'Baffling' means impossible to understand; perplexing.");
addQ(160, "Vocabulary", "SAT", "Medium", "Synonym of BASHFUL:", ["Bold", "Shy", "Arrogant", "Confident"], 1, "'Bashful' means reluctant to draw attention; shy.");
addQ(161, "Vocabulary", "MDCAT", "Hard", "Synonym of CAPACIOUS:", ["Cramped", "Spacious", "Tiny", "Small"], 1, "'Capacious' means having a lot of space inside.");
addQ(162, "Vocabulary", "ECAT", "Medium", "Synonym of COVETED:", ["Desired", "Hated", "Disliked", "Ignored"], 0, "'Coveted' means greatly desired or wished for.");
addQ(163, "Vocabulary", "NET", "Easy", "Synonym of CONFRONT:", ["Avoid", "Evade", "Face", "Yield"], 2, "'Confront' means meet face to face with hostile intent.");
addQ(164, "Vocabulary", "USAT", "Medium", "Synonym of COMPELLED:", ["Forced", "Allowed", "Dissuaded", "Stopped"], 0, "'Compelled' means forced to do something.");
addQ(165, "Vocabulary", "FAST ET", "Hard", "Synonym of COAXED:", ["Repelled", "Wheedled", "Discouraged", "Disgusted"], 1, "'Coaxed' means persuaded gradually (wheedled).");

addQ(166, "Vocabulary", "LAT", "Easy", "Synonym of CURIOUS:", ["Incurious", "Inquisitive", "Indifferent", "Apathetic"], 1, "'Curious' means eager to know or learn.");
addQ(167, "Vocabulary", "NTC", "Medium", "Synonym of DAUNTLESS:", ["Cowardly", "Brave", "Fearful", "Timid"], 1, "'Dauntless' means showing fearlessness and determination.");
addQ(168, "Vocabulary", "IBA ET", "Medium", "Synonym of ECCENTRIC:", ["Normal", "Peculiar", "Ordinary", "Conventional"], 1, "'Eccentric' means unconventional and slightly strange.");
addQ(169, "Vocabulary", "LCAT", "Medium", "Synonym of FUTILE:", ["Useful", "Pointless", "Effective", "Productive"], 1, "'Futile' means producing no useful result.");
addQ(170, "Vocabulary", "SAT", "Medium", "Synonym of HINDER:", ["Assist", "Impede", "Help", "Support"], 1, "'Hinder' means to create difficulties; impede.");
addQ(171, "Vocabulary", "MDCAT", "Medium", "Synonym of IMPECCABLE:", ["Flawed", "Flawless", "Imperfect", "Defective"], 1, "'Impeccable' means faultless or flawless.");
addQ(172, "Vocabulary", "ECAT", "Hard", "Synonym of JUXTAPOSE:", ["Separate", "Compare", "Isolate", "Divide"], 1, "'Juxtapose' means place close together for comparison.");
addQ(173, "Vocabulary", "NET", "Hard", "Synonym of BELLIGERENT:", ["Peaceful", "Combative", "Friendly", "Calm"], 1, "'Belligerent' means hostile and aggressive.");
addQ(174, "Vocabulary", "USAT", "Medium", "Synonym of ABSTAIN:", ["Indulge", "Refrain", "Consume", "Use"], 1, "'Abstain' means restrain oneself from doing something.");
addQ(175, "Vocabulary", "FAST ET", "Medium", "Synonym of ACCENTUATED:", ["Masked", "Emphasized", "Diverted", "Hidden"], 1, "'Accentuated' means made more noticeable.");

addQ(176, "Vocabulary", "LAT", "Medium", "Antonym of ABATE:", ["Diminish", "Reduce", "Increase", "Subside"], 2, "Antonym of abate (lessen) is increase.");
addQ(177, "Vocabulary", "NTC", "Medium", "Antonym of BENEVOLENT:", ["Kind", "Charitable", "Malevolent", "Generous"], 2, "Antonym of benevolent (kind) is malevolent.");
addQ(178, "Vocabulary", "IBA ET", "Medium", "Antonym of CANDID:", ["Frank", "Honest", "Evasive", "Direct"], 2, "Antonym of candid (frank) is evasive.");
addQ(179, "Vocabulary", "LCAT", "Easy", "Antonym of DILIGENT:", ["Hardworking", "Assiduous", "Lazy", "Careful"], 2, "Antonym of diligent (hardworking) is lazy.");
addQ(180, "Vocabulary", "SAT", "Medium", "Antonym of ELOQUENT:", ["Articulate", "Fluent", "Inarticulate", "Persuasive"], 2, "Antonym of eloquent is inarticulate.");
addQ(181, "Vocabulary", "MDCAT", "Medium", "Antonym of FRUGAL:", ["Thrifty", "Economical", "Extravagant", "Sparing"], 2, "Antonym of frugal (thrifty) is extravagant.");
addQ(182, "Vocabulary", "ECAT", "Medium", "Antonym of GREGARIOUS:", ["Sociable", "Outgoing", "Reclusive", "Friendly"], 2, "Antonym of gregarious (sociable) is reclusive.");
addQ(183, "Vocabulary", "NET", "Hard", "Antonym of HAPLESS:", ["Unlucky", "Unfortunate", "Fortunate", "Cursed"], 2, "Antonym of hapless (unfortunate) is fortunate.");
addQ(184, "Vocabulary", "USAT", "Medium", "Antonym of INDIFFERENT:", ["Apathetic", "Uncaring", "Concerned", "Detached"], 2, "Antonym of indifferent (unconcerned) is concerned.");
addQ(185, "Vocabulary", "FAST ET", "Easy", "Antonym of JUBILANT:", ["Joyful", "Triumphant", "Sorrowful", "Happy"], 2, "Antonym of jubilant (joyful) is sorrowful.");

addQ(186, "Vocabulary", "LAT", "Medium", "Antonym of HAUGHTY:", ["Arrogant", "Proud", "Humble", "Conceited"], 2, "Antonym of haughty (arrogant) is humble.");
addQ(187, "Vocabulary", "NTC", "Hard", "Antonym of INDOLENT:", ["Slothful", "Lazy", "Industrious", "Idle"], 2, "Antonym of indolent (lazy) is industrious.");
addQ(188, "Vocabulary", "IBA ET", "Medium", "Antonym of JOVIAL:", ["Jolly", "Cheerful", "Morose", "Merry"], 2, "Antonym of jovial (cheerful) is morose.");
addQ(189, "Vocabulary", "LCAT", "Medium", "Antonym of KINDLE:", ["Ignite", "Arouse", "Extinguis", "Spark"], 2, "Antonym of kindle (ignite) is extinguish.");
addQ(190, "Vocabulary", "SAT", "Hard", "Antonym of LETHARGIC:", ["Torpid", "Sluggish", "Energetic", "Drowsy"], 2, "Antonym of lethargic (sluggish) is energetic.");
addQ(191, "Vocabulary", "MDCAT", "Medium", "Antonym of METICULOUS:", ["Scrupulous", "Careful", "Careless", "Precise"], 2, "Antonym of meticulous is careless.");
addQ(192, "Vocabulary", "ECAT", "Hard", "Antonym of NOVICE:", ["Tyro", "Beginner", "Veteran", "Learner"], 2, "Antonym of novice (beginner) is veteran.");
addQ(193, "Vocabulary", "NET", "Medium", "Antonym of OBSOLETE:", ["Antiquated", "Outdated", "Current", "Old"], 2, "Antonym of obsolete (outdated) is current.");
addQ(194, "Vocabulary", "USAT", "Hard", "Antonym of PRUDENT:", ["Judicious", "Wise", "Rash", "Cautious"], 2, "Antonym of prudent (wise) is rash.");
addQ(195, "Vocabulary", "FAST ET", "Hard", "Antonym of QUELL:", ["Subdue", "Suppress", "Incite", "Crush"], 2, "Antonym of quell (subdue) is incite.");

addQ(196, "Vocabulary", "LAT", "Hard", "Antonym of RETICENT:", ["Taciturn", "Reserved", "Garrulous", "Silent"], 2, "Antonym of reticent (reserved) is garrulous (talkative).");
addQ(197, "Vocabulary", "NTC", "Hard", "Antonym of SAGACIOUS:", ["Astute", "Wise", "Foolish", "Shrewd"], 2, "Antonym of sagacious (wise) is foolish.");
addQ(198, "Vocabulary", "IBA ET", "Medium", "Antonym of TENACIOUS:", ["Persistent", "Stubborn", "Yielding", "Firm"], 2, "Antonym of tenacious (firm) is yielding.");
addQ(199, "Vocabulary", "LCAT", "Hard", "Antonym of UBIQUITOUS:", ["Omnipresent", "Universal", "Rare", "Everywhere"], 2, "Antonym of ubiquitous (everywhere) is rare.");
addQ(200, "Vocabulary", "SAT", "Medium", "Antonym of VEX:", ["Irritate", "Annoy", "Soothe", "Anger"], 2, "Antonym of vex (irritate) is soothe.");
addQ(201, "Vocabulary", "MDCAT", "Hard", "Antonym of WARY:", ["Circumspect", "Cautious", "Reckless", "Careful"], 2, "Antonym of wary (cautious) is reckless.");
addQ(202, "Vocabulary", "ECAT", "Hard", "Antonym of ZEALOUS:", ["Ardent", "Fervent", "Apathetic", "Passionate"], 2, "Antonym of zealous (passionate) is apathetic.");
addQ(203, "Vocabulary", "NET", "Medium", "Antonym of YEARN:", ["Crave", "Long", "Dread", "Desire"], 2, "Antonym of yearn (desire) is dread.");
addQ(204, "Vocabulary", "USAT", "Medium", "Antonym of APPALLING:", ["Horrific", "Shocking", "Delightful", "Awful"], 2, "Antonym of appalling (horrific) is delightful.");
addQ(205, "Vocabulary", "FAST ET", "Medium", "Antonym of ASTOUNDED:", ["Amazed", "Stunned", "Unimpressed", "Surprised"], 2, "Antonym of astounded is unimpressed.");

addQ(206, "Vocabulary", "LAT", "Medium", "Antonym of BOON:", ["Blessing", "Godsend", "Curse", "Benefit"], 2, "Antonym of boon (blessing) is curse.");
addQ(207, "Vocabulary", "NTC", "Medium", "Antonym of BEWILDERMENT:", ["Confusion", "Bafflement", "Clarity", "Perplexity"], 2, "Antonym of bewilderment is clarity.");
addQ(208, "Vocabulary", "IBA ET", "Medium", "Antonym of BRISKLY:", ["Rapidly", "Swiftly", "Sluggishly", "Quickly"], 2, "Antonym of briskly is sluggishly.");
addQ(209, "Vocabulary", "LCAT", "Medium", "Antonym of BAFFLING:", ["Perplexing", "Confusing", "Clear", "Mystifying"], 2, "Antonym of baffling is clear.");
addQ(210, "Vocabulary", "SAT", "Medium", "Antonym of BASHFUL:", ["Shy", "Timid", "Bold", "Reserved"], 2, "Antonym of bashful (shy) is bold.");
addQ(211, "Vocabulary", "MDCAT", "Hard", "Antonym of CAPACIOUS:", ["Spacious", "Roomy", "Cramped", "Large"], 2, "Antonym of capacious (spacious) is cramped.");
addQ(212, "Vocabulary", "ECAT", "Medium", "Antonym of COVETED:", ["Desired", "Craved", "Spurned", "Wanted"], 2, "Antonym of coveted is spurned.");
addQ(213, "Vocabulary", "NET", "Easy", "Antonym of CONFRONT:", ["Face", "Encounter", "Avoid", "Meet"], 2, "Antonym of confront is avoid.");
addQ(214, "Vocabulary", "USAT", "Medium", "Antonym of COMPELLED:", ["Forced", "Coerced", "Dissuaded", "Impelled"], 2, "Antonym of compelled is dissuaded.");
addQ(215, "Vocabulary", "FAST ET", "Hard", "Antonym of COAXED:", ["Wheedled", "Persuaded", "Repelled", "Cajoled"], 2, "Antonym of coaxed is repelled.");

addQ(216, "Vocabulary", "LAT", "Easy", "Antonym of CURIOUS:", ["Inquisitive", "Prying", "Indifferent", "Snoopy"], 2, "Antonym of curious is indifferent.");
addQ(217, "Vocabulary", "NTC", "Medium", "Antonym of DAUNTLESS:", ["Brave", "Fearless", "Cowardly", "Courageous"], 2, "Antonym of dauntless (brave) is cowardly.");
addQ(218, "Vocabulary", "IBA ET", "Medium", "Antonym of ECCENTRIC:", ["Peculiar", "Odd", "Conventional", "Strange"], 2, "Antonym of eccentric is conventional.");
addQ(219, "Vocabulary", "LCAT", "Medium", "Antonym of FUTILE:", ["Pointless", "Useless", "Productive", "Vain"], 2, "Antonym of futile (pointless) is productive.");
addQ(220, "Vocabulary", "SAT", "Medium", "Antonym of HINDER:", ["Impede", "Obstruct", "Assist", "Delay"], 2, "Antonym of hinder (obstruct) is assist.");
addQ(221, "Vocabulary", "MDCAT", "Medium", "Antonym of IMPECCABLE:", ["Flawless", "Perfect", "Defective", "Faultless"], 2, "Antonym of impeccable (flawless) is defective.");
addQ(222, "Vocabulary", "ECAT", "Hard", "Antonym of BELLIGERENT:", ["Aggressive", "Combative", "Peaceful", "Hostile"], 2, "Antonym of belligerent is peaceful.");
addQ(223, "Vocabulary", "NET", "Medium", "Antonym of ABSTAIN:", ["Refrain", "Avoid", "Indulge", "Withhold"], 2, "Antonym of abstain is indulge.");
addQ(224, "Vocabulary", "USAT", "Medium", "Antonym of ACCENTUATED:", ["Emphasized", "Highlighted", "Masked", "Stressed"], 2, "Antonym of accentuated is masked.");
addQ(225, "Vocabulary", "FAST ET", "Easy", "Synonym of COZY:", ["Uncomfortable", "Snug", "Cold", "Hard"], 1, "'Cozy' means warm and comfortable (snug).");

addQ(226, "Vocabulary", "LAT", "Easy", "Antonym of COZY:", ["Snug", "Warm", "Uncomfortable", "Soft"], 2, "Antonym of cozy is uncomfortable.");
addQ(227, "Vocabulary", "NTC", "Medium", "Synonym of AMORAL:", ["Ethical", "Unprincipled", "Good", "Moral"], 1, "'Amoral' means lacking moral sense; unprincipled.");
addQ(228, "Vocabulary", "IBA ET", "Medium", "Antonym of AMORAL:", ["Unprincipled", "Bad", "Ethical", "Evil"], 2, "Antonym of amoral is ethical.");
addQ(229, "Vocabulary", "LCAT", "Hard", "Synonym of DEARTH:", ["Scarcity", "Abundance", "Plenty", "Excess"], 0, "'Dearth' means a scarcity or lack.");
addQ(230, "Vocabulary", "SAT", "Hard", "Antonym of DEARTH:", ["Scarcity", "Lack", "Abundance", "Want"], 2, "Antonym of dearth (scarcity) is abundance.");
addQ(231, "Vocabulary", "MDCAT", "Medium", "Synonym of CONTEMPORARY:", ["Ancient", "Modern", "Old", "Past"], 1, "'Contemporary' means living or occurring at the same time; modern.");
addQ(232, "Vocabulary", "ECAT", "Medium", "Antonym of CONTEMPORARY:", ["Modern", "Current", "Ancient", "Present"], 2, "Antonym of contemporary (modern) is ancient.");
addQ(233, "Vocabulary", "NET", "Hard", "Synonym of GRANDEUR:", ["Splendor", "Poverty", "Ugliness", "Simplicity"], 0, "'Grandeur' means high rank or social importance; splendor.");
addQ(234, "Vocabulary", "USAT", "Hard", "Antonym of GRANDEUR:", ["Splendor", "Magnificence", "Simplicity", "Majesty"], 2, "Antonym of grandeur is simplicity.");
addQ(235, "Vocabulary", "FAST ET", "Hard", "Synonym of REJOINDER:", ["Question", "Reply", "Silence", "Ignorance"], 1, "'Rejoinder' means a reply, especially a sharp or witty one.");

addQ(236, "Vocabulary", "LAT", "Hard", "Antonym of REJOINDER:", ["Reply", "Answer", "Question", "Retort"], 2, "Antonym of rejoinder (reply) is question.");
addQ(237, "Vocabulary", "NTC", "Medium", "Synonym of OBSCURE:", ["Clear", "Unclear", "Bright", "Obvious"], 1, "'Obscure' means not discovered or known; unclear.");
addQ(238, "Vocabulary", "IBA ET", "Medium", "Antonym of OBSCURE:", ["Unclear", "Vague", "Clear", "Hidden"], 2, "Antonym of obscure is clear.");
addQ(239, "Vocabulary", "LCAT", "Medium", "Synonym of ELABORATE:", ["Simple", "Detailed", "Plain", "Basic"], 1, "'Elaborate' means involving many carefully arranged parts; detailed.");
addQ(240, "Vocabulary", "SAT", "Medium", "Antonym of ELABORATE:", ["Detailed", "Intricate", "Simple", "Complex"], 2, "Antonym of elaborate is simple.");
addQ(241, "Vocabulary", "MDCAT", "Easy", "Synonym of REASON:", ["Cause", "Result", "Effect", "Outcome"], 0, "'Reason' means a cause or explanation.");
addQ(242, "Vocabulary", "ECAT", "Easy", "Antonym of REASON:", ["Cause", "Logic", "Effect", "Sense"], 2, "Opposite of cause (reason) in context of origin vs outcome is effect.");
addQ(243, "Vocabulary", "NET", "Easy", "Synonym of DIM:", ["Bright", "Dark", "Shiny", "Clear"], 1, "'Dim' means not shining brightly; dark.");
addQ(244, "Vocabulary", "USAT", "Easy", "Antonym of DIM:", ["Dark", "Dull", "Bright", "Faint"], 2, "Antonym of dim is bright.");
addQ(245, "Vocabulary", "FAST ET", "Easy", "Synonym of HALT:", ["Start", "Stop", "Begin", "Continue"], 1, "'Halt' means bring to an abrupt stop.");

addQ(246, "Vocabulary", "LAT", "Easy", "Antonym of HALT:", ["Stop", "Pause", "Continue", "End"], 2, "Antonym of halt (stop) is continue.");
addQ(247, "Vocabulary", "NTC", "Medium", "Synonym of AMBIGUOUS:", ["Clear", "Unclear", "Obvious", "Plain"], 1, "'Ambiguous' means open to more than one interpretation; unclear.");
addQ(248, "Vocabulary", "IBA ET", "Medium", "Antonym of AMBIGUOUS:", ["Unclear", "Vague", "Clear", "Confusing"], 2, "Antonym of ambiguous is clear.");
addQ(249, "Vocabulary", "LCAT", "Medium", "Synonym of REVOLUTION:", ["Evolution", "Devolution", "Rebellion", "Stagnation"], 2, "'Revolution' means a forcible overthrow; rebellion.");
addQ(250, "Vocabulary", "SAT", "Medium", "Antonym of REVOLUTION:", ["Rebellion", "Uprising", "Stagnation", "Mutiny"], 2, "Antonym of revolution (change) is stagnation.");

// ─── 251-375: GRAMMAR ───
addQ(251, "Grammar", "MDCAT", "Medium", "The team of scientists ___ conducting an important experiment.", ["is", "are", "were", "have"], 0, "'Team' is a collective noun acting as a single unit, so it takes singular verb 'is'.");
addQ(252, "Grammar", "ECAT", "Hard", "Neither the teacher nor the students ___ the instructions.", ["understand", "understands", "is understanding", "has understood"], 0, "In 'neither... nor', verb agrees with closest subject ('students' -> plural 'understand').");
addQ(253, "Grammar", "NET", "Hard", "The number of applicants for the scholarship ___ increasing every year.", ["are", "is", "were", "have been"], 1, "'The number of' takes a singular verb ('is').");
addQ(254, "Grammar", "USAT", "Medium", "Each of the players ___ been practicing for the tournament.", ["have", "has", "having", "were"], 1, "'Each' is singular and takes 'has'.");
addQ(255, "Grammar", "FAST ET", "Medium", "Neither the dog nor the cats ___ the new food.", ["likes", "like", "is liking", "has liked"], 1, "Verb agrees with closest subject 'cats' (plural -> 'like').");

addQ(256, "Grammar", "LAT", "Hard", "The data collected by the researchers ___ very reliable.", ["was", "were", "are", "have been"], 0, "In standard formal usage 'data' can take singular verb 'was' or plural 'were'; here 'was' is selected.");
addQ(257, "Grammar", "NTC", "Medium", "A bouquet of flowers ___ the room.", ["brighten", "brightens", "are brightening", "have brightened"], 1, "Subject is 'bouquet' (singular), so verb is 'brightens'.");
addQ(258, "Grammar", "IBA ET", "Hard", "Ten dollars ___ too much to pay for that pen.", ["are", "is", "were", "have been"], 1, "Amounts of money take a singular verb ('is').");
addQ(259, "Grammar", "LCAT", "Easy", "The books on the shelf ___ to be dusted.", ["needs", "need", "is needing", "has needed"], 1, "Subject is 'books' (plural), taking 'need'.");
addQ(260, "Grammar", "SAT", "Medium", "The pair of shoes ___ left by the door.", ["were", "was", "are", "have been"], 1, "'Pair' is singular, so it takes 'was'.");

addQ(261, "Grammar", "MDCAT", "Hard", "Either the principal or the teachers ___ the ceremony each year.", ["attends", "attend", "is attending", "has attended"], 1, "Verb agrees with 'teachers' (plural -> 'attend').");
addQ(262, "Grammar", "ECAT", "Hard", "Every student and teacher ___ the rules.", ["know", "knows", "are knowing", "have known"], 1, "'Every' followed by singular nouns joined by 'and' takes singular verb 'knows'.");
addQ(263, "Grammar", "NET", "Medium", "The news about the elections ___ surprising.", ["were", "was", "are", "have been"], 1, "'News' is uncountable and takes singular verb 'was'.");
addQ(264, "Grammar", "USAT", "Easy", "Both of my brothers ___ studying abroad.", ["is", "are", "was", "has been"], 1, "'Both' takes a plural verb 'are'.");
addQ(265, "Grammar", "FAST ET", "Easy", "Mathematics ___ my favorite subject.", ["are", "were", "is", "have been"], 2, "Names of subjects ending in -s take singular verb 'is'.");

addQ(266, "Grammar", "LAT", "Hard", "A variety of desserts ___ served at the party.", ["was", "were", "is", "has been"], 0, "'A variety of' + plural noun can take singular or plural; 'was' is selected.");
addQ(267, "Grammar", "NTC", "Hard", "The committee ___ on how to solve the issue.", ["disagrees", "disagree", "is disagreeing", "has disagreed"], 1, "When members act individually/differently, collective noun takes plural 'disagree'.");
addQ(268, "Grammar", "IBA ET", "Medium", "The quality of the mangoes ___ not good.", ["were", "are", "is", "have"], 2, "Subject is 'quality' (singular), taking 'is'.");
addQ(269, "Grammar", "LCAT", "Medium", "The doctor with the white coat ___ at the local hospital.", ["work", "works", "are working", "have worked"], 1, "Subject is 'doctor', ignoring prepositional phrase 'with white coat' -> 'works'.");
addQ(270, "Grammar", "SAT", "Medium", "The players on the team ___ to win the championship.", ["wants", "want", "is wanting", "has wanted"], 1, "Subject is 'players' -> 'want'.");

addQ(271, "Grammar", "MDCAT", "Hard", "The teacher, along with several other professors, ___ highly qualified.", ["are", "is", "were", "have been"], 1, "'Along with' phrase does not change singular subject 'teacher' -> 'is'.");
addQ(272, "Grammar", "ECAT", "Medium", "Each of the boys ___ given a prize.", ["were", "are", "was", "have been"], 2, "'Each' is singular -> 'was'.");
addQ(273, "Grammar", "NET", "Medium", "Neither of the books ___ interesting.", ["are", "were", "is", "have"], 2, "'Neither' takes singular 'is'.");
addQ(274, "Grammar", "USAT", "Hard", "A number of issues ___ to be addressed before proceeding.", ["needs", "need", "is needing", "has needed"], 1, "'A number of' takes plural verb 'need'.");
addQ(275, "Grammar", "FAST ET", "Medium", "The majority of the students ___ excited about the field trip.", ["is", "are", "was", "has"], 1, "'Majority of' + plural noun takes plural 'are'.");

addQ(276, "Grammar", "LAT", "Hard", "Spaghetti and meatballs ___ a classic dish.", ["are", "were", "is", "have been"], 2, "When two items form a single compound dish/idea, it takes singular 'is'.");
addQ(277, "Grammar", "NTC", "Medium", "The leader of the teams ___ arriving soon.", ["are", "were", "is", "have been"], 2, "Subject is 'leader' (singular) -> 'is'.");
addQ(278, "Grammar", "IBA ET", "Hard", "Each one of the band members present ___ played splendidly.", ["have", "has", "are", "were"], 1, "'Each one' takes singular 'has'.");
addQ(279, "Grammar", "LCAT", "Medium", "The group of friends ___ to a new restaurant every weekend.", ["go", "goes", "are going", "have gone"], 1, "Subject is 'group' (singular) -> 'goes'.");
addQ(280, "Grammar", "SAT", "Medium", "The collection of rare coins ___ displayed at the museum.", ["are", "were", "is", "have been"], 2, "Subject is 'collection' -> 'is'.");

addQ(281, "Grammar", "MDCAT", "Medium", "The family of four ___ planning a vacation to Europe.", ["are", "is", "were", "have been"], 1, "'Family' acting as a unit takes singular 'is'.");
addQ(282, "Grammar", "ECAT", "Easy", "A variety of factors ___ contribute to the success.", ["can", "cans", "is", "are"], 0, "Modal auxiliary verb 'can' is appropriate here.");
addQ(283, "Grammar", "NET", "Medium", "When a fire burns red, the color of its flames ___ the chemical composition.", ["indicate", "indicates", "have indicated", "are indicating"], 1, "Subject is 'color' (singular) -> 'indicates'.");
addQ(284, "Grammar", "USAT", "Medium", "Neapolitan pizza made with San Marzano tomatoes ___ considered traditional.", ["are", "have been", "is", "were"], 2, "Subject is 'pizza' -> 'is'.");
addQ(285, "Grammar", "FAST ET", "Medium", "The sum of money one donates ___ a deduction that can be made.", ["represent", "represents", "have represented", "are representing"], 1, "Subject is 'sum' -> 'represents'.");

addQ(286, "Grammar", "LAT", "Hard", "The shape of a skilled trumpet player's lips ___ for playing a wide range of notes.", ["allow", "allows", "are allowing", "have allowed"], 1, "Subject is 'shape' -> 'allows'.");
addQ(287, "Grammar", "NTC", "Hard", "Playing sports such as basketball or football ___ children to learn teamwork.", ["allow", "allows", "are allowing", "have allowed"], 1, "Gerund phrase 'Playing sports' is singular -> 'allows'.");
addQ(288, "Grammar", "IBA ET", "Hard", "Every summer, the sound of children yelling ___ that it is summer vacation.", ["indicate", "indicates", "are indicating", "have indicated"], 1, "Subject is 'sound' -> 'indicates'.");
addQ(289, "Grammar", "LCAT", "Hard", "Extremely careful analysis of handwriting samples ___ that creative people write rounded letters.", ["show", "shows", "are showing", "have shown"], 1, "Subject is 'analysis' -> 'shows'.");
addQ(290, "Grammar", "SAT", "Medium", "An effective tutor demonstrates exceptional knowledge and ___ to them carefully.", ["listen", "listens", "are listening", "have listened"], 1, "Parallel verb to 'demonstrates' -> 'listens'.");

addQ(291, "Grammar", "MDCAT", "Medium", "Bread and butter ___ hard to win nowadays.", ["are", "were", "is", "have been"], 2, "'Bread and butter' as livelihood is singular -> 'is'.");
addQ(292, "Grammar", "ECAT", "Medium", "Corned beef and cabbage ___ his favorite dish.", ["were", "was", "are", "have been"], 1, "Single dish concept -> 'was'.");
addQ(293, "Grammar", "NET", "Hard", "The woman, accompanied by her daughters, ___ come.", ["have", "has", "are", "were"], 1, "Subject is 'woman' -> 'has'.");
addQ(294, "Grammar", "USAT", "Hard", "The man together with his friends ___ decided to improve.", ["have", "has", "are", "were"], 1, "Subject is 'man' -> 'has'.");
addQ(295, "Grammar", "FAST ET", "Hard", "An amorphous mass of cells ___ difficult to understand.", ["are", "were", "had", "is"], 3, "Subject is 'mass' -> 'is'.");

addQ(296, "Grammar", "LAT", "Medium", "Either the boy or his parents ___ responsible.", ["is", "are", "was", "has been"], 1, "Verb agrees with 'parents' (plural -> 'are').");
addQ(297, "Grammar", "NTC", "Medium", "Neither the students nor the teacher ___ present.", ["are", "were", "is", "have been"], 2, "Verb agrees with 'teacher' (singular -> 'is').");
addQ(298, "Grammar", "IBA ET", "Hard", "The jury ___ divided in their opinion.", ["was", "were", "is", "has been"], 1, "Individual division among members -> plural 'were'.");
addQ(299, "Grammar", "LCAT", "Medium", "The jury ___ given its verdict.", ["have", "has", "are", "were"], 1, "Unanimous body -> singular 'has'.");
addQ(300, "Grammar", "SAT", "Medium", "Half of the cake ___ been eaten.", ["have", "has", "are", "were"], 1, "'Half of' + singular noun takes singular 'has'.");

addQ(301, "Grammar", "MDCAT", "Medium", "Half of the apples ___ been eaten.", ["has", "have", "is", "was"], 1, "'Half of' + plural noun takes plural 'have'.");
addQ(302, "Grammar", "ECAT", "Medium", "None of the water ___ left.", ["are", "were", "is", "have"], 2, "'None of' + uncountable noun takes singular 'is'.");
addQ(303, "Grammar", "NET", "Medium", "None of the students ___ passed.", ["has", "have", "is", "was"], 1, "'None of' + plural noun takes plural 'have'.");
addQ(304, "Grammar", "USAT", "Medium", "The rich ___ not always happy.", ["is", "are", "was", "has"], 1, "'The rich' refers to rich people in general -> plural 'are'.");
addQ(305, "Grammar", "FAST ET", "Medium", "The poor ___ suffering in this economy.", ["is", "are", "was", "has"], 1, "'The poor' refers to poor people -> plural 'are'.");

addQ(306, "Grammar", "LAT", "Easy", "Measles ___ a dangerous disease.", ["are", "were", "is", "have been"], 2, "Names of diseases ending in -s take singular 'is'.");
addQ(307, "Grammar", "NTC", "Easy", "Physics ___ difficult to understand for some.", ["are", "were", "is", "have been"], 2, "Academic subjects take singular 'is'.");
addQ(308, "Grammar", "IBA ET", "Easy", "Gymnastics ___ my favorite sport.", ["are", "were", "is", "have been"], 2, "Sports names ending in -s take singular 'is'.");
addQ(309, "Grammar", "LCAT", "Medium", "The police ___ caught the thief.", ["has", "have", "is", "was"], 1, "'Police' is always plural -> 'have'.");
addQ(310, "Grammar", "SAT", "Medium", "Cattle ___ grazing in the field.", ["is", "are", "was", "has"], 1, "'Cattle' is always plural -> 'are'.");

addQ(311, "Grammar", "MDCAT", "Medium", "A lot of money ___ wasted.", ["were", "are", "was", "have"], 2, "'A lot of' + uncountable noun takes singular 'was'.");
addQ(312, "Grammar", "ECAT", "Medium", "A lot of people ___ gathered there.", ["was", "were", "is", "has"], 1, "'A lot of' + count noun takes plural 'were'.");
addQ(313, "Grammar", "NET", "Medium", "Most of the milk ___ spilled.", ["were", "are", "was", "have"], 2, "'Most of' + uncountable noun takes singular 'was'.");
addQ(314, "Grammar", "USAT", "Medium", "Most of the books ___ sold.", ["was", "were", "is", "has"], 1, "'Most of' + plural noun takes plural 'were'.");
addQ(315, "Grammar", "FAST ET", "Medium", "There ___ a boy and a girl in the room.", ["is", "are", "was", "has"], 1, "Compound subject 'a boy and a girl' after 'there' takes 'are'.");

addQ(316, "Grammar", "LAT", "Medium", "Here ___ the results of the election.", ["is", "are", "was", "has"], 1, "Subject is 'results' -> 'are'.");
addQ(317, "Grammar", "NTC", "Hard", "It is I who ___ responsible.", ["is", "are", "am", "be"], 2, "Relative pronoun 'who' refers to 'I', taking 'am'.");
addQ(318, "Grammar", "IBA ET", "Medium", "It is they who ___ done this.", ["has", "have", "is", "was"], 1, "Relative pronoun 'who' refers to 'they' -> 'have'.");
addQ(319, "Grammar", "LCAT", "Hard", "The number of students ___ small.", ["are", "were", "is", "have"], 2, "'The number of' is singular -> 'is'.");
addQ(320, "Grammar", "SAT", "Hard", "A number of students ___ present.", ["is", "are", "was", "has"], 1, "'A number of' is plural -> 'are'.");

addQ(321, "Grammar", "MDCAT", "Hard", "Many a man ___ tried this before.", ["have", "has", "are", "were"], 1, "'Many a' + singular noun takes singular verb 'has'.");
addQ(322, "Grammar", "ECAT", "Hard", "More than one person ___ involved.", ["were", "are", "was", "have"], 2, "'More than one' + singular noun takes singular 'was'.");
addQ(323, "Grammar", "NET", "Medium", "One of the boys ___ missing.", ["are", "were", "is", "have"], 2, "'One of' + plural noun takes singular 'is'.");
addQ(324, "Grammar", "USAT", "Hard", "Two-thirds of the city ___ destroyed.", ["were", "are", "was", "have"], 2, "'Two-thirds of' + singular noun takes singular 'was'.");
addQ(325, "Grammar", "FAST ET", "Hard", "Two-thirds of the people ___ dead.", ["was", "were", "is", "has"], 1, "'Two-thirds of' + plural noun takes plural 'were'.");

addQ(326, "Grammar", "LAT", "Easy", "The United States ___ a big country.", ["are", "were", "is", "have"], 2, "Country name is singular -> 'is'.");
addQ(327, "Grammar", "NTC", "Easy", "Gulliver's Travels ___ a famous book.", ["are", "were", "is", "have"], 2, "Book title is singular -> 'is'.");
addQ(328, "Grammar", "IBA ET", "Medium", "Billiards ___ played all over the world.", ["are", "were", "is", "have"], 2, "Game name ending in -s is singular -> 'is'.");
addQ(329, "Grammar", "LCAT", "Medium", "Five miles ___ a long distance.", ["are", "were", "is", "have"], 2, "Single measurement unit takes singular 'is'.");
addQ(330, "Grammar", "SAT", "Medium", "Ten years ___ a long time to wait.", ["are", "were", "is", "have"], 2, "Single unit of time takes singular 'is'.");

addQ(331, "Grammar", "MDCAT", "Medium", "My scissors ___ lost.", ["is", "are", "was", "has"], 1, "'Scissors' is plural -> 'are'.");
addQ(332, "Grammar", "ECAT", "Medium", "A pair of scissors ___ on the table.", ["are", "were", "is", "have"], 2, "'A pair of scissors' is singular -> 'is'.");
addQ(333, "Grammar", "NET", "Medium", "The trousers ___ too long.", ["is", "are", "was", "has"], 1, "'Trousers' is plural -> 'are'.");
addQ(334, "Grammar", "USAT", "Medium", "The committee ___ issued its report.", ["have", "has", "are", "were"], 1, "Singular pronoun 'its' indicates singular 'has'.");
addQ(335, "Grammar", "FAST ET", "Medium", "The committee ___ arguing with each other.", ["has", "have", "is", "was"], 1, "Individual interaction ('each other') -> plural 'have'.");

addQ(336, "Grammar", "LAT", "Medium", "All of the pie ___ gone.", ["are", "were", "is", "have"], 2, "'All of' + singular noun takes singular 'is'.");
addQ(337, "Grammar", "NTC", "Medium", "All of the guests ___ arrived.", ["has", "have", "is", "was"], 1, "'All of' + plural noun takes plural 'have'.");
addQ(338, "Grammar", "IBA ET", "Medium", "Some of the sugar ___ missing.", ["are", "were", "is", "have"], 2, "'Some of' + uncountable noun takes singular 'is'.");
addQ(339, "Grammar", "LCAT", "Medium", "Some of the students ___ left.", ["has", "have", "is", "was"], 1, "'Some of' + plural noun takes plural 'have'.");
addQ(340, "Grammar", "SAT", "Hard", "The percentage of passes ___ low.", ["are", "were", "is", "have"], 2, "'The percentage of' takes singular 'is'.");

addQ(341, "Grammar", "MDCAT", "Hard", "Twenty percent of the forest ___ destroyed.", ["were", "are", "was", "have"], 2, "'Percentage of' + uncountable noun takes singular 'was'.");
addQ(342, "Grammar", "ECAT", "Medium", "The rest of the money ___ in the bank.", ["are", "were", "is", "have"], 2, "'The rest of' + uncountable noun takes singular 'is'.");
addQ(343, "Grammar", "NET", "Medium", "The rest of the workers ___ on strike.", ["is", "are", "was", "has"], 1, "'The rest of' + plural noun takes plural 'are'.");
addQ(344, "Grammar", "USAT", "Hard", "What you do ___ none of my business.", ["are", "were", "is", "have"], 2, "Clause as subject ('What you do') takes singular 'is'.");
addQ(345, "Grammar", "FAST ET", "Easy", "To err ___ human.", ["are", "were", "is", "have"], 2, "Infinitive phrase subject ('To err') takes singular 'is'.");

addQ(346, "Grammar", "LAT", "Easy", "Reading books ___ a good habit.", ["are", "were", "is", "have"], 2, "Gerund subject ('Reading books') takes singular 'is'.");
addQ(347, "Grammar", "NTC", "Hard", "Not only the students but also the teacher ___ late.", ["were", "are", "was", "have"], 2, "Verb agrees with closest subject 'teacher' -> singular 'was'.");
addQ(348, "Grammar", "IBA ET", "Hard", "Not only the teacher but also the students ___ late.", ["was", "were", "is", "has"], 1, "Verb agrees with closest subject 'students' -> plural 'were'.");
addQ(349, "Grammar", "LCAT", "Hard", "The mother as well as her children ___ going.", ["are", "were", "is", "have"], 2, "'As well as' phrase does not alter subject 'mother' -> 'is'.");
addQ(350, "Grammar", "SAT", "Medium", "Nobody ___ the trouble I've seen.", ["know", "knows", "are knowing", "have known"], 1, "Indefinite pronoun 'Nobody' takes singular 'knows'.");

addQ(351, "Grammar", "MDCAT", "Medium", "I ___ eating a snack when my cousin called me.", ["am", "was", "will be", "have been"], 1, "Past continuous interrupted by past simple 'called'.");
addQ(352, "Grammar", "ECAT", "Medium", "The store ___ its doors on January 1st.", ["opens", "opened", "will open", "is opening"], 1, "Past action on a specific date.");
addQ(353, "Grammar", "NET", "Medium", "Yesterday, Sarah bought a ticket and ___ to Paris.", ["flies", "flew", "will fly", "flying"], 1, "Past simple tense sequence ('bought and flew').");
addQ(354, "Grammar", "USAT", "Easy", "Michael works at a hospital. He ___ helping patients.", ["liked", "likes", "will like", "had liked"], 1, "Present simple habit/routine.");
addQ(355, "Grammar", "FAST ET", "Hard", "By the time she arrived, the show ___ already started.", ["started", "has started", "had already started", "is starting"], 2, "Past perfect for an action completed before another past event.");

addQ(356, "Grammar", "LAT", "Medium", "We daily ___ breakfast early in the morning.", ["take", "takes", "took", "are taking"], 0, "Present habitual action with 'daily' -> 'take'.");
addQ(357, "Grammar", "NTC", "Medium", "A true Muslim always ___ the truth.", ["speak", "speaks", "spoke", "is speaking"], 1, "Universal truth/habit -> 'speaks'.");
addQ(358, "Grammar", "IBA ET", "Hard", "The child ___ continuously.", ["cry", "cries", "is crying", "cried"], 2, "Ongoing present action -> 'is crying'.");
addQ(359, "Grammar", "LCAT", "Medium", "At present, she ___ her homework.", ["do", "does", "is doing", "did"], 2, "'At present' signals present continuous -> 'is doing'.");
addQ(360, "Grammar", "SAT", "Medium", "The train ___ just now.", ["arrive", "arrives", "has arrived", "arrived"], 2, "Present perfect with 'just now' / 'has arrived'.");

addQ(361, "Grammar", "MDCAT", "Medium", "We ___ ourselves of the opportunity already.", ["avail", "avails", "have availed", "availed"], 2, "Present perfect with 'already' -> 'have availed'.");
addQ(362, "Grammar", "ECAT", "Medium", "They ___ their course yet.", ["do not finish", "have not finished", "finishes", "finished"], 1, "Present perfect negative with 'yet' -> 'have not finished'.");
addQ(363, "Grammar", "NET", "Medium", "It ___ since four o'clock.", ["rains", "is raining", "has been raining", "rained"], 2, "Present perfect continuous with 'since' -> 'has been raining'.");
addQ(364, "Grammar", "USAT", "Medium", "The players ___ for several hours.", ["play", "are playing", "have been playing", "played"], 2, "Present perfect continuous with 'for hours' -> 'have been playing'.");
addQ(365, "Grammar", "FAST ET", "Easy", "I ___ a letter to him yesterday.", ["write", "writes", "wrote", "have written"], 2, "Past simple with 'yesterday' -> 'wrote'.");

addQ(366, "Grammar", "LAT", "Easy", "In my last speech, I ___ well.", ["speak", "speaks", "spoke", "have spoken"], 2, "Past simple with 'last speech' -> 'spoke'.");
addQ(367, "Grammar", "NTC", "Medium", "The maid servant dusted the house ten minutes ___.", ["before", "past", "ago", "since"], 2, "Time phrase + 'ago' for past simple.");
addQ(368, "Grammar", "IBA ET", "Hard", "When he saw me, I ___ my homework.", ["do", "did", "was doing", "have done"], 2, "Past continuous for action in progress when interrupted.");
addQ(369, "Grammar", "LCAT", "Hard", "Before we came, the students ___ a noise.", ["made", "make", "were making", "have made"], 2, "Past continuous action in progress.");
addQ(370, "Grammar", "SAT", "Medium", "While we ___ in the garden, it began to rain.", ["sit", "sat", "were sitting", "are sitting"], 2, "Past continuous with 'while'.");

addQ(371, "Grammar", "MDCAT", "Hard", "Would that I ___ rich.", ["am", "was", "were", "have been"], 2, "Subjunctive wish expression takes 'were'.");
addQ(372, "Grammar", "ECAT", "Hard", "When the doctor came, the patient ___.", ["died", "dies", "had died", "has died"], 2, "Past perfect for event completed before another past event.");
addQ(373, "Grammar", "NET", "Hard", "After he had read the book, he ___ it to me.", ["give", "gives", "gave", "had given"], 2, "Past simple following past perfect 'had read'.");
addQ(374, "Grammar", "USAT", "Hard", "The farmers ___ their crops before the heavy rains came.", ["irrigated", "irrigate", "had irrigated", "have irrigated"], 2, "Past perfect for earlier past action.");
addQ(375, "Grammar", "FAST ET", "Easy", "If it rains, I ___ stay home.", ["would", "will", "could", "might"], 1, "First conditional: present simple -> 'will'.");

// ─── 376-500: SENTENCE CORRECTION ───
addQ(376, "Sentence Correction", "LAT", "Hard", "The dog Mary wants to put in the show is a beagle, ___ is a member of the hound family.", ["it", "which", "that", "this"], 1, "'Which' introduces a non-restrictive relative clause.");
addQ(377, "Sentence Correction", "NTC", "Hard", "'Long and tangled, it was difficult to comb the child's hair.' This contains a ___.", ["run-on", "dangling modifier", "comma splice", "correct structure"], 1, "Dangling modifier: 'long and tangled' incorrectly modifies 'it'.");
addQ(378, "Sentence Correction", "IBA ET", "Hard", "'Exhausted and weak, the soldiers' uniforms were covered in frost.' What needs correction?", ["Modifier", "Subject", "Verb", "Tense"], 0, "Dangling modifier: uniforms were not exhausted, soldiers were.");
addQ(379, "Sentence Correction", "LCAT", "Medium", "'Like its distant oceanic relatives whales, hippopotamuses can alter their density.' Fix:", ["its should be their", "relatives should be relative", "alter should be alters", "their should be its"], 0, "'Its' should agree with plural 'hippopotamuses' -> 'their'.");
addQ(380, "Sentence Correction", "SAT", "Hard", "After acquiring new companies, the corporation moved ___ headquarters.", ["their", "its", "it's", "there"], 1, "'Corporation' is singular, so it takes possessive 'its'.");

addQ(381, "Sentence Correction", "MDCAT", "Medium", "Coaching can be difficult for people ___ have a hard time planning strategy.", ["that", "which", "who", "whom"], 2, "'Who' refers to people as subject.");
addQ(382, "Sentence Correction", "ECAT", "Hard", "The scientific establishment ___ rejected the theory later acknowledged its mistake.", ["who", "whom", "which", "that"], 3, "'That' or 'which' introduces clause modifying establishment.");
addQ(383, "Sentence Correction", "NET", "Medium", "Each of the actors ___ a large trailer.", ["have", "has", "having", "had"], 1, "'Each' takes singular verb 'has'.");
addQ(384, "Sentence Correction", "USAT", "Medium", "Anyone thinking about becoming ___ must be an excellent reader.", ["writers", "a writer", "writer", "the writers"], 1, "Singular 'Anyone' matches singular noun 'a writer'.");
addQ(385, "Sentence Correction", "FAST ET", "Medium", "Either of these desks would be ___ great surface to work on.", ["a", "an", "the", "(no article)"], 0, "'A' is the indefinite article for consonant sound.");

addQ(386, "Sentence Correction", "LAT", "Hard", "The Venus flytrap's jaws only close when ___ senses contact from prey.", ["they", "it", "its", "their"], 1, "Singular subject 'Venus flytrap' takes pronoun 'it'.");
addQ(387, "Sentence Correction", "NTC", "Medium", "'The lab published its findings, and the medical community responded.' This is a ___.", ["run-on", "fragment", "correct sentence", "comma splice"], 2, "Properly joined compound sentence with comma and coordinating conjunction.");
addQ(388, "Sentence Correction", "IBA ET", "Medium", "'The legislation passed, it went into effect.' This error is a ___.", ["run-on", "correct sentence", "comma splice", "fragment"], 2, "Comma splice: joining two independent clauses with only a comma.");
addQ(389, "Sentence Correction", "LCAT", "Easy", "'Although the researchers disagreed on methodology.' This is a ___.", ["comma splice", "run-on", "correct sentence", "fragment"], 3, "Sentence fragment starting with dependent conjunction 'although'.");
addQ(390, "Sentence Correction", "SAT", "Medium", "Put the ___ projects on top of the lockers.", ["students", "student's", "students'", "students's"], 2, "Plural possessive is 'students''.");

addQ(391, "Sentence Correction", "MDCAT", "Hard", "We trudged through the heavy snow coating the sidewalk. This corrects a ___.", ["dangling modifier", "comma splice", "run-on", "fragment"], 0, "Correct placement avoids dangling modifiers.");
addQ(392, "Sentence Correction", "ECAT", "Medium", "She knows ___ to play cricket.", ["that", "how", "what", "when"], 1, "'Knows how to' is the correct idiom.");
addQ(393, "Sentence Correction", "NET", "Hard", "I look forward to ___ there.", ["go", "going", "went", "gone"], 1, "'Look forward to' takes a gerund ('going').");
addQ(394, "Sentence Correction", "USAT", "Hard", "He got me ___ the work in time.", ["finish", "to finish", "finishing", "finished"], 1, "Causative 'get someone to do something' -> 'to finish'.");
addQ(395, "Sentence Correction", "FAST ET", "Hard", "I made him ___ the room.", ["clean", "to clean", "cleaning", "cleaned"], 0, "Causative 'make someone do something' takes bare infinitive 'clean'.");

addQ(396, "Sentence Correction", "LAT", "Easy", "He is senior ___ me.", ["than", "to", "from", "with"], 1, "Senior takes preposition 'to'.");
addQ(397, "Sentence Correction", "NTC", "Easy", "She does not ___ the answer.", ["knows", "know", "knowing", "knew"], 1, "'Does not' takes base verb 'know'.");
addQ(398, "Sentence Correction", "IBA ET", "Easy", "He ___ to office every day.", ["go", "goes", "going", "gone"], 1, "Third-person singular present -> 'goes'.");
addQ(399, "Sentence Correction", "LCAT", "Hard", "I am feeling giddy at this time. Choose the best alternative:", ["I feel giddy now.", "I am feeling giddy now.", "I feels giddy now.", "I was feeling giddy now."], 0, "Stative verb 'feel' is preferred in simple present 'I feel giddy now'.");
addQ(400, "Sentence Correction", "SAT", "Medium", "The train ___ before we reached the station.", ["left", "leaves", "had left", "has left"], 2, "Past perfect 'had left' for action prior to past point 'reached'.");

addQ(401, "Sentence Correction", "MDCAT", "Hard", "He as well as his friends ___ coming.", ["are", "is", "were", "have"], 1, "'As well as' phrase leaves main subject 'He' singular -> 'is'.");
addQ(402, "Sentence Correction", "ECAT", "Medium", "Bread and butter ___ my favorite breakfast.", ["are", "were", "is", "have been"], 2, "Single breakfast combination takes 'is'.");
addQ(403, "Sentence Correction", "NET", "Medium", "Neither of the two men ___ very strong.", ["were", "are", "was", "have been"], 2, "'Neither' takes singular 'was'.");
addQ(404, "Sentence Correction", "USAT", "Medium", "Everyone of the boys ___ to ride.", ["love", "loves", "loving", "loved"], 1, "'Everyone' is singular -> 'loves'.");
addQ(405, "Sentence Correction", "FAST ET", "Easy", "The news ___ too good to be true.", ["are", "were", "is", "have been"], 2, "'News' is singular -> 'is'.");

addQ(406, "Sentence Correction", "LAT", "Easy", "Politics ___ a dirty game.", ["are", "were", "is", "have been"], 2, "'Politics' as a subject/field takes singular 'is'.");
addQ(407, "Sentence Correction", "NTC", "Hard", "The wages of sin ___ death.", ["are", "is", "were", "have been"], 1, "Biblical proverb taking singular 'is'.");
addQ(408, "Sentence Correction", "IBA ET", "Hard", "Time and tide ___ for none.", ["wait", "waits", "waiting", "waited"], 0, "Plural compound subject takes 'wait'.");
addQ(409, "Sentence Correction", "LCAT", "Hard", "Early to bed and early to rise ___ a man healthy.", ["make", "makes", "making", "made"], 1, "Single maxim takes singular verb 'makes'.");
addQ(410, "Sentence Correction", "SAT", "Hard", "The horse and carriage ___ at the door.", ["are", "were", "is", "have"], 2, "Single unit 'horse and carriage' takes singular 'is'.");

addQ(411, "Sentence Correction", "MDCAT", "Medium", "A number of boys ___ playing.", ["is", "are", "was", "has"], 1, "'A number of' takes plural verb 'are'.");
addQ(412, "Sentence Correction", "ECAT", "Medium", "The number of boys ___ increasing.", ["are", "were", "is", "have"], 2, "'The number of' takes singular verb 'is'.");
addQ(413, "Sentence Correction", "NET", "Hard", "Either he or I ___ mistaken.", ["is", "are", "am", "be"], 2, "Verb agrees with closest subject 'I' -> 'am'.");
addQ(414, "Sentence Correction", "USAT", "Hard", "Neither you nor he ___ to blame.", ["are", "is", "am", "were"], 1, "Verb agrees with closest subject 'he' -> 'is'.");
addQ(415, "Sentence Correction", "FAST ET", "Hard", "He, and not I, ___ to blame.", ["am", "is", "are", "were"], 1, "Main subject is 'He' -> 'is'.");

addQ(416, "Sentence Correction", "LAT", "Medium", "The committee ___ issued its report.", ["have", "has", "are", "were"], 1, "Singular 'its' requires singular verb 'has'.");
addQ(417, "Sentence Correction", "NTC", "Medium", "The committee ___ divided on this issue.", ["has", "have", "is", "was"], 1, "Members divided -> plural verb 'have'.");
addQ(418, "Sentence Correction", "IBA ET", "Medium", "Hundred dollars ___ a large sum.", ["are", "were", "is", "have"], 2, "Sum of money takes singular 'is'.");
addQ(419, "Sentence Correction", "LCAT", "Hard", "Three parts of the business ___ left for me to do.", ["is", "are", "was", "has"], 0, "Fraction of singular noun 'business' takes singular 'is'.");
addQ(420, "Sentence Correction", "SAT", "Medium", "One of my friends ___ gone to France.", ["have", "has", "are", "were"], 1, "'One of' takes singular verb 'has'.");

addQ(421, "Sentence Correction", "MDCAT", "Hard", "None but the ___ deserve the fair.", ["deserve", "deserves", "deserving", "deserved"], 0, "Idiomatic proverb: 'None but the brave deserve the fair' -> 'deserve'.");
addQ(422, "Sentence Correction", "ECAT", "Hard", "Many a flower ___ born to blush unseen.", ["are", "were", "is", "have"], 2, "'Many a' takes singular 'is'.");
addQ(423, "Sentence Correction", "NET", "Hard", "More than one person ___ involved in the theft.", ["were", "are", "was", "have"], 2, "'More than one' takes singular 'was'.");
addQ(424, "Sentence Correction", "USAT", "Hard", "Let you and ___ go there.", ["I", "me", "my", "mine"], 1, "'Let' takes objective case pronoun 'me'.");
addQ(425, "Sentence Correction", "FAST ET", "Hard", "He is taller than ___.", ["I", "me", "my", "mine"], 0, "Subjective pronoun 'I' after comparison 'than I (am)'.");

addQ(426, "Sentence Correction", "LAT", "Easy", "I know the man ___ came yesterday.", ["which", "who", "whom", "whose"], 1, "Subject relative pronoun for people is 'who'.");
addQ(427, "Sentence Correction", "NTC", "Medium", "This is the boy ___ I saw.", ["who", "which", "whom", "whose"], 2, "Object relative pronoun for people is 'whom'.");
addQ(428, "Sentence Correction", "IBA ET", "Easy", "The book ___ you gave me is lost.", ["who", "whom", "which", "whose"], 2, "Relative pronoun for objects is 'which'.");
addQ(429, "Sentence Correction", "LCAT", "Hard", "It is I who ___ to blame.", ["is", "are", "am", "was"], 2, "'Who' refers to 'I' -> verb is 'am'.");
addQ(430, "Sentence Correction", "SAT", "Hard", "It is he who ___ to blame.", ["am", "are", "is", "were"], 2, "'Who' refers to 'he' -> verb is 'is'.");

addQ(431, "Sentence Correction", "MDCAT", "Hard", "Such a man as ___ should be honored.", ["he", "him", "his", "himself"], 0, "Subjective pronoun 'he' after 'as'.");
addQ(432, "Sentence Correction", "ECAT", "Hard", "She is one of the best mothers that ___ ever lived.", ["has", "have", "is", "are"], 1, "'That' refers to 'mothers' (plural) -> 'have'.");
addQ(433, "Sentence Correction", "NET", "Hard", "This is the only one of his poems that ___ worth reading.", ["is", "are", "was", "were"], 0, "'The only one' makes the verb singular 'is'.");
addQ(434, "Sentence Correction", "USAT", "Medium", "Between you and ___, he is a liar.", ["I", "me", "my", "mine"], 1, "Prepositions take objective case 'me'.");
addQ(435, "Sentence Correction", "FAST ET", "Medium", "I cannot agree ___ your proposal.", ["with", "to", "on", "at"], 1, "Agree to a proposal.");

addQ(436, "Sentence Correction", "LAT", "Medium", "He prevented me ___ going there.", ["to", "from", "against", "for"], 1, "Prevent from + gerund.");
addQ(437, "Sentence Correction", "NTC", "Medium", "He prohibited me ___ entering.", ["to", "from", "in", "on"], 1, "Prohibit from + gerund.");
addQ(438, "Sentence Correction", "IBA ET", "Medium", "He is addicted ___ gambling.", ["of", "to", "with", "in"], 1, "Addicted to + gerund.");
addQ(439, "Sentence Correction", "LCAT", "Medium", "He is good ___ mathematics.", ["in", "at", "with", "on"], 1, "Good at something.");
addQ(440, "Sentence Correction", "SAT", "Easy", "The picture is hanging ___ the wall.", ["in", "on", "at", "to"], 1, "Hanging on the wall.");

addQ(441, "Sentence Correction", "MDCAT", "Medium", "He died ___ cancer.", ["from", "of", "with", "by"], 1, "Die of disease.");
addQ(442, "Sentence Correction", "ECAT", "Hard", "He died ___ overeating.", ["of", "from", "with", "by"], 1, "Die from a cause like overeating/injury.");
addQ(443, "Sentence Correction", "NET", "Hard", "He was killed ___ a robber ___ a knife.", ["by, with", "with, by", "by, by", "with, with"], 0, "'By' a robber (agent), 'with' a knife (instrument).");
addQ(444, "Sentence Correction", "USAT", "Easy", "The dog ran ___ the road.", ["cross", "across", "crossing", "crossed"], 1, "Run across the road.");
addQ(445, "Sentence Correction", "FAST ET", "Medium", "We went ___ foot.", ["by", "on", "in", "with"], 1, "Go on foot.");

addQ(446, "Sentence Correction", "LAT", "Medium", "He travels ___ train.", ["in", "on", "by", "with"], 2, "Travel by train.");
addQ(447, "Sentence Correction", "NTC", "Hard", "I bought this pen ___ ten rupees.", ["in", "for", "of", "with"], 1, "Buy something for an amount.");
addQ(448, "Sentence Correction", "IBA ET", "Medium", "He has been ill ___ Monday.", ["for", "from", "since", "by"], 2, "Ill since a specific starting point.");
addQ(449, "Sentence Correction", "LCAT", "Medium", "I have been living here ___ two years.", ["since", "from", "for", "in"], 2, "Living here for a period of time.");
addQ(450, "Sentence Correction", "SAT", "Easy", "The book is ___ the table.", ["in", "at", "on", "into"], 2, "Book is on the table.");

addQ(451, "Sentence Correction", "MDCAT", "Medium", "They divided the sweets ___ the two boys.", ["among", "between", "with", "to"], 1, "Between two boys.");
addQ(452, "Sentence Correction", "ECAT", "Medium", "They divided the sweets ___ the three boys.", ["between", "among", "with", "to"], 1, "Among three boys.");
addQ(453, "Sentence Correction", "NET", "Easy", "She is taller ___ her sister.", ["then", "than", "to", "from"], 1, "Taller than.");
addQ(454, "Sentence Correction", "USAT", "Hard", "This is preferable ___ that.", ["than", "to", "from", "over"], 1, "Preferable takes 'to'.");
addQ(455, "Sentence Correction", "FAST ET", "Hard", "He acts as ___ he were a king.", ["as", "like", "as if", "same as"], 2, "'As if' with subjunctive 'were'.");

addQ(456, "Sentence Correction", "LAT", "Hard", "I would rather you ___ tomorrow.", ["come", "came", "will come", "are coming"], 1, "'Would rather you' takes past subjunctive 'came'.");
addQ(457, "Sentence Correction", "NTC", "Hard", "It is time we ___ home.", ["go", "went", "are going", "will go"], 1, "'It is time we' takes past simple 'went'.");
addQ(458, "Sentence Correction", "IBA ET", "Medium", "Unless you ___ hard, you will fail.", ["do not work", "work", "worked", "working"], 1, "'Unless' is already negative, so verb is positive 'work'.");
addQ(459, "Sentence Correction", "LCAT", "Hard", "Although he is poor, ___ he is honest.", ["but", "yet", "still", "and"], 1, "'Although' pairs with 'yet' (or no conjunction).");
addQ(460, "Sentence Correction", "SAT", "Hard", "Scarcely had I reached the station ___ the train steamed off.", ["then", "than", "when", "that"], 2, "'Scarcely... when' is the correct conjunction pair.");

addQ(461, "Sentence Correction", "MDCAT", "Hard", "No sooner had I reached the station ___ the train steamed off.", ["then", "when", "than", "that"], 2, "'No sooner... than' is the correct conjunction pair.");
addQ(462, "Sentence Correction", "ECAT", "Hard", "Hardly had he left ___ it began to rain.", ["when", "than", "then", "and"], 0, "'Hardly... when' is the correct conjunction pair.");
addQ(463, "Sentence Correction", "NET", "Hard", "Walk carefully lest you ___ fall.", ["would", "should", "may", "might"], 1, "'Lest' is followed by 'should'.");
addQ(464, "Sentence Correction", "USAT", "Hard", "I requested him ___ he would help me.", ["if", "that", "whether", "to"], 1, "Indirect request with 'that'.");
addQ(465, "Sentence Correction", "FAST ET", "Hard", "He asked me ___ I was going.", ["that", "where", "where", "that"], 1, "Indirect question word 'where'.");

addQ(466, "Sentence Correction", "LAT", "Medium", "Tell me ___ you live.", ["that", "where", "where that", "that"], 1, "Indirect question word 'where'.");
addQ(467, "Sentence Correction", "NTC", "Medium", "He runs as fast as he ___.", ["can", "could", "might", "should"], 0, "Present tense 'runs' pairs with present modal 'can'.");
addQ(468, "Sentence Correction", "IBA ET", "Medium", "He ran as fast as he ___.", ["can", "could", "might", "should"], 1, "Past tense 'ran' pairs with past modal 'could'.");
addQ(469, "Sentence Correction", "LCAT", "Hard", "I don't know ___ he will come or not.", ["if", "whether", "that", "when"], 1, "'Whether... or not' is standard.");
addQ(470, "Sentence Correction", "SAT", "Medium", "He is so weak ___ he cannot walk.", ["as", "that", "so", "to"], 1, "'So... that' clause of result.");

addQ(471, "Sentence Correction", "MDCAT", "Medium", "He is too weak ___ walk.", ["that", "as", "to", "so"], 2, "'Too... to' infinitive structure.");
addQ(472, "Sentence Correction", "ECAT", "Hard", "This is the same book ___ I wanted.", ["which", "that", "as", "who"], 1, "'The same... that' (or 'as').");
addQ(473, "Sentence Correction", "NET", "Hard", "She is such a girl ___ everyone likes.", ["who", "that", "as", "whom"], 2, "'Such... as' structure.");
addQ(474, "Sentence Correction", "USAT", "Easy", "Neither Ali ___ his brother is present.", ["or", "nor", "and", "but"], 1, "'Neither... nor' correlation.");
addQ(475, "Sentence Correction", "FAST ET", "Easy", "Either you ___ he is to blame.", ["nor", "or", "and", "but"], 1, "'Either... or' correlation.");

addQ(476, "Sentence Correction", "LAT", "Medium", "Not only he ___ his brother went there.", ["and", "but also", "also", "or"], 1, "'Not only... but also' correlation.");
addQ(477, "Sentence Correction", "NTC", "Medium", "Though he is rich, ___ he is miser.", ["but", "yet", "still", "and"], 1, "'Though... yet' correlation.");
addQ(478, "Sentence Correction", "IBA ET", "Medium", "Make hay ___ the sun shines.", ["when", "while", "during", "as"], 1, "Proverb: 'Make hay while the sun shines'.");
addQ(479, "Sentence Correction", "LCAT", "Medium", "Wait here ___ I return.", ["until", "unless", "up to", "as long"], 0, "'Until' indicates time up to point.");
addQ(480, "Sentence Correction", "SAT", "Medium", "Do ___ I tell you.", ["like", "as", "same", "how"], 1, "'As' is used as conjunction before a clause.");

addQ(481, "Sentence Correction", "MDCAT", "Medium", "He behaves ___ a fool.", ["as", "like", "same", "similar"], 1, "'Like' is used as preposition before noun phrase.");
addQ(482, "Sentence Correction", "ECAT", "Hard", "Let him ___ the book.", ["to read", "read", "reading", "reads"], 1, "'Let' takes bare infinitive 'read'.");
addQ(483, "Sentence Correction", "NET", "Hard", "We saw him ___.", ["to go", "go", "goes", "went"], 1, "Verbs of perception take bare infinitive 'go'.");
addQ(484, "Sentence Correction", "USAT", "Hard", "She made me ___.", ["to weep", "weep", "weeping", "wept"], 1, "Causative 'make' takes bare infinitive 'weep'.");
addQ(485, "Sentence Correction", "FAST ET", "Hard", "I heard him ___.", ["to sing", "sing", "sings", "sang"], 1, "Perception verb takes bare infinitive 'sing'.");

addQ(486, "Sentence Correction", "LAT", "Hard", "Bid him ___ there.", ["to go", "go", "going", "gone"], 1, "'Bid' takes bare infinitive 'go'.");
addQ(487, "Sentence Correction", "NTC", "Hard", "He dares not ___ there.", ["to go", "go", "goes", "going"], 1, "'Dare not' as modal takes bare infinitive 'go'.");
addQ(488, "Sentence Correction", "IBA ET", "Hard", "You need not ___ worry.", ["to", "(no word)", "about", "for"], 1, "'Need not' takes bare infinitive without 'to'.");
addQ(489, "Sentence Correction", "LCAT", "Easy", "He used ___ play hockey.", ["for", "to", "in", "at"], 1, "'Used to' + infinitive for past habit.");
addQ(490, "Sentence Correction", "SAT", "Hard", "I am used ___ sleeping late.", ["for", "in", "to", "at"], 2, "'Be used to' + gerund ('sleeping').");

addQ(491, "Sentence Correction", "MDCAT", "Hard", "He is looking forward to ___ you.", ["see", "seeing", "saw", "seen"], 1, "'Look forward to' + gerund ('seeing').");
addQ(492, "Sentence Correction", "ECAT", "Hard", "She is averse to ___ hard.", ["work", "working", "worked", "works"], 1, "'Averse to' + gerund ('working').");
addQ(493, "Sentence Correction", "NET", "Hard", "With a view to ___ the poor, he started an NGO.", ["help", "helping", "helped", "helps"], 1, "'With a view to' + gerund ('helping').");
addQ(494, "Sentence Correction", "USAT", "Hard", "I cannot help ___ at his jokes.", ["laugh", "laughing", "laughed", "laughs"], 1, "'Cannot help' + gerund ('laughing').");
addQ(495, "Sentence Correction", "FAST ET", "Medium", "It is no use ___ over spilt milk.", ["to cry", "crying", "cry", "cried"], 1, "'It is no use' + gerund ('crying').");

addQ(496, "Sentence Correction", "LAT", "Medium", "Do you mind ___ the door?", ["to open", "opening", "open", "opened"], 1, "'Mind' + gerund ('opening').");
addQ(497, "Sentence Correction", "NTC", "Medium", "Stop ___ a noise.", ["to make", "making", "make", "made"], 1, "'Stop' + gerund ('making').");
addQ(498, "Sentence Correction", "IBA ET", "Medium", "Would you mind ___ me?", ["help", "to help", "helping", "helped"], 2, "'Would you mind' + gerund ('helping').");
addQ(499, "Sentence Correction", "LCAT", "Hard", "She insisted on ___ there.", ["to go", "going", "go", "gone"], 1, "'Insist on' + gerund ('going').");
addQ(500, "Sentence Correction", "SAT", "Medium", "He prevented me from ___ it.", ["do", "to do", "doing", "done"], 2, "'Prevent from' + gerund ('doing').");

console.log(`Generated ${mcqs.length} English MCQs!`);

const targetPath = path.join(__dirname, 'public/data/mcqs/english.json');
fs.writeFileSync(targetPath, JSON.stringify(mcqs, null, 2));
console.log(`Successfully written 500 MCQs to ${targetPath}`);
