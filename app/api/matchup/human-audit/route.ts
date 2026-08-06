import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticketId, trxId, notes, profile, query, aiResult, userEmail } = body;

    const emailSubject = `🚨 NEW HUMAN + AI AUDIT ORDER (500 PKR) — Ticket #${ticketId || 'UNKNOWN'}`;

    const emailContent = `
====================================================================
🌟 NEW HUMAN + AI EXPERT AUDIT ORDER RECEIVED (500 PKR)
====================================================================

📌 TICKET & TRANSACTION DETAILS:
----------------------------------
Ticket ID:      #${ticketId || 'N/A'}
TRX Reference:  ${trxId || 'N/A'}
Submitted At:   ${new Date().toLocaleString()}
User Contact:   ${userEmail || profile?.email || 'N/A'}

👤 STUDENT PROFILE SUMMARY:
----------------------------------
Student Name:   ${profile?.firstName || ''} ${profile?.lastName || ''}
Nationality:    ${profile?.nationality || 'N/A'}
City:           ${profile?.city || 'N/A'}
Intended Field: ${profile?.futureFieldOfStudy || 'N/A'}

🎓 EDUCATION HISTORY:
${(profile?.educationList || []).map((e: any) => `- ${e.level}: ${e.degree} at ${e.institution} (${e.startYear}-${e.endYear}). Score: ${e.score}/${e.totalScore}`).join('\n')}

💬 STUDENT'S SPECIFIC SEARCH GOALS:
"${query || 'N/A'}"

✍️ CUSTOM NOTES FOR HUMAN CONSULTANT:
"${notes || 'None provided'}"

====================================================================
🤖 GENERATED 250-CREDIT DEEP AI MATCH REPORT:
====================================================================

🧑‍💼 Executive Summary:
${aiResult?.executiveSummary?.overview || 'N/A'}

🚀 Recommended Top Career Path:
${aiResult?.executiveSummary?.topCareerPath || 'N/A'}

📊 SWOT Analysis:
- Strengths: ${(aiResult?.profileSWOT?.strengths || []).join('; ')}
- Weaknesses: ${(aiResult?.profileSWOT?.weaknesses || []).join('; ')}
- Opportunities: ${(aiResult?.profileSWOT?.opportunities || []).join('; ')}
- Threats: ${(aiResult?.profileSWOT?.threats || []).join('; ')}

🎯 Target Universities:
${(aiResult?.universityMatches?.target || []).map((u: any) => `* ${u.name} (${u.program}) - ${u.matchPercentage}% Match | ${u.location}`).join('\n')}

🚀 Reach Universities:
${(aiResult?.universityMatches?.reach || []).map((u: any) => `* ${u.name} (${u.program}) - ${u.matchPercentage}% Match | ${u.location}`).join('\n')}

🛡️ Safety Universities:
${(aiResult?.universityMatches?.safety || []).map((u: any) => `* ${u.name} (${u.program}) - ${u.matchPercentage}% Match | ${u.location}`).join('\n')}

💰 Financial Strategy:
${(aiResult?.financialStrategy?.scholarships || []).map((s: any) => `* ${s.name}: ${s.amount} (Deadline: ${s.deadline})`).join('\n')}

ROI Note: ${aiResult?.financialStrategy?.roiAnalysis || 'N/A'}

⚡ Strategic Roadmap:
- Next 30 Days: ${(aiResult?.futureInstructions?.immediateNextSteps || []).join('; ')}
- Next 12 Months: ${(aiResult?.futureInstructions?.longTermGoals || []).join('; ')}
- Skill Gaps: ${(aiResult?.futureInstructions?.skillGapsToClose || []).join('; ')}
====================================================================
`;

    // Attempt sending email via external webhook / formspree / console log
    console.log(`\n📧 [HUMAN AUDIT DISPATCH to trazoexplains@gmail.com]\nSubject: ${emailSubject}\n${emailContent}`);

    // Call Formspree / Webhook / Resend fallback endpoint
    try {
      await fetch('https://formspree.io/f/trazoexplains@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'trazoexplains@gmail.com',
          subject: emailSubject,
          ticketId,
          trxId,
          studentName: `${profile?.firstName || ''} ${profile?.lastName || ''}`,
          notes,
          fullReport: emailContent
        })
      });
    } catch(e) {
      console.warn('Formspree dispatch fallback note:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Human Audit order registered and dispatched to trazoexplains@gmail.com',
      ticketId,
      sentTo: 'trazoexplains@gmail.com'
    });

  } catch(error: any) {
    console.error('Human Audit API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
