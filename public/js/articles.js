/**
 * SCHOLARLY AI — Community Articles & Experience Wall Module
 * Fully functional module with persistent storage, article editor, and distraction-free reader.
 */

class ArticlesManager {
    constructor() {
        this.storageKey = 'scholarly_articles_v3';
        this.articles = this.load();
        this.injectStyles();
    }

    injectStyles() {
        if (!document.getElementById('articlesStyles')) {
            const style = document.createElement('style');
            style.id = 'articlesStyles';
            style.textContent = `
                .article-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .article-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
                    background: var(--accent-primary); opacity: 0; transition: opacity 0.3s;
                }
                .article-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.08);
                    border-color: var(--accent-subtle);
                }
                .article-card:hover::before { opacity: 1; }
                
                .upvote-btn {
                    transition: all 0.2s;
                }
                .upvote-btn.active {
                    background: var(--accent-subtle);
                    color: var(--accent-primary);
                    border-color: var(--accent-primary);
                }
                .upvote-btn:active {
                    transform: scale(0.95);
                }

                /* Modals */
                .art-modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
                }
                .art-modal-overlay.active {
                    opacity: 1; pointer-events: all;
                }
                .art-modal-content {
                    background: var(--bg-surface); border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg); padding: 32px; width: 90%; max-width: 650px;
                    max-height: 85vh; overflow-y: auto;
                    transform: translateY(20px); transition: transform 0.3s ease;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                .art-modal-overlay.active .art-modal-content {
                    transform: translateY(0);
                }

                /* Reader specifics */
                .reader-title {
                    font-family: var(--font-display);
                    font-size: 1.8rem;
                    line-height: 1.3;
                    margin-bottom: 12px;
                    color: var(--text-primary);
                }
                .reader-meta {
                    display: flex; align-items: center; gap: 12px;
                    font-size: 0.9rem; color: var(--text-secondary);
                    padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);
                    margin-bottom: 24px;
                }
                .reader-body {
                    font-size: 1.05rem;
                    line-height: 1.7;
                    color: var(--text-primary);
                    white-space: pre-wrap;
                }
            `;
            document.head.appendChild(style);
        }
    }

    getDefaultArticles() {
        return [
            { 
                id: 1, 
                title: 'How I Cleared NUST NET-1 CS with 162/200 Score: Complete Strategy', 
                author: 'Hamza Malik (FAST/NUST Alum)', 
                tag: 'NUST / NET', 
                upvotes: 248, 
                readTime: '4 min read',
                body: "Getting a 162 in NET-1 was not about studying 14 hours a day, it was about studying smart.\n\nFirst, I realized that Physics and Math carry the most weight. I stopped reading FSc books line-by-line and shifted entirely to OETP and STEP practice books. Time management is the real killer in NET. You have 3 hours for 200 MCQs.\n\nMy strategy during the exam:\n1. Intelligence & English (Done in 15 mins) - Free marks if you are good at logic.\n2. Chemistry/CS (Done in 25 mins) - These are usually memory-based. You either know it or you don't. Don't waste time deriving.\n3. Physics (45 mins) - The conceptual part. I skipped long calculations for the end.\n4. Math (Rest of the time) - The hardest and most weighted section.\n\nDon't stress if your NET-1 score is low, you have 3 more attempts. But NET-1 is usually considered the easiest because the FSc Part 2 syllabus isn't fully covered yet!"
            },
            { 
                id: 2, 
                title: 'Hostel Reality Guide 2026: NUST H-12 vs FAST Islamabad', 
                author: 'Ayesha Khan', 
                tag: 'Hostel Reality', 
                upvotes: 189, 
                readTime: '3 min read',
                body: "Choosing a university isn't just about academics; where you live matters just as much. Having experienced both environments through friends and personal experience, here's the raw truth.\n\nNUST H-12 Hostels:\nPros: It's massive, incredibly secure, and you literally live inside a mini-city. The internet (PERN) is fantastic, and you have cafes, gyms, and sports grounds walking distance away.\nCons: Getting a room is notoriously difficult due to merit and distance quotas. The mess food gets repetitive very quickly.\n\nFAST Islamabad (Private Hostels):\nFAST ISB doesn't have official on-campus hostels for everyone, so you'll likely live in private hostels in G-9 or G-11.\nPros: More freedom, better food options around you, and you get to experience the actual city vibe.\nCons: Commuting every day via van or Careem gets exhausting and expensive. Security is entirely dependent on the private owner.\n\nVerdict: If you want convenience and campus life, NUST wins. If you want city life, FAST is better."
            },
            { 
                id: 3, 
                title: 'Cracking the HEC Need-Based & Ehsaas Scholarship Interview', 
                author: 'Bilal Ahmed (HEC Scholar)', 
                tag: 'Scholarships', 
                upvotes: 312, 
                readTime: '5 min read',
                body: "I secured a 100% tuition waiver through the Ehsaas/HEC need-based program. The most crucial part of this process is the physical interview. Here is exactly what they look for.\n\n1. Document Consistency:\nThe panel will have your form in front of them. If you wrote your father's income is 40k, but your electricity bills average 15k, they WILL cross-question you. Be honest and explain anomalies.\n\n2. The 'Why' Question:\nThey often ask: 'Why should we give this to you instead of the person waiting outside?' Don't just give a generic 'I am poor' answer. Talk about your academic drive, what you want to achieve, and how this scholarship is the ONLY way you can continue studying.\n\n3. Confidence and Honesty:\nDo not exaggerate your poverty. They have seen thousands of cases. They appreciate students who are struggling but maintain dignity and a fighting spirit.\n\nMake sure your FRC, income certificates, and utility bills are neatly filed when you walk into that room. Good luck!"
            },
            {
                id: 4,
                title: 'Q/A: Pre-Med vs Pre-Engineering vs ICS – What should I choose after Matric?',
                author: 'Counselor Ali',
                tag: 'Career Advice',
                upvotes: 450,
                readTime: '4 min read',
                body: "The most famous question asked by Matric students in Pakistan.\n\nPre-Medical (FSc):\nTake this ONLY if you are 100% committed to becoming a Doctor (MBBS/BDS) or going into Allied Health Sciences. The competition for MDCAT is brutal (over 200,000 students compete for ~4,000 public seats). If you don't get in, backup options are Pharmacy, DPT, or BS Bio-sciences.\n\nPre-Engineering (FSc):\nThe traditional route for engineers. However, the market for Civil/Mechanical engineers is currently saturated in Pakistan. But this group gives you the most flexibility. You can still switch to Computer Science or BBA in university.\n\nICS (Computer Science):\nThe golden ticket right now. The IT industry is booming in Pakistan and globally. If you like logic, math, and problem-solving, choose ICS. You can easily get into top CS programs at NUST, FAST, PUCIT, or COMSATS.\n\nMy Advice: Follow the market trends and your own aptitude. Don't choose Pre-Med just because your parents want you to, it's a 5+ year grind."
            },
            {
                id: 5,
                title: 'Q/A: MDCAT vs NUMS vs Aga Khan - Which Medical Test is the Hardest?',
                author: 'Dr. Zainab',
                tag: 'MDCAT / Medical',
                upvotes: 521,
                readTime: '3 min read',
                body: "Every pre-medical student asks this. Here is the breakdown.\n\n1. Aga Khan University (AKU) Test:\nThe hardest. Period. It's not about cramming the textbook; it's entirely conceptual. You need strong critical thinking skills. Their science reasoning section is notoriously difficult and similar to the SAT.\n\n2. NUMS (National University of Medical Sciences):\nUsually considered easier than the national MDCAT. It is well-structured, strictly follows the syllabus, and has no out-of-course surprises. It's for admission into Army Medical College (AMC) and CMH-affiliated colleges.\n\n3. National MDCAT (UHS / PMDC / SZABMU / DUHS):\nThe most stressful, not because the questions are impossible, but because the syllabus is huge, the provincial board discrepancies are annoying, and the stakes are highest. Time management and nerve control are what get you a good score here.\n\nFocus 80% of your energy on the National MDCAT, but attempt NUMS as a very strong backup."
            },
            {
                id: 6,
                title: 'Q/A: How exactly is the University Aggregate / Merit Calculated in Pakistan?',
                author: 'Admissions Expert',
                tag: 'Admissions',
                upvotes: 389,
                readTime: '2 min read',
                body: "The aggregate formula confuses many students. It is a weighted percentage used to rank you against other applicants.\n\nMost engineering/CS universities (like FAST or UET) use this standard formula:\n- Matric / O-Levels: 10% weightage\n- FSc / A-Levels: 40% weightage\n- Entry Test (NET / ECAT): 50% weightage\n\nHow to calculate it manually:\n1. (Your Matric Marks / Total Matric Marks) * 10\n2. (Your FSc Marks / Total FSc Marks) * 40\n3. (Your Entry Test Marks / Total Test Marks) * 50\nAdd all three values together to get your aggregate out of 100.\n\nNOTE: NUST places a massive 75% weight on their entry test (NET). This means even if you scored average in FSc, you can still easily secure admission by scoring 150+ in the NET!"
            },
            {
                id: 7,
                title: 'Q/A: What is the difference between HEC Recognized and Unrecognized Degrees?',
                author: 'HEC Guidelines',
                tag: 'University Selection',
                upvotes: 210,
                readTime: '3 min read',
                body: "Before taking admission in any private university, you MUST check if they are recognized by the Higher Education Commission (HEC) of Pakistan.\n\nRecognized Degree:\n- You can apply for government jobs (CSS, PMS, FPSC).\n- You can easily apply for master's programs abroad.\n- Your degree will be attested by HEC, which is a requirement for work visas in the Middle East and Europe.\n\nUnrecognized / Fake Degree / Sub-Campuses:\n- If a university opens an illegal sub-campus in a small city without HEC approval, your degree is essentially a piece of paper.\n- You cannot attest it, you cannot use it for government jobs, and foreign embassies will reject your visa.\n\nHow to check?\nAlways go to the official HEC website and check their 'Recognized Universities/Campuses' list before paying any admission fee."
            }
        ];
    }

    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) return JSON.parse(stored);
        } catch (e) { console.error('Error loading articles', e); }
        return this.getDefaultArticles();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.articles));
        } catch (e) {
            console.error('Storage full');
        }
    }

    calculateReadTime(text) {
        const words = text.trim().split(/\s+/).length;
        const mins = Math.ceil(words / 200); // 200 wpm average
        return mins === 0 ? 1 : mins;
    }

    submitArticle() {
        const title = document.getElementById('artTitle').value.trim();
        const author = document.getElementById('artAuthor').value.trim();
        const tag = document.getElementById('artTag').value.trim();
        const body = document.getElementById('artBody').value.trim();

        if (!title || !author || !tag || !body) {
            if(window.showToast) window.showToast('Please fill in all fields', 'warning');
            return;
        }

        const readTime = this.calculateReadTime(body);

        const newArticle = {
            id: Date.now(),
            title,
            author,
            tag,
            upvotes: 0,
            readTime: `${readTime} min read`,
            body
        };

        // Prepend to top of feed
        this.articles.unshift(newArticle);
        this.save();
        this.render();
        this.closeEditor();

        if(window.showToast) window.showToast('Article published successfully! 🎉', 'success');
    }

    upvote(id, btnElement) {
        const art = this.articles.find(a => a.id === id);
        if (art) {
            // Simple toggle logic for the prototype (prevents infinite upvoting in one session)
            if (btnElement.classList.contains('active')) {
                art.upvotes--;
                btnElement.classList.remove('active');
            } else {
                art.upvotes++;
                btnElement.classList.add('active');
                // Mini animation
                btnElement.style.transform = 'scale(1.1)';
                setTimeout(() => btnElement.style.transform = 'scale(1)', 200);
            }
            btnElement.innerHTML = `👍 Upvote (${art.upvotes})`;
            this.save();
        }
    }

    openEditor() {
        document.getElementById('articleEditorModal')?.classList.add('active');
    }

    closeEditor() {
        document.getElementById('articleEditorModal')?.classList.remove('active');
        // Clear inputs
        document.getElementById('artTitle').value = '';
        document.getElementById('artAuthor').value = '';
        document.getElementById('artTag').value = '';
        document.getElementById('artBody').value = '';
    }

    openReader(id) {
        const art = this.articles.find(a => a.id === id);
        if (!art) return;

        const readerTitle = document.getElementById('readerTitle');
        const readerMeta = document.getElementById('readerMeta');
        const readerBody = document.getElementById('readerBody');

        if (readerTitle) readerTitle.textContent = art.title;
        if (readerMeta) {
            readerMeta.innerHTML = `
                <span class="badge" style="background:var(--accent-subtle); color:var(--accent-primary);">${art.tag}</span>
                <span>By <strong>${art.author}</strong></span>
                <span>⏱️ ${art.readTime}</span>
            `;
        }
        if (readerBody) readerBody.textContent = art.body;

        document.getElementById('articleReaderModal')?.classList.add('active');
    }

    closeReader() {
        document.getElementById('articleReaderModal')?.classList.remove('active');
    }

    render(containerId = 'articlesContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:32px;">
                <!-- Header -->
                <div style="background:var(--bg-surface); padding:32px; border-radius:var(--radius-lg); border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <div style="flex:1;">
                        <h2 style="font-family:var(--font-display); font-size:1.8rem; margin-bottom:8px; color:var(--text-primary);">📰 Community Experience Wall</h2>
                        <p style="font-size:1rem; color:var(--text-secondary); max-width:700px; line-height:1.5;">Learn from the journeys of seniors, alumni, and scholarship winners. Share your own experiences to guide the next generation.</p>
                    </div>
                    <button class="btn btn-primary" style="padding:12px 24px; font-size:1rem;" onclick="window.ArticlesModule.openEditor()">✍️ Write an Article</button>
                </div>

                <!-- Feed Grid -->
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap:24px;">
                    ${this.articles.map(art => `
                        <div class="article-card">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span class="badge" style="background:var(--accent-subtle); color:var(--accent-primary); font-weight:600; letter-spacing:0.5px;">${art.tag}</span>
                                <span style="font-size:0.8rem; color:var(--text-tertiary); font-weight:500;">⏱️ ${art.readTime}</span>
                            </div>
                            <h3 style="font-size:1.2rem; color:var(--text-primary); line-height:1.4; font-family:var(--font-display); margin-top:8px;">${art.title}</h3>
                            
                            <!-- Sneak peek of body -->
                            <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                ${art.body}
                            </p>

                            <div style="margin-top:auto; padding-top:20px; display:flex; justify-content:space-between; align-items:center;">
                                <div style="display:flex; flex-direction:column; gap:2px;">
                                    <span style="font-size:0.75rem; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:1px;">Author</span>
                                    <span style="font-size:0.9rem; color:var(--text-primary); font-weight:600;">${art.author}</span>
                                </div>
                                <div style="display:flex; gap:12px;">
                                    <button class="btn btn-sm btn-outline upvote-btn" onclick="window.ArticlesModule.upvote(${art.id}, this)">👍 Upvote (${art.upvotes})</button>
                                    <button class="btn btn-sm btn-primary" onclick="window.ArticlesModule.openReader(${art.id})">Read →</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- READER MODAL -->
            <div class="art-modal-overlay" id="articleReaderModal">
                <div class="art-modal-content">
                    <div style="display:flex; justify-content:flex-end; margin-bottom:12px;">
                        <button style="background:none; border:none; font-size:1.5rem; color:var(--text-secondary); cursor:pointer;" onclick="window.ArticlesModule.closeReader()">×</button>
                    </div>
                    <h2 id="readerTitle" class="reader-title"></h2>
                    <div id="readerMeta" class="reader-meta"></div>
                    <div id="readerBody" class="reader-body"></div>
                    
                    <div style="margin-top:40px; text-align:center;">
                        <button class="btn btn-primary" onclick="window.ArticlesModule.closeReader()">Done Reading</button>
                    </div>
                </div>
            </div>

            <!-- EDITOR MODAL -->
            <div class="art-modal-overlay" id="articleEditorModal">
                <div class="art-modal-content">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                        <h2 style="font-family:var(--font-display); font-size:1.5rem; color:var(--text-primary);">✍️ Publish an Article</h2>
                        <button style="background:none; border:none; font-size:1.5rem; color:var(--text-secondary); cursor:pointer;" onclick="window.ArticlesModule.closeEditor()">×</button>
                    </div>
                    
                    <div style="display:flex; flex-direction:column; gap:16px;">
                        <div>
                            <label style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:6px; font-weight:600;">Article Title</label>
                            <input type="text" id="artTitle" class="form-input" placeholder="Catchy title (e.g. My USAT Experience)" style="width:100%; font-size:1rem; padding:12px;">
                        </div>
                        <div style="display:flex; gap:16px;">
                            <div style="flex:1;">
                                <label style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:6px; font-weight:600;">Author Name</label>
                                <input type="text" id="artAuthor" class="form-input" placeholder="Your Name or 'Anonymous'" style="width:100%;">
                            </div>
                            <div style="flex:1;">
                                <label style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:6px; font-weight:600;">Category Tag</label>
                                <input type="text" id="artTag" class="form-input" placeholder="e.g. ECAT Prep" style="width:100%;">
                            </div>
                        </div>
                        <div>
                            <label style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:6px; font-weight:600;">Article Body</label>
                            <textarea id="artBody" class="form-input" rows="10" placeholder="Write your experience, tips, or guide here... (Paragraphs will be preserved)" style="width:100%; font-family:inherit; resize:vertical; padding:12px; line-height:1.6;"></textarea>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:16px; margin-top:32px;">
                        <button class="btn" style="background:var(--bg-elevated); color:var(--text-primary);" onclick="window.ArticlesModule.closeEditor()">Cancel</button>
                        <button class="btn btn-primary" onclick="window.ArticlesModule.submitArticle()">Publish Post 🚀</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Global instance
window.ArticlesModule = new ArticlesManager();
