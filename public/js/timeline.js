/**
 * SCHOLARLY AI — Premium Timeline Module
 * Unified Timeline & Blueprint Architecture
 */

window.TimelineModule = (function() {
    // Initial Seed Data
    const defaultEvents = [
        { id: '1', title: 'NUST NET Series-1 Registration', date: '2026-08-15', category: 'Entry Test', priority: 'High', status: 'Upcoming', notes: 'Apply via NUST online portal' },
        { id: '2', title: 'FAST NUCES Fall 2026 Admissions', date: '2026-08-28', category: 'University Admission', priority: 'High', status: 'Upcoming', notes: 'Submit intermediate part 1 roll number' },
        { id: '3', title: 'HEC EHSAAS Scholarship Cutoff', date: '2026-09-10', category: 'Scholarship', priority: 'Medium', status: 'Scheduled', notes: 'Ensure income certificate is verified' }
    ];

    const defaultPrepTasks = [
        { id: 't1', subject: 'Mathematics', title: 'Revise Integration Formulas', description: 'Review the standard integral forms.', done: true },
        { id: 't2', subject: 'Physics', title: 'Electrostatics MCQs', description: 'Focus on Gauss Law applications.', done: false },
        { id: 't3', subject: 'English', title: 'NET Vocabulary', description: 'Memorize the top 100 high-frequency words.', done: false }
    ];

    let activeTab = 'timeline';
    let events = [];
    let prepTasks = [];
    let savedObjectsFilter = 'All';
    let currentCalendarDate = new Date(2026, 6, 23); // Default July 2026
    let editingEventId = null;

    function loadState() {
        try {
            const storedEvents = localStorage.getItem('scholarpath_timeline_events');
            events = storedEvents ? JSON.parse(storedEvents) : defaultEvents;
            
            const storedTasks = localStorage.getItem('scholarpath_prep_tasks');
            prepTasks = storedTasks ? JSON.parse(storedTasks) : defaultPrepTasks;

            // Migration script: Move any isolated Blueprints into the unified Timeline events system
            let savedSearchResults = localStorage.getItem('scholarpath_saved_results');
            if (savedSearchResults) {
                let oldResults = JSON.parse(savedSearchResults);
                if (oldResults.length > 0) {
                    oldResults.forEach(s => {
                        const exists = events.some(e => e.title.toLowerCase() === s.title.toLowerCase());
                        if (!exists) {
                            const futureDate = new Date(2026, 7, 25);
                            events.unshift({
                                id: 'migrated_' + s.id,
                                title: s.title,
                                category: s.type === 'University' ? 'University Admission' : s.type === 'Test' ? 'Entry Test' : 'Scholarship',
                                priority: 'Medium',
                                date: futureDate.toISOString().split('T')[0],
                                status: 'Upcoming',
                                notes: 'Migrated from isolated Blueprint. Edit to set real date.',
                                rawData: s.data // Keep the rich AI data
                            });
                        }
                    });
                    // Clear the old legacy array to finalize migration
                    localStorage.setItem('scholarpath_saved_results', '[]');
                    localStorage.setItem('scholarpath_timeline_events', JSON.stringify(events));
                }
            } else if (!storedEvents) {
                // If it's a completely fresh user, seed them with 3 rich blueprints as Timeline events
                const defaultRichEvents = [
                    { id: 'r1', title: 'NUST (National University of Sciences)', category: 'University Admission', priority: 'High', date: '2026-08-15', status: 'Upcoming', notes: 'A premium institution for STEM.', rawData: { ranking: '#1 in Pakistan (Engineering)', requirements: '60% aggregate minimum in FSc', fee_structure: 'Approx 150k PKR / semester' } },
                    { id: 'r2', title: 'Fulbright Masters Scholarship', category: 'Scholarship', priority: 'High', date: '2027-02-15', status: 'Upcoming', notes: 'Fully funded scholarship to study in the USA.', rawData: { provider: 'USEFP', amount_coverage: 'Full tuition, airfare, living stipend', eligibility_criteria: '16 years of education minimum.' } },
                    { id: 'r3', title: 'MDCAT Entry Test 2026', category: 'Entry Test', priority: 'Medium', date: '2026-09-20', status: 'Upcoming', notes: 'Mandatory test for Medical colleges.', rawData: { conducting_body: 'PMDC', fee: 'PKR 6000', syllabus_weightage: 'Biology 68, Chemistry 54, Physics 54, English 18' } }
                ];
                events = defaultRichEvents;
                localStorage.setItem('scholarpath_timeline_events', JSON.stringify(events));
            }
        } catch (e) {
            console.error('Error loading timeline state', e);
            events = defaultEvents;
            prepTasks = defaultPrepTasks;
        }
    }

    function saveState() {
        try {
            localStorage.setItem('scholarpath_timeline_events', JSON.stringify(events));
            localStorage.setItem('scholarpath_prep_tasks', JSON.stringify(prepTasks));
        } catch (e) {
            console.error('Error saving timeline state', e);
        }
    }

    function onItemSaved(item) {
        loadState();
        const exists = events.some(e => e.title.toLowerCase() === item.title.toLowerCase());
        if (!exists) {
            let dateStr = item.deadline;
            if (!dateStr) {
                const futureDate = new Date(2026, 7, 25);
                dateStr = futureDate.toISOString().split('T')[0];
            }
            events.unshift({
                id: Date.now().toString(),
                title: item.title,
                date: dateStr,
                category: item.type === 'University' ? 'University Admission' : item.type === 'Scholarship' ? 'Scholarship' : 'Entry Test',
                priority: 'High',
                status: 'Upcoming',
                notes: item.deadline ? `Automatically tracked ${item.type} deadline.` : `Saved from ${item.type} search. Edit to set accurate date.`,
                rawData: item.data || null
            });
            saveState();
            render();
            if (window.showToast) window.showToast(`Saved to unified Timeline: ${item.title}`, 'success');
            else alert(`Added to Timeline: ${item.title}`);
        }
    }

    function getDaysRemaining(dateStr) {
        const target = new Date(dateStr);
        const today = new Date(2026, 6, 23);
        const diffTime = target - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    function switchTab(tabId) {
        activeTab = tabId;
        render();
    }

    function generateGoogleCalendarUrl(evt) {
        const title = encodeURIComponent("TRAZO: " + evt.title);
        const details = encodeURIComponent(evt.notes || "Academic deadline");
        const dateFormatted = evt.date.replace(/-/g, '');
        const dates = `${dateFormatted}T090000Z/${dateFormatted}T170000Z`;
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
    }

    function exportIcsFile(evt) {
        const dateFormatted = evt.date.replace(/-/g, '');
        const icsData = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Trazo Scholarly//Academic Platform//EN', 'BEGIN:VEVENT',
            `SUMMARY:TRAZO SCHOLARLY: ${evt.title}`, `DESCRIPTION:${evt.notes || 'Academic deadline'}`,
            `DTSTART:${dateFormatted}T090000Z`, `DTEND:${dateFormatted}T170000Z`, 'END:VEVENT', 'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'trazo_scholarly_deadline.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (window.showToast) window.showToast('Exported .ics Calendar file!', 'success');
        else alert('Exported .ics file!');
    }

    function exportAllIcsFile() {
        const eventsIcs = events.map(evt => {
            const dateFormatted = evt.date.replace(/-/g, '');
            return ['BEGIN:VEVENT', `SUMMARY:TRAZO SCHOLARLY: ${evt.title}`, `DESCRIPTION:${evt.notes || 'Academic deadline'}`, `DTSTART:${dateFormatted}T090000Z`, `DTEND:${dateFormatted}T170000Z`, 'END:VEVENT'].join('\n');
        }).join('\n');
        const icsData = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Trazo Scholarly//Academic Platform//EN', eventsIcs, 'END:VCALENDAR'].join('\n');

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'trazo_scholarly_all_deadlines.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (window.showToast) window.showToast('Exported all deadlines as .ics!', 'success');
        else alert('Exported all deadlines as .ics!');
    }

    function renderTimelineTab() {
        const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

        const renderEventCard = (evt) => {
            const daysLeft = getDaysRemaining(evt.date);
            const isUrgent = daysLeft >= 0 && daysLeft <= 7;
            const glowColor = evt.priority === 'High' ? 'rgba(255, 71, 87, 0.4)' : 'rgba(124, 77, 255, 0.4)';
            const borderColor = evt.priority === 'High' ? '#ff4757' : 'var(--accent-primary)';

            return `
                <div class="timeline-event-wrapper" style="position:relative; margin-bottom:24px; padding-left:24px;">
                    <!-- Timeline Node (Dot) -->
                    <div style="position:absolute; left:-6px; top:20px; width:14px; height:14px; border-radius:50%; background:${borderColor}; box-shadow:0 0 12px ${glowColor}; z-index:2; border:2px solid var(--bg-surface);"></div>
                    
                    <div class="timeline-event-card" style="background:var(--bg-surface); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:20px; display:flex; align-items:center; gap:24px; box-shadow:0 8px 32px rgba(0,0,0,0.1); border-left:6px solid transparent; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor:default;" onmouseover="this.style.transform='scale(1.01) translateX(4px)'; this.style.boxShadow='0 12px 40px ${glowColor}'; this.style.borderLeftColor='${borderColor}';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 8px 32px rgba(0,0,0,0.1)'; this.style.borderLeftColor='transparent';">
                        
                        <!-- 1. TIME / DATE (Extreme Left as requested) -->
                        <div class="timeline-event-date" style="flex-shrink:0; text-align:center; min-width:110px; border-right:1px solid var(--border-subtle); padding-right:20px;">
                            <div style="font-weight:900; color:var(--text-primary); font-size:1.4rem; font-family:var(--font-display); letter-spacing:1px;">${evt.date.substring(5).replace('-', '/')}</div>
                            <div style="font-size:0.8rem; font-weight:700; color:var(--text-secondary); margin-top:2px;">${evt.date.substring(0, 4)}</div>
                            <div style="margin-top:10px; font-size:0.75rem; padding:4px 8px; border-radius:8px; background:${daysLeft < 0 ? 'var(--bg-deep)' : isUrgent ? 'rgba(255,71,87,0.15)' : 'rgba(245,166,35,0.15)'}; color:${daysLeft < 0 ? 'var(--text-tertiary)' : isUrgent ? '#ff4757' : '#f5a623'}; font-weight:800; letter-spacing:0.5px;">
                                ${daysLeft < 0 ? 'Passed' : `⏳ ${daysLeft} Days`}
                            </div>
                        </div>

                        <!-- 2. PROGRAM NAME & DETAILS -->
                        <div class="timeline-event-content" style="flex:1; min-width:0;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
                                <span style="background:linear-gradient(135deg, var(--accent-primary), #e84393); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:1px;">${evt.category}</span>
                                ${evt.priority === 'High' ? `<span style="background:rgba(255,71,87,0.1); color:#ff4757; border:1px solid rgba(255,71,87,0.3); font-size:0.7rem; font-weight:700; padding:2px 6px; border-radius:4px;">High Priority</span>` : ''}
                            </div>
                            <h4 style="color:var(--text-primary); font-size:1.25rem; font-family:var(--font-display); font-weight:800; margin:0 0 6px 0;">${evt.title}</h4>
                            ${evt.notes ? `<p style="font-size:0.85rem; color:var(--text-secondary); margin:0; line-height:1.5;">${evt.notes}</p>` : ''}
                        </div>

                        <!-- 3. ACTIONS -->
                        <div class="timeline-event-actions" style="display:flex; flex-direction:column; gap:8px; align-items:flex-end; flex-shrink:0;">
                            <div style="display:flex; gap:8px;">
                                <a href="${generateGoogleCalendarUrl(evt)}" target="_blank" style="background:rgba(255,255,255,0.05); color:var(--text-primary); padding:6px 12px; border-radius:8px; text-decoration:none; font-size:0.8rem; font-weight:600; border:1px solid var(--border-subtle); transition:all 0.2s;" onmouseover="this.style.background='var(--accent-primary)'; this.style.borderColor='var(--accent-primary)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='var(--border-subtle)';">📅 Sync</a>
                                <button onclick="window.TimelineModule.exportIcsFileById('${evt.id}')" style="background:rgba(255,255,255,0.05); color:var(--text-primary); padding:6px 12px; border-radius:8px; font-size:0.8rem; font-weight:600; border:1px solid var(--border-subtle); transition:all 0.2s; cursor:pointer;" onmouseover="this.style.background='var(--accent-primary)'; this.style.borderColor='var(--accent-primary)';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='var(--border-subtle)';">📥 ICS</button>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button style="background:transparent; color:var(--text-secondary); padding:6px 12px; border-radius:8px; font-size:0.8rem; font-weight:600; border:1px solid var(--border-color); cursor:pointer; transition:all 0.2s;" onmouseover="this.style.color='var(--text-primary)'; this.style.borderColor='var(--text-primary)';" onmouseout="this.style.color='var(--text-secondary)'; this.style.borderColor='var(--border-color)';" onclick="window.TimelineModule.openEditModal('${evt.id}')">✏️ Edit</button>
                                <button style="background:rgba(255,71,87,0.1); color:#ff4757; border:1px solid rgba(255,71,87,0.2); padding:6px 12px; font-size:0.8rem; font-weight:600; border-radius:8px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#ff4757'; this.style.color='#fff';" onmouseout="this.style.background='rgba(255,71,87,0.1)'; this.style.color='#ff4757';" onclick="window.TimelineModule.deleteDeadline('${evt.id}')">🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        };

        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                <h3 style="font-family:var(--font-display); font-size:1.4rem; font-weight:800; margin:0; background:linear-gradient(90deg, #fff, var(--text-secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">⏱️ Chronological Flow</h3>
            </div>
            
            <div style="position:relative; padding-left:16px;">
                <!-- Vertical Timeline Line -->
                <div style="position:absolute; left:16px; top:20px; bottom:20px; width:2px; background:linear-gradient(to bottom, var(--accent-primary), rgba(255,255,255,0.05)); z-index:1;"></div>
                
                ${sortedEvents.map(renderEventCard).join('')}
                ${sortedEvents.length === 0 ? '<div style="text-align:center; padding:40px; color:var(--text-secondary); background:rgba(255,255,255,0.02); border-radius:16px; border:1px dashed var(--border-color);">No upcoming deadlines.</div>' : ''}
            </div>
        `;
    }

    function renderSavedObjectsTab() {
        // Now fully unified! We just filter the exact same `events` array.
        const filtered = events.filter(obj => savedObjectsFilter === 'All' || obj.category.toLowerCase().includes(savedObjectsFilter.toLowerCase()));

        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                <h3 style="font-family:var(--font-display); font-size:1.4rem; font-weight:800; margin:0; background:linear-gradient(90deg, #fff, var(--text-secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">📂 Unified Blueprints</h3>
                <select style="background:var(--bg-deep); border:1px solid var(--border-color); color:var(--text-primary); padding:10px 16px; border-radius:12px; font-weight:600; outline:none; cursor:pointer;" onchange="window.TimelineModule.setSavedObjectsFilter(this.value)">
                    ${['All', 'Test', 'University', 'Scholarship', 'Entry Test'].map(cat => `<option style="background:var(--bg-deep);" value="${cat}" ${savedObjectsFilter === cat ? 'selected' : ''}>${cat === 'All' ? 'View All Categories' : cat}</option>`).join('')}
                </select>
            </div>
            
            ${filtered.length === 0 ? `<div style="text-align:center; padding:60px; background:rgba(255,255,255,0.02); border-radius:20px; border:1px dashed rgba(255,255,255,0.1);"><p style="color:var(--text-secondary); font-size:1.1rem;">No saved programs found. Add a program to the timeline or search to track one.</p></div>` : `
                <div style="display:flex; flex-wrap:nowrap; overflow-x:auto; gap:24px; padding-bottom:24px; padding-top:10px; padding-left:10px; scroll-snap-type: x mandatory;">
                    ${filtered.map(item => `
                        <div style="cursor:pointer; position:relative; min-width:320px; max-width:320px; scroll-snap-align: start; flex: 0 0 auto; background:var(--bg-surface); backdrop-filter:blur(10px); border:1px solid var(--border-color); border-radius:20px; padding:24px; display:flex; flex-direction:column; justify-content:space-between; gap:16px; box-shadow:0 8px 32px rgba(0,0,0,0.1); transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 16px 40px rgba(124, 77, 255, 0.2)'; this.style.borderColor='rgba(124, 77, 255, 0.4)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 8px 32px rgba(0,0,0,0.1)'; this.style.borderColor='var(--border-color)';">
                            <div onclick="window.TimelineModule.viewSavedObject('${item.id}')">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                                    <span style="background:rgba(124, 77, 255, 0.15); color:var(--accent-primary); font-size:0.7rem; font-weight:800; padding:4px 10px; border-radius:8px; text-transform:uppercase; letter-spacing:1px;">${item.category}</span>
                                    <span style="font-size:0.7rem; color:var(--text-tertiary); font-weight:600;">${item.rawData ? 'AI Bookmark' : 'Manual Entry'}</span>
                                </div>
                                <h4 style="font-size:1.2rem; color:var(--text-primary); font-family:var(--font-display); font-weight:800; margin:0 0 8px 0; line-height:1.3;">${item.title}</h4>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:16px;">
                                <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); display:flex; align-items:center; gap:8px;">
                                    <span style="background:var(--accent-primary); width:8px; height:8px; border-radius:50%; display:inline-block; box-shadow:0 0 10px var(--accent-primary);"></span> ${item.date}
                                </div>
                                <!-- Unified Delete Button right on the Blueprint Card -->
                                <button style="background:rgba(255,71,87,0.1); color:#ff4757; border:1px solid rgba(255,71,87,0.2); padding:4px 8px; font-size:0.7rem; font-weight:600; border-radius:6px; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#ff4757'; this.style.color='#fff';" onmouseout="this.style.background='rgba(255,71,87,0.1)'; this.style.color='#ff4757';" onclick="event.stopPropagation(); window.TimelineModule.deleteDeadline('${item.id}')">🗑️ Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        `;
    }

    function setSavedObjectsFilter(val) { savedObjectsFilter = val; render(); }

    function renderCalendarTab() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let startYear = 2026;
        let startMonth = 6; // July
        
        let monthNavHTML = '<div style="display:flex; overflow-x:auto; gap:8px; padding-bottom:12px; margin-bottom:20px; scrollbar-width:none; position:sticky; top:0; z-index:10; background:var(--bg-deep); padding-top:10px;">';
        
        let allMonthsHTML = '';

        for (let mOffset = 0; mOffset < 12; mOffset++) { // Show 12 months vertically
            let d = new Date(startYear, startMonth + mOffset, 1);
            let month = d.getMonth();
            let year = d.getFullYear();
            let monthId = `cal-month-${month}-${year}`;
            
            // Add to horizontal nav
            monthNavHTML += `<a href="#${monthId}" style="flex-shrink:0; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:8px 16px; border-radius:20px; color:var(--text-secondary); text-decoration:none; font-weight:600; font-size:0.85rem; transition:all 0.2s;" onmouseover="this.style.background='var(--accent-primary)'; this.style.color='#fff';" onmouseout="this.style.background='rgba(255,255,255,0.05)'; this.style.color='var(--text-secondary)';">${monthNames[month]} ${year}</a>`;
            
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            let dayCells = [];
            for (let i = 0; i < firstDay; i++) dayCells.push('<div style="opacity:0;"></div>');
            
            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const dayEvents = events.filter(e => e.date === dateStr);
                
                const eventsHtml = dayEvents.map(e => {
                    let typeColor = 'var(--accent-primary)';
                    if (e.category.includes('Test')) typeColor = '#f5a623';
                    if (e.category.includes('Scholarship')) typeColor = '#2ed573';
                    return `<div style="display:flex; align-items:center; gap:6px; margin-top:4px; background:rgba(255,255,255,0.05); padding:4px 6px; border-radius:4px;"><span style="width:6px; height:6px; border-radius:50%; background:${typeColor}; flex-shrink:0; box-shadow:0 0 8px ${typeColor};"></span><span style="font-size:0.65rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:600;">${e.title}</span></div>`;
                }).join('');
                
                dayCells.push(`
                    <div style="min-height:90px; padding:10px; border:1px solid rgba(255,255,255,0.05); border-radius:12px; background:rgba(255,255,255,0.02); display:flex; flex-direction:column; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)';" onmouseout="this.style.background='rgba(255,255,255,0.02)';">
                        <div style="font-weight:800; font-size:0.9rem; color:var(--text-primary); text-align:right;">${d}</div>
                        <div style="flex:1; margin-top:6px; display:flex; flex-direction:column; gap:4px;">${eventsHtml}</div>
                    </div>
                `);
            }

            allMonthsHTML += `
                <div id="${monthId}" style="background:rgba(255,255,255,0.02); padding:30px; border-radius:24px; border:1px solid rgba(255,255,255,0.05); box-shadow:0 12px 40px rgba(0,0,0,0.1); margin-bottom: 40px; scroll-margin-top: 80px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                        <h3 style="font-family:var(--font-display); font-size:1.4rem; font-weight:800; margin:0;">🗓️ ${monthNames[month]} ${year}</h3>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:12px; text-align:center; font-weight:800; color:var(--text-secondary); margin-bottom:12px; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:12px;">
                        ${dayCells.join('')}
                    </div>
                </div>
            `;
        }
        monthNavHTML += '</div>';

        return `
            <div id="timelineListContainer" style="display:flex; flex-direction:column; max-height: 800px; overflow-y: auto; padding-right:10px;">
                ${monthNavHTML + allMonthsHTML}
            </div>
        `;
    }

    function renderPreparationPlanTab() {
        const completedCount = prepTasks.filter(t => t.done).length;
        const totalCount = prepTasks.length;
        const overallPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        const subjectStats = {};
        prepTasks.forEach(t => {
            if (!subjectStats[t.subject]) subjectStats[t.subject] = { total: 0, done: 0 };
            subjectStats[t.subject].total++;
            if (t.done) subjectStats[t.subject].done++;
        });

        const subjectCardsHTML = Object.keys(subjectStats).map((subj, idx) => {
            const stats = subjectStats[subj];
            const pct = Math.round((stats.done / stats.total) * 100);
            const colors = ['#7c4dff', '#ff4757', '#2ed573', '#f5a623', '#e84393'];
            const color = colors[idx % colors.length];
            return `
                <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:20px; box-shadow:0 8px 32px rgba(0,0,0,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="color:var(--text-primary); font-size:1.05rem; font-family:var(--font-display); font-weight:800;">📘 ${subj}</strong>
                        <span style="font-size:0.9rem; font-weight:900; color:${color}; text-shadow:0 0 10px ${color}40;">${pct}%</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:6px; font-weight:600;">${stats.done} / ${stats.total} Tasks Completed</p>
                    <div style="height:8px; background:rgba(255,255,255,0.05); border-radius:4px; margin-top:12px; overflow:hidden;">
                        <div style="width:${pct}%; background:linear-gradient(90deg, ${color}, ${color}dd); height:100%; border-radius:4px; transition:width 0.5s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:0 0 10px ${color};"></div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div style="display:flex; flex-direction:column; gap:30px;">
                <div style="background:linear-gradient(135deg, rgba(124, 77, 255, 0.1), rgba(255, 71, 87, 0.05)); border:1px solid rgba(124, 77, 255, 0.2); border-radius:24px; padding:30px; box-shadow:0 12px 40px rgba(0,0,0,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; margin-bottom:20px;">
                        <div>
                            <h3 style="font-family:var(--font-display); font-size:1.6rem; font-weight:900; color:var(--text-primary); margin:0;">🎯 Preparation Readiness</h3>
                            <p style="font-size:0.9rem; color:var(--text-secondary); margin-top:6px;">Your live study roadmap progress.</p>
                        </div>
                        <div style="text-align:right;">
                            <span style="font-size:2.2rem; font-weight:900; color:var(--accent-primary); font-family:var(--font-display); text-shadow:0 0 20px rgba(124, 77, 255, 0.5);">${overallPercent}%</span>
                            <span style="font-size:0.85rem; color:var(--text-secondary); display:block; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Global Readiness</span>
                        </div>
                    </div>
                    <div style="height:14px; background:rgba(0,0,0,0.3); border-radius:7px; overflow:hidden; border:1px solid rgba(255,255,255,0.05);">
                        <div style="width:${overallPercent}%; background:linear-gradient(90deg, #7c4dff, #ff4757); height:100%; transition:width 0.5s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:0 0 20px rgba(255,71,87,0.5);"></div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:20px;">
                    ${subjectCardsHTML}
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:24px; padding:30px; box-shadow:0 12px 40px rgba(0,0,0,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:24px;">
                        <h4 style="font-family:var(--font-display); font-size:1.3rem; font-weight:800; color:var(--text-primary); margin:0;">📋 Master Checklist</h4>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${prepTasks.map(task => `
                            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:20px; opacity:${task.done ? '0.5' : '1'}; transition:all 0.3s;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px;">
                                    <div style="display:flex; align-items:flex-start; gap:16px; flex:1;">
                                        <div style="background:${task.done ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}; width:24px; height:24px; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; border:1px solid ${task.done ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)'};" onclick="window.TimelineModule.togglePrepTask('${task.id}')">
                                            ${task.done ? '<span style="color:var(--text-primary); font-size:0.8rem; font-weight:900;">✓</span>' : ''}
                                        </div>
                                        <div style="flex:1;">
                                            <span style="background:rgba(255,255,255,0.08); color:var(--text-secondary); font-size:0.65rem; font-weight:800; padding:4px 8px; border-radius:6px; margin-bottom:8px; display:inline-block; text-transform:uppercase; letter-spacing:1px;">${task.subject}</span>
                                            <div style="color:var(--text-primary); font-weight:700; font-size:1.05rem; text-decoration:${task.done ? 'line-through' : 'none'}; margin-bottom:4px;">${task.title}</div>
                                            ${task.description ? `<div style="color:var(--text-tertiary); font-size:0.85rem; line-height:1.5;">${task.description}</div>` : ''}
                                        </div>
                                    </div>
                                    <button style="background:transparent; color:var(--text-tertiary); border:none; cursor:pointer; font-size:1.2rem; transition:color 0.2s;" onmouseover="this.style.color='#ff4757';" onmouseout="this.style.color='var(--text-tertiary)';" onclick="window.TimelineModule.deletePrepTask('${task.id}')">✕</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function togglePrepTask(id) { prepTasks = prepTasks.map(t => t.id === id ? { ...t, done: !t.done } : t); saveState(); render(); }
    function deletePrepTask(id) { prepTasks = prepTasks.filter(t => t.id !== id); saveState(); render(); }

    function openAddPrepTaskModal() { const m = document.getElementById('addPrepTaskModal'); if (m) m.style.display = 'flex'; }
    function closeAddPrepTaskModal() { const m = document.getElementById('addPrepTaskModal'); if (m) m.style.display = 'none'; document.getElementById('newPrepTaskTitle').value=''; document.getElementById('newPrepTaskDesc').value=''; }

    function savePrepTaskModal() {
        const title = document.getElementById('newPrepTaskTitle').value.trim();
        const subject = document.getElementById('newPrepTaskSubject').value;
        const description = document.getElementById('newPrepTaskDesc').value.trim();
        
        if (!title) {
            alert('Error: Task Title is required!');
            return;
        }
        
        prepTasks.push({ id: Date.now().toString(), subject, title, description, done: false });
        saveState();
        closeAddPrepTaskModal();
        if(window.showToast) window.showToast('Study task added!', 'success');
        else alert('Study task added!');
        render();
    }

    // MODALS
    function openDeadlineModal() { 
        document.getElementById('newDeadlineTitle').value = '';
        document.getElementById('newDeadlineDate').value = '';
        document.getElementById('newDeadlineNotes').value = '';
        const m = document.getElementById('addDeadlineModal'); 
        if(m) m.style.display = 'flex'; 
    }
    function closeDeadlineModal() { const m = document.getElementById('addDeadlineModal'); if(m) m.style.display = 'none'; }

    function saveCustomDeadline() {
        const title = document.getElementById('newDeadlineTitle')?.value.trim();
        const category = document.getElementById('newDeadlineCategory')?.value;
        const priority = document.getElementById('newDeadlinePriority')?.value;
        const date = document.getElementById('newDeadlineDate')?.value;
        const status = document.getElementById('newDeadlineStatus')?.value;
        const notes = document.getElementById('newDeadlineNotes')?.value.trim();
        
        if (!title || !date) {
            alert('Error: Title and Date are strictly required!');
            return;
        }
        
        events.push({ id: Date.now().toString(), title, category, priority, date, status, notes, rawData: null });
        saveState();
        closeDeadlineModal();
        if(window.showToast) window.showToast('Program securely added to Timeline & Blueprints!', 'success');
        else alert('Program successfully added!');
        render();
    }

    function openEditModal(id) {
        const evt = events.find(e => e.id === id);
        if (!evt) return;
        editingEventId = id;
        document.getElementById('editDeadlineTitle').value = evt.title;
        document.getElementById('editDeadlineCategory').value = evt.category;
        document.getElementById('editDeadlinePriority').value = evt.priority;
        document.getElementById('editDeadlineDate').value = evt.date;
        document.getElementById('editDeadlineStatus').value = evt.status;
        document.getElementById('editDeadlineNotes').value = evt.notes || '';
        const m = document.getElementById('editDeadlineModal');
        if (m) m.style.display = 'flex';
    }
    function closeEditModal() { editingEventId = null; const m = document.getElementById('editDeadlineModal'); if (m) m.style.display = 'none'; }

    function saveEditedDeadline() {
        if (!editingEventId) return;
        const title = document.getElementById('editDeadlineTitle').value.trim();
        const date = document.getElementById('editDeadlineDate').value;
        if (!title || !date) {
            alert('Error: Title and Date cannot be empty.');
            return;
        }
        events = events.map(e => e.id === editingEventId ? { ...e, title, category: document.getElementById('editDeadlineCategory').value, priority: document.getElementById('editDeadlinePriority').value, date, status: document.getElementById('editDeadlineStatus').value, notes: document.getElementById('editDeadlineNotes').value.trim() } : e);
        saveState();
        closeEditModal();
        if(window.showToast) window.showToast('Program updated across all tabs!', 'success');
        render();
    }

    function deleteDeadline(id) { 
        if (confirm('Are you sure you want to delete this program from BOTH your Timeline and your Blueprints?')) {
            events = events.filter(e => e.id !== id); 
            saveState(); 
            render(); 
        }
    }

    function viewSavedObject(id) {
        // Because data is unified, we just search events array!
        const obj = events.find(e => e.id === id);
        if (!obj) return;
        
        const modal = document.getElementById('viewSavedObjectModal');
        const titleElem = document.getElementById('viewSavedObjectTitle');
        const bodyElem = document.getElementById('viewSavedObjectBody');
        
        titleElem.innerHTML = `🎓 ${obj.title}`;
        let html = `<span style="background:rgba(124,77,255,0.2); color:#c5a1ff; font-size:0.75rem; font-weight:800; padding:6px 12px; border-radius:8px; margin-bottom:20px; display:inline-block; text-transform:uppercase; letter-spacing:1px;">${obj.category}</span>`;
        
        if (obj.rawData) {
            // It has rich AI details saved
            Object.keys(obj.rawData).forEach(key => {
                const val = obj.rawData[key];
                if (!val) return;
                const displayKey = key.replace(/_/g, ' ').toUpperCase();
                html += `<div style="margin-bottom:16px; background:rgba(255,255,255,0.02); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.05);"><strong style="display:block; margin-bottom:6px; color:var(--text-primary); font-size:0.85rem; letter-spacing:1px;">${displayKey}</strong><div style="color:var(--text-secondary); line-height:1.6; font-size:0.9rem;">${val}</div></div>`;
            });
        } else {
            // Manual entry
            html += `<p style="color:var(--text-secondary);"><strong>Target Date:</strong> ${obj.date}</p><p style="color:var(--text-secondary);"><strong>Notes:</strong> ${obj.notes || 'No manual notes provided.'}</p>`;
        }

        bodyElem.innerHTML = html;
        if (modal) modal.style.display = 'flex';
    }
    function closeViewSavedObjectModal() { const m = document.getElementById('viewSavedObjectModal'); if (m) m.style.display = 'none'; }

    // GLOBAL RENDERER
    function render(containerId = 'timelineContainer') {
        loadState();
        const container = document.getElementById(containerId);
        if (!container) return;

        let activeContent = '';
        let dynamicAddButton = ''; // Logic to swap ADD button

        if (activeTab === 'saved-objects') {
            activeContent = renderSavedObjectsTab();
            // We use the EXACT SAME modal (Add Event) since the data model is fully unified.
            dynamicAddButton = `<button style="background:linear-gradient(135deg, var(--accent-primary), #7c4dff); border:none; color:#fff; padding:8px 16px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; box-shadow:0 4px 15px rgba(124, 77, 255, 0.4); transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';" onclick="window.TimelineModule.openDeadlineModal()">➕ Add Program</button>`;
        }
        else if (activeTab === 'timeline' || activeTab === 'calendar') {
            activeContent = activeTab === 'timeline' ? renderTimelineTab() : renderCalendarTab();
            dynamicAddButton = `<button style="background:linear-gradient(135deg, var(--accent-primary), #7c4dff); border:none; color:#fff; padding:8px 16px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; box-shadow:0 4px 15px rgba(124, 77, 255, 0.4); transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';" onclick="window.TimelineModule.openDeadlineModal()">➕ Add Program</button>`;
        }
        else if (activeTab === 'preparation-plan') {
            activeContent = renderPreparationPlanTab();
            dynamicAddButton = `<button style="background:linear-gradient(135deg, var(--accent-primary), #7c4dff); border:none; color:#fff; padding:8px 16px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; box-shadow:0 4px 15px rgba(124, 77, 255, 0.4); transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';" onclick="window.TimelineModule.openAddPrepTaskModal()">➕ New Study Task</button>`;
        }

        const modalStyles = `
            style="background:rgba(0,0,0,0.8); backdrop-filter:blur(12px); position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; display:none; align-items:center; justify-content:center; padding:20px;"
        `;
        const modalInnerStyles = `
            style="background:var(--bg-deep); border:1px solid var(--border-color); border-radius:24px; box-shadow:0 24px 80px rgba(0,0,0,0.8); width:100%; overflow:hidden; animation:modalSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);"
        `;
        const modalHeaderStyles = `
            style="padding:24px 30px; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface);"
        `;
        const inputStyles = `
            style="width:100%; background:var(--bg-input); border:1px solid var(--border-color); color:var(--text-primary); font-size:0.95rem; padding:12px 16px; border-radius:12px; outline:none; transition:border-color 0.2s;"
        `;
        const isMobile = window.innerWidth <= 768;

        container.innerHTML = `
            <style>
                .timeline-tab-btn { background:none; border:none; border-bottom:3px solid transparent; padding:12px 0; color:var(--text-secondary); font-weight:800; cursor:pointer; font-size:1rem; transition:all 0.3s; letter-spacing:0.5px; }
                .timeline-tab-btn.active { color:var(--text-primary); border-bottom:3px solid var(--accent-primary); text-shadow:0 0 10px rgba(124,77,255,0.5); }
                .timeline-tab-btn:hover { color:var(--text-primary); }
                @keyframes modalSlide { from { transform:translateY(30px) scale(0.95); opacity:0; } to { transform:translateY(0) scale(1); opacity:1; } }
            </style>

            <div style="display:flex; flex-direction:column; gap:30px;">
                
                <div style="display:${isMobile ? 'none' : 'flex'}; background:var(--bg-surface); padding:20px 30px; border-radius:20px; border:1px solid var(--border-subtle); justify-content:space-between; align-items:center; box-shadow:0 8px 32px rgba(0,0,0,0.1); flex-wrap:wrap; gap:16px;">
                    <div style="font-family:var(--font-display); font-size:1.1rem; font-weight:800; color:var(--text-primary); letter-spacing:1px; text-transform:uppercase;">Interactive Control Center</div>
                    <div style="display:flex; gap:12px; align-items:center;">
                        ${dynamicAddButton}
                        ${(activeTab === 'timeline' || activeTab === 'calendar') ? `<button style="background:transparent; border:1px solid var(--border-color); color:var(--text-primary); padding:8px 16px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)';" onmouseout="this.style.background='transparent';" onclick="window.TimelineModule.exportAllIcsFile()">📥 Export ICS</button>` : ''}
                    </div>
                </div>

                <div style="display:${isMobile ? 'none' : 'flex'}; border-bottom:1px solid var(--border-subtle); gap:32px; padding:0 10px;">
                    <button class="timeline-tab-btn ${activeTab === 'timeline' ? 'active' : ''}" onclick="window.TimelineModule.switchTab('timeline')">⏱️ Timeline</button>
                    <button class="timeline-tab-btn ${activeTab === 'saved-objects' ? 'active' : ''}" onclick="window.TimelineModule.switchTab('saved-objects')">📂 Blueprints</button>
                    <button class="timeline-tab-btn ${activeTab === 'calendar' ? 'active' : ''}" onclick="window.TimelineModule.switchTab('calendar')">🗓️ Calendar</button>
                    <button class="timeline-tab-btn ${activeTab === 'preparation-plan' ? 'active' : ''}" onclick="window.TimelineModule.switchTab('preparation-plan')">🎯 Prep Plan</button>
                </div>

                <!-- Mobile Floating Action Button (FAB) -->
                ${(isMobile && dynamicAddButton) ? `
                    <div style="position:fixed; bottom:90px; right:20px; z-index:9000; display:flex; flex-direction:column; gap:10px; align-items:flex-end;">
                        ${(activeTab === 'timeline' || activeTab === 'calendar') ? `<button style="background:var(--bg-elevated); border:1px solid var(--border-color); color:var(--text-primary); padding:10px; border-radius:50%; box-shadow:0 4px 10px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; width:40px; height:40px;" onclick="window.TimelineModule.exportAllIcsFile()" title="Export ICS">📅</button>` : ''}
                        <div style="box-shadow:0 8px 24px rgba(124, 77, 255, 0.4); border-radius:30px;">
                            ${dynamicAddButton.replace('padding:8px 16px; border-radius:10px;', 'padding:14px 20px; border-radius:30px; font-size:1rem;')}
                        </div>
                    </div>
                ` : ''}

                <div class="timeline-content-area" style="animation: modalSlide 0.4s ease-out;">
                    ${activeContent}
                </div>

                <!-- Modals -->
                <div id="addDeadlineModal" ${modalStyles}>
                    <div class="modal" ${modalInnerStyles} style="max-width:500px; max-height:90vh; display:flex; flex-direction:column;">
                        <div ${modalHeaderStyles}>
                            <h3 style="font-family:var(--font-display); font-size:1.3rem; margin:0; color:var(--text-primary); font-weight:800;">➕ New Program</h3>
                            <div style="display:flex; gap:12px;">
                                <button style="background:transparent; color:var(--text-secondary); border:none; font-weight:700; cursor:pointer;" onclick="window.TimelineModule.closeDeadlineModal()">Cancel</button>
                                <button style="background:linear-gradient(135deg, var(--accent-primary), #7c4dff); border:none; color:#fff; padding:6px 16px; border-radius:8px; font-weight:800; cursor:pointer;" onclick="window.TimelineModule.saveCustomDeadline()">Save</button>
                            </div>
                        </div>
                        <div style="padding:30px; display:flex; flex-direction:column; gap:16px; overflow-y:auto; flex:1;">
                            <input type="text" id="newDeadlineTitle" placeholder="Program Title (Required)" ${inputStyles}>
                            <div style="color:var(--text-secondary); font-size:0.8rem; font-weight:600;">Target Deadline (Required):</div>
                            <input type="date" id="newDeadlineDate" ${inputStyles}>
                            <select id="newDeadlineCategory" ${inputStyles}><option value="Entry Test">Entry Test</option><option value="Scholarship">Scholarship</option><option value="University Admission">University Admission</option></select>
                            <select id="newDeadlinePriority" ${inputStyles}><option value="High">High</option><option value="Medium">Medium</option></select>
                            <select id="newDeadlineStatus" ${inputStyles}><option value="Upcoming">Upcoming</option></select>
                            <input type="text" id="newDeadlineNotes" placeholder="Additional Notes" ${inputStyles}>
                        </div>
                    </div>
                </div>

                <div id="editDeadlineModal" ${modalStyles}>
                    <div class="modal" ${modalInnerStyles} style="max-width:500px; max-height:90vh; display:flex; flex-direction:column;">
                        <div ${modalHeaderStyles}>
                            <h3 style="font-family:var(--font-display); font-size:1.3rem; margin:0; color:var(--text-primary); font-weight:800;">✏️ Edit Program</h3>
                            <div style="display:flex; gap:12px;">
                                <button style="background:transparent; color:var(--text-secondary); border:none; font-weight:700; cursor:pointer;" onclick="window.TimelineModule.closeEditModal()">Cancel</button>
                                <button style="background:linear-gradient(135deg, var(--accent-primary), #7c4dff); border:none; color:#fff; padding:6px 16px; border-radius:8px; font-weight:800; cursor:pointer;" onclick="window.TimelineModule.saveEditedDeadline()">Update</button>
                            </div>
                        </div>
                        <div style="padding:30px; display:flex; flex-direction:column; gap:16px; overflow-y:auto; flex:1;">
                            <input type="text" id="editDeadlineTitle" ${inputStyles}>
                            <input type="date" id="editDeadlineDate" ${inputStyles}>
                            <select id="editDeadlineCategory" ${inputStyles}><option value="Entry Test">Entry Test</option><option value="Scholarship">Scholarship</option><option value="University Admission">University Admission</option></select>
                            <select id="editDeadlinePriority" ${inputStyles}><option value="High">High</option><option value="Medium">Medium</option></select>
                            <select id="editDeadlineStatus" ${inputStyles}><option value="Upcoming">Upcoming</option><option value="Completed">Completed</option></select>
                            <input type="text" id="editDeadlineNotes" ${inputStyles}>
                        </div>
                    </div>
                </div>

                <div id="addPrepTaskModal" ${modalStyles}>
                    <div class="modal" ${modalInnerStyles} style="max-width:500px; max-height:90vh; display:flex; flex-direction:column;">
                        <div ${modalHeaderStyles}>
                            <h3 style="font-family:var(--font-display); font-size:1.3rem; margin:0; color:var(--text-primary); font-weight:800;">➕ New Study Task</h3>
                            <div style="display:flex; gap:12px;">
                                <button style="background:transparent; color:var(--text-secondary); border:none; font-weight:700; cursor:pointer;" onclick="window.TimelineModule.closeAddPrepTaskModal()">Cancel</button>
                                <button style="background:linear-gradient(135deg, var(--accent-primary), #7c4dff); border:none; color:#fff; padding:6px 16px; border-radius:8px; font-weight:800; cursor:pointer;" onclick="window.TimelineModule.savePrepTaskModal()">Add Task</button>
                            </div>
                        </div>
                        <div style="padding:30px; display:flex; flex-direction:column; gap:16px; overflow-y:auto; flex:1;">
                            <input type="text" id="newPrepTaskTitle" placeholder="Task Title (Required)" ${inputStyles}>
                            <select id="newPrepTaskSubject" ${inputStyles}>
                                <option value="Mathematics">Mathematics</option><option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option><option value="English">English</option><option value="General">General</option>
                            </select>
                            <textarea id="newPrepTaskDesc" placeholder="Description" ${inputStyles} style="min-height:100px; resize:vertical;"></textarea>
                        </div>
                    </div>
                </div>

                <div id="viewSavedObjectModal" ${modalStyles}>
                    <div class="modal" ${modalInnerStyles} style="max-width:650px; max-height:85vh; display:flex; flex-direction:column;">
                        <div ${modalHeaderStyles}>
                            <h3 class="modal-title" id="viewSavedObjectTitle" style="font-family:var(--font-display); color:var(--text-primary); font-size:1.4rem; font-weight:900; margin:0;">Program Details</h3>
                            <button style="background:transparent; border:none; color:var(--text-secondary); font-size:1.5rem; cursor:pointer;" onclick="window.TimelineModule.closeViewSavedObjectModal()">✕</button>
                        </div>
                        <div id="viewSavedObjectBody" style="padding:30px; overflow-y:auto; flex:1;"></div>
                    </div>
                </div>

            </div>
        `;
    }

    return {
        render, switchTab, onItemSaved, setSavedObjectsFilter, openDeadlineModal, closeDeadlineModal,
        saveCustomDeadline, openEditModal, closeEditModal, saveEditedDeadline, deleteDeadline,
        togglePrepTask, deletePrepTask, openAddPrepTaskModal,
        closeAddPrepTaskModal, savePrepTaskModal, viewSavedObject, closeViewSavedObjectModal,
        exportIcsFileById: exportIcsFile, exportAllIcsFile
    };
})();
