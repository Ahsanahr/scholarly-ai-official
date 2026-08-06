/**
 * SCHOLARLY AI — Admin Module
 * Minimal, live time-based User & Subscription Management Dashboard.
 */

window.AdminModule = (function() {
    let usersList = [];
    let currentFilterPlan = 'All';
    let currentSearchQuery = '';

    function init() {
        // Hidden login shortcut (Ctrl+Shift+A)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                promptLogin();
            }
        });

        if (isAdmin()) {
            setupArticleDelete();
            
            const adminLink = document.getElementById('adminSidebarLink');
            if (adminLink) adminLink.style.display = 'flex';

            if (sessionStorage.getItem('just_logged_in_admin') === 'true') {
                sessionStorage.removeItem('just_logged_in_admin');
            }
        }
    }

    function isAdmin() {
        const adminFlag = localStorage.getItem('scholarly_admin') === 'true';
        if (!adminFlag) return false;

        let activeEmail = '';
        if (window.ScholarAuth && window.ScholarAuth.currentUser && window.ScholarAuth.currentUser.email) {
            activeEmail = window.ScholarAuth.currentUser.email.toLowerCase();
        } else {
            const activeDemo = localStorage.getItem('scholarpath_demo_user');
            if (activeDemo) {
                try {
                    const u = JSON.parse(activeDemo);
                    if (u && u.email) activeEmail = u.email.toLowerCase();
                } catch(e) {}
            }
        }

        // Guests (no active logged in email) or regular student accounts MUST return false!
        if (!activeEmail || (activeEmail !== 'trazoexplains' && activeEmail !== 'trazoexplains@admin')) {
            return false;
        }

        return true;
    }

    function promptLogin() {
        if (isAdmin()) {
            alert('Already logged in as Admin');
            return;
        }

        const email = prompt("Admin Email:");
        if (email !== 'trazoexplains') return;
        
        const pass = prompt("Admin Password:");
        if (pass === 'Ahsan123$') {
            const adminUser = {
                uid: 'admin_trazoexplains',
                displayName: 'Admin (Trazo)',
                email: 'trazoexplains',
                photoURL: null,
                role: 'owner',
                isAdmin: true
            };
            localStorage.setItem('scholarly_admin', 'true');
            localStorage.setItem('scholarpath_demo_user', JSON.stringify(adminUser));
            if (window.ScholarAuth) {
                window.ScholarAuth.currentUser = adminUser;
                window.ScholarAuth.updateUI(adminUser);
            }
            alert('Admin access granted!');
            location.reload();
        } else {
            alert('Access Denied');
        }
    }

    function setupArticleDelete() {
        setTimeout(() => {
            const articlesContainer = document.getElementById('articlesContainer');
            if (!articlesContainer) return;

            const observer = new MutationObserver(() => {
                const cards = articlesContainer.querySelectorAll('.article-card');
                cards.forEach(card => {
                    if (!card.querySelector('.admin-delete-btn')) {
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'admin-delete-btn btn btn-sm';
                        deleteBtn.style = 'position:absolute; top:10px; right:10px; background:#ff4444; color:white; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; z-index:10; font-size:0.8rem;';
                        deleteBtn.innerText = '🗑️ Delete';
                        deleteBtn.onclick = (e) => {
                            e.stopPropagation();
                            if (confirm('Delete this article?')) {
                                const upvoteBtn = card.querySelector('.upvote-btn');
                                if (upvoteBtn) {
                                    const match = upvoteBtn.getAttribute('onclick').match(/upvote\((\d+)/);
                                    if (match) {
                                        const id = parseInt(match[1]);
                                        if (window.ArticlesModule) {
                                            window.ArticlesModule.articles = window.ArticlesModule.articles.filter(a => a.id !== id);
                                            window.ArticlesModule.save();
                                            window.ArticlesModule.render('articlesContainer');
                                        }
                                    }
                                }
                            }
                        };
                        card.appendChild(deleteBtn);
                    }
                });
            });

            observer.observe(articlesContainer, { childList: true, subtree: true });
        }, 1000);
    }

    // Generic JSON saving function for inline editors
    async function saveJsonData(target, data, silent = false) {
        try {
            const res = await fetch('/api/admin/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target: target,
                    data: data,
                    authEmail: 'trazoexplains',
                    authPass: 'Ahsan123$'
                })
            });

            const result = await res.json();
            if (res.ok) {
                if (!silent) alert('Saved successfully!');
                return true;
            } else {
                alert('Error saving: ' + result.error);
                return false;
            }
        } catch (e) {
            alert('Network error: ' + e.message + '\n(Note: Save feature requires the Next.js backend server to be running via "npm run dev")');
            return false;
        }
    }

    // --- MINIMAL TIME-BASED ADMIN DASHBOARD ---

    async function fetchUsers() {
        try {
            const res = await fetch('/api/admin/users?authEmail=trazoexplains&authPass=Ahsan123$');
            if (res.ok) {
                const data = await res.json();
                if (data.users && Array.isArray(data.users)) {
                    usersList = data.users;
                }
            } else {
                const fallbackRes = await fetch('/data/users-db.json?t=' + Date.now());
                if (fallbackRes.ok) {
                    usersList = await fallbackRes.json();
                }
            }
        } catch (e) {
            try {
                const fallbackRes = await fetch('/data/users-db.json?t=' + Date.now());
                if (fallbackRes.ok) usersList = await fallbackRes.json();
            } catch (err) {}
        }
    }

    function getPlanBadge(plan) {
        const p = (plan || 'free').toLowerCase();
        if (p === 'premier' || p === 'premium') {
            return `<span style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.25); color:#f59e0b; padding:3px 10px; border-radius:12px; font-weight:600; font-size:0.78rem;">Premier</span>`;
        } else if (p === 'pro') {
            return `<span style="background:rgba(176,38,255,0.1); border:1px solid rgba(176,38,255,0.25); color:var(--accent-primary); padding:3px 10px; border-radius:12px; font-weight:600; font-size:0.78rem;">Pro Explorer</span>`;
        }
        return `<span style="background:var(--bg-elevated); border:1px solid var(--border-color); color:var(--text-secondary); padding:3px 10px; border-radius:12px; font-weight:500; font-size:0.78rem;">Free</span>`;
    }

    function getLiveTimeString() {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return now.toLocaleDateString('en-US', options);
    }

    async function renderUsersDashboard(containerId = 'adminDashboardContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!usersList.length) {
            await fetchUsers();
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const currentMonthStr = todayStr.substring(0, 7); // e.g. "2026-07"

        const totalUsers = usersList.length;
        const todayUsers = usersList.filter(u => u.joinedDate === todayStr || u.lastSeen === todayStr).length;
        const monthUsers = usersList.filter(u => u.joinedDate && u.joinedDate.startsWith(currentMonthStr)).length;

        const freeCount = usersList.filter(u => !u.plan || u.plan.toLowerCase() === 'free').length;
        const proCount = usersList.filter(u => u.plan && u.plan.toLowerCase() === 'pro').length;
        const premierCount = usersList.filter(u => u.plan && (u.plan.toLowerCase() === 'premier' || u.plan.toLowerCase() === 'premium')).length;
        
        const estRevenue = (proCount * 420) + (premierCount * 1250);

        const filteredUsers = usersList.filter(u => {
            const matchesSearch = !currentSearchQuery || 
                (u.name && u.name.toLowerCase().includes(currentSearchQuery.toLowerCase())) ||
                (u.email && u.email.toLowerCase().includes(currentSearchQuery.toLowerCase()));
            
            const p = (u.plan || 'free').toLowerCase();
            const matchesPlan = currentFilterPlan === 'All' || 
                (currentFilterPlan === 'free' && p === 'free') ||
                (currentFilterPlan === 'pro' && p === 'pro') ||
                (currentFilterPlan === 'premier' && (p === 'premier' || p === 'premium'));

            return matchesSearch && matchesPlan;
        });

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px; animation: fadeIn 0.25s ease-out;">
                <!-- Header Banner -->
                <div style="background:var(--bg-surface); padding:20px 24px; border-radius:var(--radius-lg); border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                    <div>
                        <h2 style="font-family:var(--font-display); font-size:1.5rem; font-weight:700; color:var(--text-primary); margin:0;">
                            Users
                        </h2>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-size:0.8rem; color:var(--text-tertiary); font-weight:600;">${getLiveTimeString()}</span>
                        <button class="btn btn-outline" onclick="window.AdminModule.refreshUsersDashboard()" style="padding:6px 14px; border-radius:var(--radius-md); font-size:0.82rem; font-weight:600;">🔄 Refresh</button>
                    </div>
                </div>

                <!-- Minimal Metrics Grid -->
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:14px;">
                    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:18px;">
                        <div style="font-size:0.75rem; color:var(--text-tertiary); font-weight:600; text-transform:uppercase;">Total Registered</div>
                        <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:700; color:var(--text-primary); margin-top:4px;">${totalUsers}</div>
                        <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">${monthUsers} new this month</div>
                    </div>

                    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:18px;">
                        <div style="font-size:0.75rem; color:var(--text-tertiary); font-weight:600; text-transform:uppercase;">Today Active</div>
                        <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:700; color:var(--text-primary); margin-top:4px;">${todayUsers || 1}</div>
                        <div style="font-size:0.75rem; color:var(--status-success); margin-top:2px;">● Synced Now</div>
                    </div>

                    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:18px;">
                        <div style="font-size:0.75rem; color:var(--text-tertiary); font-weight:600; text-transform:uppercase;">Subscribers (Pro/Premier)</div>
                        <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:700; color:var(--accent-primary); margin-top:4px;">${proCount + premierCount}</div>
                        <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">${proCount} Pro • ${premierCount} Premier</div>
                    </div>

                    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:18px;">
                        <div style="font-size:0.75rem; color:var(--text-tertiary); font-weight:600; text-transform:uppercase;">Monthly Revenue</div>
                        <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:700; color:var(--status-success); margin-top:4px;">${estRevenue.toLocaleString()} PKR</div>
                        <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">Current billing cycle</div>
                    </div>
                </div>

                <!-- Minimal Controls & Filter Bar -->
                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                    <div style="flex:1; min-width:240px;">
                        <input type="text" id="adminUserSearch" placeholder="Search user by name or email..." value="${currentSearchQuery}" oninput="window.AdminModule.filterUsersSearch(this.value)" style="width:100%; padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-size:0.88rem; outline:none;">
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:0.82rem; color:var(--text-secondary);">Plan Filter:</span>
                        <select onchange="window.AdminModule.filterUsersPlan(this.value)" style="padding:8px 12px; border-radius:var(--radius-md); border:1px solid var(--border-color); background:var(--bg-elevated); color:var(--text-primary); font-size:0.85rem; outline:none;">
                            <option value="All" ${currentFilterPlan === 'All' ? 'selected' : ''}>All Plans (${totalUsers})</option>
                            <option value="free" ${currentFilterPlan === 'free' ? 'selected' : ''}>Free Tier (${freeCount})</option>
                            <option value="pro" ${currentFilterPlan === 'pro' ? 'selected' : ''}>Pro Explorer (${proCount})</option>
                            <option value="premier" ${currentFilterPlan === 'premier' ? 'selected' : ''}>Premier (${premierCount})</option>
                        </select>
                    </div>
                </div>

                <!-- Minimal Users Table -->
                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden;">
                    <div style="overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.88rem;">
                            <thead>
                                <tr style="background:var(--bg-elevated); border-bottom:1px solid var(--border-color); color:var(--text-tertiary); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em;">
                                    <th style="padding:12px 18px;">User</th>
                                    <th style="padding:12px 18px;">Email</th>
                                    <th style="padding:12px 18px;">Subscription Tier</th>
                                    <th style="padding:12px 18px;">Credits</th>
                                    <th style="padding:12px 18px;">Joined Date</th>
                                    <th style="padding:12px 18px;">Last Activity</th>
                                    <th style="padding:12px 18px; text-align:right;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredUsers.length === 0 ? `
                                    <tr>
                                        <td colspan="7" style="text-align:center; padding:36px; color:var(--text-secondary);">No user records found matching search query.</td>
                                    </tr>
                                ` : filteredUsers.map(u => `
                                    <tr style="border-bottom:1px solid var(--border-color); transition:background 0.15s;" onmouseover="this.style.background='var(--bg-elevated)'" onmouseout="this.style.background='transparent'">
                                        <td style="padding:14px 18px; font-weight:600; color:var(--text-primary);">${u.name}</td>
                                        <td style="padding:14px 18px; color:var(--text-secondary);">${u.email}</td>
                                        <td style="padding:14px 18px;">${getPlanBadge(u.plan)}</td>
                                        <td style="padding:14px 18px; font-weight:600; color:var(--text-primary);">${u.credits !== undefined ? u.credits : 15}</td>
                                        <td style="padding:14px 18px; color:var(--text-secondary); font-size:0.82rem;">${u.joinedDate || todayStr}</td>
                                        <td style="padding:14px 18px; color:var(--text-tertiary); font-size:0.82rem;">${u.lastSeen || 'Today'}</td>
                                        <td style="padding:14px 18px; text-align:right;">
                                            <select onchange="window.AdminModule.changeUserPlan('${u.id}', this.value)" style="padding:5px 10px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-surface); color:var(--text-primary); font-size:0.8rem; cursor:pointer;">
                                                <option value="" disabled selected>Change Plan...</option>
                                                <option value="free">Free Starter</option>
                                                <option value="pro">Pro Explorer</option>
                                                <option value="premier">Premier Tier</option>
                                            </select>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    async function changeUserPlan(userId, newPlan) {
        if (!confirm(`Confirm changing plan tier for this user to "${newPlan.toUpperCase()}"?`)) {
            return;
        }

        let newCredits = 15;
        if (newPlan === 'pro') newCredits = 450;
        if (newPlan === 'premier') newCredits = 1350;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updatePlan',
                    userId: userId,
                    newPlan: newPlan,
                    newCredits: newCredits,
                    authEmail: 'trazoexplains',
                    authPass: 'Ahsan123$'
                })
            });

            if (res.ok) {
                const u = usersList.find(x => x.id === userId);
                if (u) {
                    u.plan = newPlan;
                    u.credits = newCredits;
                }
                if (window.showToast) window.showToast(`User plan updated to ${newPlan.toUpperCase()}!`, 'success');
                renderUsersDashboard();
            } else {
                alert('Failed to update plan.');
            }
        } catch (e) {
            console.error('Error changing plan:', e);
            alert('Error updating user plan.');
        }
    }

    function filterUsersSearch(query) {
        currentSearchQuery = query;
        renderUsersDashboard();
    }

    function filterUsersPlan(plan) {
        currentFilterPlan = plan;
        renderUsersDashboard();
    }

    async function refreshUsersDashboard() {
        await fetchUsers();
        renderUsersDashboard();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        isAdmin,
        saveJsonData,
        renderDashboard: renderUsersDashboard,
        refreshUsersDashboard,
        changeUserPlan,
        filterUsersSearch,
        filterUsersPlan
    };
})();
