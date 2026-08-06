window.ScholarshipsData = [];
fetch("/data/scholarships.json?t=" + new Date().getTime()).then(r => r.json()).then(data => { window.ScholarshipsData = data; if(document.getElementById("scholarshipsContainer")) window.ScholarshipsModule.render("scholarshipsContainer"); }).catch(console.error);
