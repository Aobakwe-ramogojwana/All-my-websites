// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    generateQRCode();
    loadYearModules(1); // Default to Year 1 on load
    loadSimulatorApp('app1'); // Default to transit app
});

/* ==========================================================================
   1. 3D CARD TILT & GLARE EFFECT
   ========================================================================== */
const card = document.getElementById("business-card-3d");

if (card) {
    card.addEventListener("mousemove", (e) => {
        if (card.classList.contains("flipped")) return; // Disable tilt when flipped
        
        const cardRect = card.getBoundingClientRect();
        
        // Mouse coordinate offsets relative to center of card
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        const mouseX = e.clientX - cardRect.left - cardWidth / 2;
        const mouseY = e.clientY - cardRect.top - cardHeight / 2;
        
        // Calculate tilt angles (max tilt of 15 degrees)
        const tiltX = (mouseY / (cardHeight / 2)) * -15;
        const tiltY = (mouseX / (cardWidth / 2)) * 15;
        
        // Glare gradient positioning
        const glareX = ((e.clientX - cardRect.left) / cardWidth) * 100;
        const glareY = ((e.clientY - cardRect.top) / cardHeight) * 100;
        
        // Apply transform styling
        card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
        
        // Apply glare glow styling
        const frontGlint = card.querySelector(".card-front .card-hologram");
        if (frontGlint) {
            frontGlint.style.backgroundPosition = `${glareX}% ${glareY}%`;
            frontGlint.style.opacity = 1;
        }
    });

    card.addEventListener("mouseleave", () => {
        // Reset card back to flat state slowly
        card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        const frontGlint = card.querySelector(".card-front .card-hologram");
        if (frontGlint) {
            frontGlint.style.backgroundPosition = "0% 0%";
            frontGlint.style.opacity = 0.5;
        }
    });
}

// Flip buttons triggers
const flipBtnFront = document.getElementById("flip-btn-front");
const flipBtnBack = document.getElementById("flip-btn-back");

if (flipBtnFront && flipBtnBack) {
    flipBtnFront.addEventListener("click", () => {
        card.classList.toggle("flipped");
    });
    
    flipBtnBack.addEventListener("click", () => {
        card.classList.remove("flipped");
    });
}

/* ==========================================================================
   2. QR CODE GENERATOR INTEGRATION
   ========================================================================== */
function generateQRCode() {
    const qrImg = document.getElementById("portfolio-qr");
    if (qrImg) {
        // Points to current window location, fallback to github page
        const currentUrl = window.location.origin === "null" || window.location.origin === "file://" 
            ? "https://aobakwe-ramogojwana.github.io" 
            : window.location.href;
        
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}&color=080810&bgcolor=FFFFFF`;
    }
}

/* ==========================================================================
   3. ACADEMIC DATA & "LAYMAN'S TRANSLATOR" ENGINE
   ========================================================================== */
const transcriptData = {
    // YEAR 1
    1: [
        {
            code: "CSE103",
            name: "Systems Development",
            semester: "Sem 2",
            mark: 57,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Covers systems analysis methodologies, planning pipelines, and architectural design phases.",
            value: "Builds a reliable architectural blueprint for software before coders write a single line, saving the business from costly code rewrites or project delays."
        },
        {
            code: "CSE105",
            name: "Web and Multimedia Development",
            semester: "Sem 2",
            mark: 55,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Core front-end web engineering, layouts, multimedia responsive coding, and asset optimization.",
            value: "Creates visually stunning and optimized web platforms that load lightning-fast, boosting user search engine visibility and conversion rates."
        },
        {
            code: "MT105",
            name: "Computer Programming",
            semester: "Sem 2",
            mark: 44,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Logic models, loops, functional decomposition, object-oriented concepts, and computational theory.",
            value: "Ensures custom application source code is written to industry-grade standards—structured, efficient, and easy for teams to extend and maintain."
        },
        {
            code: "CSE104",
            name: "Computer Related Math & Stats",
            semester: "Sem 1",
            mark: 53,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Discrete logic structures, graph theory, probability matrices, and statistical distributions.",
            value: "Equips the engineer to write smart backend data logic, calculate complex app metrics, and run deep user demographic analysis."
        },
        {
            code: "MT102",
            name: "Mobile Development Environments",
            semester: "Sem 1",
            mark: 54,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "IDEs, emulator configs, build tools (Gradle, CMake), and mobile deployment tools.",
            value: "Saves setup and developer tooling time, enabling rapid deployment of mobile builds to production servers or app stores."
        },
        {
            code: "MT101",
            name: "Introduction to Mobile Technology",
            semester: "Sem 1",
            mark: 47,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Overview of telecommunication standards, hardware restrictions, and mobile infrastructure protocols.",
            value: "Provides the underlying architectural context of cell towers, low battery states, and cellular protocols to make apps work smoothly anywhere."
        }
    ],
    // YEAR 2
    2: [
        {
            code: "MT204",
            name: "Advanced Mobile Application Dev",
            semester: "Sem 2",
            mark: 71,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Heavy Android engineering, custom UI thread handling, databases (Room/SQLite), background tasks, and API sync.",
            value: "Enables heavy-duty app functions (like working offline, auto-saving forms, and silent background cloud syncing) without draining the user's battery."
        },
        {
            code: "MT203",
            name: "Cross Platform Mobile Dev",
            semester: "Sem 1",
            mark: 55,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Dual-deployment frameworks (Flutter/React Native) utilizing a single compiled code repository.",
            value: "Cuts corporate development costs by 50%. Deploys beautiful, synchronized iOS and Android applications simultaneously using one codebase."
        },
        {
            code: "CSE201",
            name: "Database Design & Development",
            semester: "Sem 1",
            mark: 54,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Relational database models, indexing, transaction controls, complex queries, and SQL query optimizations.",
            value: "Prevents databases from slowing down when thousands of users query records at once, ensuring reliable server operations."
        },
        {
            code: "CSE206",
            name: "Research and Innovation",
            semester: "Sem 2",
            mark: 52,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Writing tech reviews, market-fit analysis, competitive intelligence, and intellectual property paths.",
            value: "Ensures software designs solve real market needs, allowing businesses to pivot quickly based on user telemetry and market research."
        },
        {
            code: "MT202",
            name: "Computer Networks",
            semester: "Sem 2",
            mark: 45,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "TCP/IP routing, socket communication, DNS management, and local/wide area network layout configs.",
            value: "Understands how routers and servers transfer data, enabling low-latency data fetching and secure API endpoint connections."
        },
        {
            code: "MT201",
            name: "Mobile Application Development",
            semester: "Sem 1",
            mark: 41,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Basic mobile design patterns, MVC/MVVM layouts, and local mobile file storage handling.",
            value: "Establishes clean separation of UI and logic, ensuring the frontend interface loads smoothly even on low-cost devices."
        }
    ],
    // YEAR 3
    3: [
        {
            code: "BI303",
            name: "Industry Attachment",
            semester: "Sem 2",
            mark: 67,
            credits: "60 Cr",
            outcome: "Pass",
            desc: "Commercial job placement. Practical engineering in developer environments.",
            value: "Provides real-world commercial experience, demonstrating the ability to collaborate in teams, meet product deadlines, and deploy enterprise-level code."
        },
        {
            code: "MT305",
            name: "Enterprise Mobile App Dev Management",
            semester: "Sem 1",
            mark: 47,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Agile methodologies, sprint cycles, task trackers, test-driven dev, and CI/CD pipelines.",
            value: "Maintains clear project progress under tight sprint deadlines, ensuring high software quality and steady product deliveries."
        },
        {
            code: "MT302",
            name: "Modeling & Simulation of Mobile Networks",
            semester: "Sem 1",
            mark: 48,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Queue theory, network congestion simulations, bandwidth optimization strategies, and latency testing.",
            value: "Optimizes network payload size. Ensures the application handles unstable internet connections and poor 3G/4G signals without freezing."
        },
        {
            code: "MT304",
            name: "Mobile and Web Security",
            semester: "Sem 1",
            mark: 46,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "E2E Encryption protocols, OAuth2 authentication, SQL injections prevention, and cross-site scripting guards.",
            value: "Protects sensitive customer credentials and payment histories from hackers, keeping the business compliant and secure against breaches."
        }
    ],
    // YEAR 4
    4: [
        {
            code: "CET371",
            name: "Mobile App Development Technologies",
            semester: "Sem 2",
            mark: 87,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Advanced mobile state management, offline database synchronization, custom native plugin bindings, and reactive programming architectures.",
            value: "Accelerates app feature additions using the latest high-performance rendering engines. (Aobakwe scored a stellar 87% in this module, proving core technical dominance!)"
        },
        {
            code: "CET351",
            name: "Research",
            semester: "Sem 1",
            mark: 83,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Detailed scientific engineering thesis, algorithmic performance benchmarks, and empirical data collection.",
            value: "Shows strong technical writing and deep problem-solving skills, allowing the engineer to solve complex performance issues and design custom algorithms."
        },
        {
            code: "CET303",
            name: "Telecommunications",
            semester: "Sem 1",
            mark: 70,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "RF engineering, signal-to-noise ratios, satellite link metrics, cellular handover protocols, and modern 5G layers.",
            value: "Understands low-level telecommunication pipes, enabling optimization of app socket streams for fast transfers over cellular networks."
        },
        {
            code: "CET343",
            name: "Android Mobile Development",
            semester: "Sem 1",
            mark: 64,
            credits: "20 Cr",
            outcome: "Pass",
            desc: "Native Kotlin, service binders, custom views, hardware sensor access, and system-level event hooks.",
            value: "Enables direct, native hardware communication (Bluetooth, sensors, GPS), delivering maximum device speed and native system integrations."
        },
        {
            code: "CET333",
            name: "Product Development",
            semester: "Sem 2",
            mark: "Enrolled",
            credits: "20 Cr",
            outcome: "Active",
            desc: "SaaS business scaling, product monetization strategies, user retention analytics, and go-to-market pipelines.",
            value: "Aligns code architecture with business goals, developing features that drive revenue, attract investments, and boost customer retention."
        },
        {
            code: "CET308",
            name: "User Experience Design",
            semester: "Sem 2",
            mark: "Enrolled",
            credits: "20 Cr",
            outcome: "Active",
            desc: "User journey map diagnostics, layout testing, typography principles, accessibility, and high-fidelity mockups.",
            value: "Designs gorgeous, thumb-friendly screens that prevent user frustration, reduce checkout abandoned rates, and maximize usability."
        }
    ]
};

// Handle Tab Navigation Click
const tabButtons = document.querySelectorAll(".tab-btn");
tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const year = parseInt(btn.getAttribute("data-year"));
        loadYearModules(year);
    });
});

// Render modules under selected academic year
function loadYearModules(year) {
    const container = document.getElementById("modules-container");
    if (!container) return;
    
    container.innerHTML = "";
    const modules = transcriptData[year];
    
    modules.forEach((mod, index) => {
        const isEnrolled = mod.mark === "Enrolled";
        
        // Badge color logic - Hides raw numerical grades to focus on outcome states
        let badgeClass = "";
        let gradeDisplay = "";
        if (isEnrolled) {
            gradeDisplay = "Enrolled";
        } else {
            if (mod.mark >= 80) {
                badgeClass = "platinum";
                gradeDisplay = "Distinction";
            } else {
                badgeClass = "gold";
                gradeDisplay = "Passed";
            }
        }
        
        const cardHtml = `
            <div class="module-card" data-code="${mod.code}" onclick="selectModule(this, ${year}, ${index})">
                <div class="module-top">
                    <span class="module-code">${mod.code}</span>
                    <div class="module-grade">
                        <span class="grade-val ${badgeClass}">${gradeDisplay}</span>
                        <span class="grade-lbl">${isEnrolled ? "status" : "grade"}</span>
                    </div>
                </div>
                <h3 class="module-name">${mod.name}</h3>
                <div class="module-meta">
                    <span class="meta-item"><i data-lucide="clock"></i> ${mod.semester}</span>
                    <span class="meta-item"><i data-lucide="award"></i> ${mod.credits}</span>
                </div>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", cardHtml);
    });
    
    // Auto-select first module of the loaded year to show decoder immediately
    lucide.createIcons();
    const firstCard = container.querySelector(".module-card");
    if (firstCard) {
        firstCard.click();
    }
}

// Module select callback to update Layman's Decoder Panel
function selectModule(cardElem, year, index) {
    // Reset selected styles
    const allCards = document.querySelectorAll(".module-card");
    allCards.forEach(c => c.classList.remove("selected"));
    
    // Highlight clicked card
    cardElem.classList.add("selected");
    
    const mod = transcriptData[year][index];
    
    const decName = document.getElementById("decoder-module-name");
    const decDesc = document.getElementById("decoder-module-desc");
    const decValBox = document.getElementById("decoder-value-box");
    const decValue = document.getElementById("decoder-module-value");
    
    if (decName && decDesc && decValue && decValBox) {
        decName.innerText = `${mod.code}: ${mod.name}`;
        decDesc.innerText = mod.desc;
        decValue.innerText = mod.value;
        decValBox.style.display = "block";
    }
}

/* ==========================================================================
   4. INTERACTIVE PHONE SIMULATOR ENGINE
   ========================================================================== */
const simulatorApps = {
    app1: {
        title: "M-Botswana",
        subtitle: "Transit Navigation",
        icon: "navigation",
        features: ["Offline Cache", "GPS Handover", "Node Route Optimizations", "Latency Aware"],
        html: `
            <div class="sim-app-header">
                <div class="sim-app-title"><i data-lucide="navigation"></i> M-Botswana</div>
                <div class="sim-status-bar"><span>3G</span> <i data-lucide="battery"></i></div>
            </div>
            <div class="sim-app-content">
                <div class="sim-card">
                    <h4>Local Commute Assistant</h4>
                    <p>Designed to compute transport routes in Gaborone without mobile network data lags.</p>
                </div>
                <div class="sim-map-visual">
                    <div class="map-grid-lines"></div>
                    <div class="map-route-line"></div>
                    <div class="map-node node-start"></div>
                    <div class="map-node node-end"></div>
                    <div class="map-pulse-dot" id="sim-route-dot"></div>
                </div>
                <div class="sim-card">
                    <div class="sim-card-row">
                        <span>Terminal: <strong>Broadhurst</strong></span>
                        <span class="sim-badge active">Optimized</span>
                    </div>
                </div>
                <div class="sim-input-group">
                    <input type="text" class="sim-input" id="transit-input" placeholder="e.g. Fairgrounds to Main Mall" value="Plot 50661 to Moffat St">
                    <button class="sim-btn" onclick="runSimTransitSearch()">Map Route</button>
                </div>
                <div id="sim-transit-log" style="font-size:0.65rem; color:#00ffd5; line-height:1.2; font-family:monospace; margin-top:0.2rem; display:none;">
                    Analyzing local route metrics...<br>
                    Plotting cell handover coords...<br>
                    Success! Estimated travel: 12 mins.
                </div>
            </div>
        `
    },
    app2: {
        title: "MediLink Mobile",
        subtitle: "Healthcare Sync",
        icon: "activity",
        features: ["Low Energy Bluetooth", "JSON telemetry", "Local SQLite Caching", "Thread Isolation"],
        html: `
            <div class="sim-app-header">
                <div class="sim-app-title"><i data-lucide="activity"></i> MediLink</div>
                <div class="sim-status-bar"><span>BLE On</span> <i data-lucide="battery"></i></div>
            </div>
            <div class="sim-app-content">
                <div class="sim-card">
                    <h4>IoT Vital Monitor</h4>
                    <p>Retrieves physical IoT sensor datasets over Bluetooth Low Energy (BLE) and auto-saves telemetry records offline.</p>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem;">
                    <div class="sim-card" style="align-items:center;">
                        <span style="font-size:0.65rem; color:#646675;">Heart Rate</span>
                        <strong style="font-size:1.4rem; color:#00ffd5;" id="sim-vital-heart">72 <span style="font-size:0.65rem; color:#9ea0b0;">bpm</span></strong>
                    </div>
                    <div class="sim-card" style="align-items:center;">
                        <span style="font-size:0.65rem; color:#646675;">Temp</span>
                        <strong style="font-size:1.4rem; color:#ffbe3b;" id="sim-vital-temp">36.5 <span style="font-size:0.65rem; color:#9ea0b0;">°C</span></strong>
                    </div>
                </div>
                <div class="sim-card">
                    <div class="sim-card-row">
                        <span>Oxygen Level: <strong id="sim-vital-o2">98%</strong></span>
                        <span class="sim-badge active" style="background:rgba(0, 210, 255, 0.1); color:#00d2ff;">Syncing</span>
                    </div>
                </div>
                <button class="sim-btn" onclick="refreshSimTelemetry()" style="width:100%; display:flex; align-items:center; justify-content:center; gap:0.4rem;">
                    <i data-lucide="refresh-cw" style="width:12px; height:12px;"></i> Query Sensor Data
                </button>
            </div>
        `
    },
    app3: {
        title: "FinGuard Secure",
        subtitle: "Encrypted Wallet",
        icon: "bar-chart-2",
        features: ["256-bit AES encryption", "Fingerprint Auth hooks", "API Handshake Token", "No Logs Mode"],
        html: `
            <div class="sim-app-header">
                <div class="sim-app-title"><i data-lucide="shield-check"></i> FinGuard</div>
                <div class="sim-status-bar"><span>SSL Enforced</span> <i data-lucide="battery"></i></div>
            </div>
            <div class="sim-app-content">
                <div class="sim-card">
                    <h4>Encrypted Mobile Gateway</h4>
                    <p>Secures communication endpoints against man-in-the-middle hacks using cryptographic validation.</p>
                </div>
                <div class="sim-card">
                    <div class="sim-card-row" style="margin-bottom:0.4rem;">
                        <span style="font-size:0.75rem;">Account balance</span>
                        <span style="font-size:0.6rem; color:#ffbe3b;">Encrypted Mode</span>
                    </div>
                    <strong style="font-size:1.3rem; color:#fff;" id="sim-balance">BWP 18,450.00</strong>
                </div>
                <div class="sim-card">
                    <span style="font-size:0.65rem; color:#646675;">Transfer Endpoint:</span>
                    <code id="sim-crypt-string" style="font-size:0.6rem; background:#000; padding:0.3rem; border-radius:4px; margin-top:0.2rem; color:#00ffd5; overflow-x:hidden;">https://api.finguard.bw/v2/secure-gateway</code>
                </div>
                <button class="sim-btn" onclick="toggleSimEncryption(this)" style="width:100%; background:#ffbe3b; color:#000;">
                    Encrypt Network Stream
                </button>
            </div>
        `
    }
};

// Handle Simulator Project Selector Click
const simButtons = document.querySelectorAll(".project-sel-btn");
simButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        simButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const appId = btn.getAttribute("data-sim-app");
        loadSimulatorApp(appId);
    });
});

// Load App content inside Simulated Smartphone viewport
function loadSimulatorApp(appId) {
    const screenViewport = document.getElementById("phone-screen-viewport");
    const featuresList = document.getElementById("sim-features-list");
    
    if (!screenViewport || !featuresList) return;
    
    // Fade screen out briefly
    screenViewport.style.opacity = 0;
    
    setTimeout(() => {
        const app = simulatorApps[appId];
        screenViewport.innerHTML = app.html;
        
        // Load tags
        featuresList.innerHTML = "";
        app.features.forEach(feat => {
            featuresList.insertAdjacentHTML("beforeend", `<span class="feature-tag">${feat}</span>`);
        });
        
        // Re-trigger icon rendering inside the phone screen
        lucide.createIcons();
        
        // Fade back in
        screenViewport.style.opacity = 1;
    }, 200);
}

// App 1 Feature action: transit route search
function runSimTransitSearch() {
    const transitInput = document.getElementById("transit-input");
    const logBox = document.getElementById("sim-transit-log");
    const dot = document.getElementById("sim-route-dot");
    
    if (!logBox) return;
    
    logBox.style.display = "block";
    
    // Simulate dot animation reset
    if (dot) {
        dot.style.animation = "none";
        dot.offsetHeight; // Trigger reflow
        dot.style.animation = "simMoveDot 6s infinite linear";
    }
    
    setTimeout(() => {
        logBox.innerHTML += "<br>Handovers complete. Pinpoint match.";
    }, 2000);
}

// App 2 Feature action: refresh sensor vital metrics
function refreshSimTelemetry() {
    const hrVal = document.getElementById("sim-vital-heart");
    const tempVal = document.getElementById("sim-vital-temp");
    const o2Val = document.getElementById("sim-vital-o2");
    
    if (!hrVal || !tempVal || !o2Val) return;
    
    hrVal.innerText = "Querying...";
    tempVal.innerText = "Querying...";
    
    setTimeout(() => {
        // Randomize mock telemetry within safe bio thresholds
        const randomHr = Math.floor(Math.random() * (90 - 68 + 1)) + 68;
        const randomTemp = (Math.random() * (37.2 - 36.1) + 36.1).toFixed(1);
        const randomO2 = Math.floor(Math.random() * (100 - 97 + 1)) + 97;
        
        hrVal.innerHTML = `${randomHr} <span style="font-size:0.65rem; color:#9ea0b0;">bpm</span>`;
        tempVal.innerHTML = `${randomTemp} <span style="font-size:0.65rem; color:#9ea0b0;">°C</span>`;
        o2Val.innerHTML = `${randomO2}%`;
    }, 1000);
}

// App 3 Feature action: Encrypt transmission stream
let isStreamEncrypted = false;
function toggleSimEncryption(btnElem) {
    const balanceVal = document.getElementById("sim-balance");
    const apiCode = document.getElementById("sim-crypt-string");
    
    if (!balanceVal || !apiCode || !btnElem) return;
    
    if (!isStreamEncrypted) {
        // Encrypting transition animation
        let counter = 0;
        const interval = setInterval(() => {
            apiCode.innerText = Math.random().toString(36).substring(2, 18).toUpperCase();
            counter++;
            if (counter > 8) {
                clearInterval(interval);
                apiCode.innerText = "AES-256::C48A10EE4B9B88019C304D1";
                balanceVal.innerText = "•••••••••••••";
                btnElem.innerText = "Decrypt Network Stream";
                btnElem.style.background = "#00d2ff";
                isStreamEncrypted = true;
            }
        }, 100);
    } else {
        apiCode.innerText = "https://api.finguard.bw/v2/secure-gateway";
        balanceVal.innerText = "BWP 18,450.00";
        btnElem.innerText = "Encrypt Network Stream";
        btnElem.style.background = "#ffbe3b";
        isStreamEncrypted = false;
    }
}

/* ==========================================================================
   5. EMAIL TRANSIT FORM HANDLER
   ========================================================================== */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById("contact-form");
    const successMsg = document.getElementById("form-success");
    
    if (form && successMsg) {
        form.style.opacity = 0.3;
        form.querySelectorAll("input, textarea, button").forEach(elem => elem.disabled = true);
        
        setTimeout(() => {
            form.style.display = "none";
            successMsg.style.display = "flex";
            lucide.createIcons();
        }, 1200);
    }
}

/* ==========================================================================
   6. PDF RESUME / CV EXPORTER UTIL
   ========================================================================== */
function printResume() {
    // Media stylesheet will hide standard layouts and format print-resume-layout nicely
    window.print();
}
