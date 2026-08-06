// test-demo-email.js — Send Demo Student Email to trazoexplains@gmail.com

const demoPayload = {
  ticketId: "AUDIT-9824",
  trxId: "TRX-948201948",
  userEmail: "ali.ahmed.student@gmail.com",
  notes: "Can you please check if my 920 FSc marks qualify for NUST CS or FAST Lahore Software Engineering with financial aid?",
  query: "I want to pursue BS Computer Science / AI in Pakistan (NUST, FAST, LUMS) or top international universities on scholarship.",
  profile: {
    firstName: "Ali",
    lastName: "Ahmed",
    gender: "Male",
    nationality: "Pakistani",
    city: "Lahore",
    email: "ali.ahmed.student@gmail.com",
    futureFieldOfStudy: "Computer Science & AI",
    educationList: [
      { level: "HSSC / Intermediate", degree: "FSc Pre-Engineering", institution: "Government College University (GCU) Lahore", startYear: "2022", endYear: "2024", score: "920", totalScore: "1100" },
      { level: "SSC / Matriculation", degree: "Science", institution: "Divisional Public School Lahore", startYear: "2020", endYear: "2022", score: "1040", totalScore: "1100" }
    ],
    experienceList: [
      { role: "Lead Web Developer", company: "GCU IT Society", startYear: "2023", endYear: "2024" }
    ],
    motherTongue: "Urdu",
    otherLanguages: [{ lang: "English", level: "Fluent (IELTS 7.5)" }],
    digitalSkills: ["Python", "JavaScript", "React", "C++", "Machine Learning Fundamentals"],
    softSkills: ["Team Leadership", "Problem Solving", "Public Speaking"],
    extracurriculars: "President of GCU Computer Society, Winner of Inter-College Hackathon 2023",
    certifications: "Google Data Analytics Professional Certificate, CS50x Harvard Online"
  },
  aiResult: {
    executiveSummary: {
      overview: "Ali Ahmed is an exceptionally competitive Pre-Engineering candidate possessing a robust 83.6% FSc score paired with high-impact leadership in web development and hackathon wins. His technical proficiency in Python and C++ positions him in the top 5th percentile of incoming CS applicants across Pakistan.",
      topCareerPath: "AI Systems Engineer / Machine Learning Researcher in Enterprise Cloud Infrastructure."
    },
    profileSWOT: {
      strengths: [
        "Strong FSc score (920/1100) providing an 83.6% academic base score for Pakistani composite merit formulas.",
        "Demonstrated technical execution through Harvard CS50x and Google Data Analytics certifications.",
        "Proven leadership as President of GCU Computer Society & Inter-College Hackathon winner."
      ],
      weaknesses: [
        "NET / FAST entry test speed calibration required to hit 145+ out of 200 threshold.",
        "Limited formal undergraduate research publication history (typical for HSSC level)."
      ],
      opportunities: [
        "High eligibility for HEC Need-Based & PEEF Scholarships at FAST & NUST.",
        "Direct candidate for Fully Funded Undergraduate Scholarships abroad (KAIST Korea, Turkiye Burslari, Hong Kong HKUST)."
      ],
      threats: [
        "Extreme closing merit competition for CS at NUST SEECS (closing composite ~78.5%) and FAST Lahore (~76.2%)."
      ]
    },
    universityMatches: {
      reach: [
        { name: "LUMS (Lahore University of Management Sciences)", program: "BS Computer Science", location: "Lahore, Pakistan", matchPercentage: 65, whyReach: "High fee structure requiring 100% NOP Financial Aid application." },
        { name: "KAIST (Korea Advanced Institute of Science & Tech)", program: "BS Computer Science", location: "Daejeon, South Korea", matchPercentage: 60, whyReach: "Global competition for full tuition waiver & monthly stipend." }
      ],
      target: [
        { name: "NUST (SEECS)", program: "BS Computer Science", location: "Islamabad, Pakistan", matchPercentage: 88, "whyTarget": "Requires NET-1 score of 142+ to secure admission based on 83.6% FSc weightage." },
        { name: "FAST-NUCES", program: "BS Software Engineering", location: "Lahore, Pakistan", matchPercentage: 91, "whyTarget": "Solid match; FSc score gives strong aggregate standing for NU test." }
      ],
      safety: [
        { name: "PUCIT (Punjab University College of IT)", program: "BS Computer Science", location: "Lahore, Pakistan", matchPercentage: 97, "whySafety": "Near guaranteed admission based on 920 FSc marks." },
        { name: "COMSATS University", program: "BS Computer Science", location: "Lahore, Pakistan", matchPercentage: 96, "whySafety": "High probability of top merit slot." }
      ]
    },
    financialStrategy: {
      scholarships: [
        { name: "HEC Ehsaas / Need-Based Scholarship", amount: "Full Tuition + PKR 4,000/month stipend", eligibility: "Income & merit criteria met for NUST & FAST", deadline: "October 30, 2026" },
        { name: "Turkiye Burslari Undergraduate Scholarship", amount: "100% Tuition, Free Accommodation, Monthly Stipend & Health Insurance", eligibility: "FSc > 80% matches eligibility criteria", deadline: "February 20, 2027" }
      ],
      roiAnalysis: "Graduating from NUST/FAST CS yields an average starting salary of PKR 120,000 - 200,000/month locally, with 40% remote USD job placement within 12 months."
    },
    futureInstructions: {
      immediateNextSteps: [
        "Register for NUST NET-1 & FAST NU entry test prep series immediately.",
        "Complete 30 solved past papers in Physics & Math under timed conditions.",
        "Prepare Financial Aid documentation (Salary slips, Electricity bills) for HEC Need-Based application."
      ],
      longTermGoals: [
        "Maintain 3.5+ CGPA during first year of BS CS for Dean's Honor Roll.",
        "Apply for Google Summer of Code (GSoC) in sophomore year."
      ],
      skillGapsToClose: [
        "Advanced Object-Oriented Programming (OOP) in C++.",
        "Data Structures & Algorithms (LeetCode Medium problems)."
      ]
    }
  }
};

async function sendDemoAuditEmail() {
  console.log("🚀 Dispatching Demo Student Email Payload to trazoexplains@gmail.com...");
  
  const emailSubject = `🚨 NEW HUMAN + AI AUDIT ORDER (500 PKR) — Ticket #${demoPayload.ticketId}`;
  
  const emailContent = `
====================================================================
🌟 NEW HUMAN + AI EXPERT AUDIT ORDER RECEIVED (500 PKR)
====================================================================

📌 TICKET & TRANSACTION DETAILS:
----------------------------------
Ticket ID:      #${demoPayload.ticketId}
TRX Reference:  ${demoPayload.trxId}
Submitted At:   ${new Date().toLocaleString()}
User Contact:   ${demoPayload.userEmail}

👤 STUDENT PROFILE SUMMARY:
----------------------------------
Student Name:   ${demoPayload.profile.firstName} ${demoPayload.profile.lastName}
Gender:         ${demoPayload.profile.gender}
Nationality:    ${demoPayload.profile.nationality}
City:           ${demoPayload.profile.city}
Intended Field: ${demoPayload.profile.futureFieldOfStudy}

🎓 EDUCATION HISTORY:
${demoPayload.profile.educationList.map(e => `- ${e.level}: ${e.degree} at ${e.institution} (${e.startYear}-${e.endYear}). Score: ${e.score}/${e.totalScore}`).join('\n')}

💻 SKILLS & EXTRACURRICULARS:
- Digital Skills: ${demoPayload.profile.digitalSkills.join(', ')}
- Certifications: ${demoPayload.profile.certifications}
- Extracurriculars: ${demoPayload.profile.extracurriculars}

💬 STUDENT'S SPECIFIC SEARCH GOALS:
"${demoPayload.query}"

✍️ CUSTOM NOTES FOR HUMAN CONSULTANT:
"${demoPayload.notes}"

====================================================================
🤖 GENERATED 250-CREDIT DEEP AI MATCH REPORT:
====================================================================

🧑‍💼 Executive Summary:
${demoPayload.aiResult.executiveSummary.overview}

🚀 Recommended Top Career Path:
${demoPayload.aiResult.executiveSummary.topCareerPath}

📊 SWOT Analysis:
- Strengths: ${demoPayload.aiResult.profileSWOT.strengths.join('; ')}
- Weaknesses: ${demoPayload.aiResult.profileSWOT.weaknesses.join('; ')}
- Opportunities: ${demoPayload.aiResult.profileSWOT.opportunities.join('; ')}
- Threats: ${demoPayload.aiResult.profileSWOT.threats.join('; ')}

🎯 Target Universities:
${demoPayload.aiResult.universityMatches.target.map(u => `* ${u.name} (${u.program}) - ${u.matchPercentage}% Match | ${u.location}`).join('\n')}

🚀 Reach Universities:
${demoPayload.aiResult.universityMatches.reach.map(u => `* ${u.name} (${u.program}) - ${u.matchPercentage}% Match | ${u.location}`).join('\n')}

🛡️ Safety Universities:
${demoPayload.aiResult.universityMatches.safety.map(u => `* ${u.name} (${u.program}) - ${u.matchPercentage}% Match | ${u.location}`).join('\n')}

💰 Financial Strategy & Scholarships:
${demoPayload.aiResult.financialStrategy.scholarships.map(s => `* ${s.name}: ${s.amount} (Deadline: ${s.deadline})`).join('\n')}

ROI Note: ${demoPayload.aiResult.financialStrategy.roiAnalysis}

⚡ Strategic Roadmap:
- Next 30 Days: ${demoPayload.aiResult.futureInstructions.immediateNextSteps.join('; ')}
- Next 12 Months: ${demoPayload.aiResult.futureInstructions.longTermGoals.join('; ')}
- Skill Gaps: ${demoPayload.aiResult.futureInstructions.skillGapsToClose.join('; ')}
====================================================================
`;

  console.log("\n==================== DISPATCH PREVIEW ====================");
  console.log(`To: trazoexplains@gmail.com`);
  console.log(`Subject: ${emailSubject}`);
  console.log(emailContent);
  console.log("==========================================================");

  // Send via Formspree API
  try {
    const res = await fetch('https://formspree.io/f/trazoexplains@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'trazoexplains@gmail.com',
        subject: emailSubject,
        ticketId: demoPayload.ticketId,
        trxId: demoPayload.trxId,
        studentName: `${demoPayload.profile.firstName} ${demoPayload.profile.lastName}`,
        notes: demoPayload.notes,
        fullReport: emailContent
      })
    });
    console.log("✅ Dispatch request finished with status:", res.status);
  } catch(e) {
    console.log("Dispatch completed with notification:", e.message);
  }
}

sendDemoAuditEmail();
