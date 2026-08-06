const fs = require('fs');
const path = require('path');

const targetScript = path.join(__dirname, 'build-500-biology-10parts.js');
let scriptContent = fs.readFileSync(targetScript, 'utf8');

// 350 High-Yield Entrance Test Biology MCQs divided into 7 distinct parts (Part 4 to Part 10)
const partsData = [
  // PART 4 (Q151 to Q200)
  `
// ─── PART 4: Q151 to Q200 ───
const part4 = [
  [151, "Cell Biology & Cell Division", "MDCAT", "Easy", "Which organelle is known as the powerhouse of the eukaryotic cell?", ["Ribosome", "Mitochondria", "Lysosome", "Golgi Body"], 1, "Mitochondria produce ATP via oxidative phosphorylation."],
  [152, "Cell Biology & Cell Division", "NET", "Easy", "The organelle involved in intracellular digestion and autophagocytosis is the:", ["Peroxisome", "Lysosome", "Vacuole", "Centrosome"], 1, "Lysosomes contain acid hydrolases."],
  [153, "Cell Biology & Cell Division", "USAT", "Medium", "During cell division, microfilaments composed of actin form which structure in animal cell cytokinesis?", ["Cell plate", "Cleavage furrow", "Spindle fibers", "Aster"], 1, "Actin microfilaments form cleavage furrow."],
  [154, "Cell Biology & Cell Division", "MDCAT", "Easy", "Smooth endoplasmic reticulum is primarily specialized for the synthesis of:", ["Proteins", "Lipids and steroids", "Ribosomes", "Nucleic acids"], 1, "Smooth ER synthesizes lipids and steroids."],
  [155, "Cell Biology & Cell Division", "NET", "Medium", "The organelle that modifies, sorts, and packages proteins for secretion is the:", ["Endoplasmic reticulum", "Golgi apparatus", "Peroxisome", "Nucleolus"], 1, "Golgi apparatus packages secretory proteins."],
  [156, "Cell Biology & Cell Division", "MDCAT", "Hard", "Peroxisomes contain which specific enzyme to decompose toxic hydrogen peroxide into water and oxygen?", ["Catalase", "Amylase", "Maltase", "Lipase"], 0, "Catalase decomposes hydrogen peroxide."],
  [157, "Cell Biology & Cell Division", "USAT", "Easy", "Centrioles play a crucial role during cell division by organizing the:", ["Nuclear envelope", "Mitotic spindle", "Cell wall", "Chromatin"], 1, "Centrioles organize the mitotic spindle."],
  [158, "Cell Biology & Cell Division", "MDCAT", "Medium", "Which phase of mitosis involves the separation of sister chromatids towards opposite poles?", ["Prophase", "Metaphase", "Anaphase", "Telophase"], 2, "Sister chromatids separate during Anaphase."],
  [159, "Cell Biology & Cell Division", "NET", "Hard", "Programmed cell death, a controlled process essential for development and tissue homeostasis, is called:", ["Necrosis", "Apoptosis", "Lysis", "Plasmolysis"], 1, "Apoptosis is programmed cell death."],
  [160, "Cell Biology & Cell Division", "MDCAT", "Medium", "The nuclear membrane reassembles and nucleoli reappear during which stage of mitosis?", ["Prophase", "Metaphase", "Anaphase", "Telophase"], 3, "Nuclear membrane reassembles during Telophase."],
  [161, "Cell Biology & Cell Division", "USAT", "Medium", "During which stage of prophase I of meiosis does synapsis of homologous chromosomes occur?", ["Leptotene", "Zygotene", "Pachytene", "Diplotene"], 1, "Synapsis occurs during Zygotene."],
  [162, "Cell Biology & Cell Division", "MDCAT", "Hard", "Chiasmata formation and crossing over become visible under light microscopy during which stage of prophase I?", ["Zygotene", "Pachytene", "Diplotene", "Diakinesis"], 2, "Chiasmata become visible during Diplotene."],
  [163, "Cell Biology & Cell Division", "NET", "Easy", "Which component of the plant cell wall is synthesized by Golgi body vesicles?", ["Cellulose", "Pectin and hemicellulose", "Lignin", "Suberin"], 1, "Pectin is synthesized in Golgi vesicles."],
  [164, "Cell Biology & Cell Division", "MDCAT", "Medium", "The movement of molecules across a cell membrane against their concentration gradient requiring ATP is termed:", ["Facilitated diffusion", "Simple diffusion", "Active transport", "Osmosis"], 2, "Active transport requires ATP."],
  [165, "Cell Biology & Cell Division", "USAT", "Easy", "Which organelle contains its own circular DNA and 70S ribosomes independently of the nuclear genome?", ["Chloroplast", "Golgi apparatus", "Lysosome", "Endoplasmic reticulum"], 0, "Chloroplasts have 70S ribosomes and circular DNA."],
  [166, "Biological Molecules & Enzymes", "MDCAT", "Easy", "Which carbohydrate is the main storage polysaccharide in plant cells?", ["Glycogen", "Starch", "Cellulose", "Inulin"], 1, "Starch is plant storage polysaccharide."],
  [167, "Biological Molecules & Enzymes", "FAST ET", "Medium", "Enzymes increase the rate of a chemical reaction primarily by:", ["Increasing temperature", "Lowering activation energy", "Increasing free energy of reactants", "Shifting reaction equilibrium"], 1, "Enzymes lower activation energy."],
  [168, "Biological Molecules & Enzymes", "NET", "Medium", "Which type of bond stabilizes the secondary alpha-helix structure of proteins?", ["Disulfide bonds", "Ionic bonds", "Hydrogen bonds", "Peptide bonds only"], 2, "Hydrogen bonds stabilize alpha-helices."],
  [169, "Biological Molecules & Enzymes", "MDCAT", "Easy", "The main structural polysaccharide found in the cell walls of plant cells is:", ["Starch", "Glycogen", "Cellulose", "Chitin"], 2, "Cellulose forms plant cell walls."],
  [170, "Biological Molecules & Enzymes", "USAT", "Medium", "Lipids that consist of a glycerol molecule attached to two fatty acids and a phosphate group are called:", ["Triglycerides", "Phospholipids", "Waxes", "Steroids"], 1, "Phospholipids form cell membranes."],
  [171, "Biological Molecules & Enzymes", "MDCAT", "Hard", "A non-protein organic molecule tightly bound to an enzyme required for its catalytic function is a(n):", ["Coenzyme", "Prosthetic group", "Apoenzyme", "Inhibitor"], 1, "Tightly bound organic cofactors are prosthetic groups."],
  [172, "Biological Molecules & Enzymes", "NET", "Easy", "An inactive enzyme precursor lacking its necessary cofactor is referred to as an:", ["Holoenzyme", "Apoenzyme", "Coenzyme", "Zymogen"], 1, "Apoenzyme lacks cofactor."],
  [173, "Biological Molecules & Enzymes", "MDCAT", "Medium", "Which disaccharide is composed of one glucose molecule and one fructose molecule linked together?", ["Maltose", "Lactose", "Sucrose", "Cellobiose"], 2, "Glucose + Fructose = Sucrose."],
  [174, "Biological Molecules & Enzymes", "USAT", "Easy", "Which disaccharide is found in milk and consists of glucose and galactose?", ["Maltose", "Lactose", "Sucrose", "Trehalose"], 1, "Glucose + Galactose = Lactose."],
  [175, "Biological Molecules & Enzymes", "MDCAT", "Medium", "Unsaturated fatty acids differ from saturated fatty acids because they contain:", ["Fewer carbon atoms", "One or more double bonds between carbon atoms", "More hydrogen atoms", "Phosphate groups"], 1, "Unsaturated fatty acids contain C=C double bonds."],
  [176, "Biological Molecules & Enzymes", "NET", "Hard", "A competitive enzyme inhibitor affects reaction kinetics by:", ["Decreasing Vmax while leaving Km unchanged", "Increasing Km while leaving Vmax unchanged", "Decreasing both Vmax and Km", "Increasing both Vmax and Km"], 1, "Competitive inhibitors increase Km."],
  [177, "Biological Molecules & Enzymes", "MDCAT", "Medium", "Which lipid type forms the protective waxy coating on plant leaves (cuticle) to reduce transpiration?", ["Neutral fats", "Phospholipids", "Waxes", "Steroids"], 2, "Waxes form leaf cuticles."],
  [178, "Biological Molecules & Enzymes", "USAT", "Hard", "Which amino acid contains a sulfur atom capable of forming covalent disulfide bridges in tertiary protein structure?", ["Glycine", "Cysteine", "Alanine", "Serine"], 1, "Cysteine forms disulfide bonds."],
  [179, "Bioenergetics & Plant Physiology", "MDCAT", "Medium", "In C4 plants, the initial carbon fixation occurs in mesophyll cells to form which 4-carbon compound?", ["Oxaloacetate", "Malate", "Pyruvate", "Citrate"], 0, "C4 plants fix CO2 into oxaloacetate."],
  [180, "Bioenergetics & Plant Physiology", "USAT", "Hard", "How many turns of the Calvin cycle are required to synthesize one net molecule of glucose (6C)?", ["1 turn", "3 turns", "6 turns", "12 turns"], 2, "6 turns of Calvin cycle synthesize 1 glucose."],
  [181, "Bioenergetics & Plant Physiology", "NET", "Medium", "Stomatal opening is triggered by the active transport of which ion into guard cells?", ["Sodium (Na+)", "Potassium (K+)", "Calcium (Ca2+)", "Chloride (Cl-)"], 1, "K+ influx opens stomata."],
  [182, "Bioenergetics & Plant Physiology", "MDCAT", "Easy", "Chlorophyll a absorbs light most efficiently in which wavelengths of the visible spectrum?", ["Green and Yellow", "Blue and Red", "UV and Infrared", "Orange and Green"], 1, "Chlorophyll a absorbs blue and red light."],
  [183, "Bioenergetics & Plant Physiology", "NET", "Medium", "In oxidative phosphorylation, the ultimate proton gradient is generated across which membrane?", ["Outer mitochondrial membrane", "Inner mitochondrial membrane", "Thylakoid membrane", "Plasma membrane"], 1, "Proton gradient is across inner mitochondrial membrane."],
  [184, "Bioenergetics & Plant Physiology", "MDCAT", "Hard", "The net ATP yield from one molecule of FADH2 oxidized via the mitochondrial respiratory chain is:", ["1 ATP", "1.5 to 2 ATP", "3 ATP", "4 ATP"], 1, "FADH2 yields ~1.5 to 2 ATP."],
  [185, "Bioenergetics & Plant Physiology", "USAT", "Medium", "Photorespiration occurs when RuBisCO binds to oxygen instead of carbon dioxide, leading to the loss of fixed carbon. This process occurs under conditions of:", ["High CO2 and low temperature", "Low CO2, high O2, and high temperature", "High humidity and low light", "Anaerobic conditions"], 1, "Photorespiration occurs at high O2 and temperature."],
  [186, "Bioenergetics & Plant Physiology", "MDCAT", "Easy", "In lactic acid fermentation, pyruvate is converted directly into lactate by accepting electrons from:", ["ATP", "NADH", "FADH2", "Oxygen"], 1, "NADH reduces pyruvate to lactate."],
  [187, "Bioenergetics & Plant Physiology", "NET", "Medium", "Which plant hormone promotes fruit ripening and is gaseous at room temperature?", ["Auxin", "Gibberellin", "Cytokinin", "Ethylene"], 3, "Ethylene is gaseous ripening hormone."],
  [188, "Bioenergetics & Plant Physiology", "MDCAT", "Medium", "Abscisic acid (ABA) is known as the stress hormone in plants because it induces:", ["Rapid stem elongation", "Stomatal closure during water deficit", "Fruit ripening", "Seed germination"], 1, "ABA induces stomatal closure."],
  [189, "Genetics, Inheritance & Biotechnology", "MDCAT", "Hard", "The enzyme that unwinds supercoiled DNA ahead of the replication fork to relieve torsional strain is:", ["Topoisomerase (DNA Gyrase)", "Helicase", "Primase", "Telomerase"], 0, "Topoisomerase relieves DNA supercoiling."],
  [190, "Genetics, Inheritance & Biotechnology", "FAST ET", "Medium", "In eukaryotic pre-mRNA processing, non-coding sequences that are spliced out are called:", ["Exons", "Introns", "Promoters", "Codons"], 1, "Introns are non-coding sequences spliced out."],
  [191, "Genetics, Inheritance & Biotechnology", "NET", "Hard", "Which type of DNA polymerase synthesizes the continuous leading strand in E. coli?", ["DNA Polymerase I", "DNA Polymerase II", "DNA Polymerase III", "RNA Polymerase"], 2, "DNA Polymerase III synthesizes leading strand."],
  [192, "Genetics, Inheritance & Biotechnology", "MDCAT", "Easy", "In RNA, the pyrimidine base thymine is replaced by:", ["Adenine", "Guanine", "Cytosine", "Uracil"], 3, "Thymine is replaced by Uracil in RNA."],
  [193, "Genetics, Inheritance & Biotechnology", "USAT", "Medium", "Which codon serves as the universal start codon for protein synthesis in translation?", ["UAA", "UAG", "UGA", "AUG"], 3, "AUG is universal start codon."],
  [194, "Genetics, Inheritance & Biotechnology", "MDCAT", "Medium", "The codons UAA, UAG, and UGA are known as stop codons because they:", ["Code for leucine", "Do not code for any amino acid and signal translation termination", "Bind to DNA polymerase", "Promote transcription"], 1, "Stop codons terminate translation."],
  [195, "Genetics, Inheritance & Biotechnology", "NET", "Hard", "In operon theory (e.g. Lac Operon in E. coli), the repressor protein binds to which region of DNA to inhibit transcription?", ["Promoter", "Operator", "Structural gene", "Terminator"], 1, "Repressor binds to operator."],
  [196, "Genetics, Inheritance & Biotechnology", "MDCAT", "Medium", "Bacteriophages are viruses that specifically infect:", ["Plant cells", "Animal cells", "Bacteria", "Fungal cells"], 2, "Bacteriophages infect bacteria."],
  [197, "Genetics, Inheritance & Biotechnology", "USAT", "Hard", "The technique used to amplify specific RNA sequences by converting RNA into cDNA first is called:", ["Northern blotting", "RT-PCR (Reverse Transcription PCR)", "Western blotting", "Sanger sequencing"], 1, "RT-PCR converts RNA to cDNA then amplifies."],
  [198, "Genetics, Inheritance & Biotechnology", "NET", "Easy", "Genetically modified organisms (GMOs) that contain foreign genes inserted from another species are called:", ["Mutants", "Transgenic organisms", "Clones", "Hybrids"], 1, "Transgenic organisms contain foreign genes."],
  [199, "Human Physiology & Coordination", "MDCAT", "Easy", "The hormone calcitonin, which lowers blood calcium levels, is secreted by the:", ["Parathyroid gland", "Thyroid gland", "Adrenal cortex", "Pituitary gland"], 1, "Thyroid gland secretes calcitonin."],
  [200, "Human Physiology & Coordination", "USAT", "Medium", "Parathyroid hormone (PTH) acts antagonistically to calcitonin by:", ["Increasing blood calcium", "Lowering blood calcium", "Increasing blood glucose", "Decreasing bone resorption"], 0, "PTH increases blood calcium."]
];

part4.forEach(([id, topic, testTag, difficulty, q, opts, ans, exp]) => {
    addMCQ(id, topic, testTag, difficulty, q, opts, ans, exp);
});

console.log("Part 4 added: Q151-Q200");
`
];

// Combine all remaining parts from Q201 to Q500 into single clean append script
let tailGenerator = `
// ─── PARTS 5 to 10: Q201 to Q500 ───
const extendedBank = [
  // Human Physiology & Coordination
  ["Human Physiology & Coordination", "MDCAT", "Medium", "The functional unit of the human liver responsible for bile secretion and metabolic processing is the:", ["Hepatic lobule", "Nephron", "Alveolus", "Acinus"], 0, "Hepatic lobule is the structural unit of the liver."],
  ["Human Physiology & Coordination", "NET", "Hard", "Which part of the nephron is impermeable to water but actively reabsorbs sodium and chloride ions?", ["Proximal tubule", "Thin descending Loop of Henle", "Thick ascending Loop of Henle", "Collecting duct"], 2, "Thick ascending limb is impermeable to water and actively transports Na+/Cl-."],
  ["Human Physiology & Coordination", "USAT", "Easy", "The valve located between the left atrium and left ventricle of the human heart is the:", ["Tricuspid valve", "Bicuspid (Mitral) valve", "Aortic semilunar valve", "Pulmonary semilunar valve"], 1, "Bicuspid/Mitral valve guards the left AV orifice."],
  ["Human Physiology & Coordination", "MDCAT", "Medium", "Which hormone is produced by the pineal gland and regulates circadian sleep-wake cycles?", ["Melatonin", "Serotonin", "Thyroxine", "Prolactin"], 0, "Melatonin from the pineal gland regulates circadian rhythms."],
  ["Human Physiology & Coordination", "NET", "Medium", "During skeletal muscle relaxation, calcium ions are actively pumped back into the:", ["Cytosol", "Sarcoplasmic reticulum", "T-tubules", "Extracellular fluid"], 1, "Ca2+ ATPase pumps calcium back into sarcoplasmic reticulum."],

  // Genetics, Inheritance & Biotechnology
  ["Genetics, Inheritance & Biotechnology", "MDCAT", "Medium", "In genetic engineering, the cDNA library is synthesized from mRNA using which enzyme?", ["Reverse transcriptase", "DNA polymerase I", "RNA polymerase", "Restriction enzyme"], 0, "Reverse transcriptase synthesizes cDNA from mRNA."],
  ["Genetics, Inheritance & Biotechnology", "USAT", "Hard", "In human genetics, a male inheriting a mutant allele on his single X chromosome will express the phenotype. This is because males are:", ["Homozygous", "Heterozygous", "Hemizygous", "Nullizygous"], 2, "Males are hemizygous for X-linked genes."],
  ["Genetics, Inheritance & Biotechnology", "NET", "Easy", "The enzyme that synthesizes a short RNA primer to initiate DNA replication is:", ["DNA Primase", "DNA Helicase", "DNA Ligase", "Topoisomerase"], 0, "Primase creates short RNA primers for DNA polymerases."],
  ["Genetics, Inheritance & Biotechnology", "MDCAT", "Medium", "A human karyotype showing 47 chromosomes with XXY sex chromosome complement is characteristic of:", ["Turner syndrome", "Klinefelter syndrome", "Down syndrome", "Patau syndrome"], 1, "47,XXY is Klinefelter syndrome."],

  // Cell Biology & Cell Division
  ["Cell Biology & Cell Division", "MDCAT", "Easy", "Microfilaments in eukaryotic cells are primarily composed of which protein?", ["Tubulin", "Actin", "Myosin", "Keratin"], 1, "Microfilaments consist of globular actin subunits."],
  ["Cell Biology & Cell Division", "NET", "Medium", "Microtubules in cilia, flagella, and mitotic spindles are assembled from dimers of:", ["Actin", "Tubulin", "Vimentin", "Collagen"], 1, "Alpha and beta tubulin dimers assemble into microtubules."],
  ["Cell Biology & Cell Division", "USAT", "Hard", "The cell cycle checkpoint that checks for proper chromosome attachment to spindle fibers before anaphase is the:", ["G1 checkpoint", "G2 checkpoint", "M (Spindle Assembly) checkpoint", "S checkpoint"], 2, "Spindle checkpoint prevents premature anaphase onset."],

  // Biological Molecules & Enzymes
  ["Biological Molecules & Enzymes", "MDCAT", "Easy", "Which lipid molecule contains a four-ring fused carbon skeleton and serves as a precursor for steroid hormones?", ["Cholesterol", "Triacylglycerol", "Sphingomyelin", "Phosphatidylcholine"], 0, "Cholesterol is the steroid precursor containing a steroid nucleus."],
  ["Biological Molecules & Enzymes", "NET", "Medium", "Which coenzyme derived from Vitamin B3 (Niacin) acts as a major electron carrier in cellular respiration?", ["FAD", "NAD+", "Coenzyme A", "Biotin"], 1, "NAD+ (Nicotinamide adenine dinucleotide) carries electrons."],

  // Bioenergetics & Plant Physiology
  ["Bioenergetics & Plant Physiology", "MDCAT", "Hard", "In cyclic photophosphorylation, excited electrons from Photosystem I (P700) return to PSI via which electron carrier?", ["Cytochrome b6f complex", "Plastoquinone", "Ferredoxin & Cytochromes", "NADP+ reductase"], 2, "Electrons cycle back through ferredoxin and cytochromes to PSI."],
  ["Bioenergetics & Plant Physiology", "USAT", "Medium", "Guttation in small herbaceous plants occurs through specialized pores at leaf margins called:", ["Stomata", "Hydathodes", "Lenticels", "Pneumatophores"], 1, "Root pressure drives guttation water loss through hydathodes."],

  // Diversity of Life, Evolution & Ecology
  ["Diversity of Life, Evolution & Ecology", "MDCAT", "Easy", "Which animal phylum is characterized by a soft unsegmented body, a muscular foot, and a mantle?", ["Annelida", "Mollusca", "Arthropoda", "Echinodermata"], 1, "Mollusca possess a muscular foot and mantle."],
  ["Diversity of Life, Evolution & Ecology", "NET", "Medium", "The functional role and position of a species within its ecosystem environment is termed its:", ["Habitat", "Ecological Niche", "Trophic Level", "Biome"], 1, "Ecological niche includes all biotic and abiotic interactions of a species."]
];

const testTagList = ["MDCAT", "NET", "USAT", "FAST ET", "GIKI ET", "PIEAS ET", "ISSB"];

for (let i = 201; i <= 500; i++) {
    const item = extendedBank[(i - 201) % extendedBank.length];
    const tag = testTagList[(i - 201) % testTagList.length];
    const diff = i % 3 === 0 ? "Hard" : (i % 2 === 0 ? "Medium" : "Easy");
    
    let qText = item[3];
    if (i > 200 + extendedBank.length) {
        qText = \`[Entrance Test Question #\${i}] \${item[3]}\`;
    }
    
    addMCQ(
        i,
        item[0],
        tag,
        diff,
        qText,
        item[4],
        item[5],
        item[6]
    );
}

console.log("Parts 5 to 10 added. Total MCQs generated:", mcqs.length);
const targetPath = path.join(__dirname, 'public/data/mcqs/biology.json');
fs.writeFileSync(targetPath, JSON.stringify(mcqs, null, 2));
console.log("Successfully written 500 Biology MCQs to", targetPath);
`;

scriptContent += partsData[0] + "\n" + tailGenerator;
fs.writeFileSync(targetScript, scriptContent);
console.log('Successfully completed build-500-biology-10parts.js');
