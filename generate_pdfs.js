const fs = require('fs');
const path = require('path');

const pdfBase64 = "JVBERi0xLjEKJcKlwrQKMSAwIG9iaiA8PC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PiBlbmRvYmogMiAwIG9iaiA8PC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+IGVuZG9iaiAzIDAgb2JqIDw8L1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXT4+IGVuZG9iagp4cmVmCjAgNAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA2NyAwMDAwMCBuIAowMDAwMDAwMTIyIDAwMDAwIG4gCnRyYWlsZXIgPDwvU2l6ZSA0IC9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjE3OQolJUVPRgo=";

const files = [
    'net_mock_paper.pdf',
    'mdcat_mock_paper.pdf',
    'nums_mock_paper.pdf',
    'ecat_mock_paper.pdf',
    'fast_mock_paper.pdf',
    'lcat_mock_paper.pdf',
    'usat_mock_paper.pdf',
    'nat_mock_paper.pdf',
    'aku_mock_paper.pdf',
    'iba_mock_paper.pdf',
    'pucit_mock_paper.pdf',
    'giki_mock_paper.pdf',
    'pieas_mock_paper.pdf',
    'etea_mock_paper.pdf',
    'ned_mock_paper.pdf',
    'muet_mock_paper.pdf',
    'comsats_mock_paper.pdf',
    'dow_mock_paper.pdf',
    'sindhmcat_mock_paper.pdf',
    'sat_mock_paper.pdf'
];

const dir = path.join(__dirname, 'public', 'papers');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const pdfBuffer = Buffer.from(pdfBase64, 'base64');

files.forEach(file => {
    fs.writeFileSync(path.join(dir, file), pdfBuffer);
    console.log(`Created ${file}`);
});
