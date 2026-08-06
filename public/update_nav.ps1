$newNav = @"
    <!-- ===== Bottom Navigation Bar ===== -->
    <nav class="mobile-bottom-nav" aria-label="Main navigation">
        <a href="dashboard.html" class="bottom-nav-item" aria-label="Dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Home
        </a>
        <a href="search.html" class="bottom-nav-item" aria-label="AI Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Search
        </a>
        <a href="test-prep.html" class="bottom-nav-item" aria-label="Test Prep" style="position:relative;">
            <div style="background:var(--accent-primary); border-radius:50%; width:44px; height:44px; display:flex; align-items:center; justify-content:center; color:#fff; position:absolute; top:-16px; box-shadow:0 4px 12px var(--accent-glow); border:4px solid var(--bg-body);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <span style="margin-top:20px;">Test Prep</span>
        </a>
        <a href="timeline.html" class="bottom-nav-item" aria-label="Timeline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Timeline
        </a>
        <a href="profile.html" class="bottom-nav-item" aria-label="Profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
        </a>
    </nav>
"@

$files = @("dashboard.html", "search.html", "timeline.html", "university.html", "sop.html", "matchmaker.html", "test-prep.html", "programs.html")
foreach ($file in $files) {
    $path = "c:\Users\HAFIZ ABU BAKER\Downloads\SCOLARY AI\public\mobile\$file"
    if (Test-Path $path) {
        $content = Get-Content -Raw $path
        # Regex to match from <!-- ===== Bottom Navigation Bar ===== --> to </nav>
        $pattern = "(?s)<!-- ===== Bottom Navigation Bar ===== -->.*?</nav>"
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $newNav
            Set-Content -Path $path -Value $content -NoNewline -Encoding UTF8
            Write-Host "Updated $file"
        } else {
            Write-Host "Nav not found in $file"
        }
    }
}
