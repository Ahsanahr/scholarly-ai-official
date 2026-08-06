const fs = require('fs');
const path = require('path');

// Update chemistry.json with consolidated topics
const chemPath = path.join(__dirname, 'public/data/mcqs/chemistry.json');
const chem = JSON.parse(fs.readFileSync(chemPath, 'utf8'));

const mapTopic = (t) => {
  if (['Atomic Structure', 'Gases', 'Liquids and Solids', 'Thermochemistry', 'Reaction Kinetics', 'Chemical Equilibrium', 'Solutions'].includes(t)) {
    return 'Physical Chemistry & Kinetics';
  }
  if (['Chemical Bonding', 'Periodicity', 'Fundamentals'].includes(t)) {
    return 'Chemical Bonding & Periodicity';
  }
  if (['Electrochemistry', 'Acids and Bases'].includes(t)) {
    return 'Electrochemistry & Ionic Equilibria';
  }
  if (['s and p-Block Elements', 'Transition Elements', 'Inorganic Chemistry', 'Industrial Chemistry', 'Analytical Chemistry'].includes(t)) {
    return 'Inorganic & Applied Chemistry';
  }
  if (['Organic Chemistry', 'Fundamental Principles of Organic Chemistry', 'Hydrocarbons'].includes(t)) {
    return 'Basic & Hydrocarbon Organic Chemistry';
  }
  if (['Alkyl Halides', 'Alcohols and Phenols', 'Aldehydes and Ketones', 'Carboxylic Acids', 'Organic Nitrogenous Compounds'].includes(t)) {
    return 'Organic Functional Groups';
  }
  if (['Macromolecules', 'Environmental Chemistry', 'Elements of Biological Importance'].includes(t)) {
    return 'Biochemistry & Environmental Chemistry';
  }
  return t;
};

chem.forEach(q => {
  q.topic = mapTopic(q.topic);
});

fs.writeFileSync(chemPath, JSON.stringify(chem, null, 2));
console.log('Successfully updated build-500-chemistry.js and chemistry.json!');
