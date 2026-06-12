/* =============================================
   DK Portfolio — Gen AI Engineer Edition
   script.js — Complete Interactive JS
   ============================================= */

(function () {
    'use strict';

    /* --------------------------------------------------
       1. SCROLL PROGRESS
    -------------------------------------------------- */
    const scrollBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        scrollBar.style.width = pct + '%';
    }, { passive: true });

    /* --------------------------------------------------
       2. NAVBAR
    -------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navAnchors = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navAnchors.forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active nav highlight
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
                });
            }
        });
    }, { threshold: 0.4, rootMargin: '-64px 0px 0px 0px' });
    sections.forEach(s => obs.observe(s));

    /* --------------------------------------------------
       3. CUSTOM CURSOR
    -------------------------------------------------- */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let cx = -100, cy = -100, ox = -100, oy = -100;

    document.addEventListener('mousemove', e => {
        cx = e.clientX; cy = e.clientY;
        cursorDot.style.left = cx + 'px';
        cursorDot.style.top = cy + 'px';
    });

    function animateCursor() {
        ox += (cx - ox) * 0.12;
        oy += (cy - oy) * 0.12;
        cursorOutline.style.left = ox + 'px';
        cursorOutline.style.top = oy + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .tilt-card, input, textarea, select, .chip, .pf-btn, .skill-pills span').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });

    /* --------------------------------------------------
       4. FADE IN ON SCROLL
    -------------------------------------------------- */
    const fadeObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                fadeObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

    /* --------------------------------------------------
       5. TILT EFFECT
    -------------------------------------------------- */
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx_ = rect.width / 2;
            const cy_ = rect.height / 2;
            const rotX = ((y - cy_) / cy_) * -8;
            const rotY = ((x - cx_) / cx_) * 8;
            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* --------------------------------------------------
       6. HERO — Typewriter Roles
    -------------------------------------------------- */
    const roles = [
        'Generative AI Engineer',
        'LLM Systems Architect',
        'RAG Pipeline Specialist',
        'Multi-Agent Developer',
        'Data Scientist',
    ];
    const roleEl = document.getElementById('dynamic-role');
    let rIdx = 0, charIdx = 0, deleting = false;

    function typeRole() {
        const role = roles[rIdx];
        if (!deleting) {
            roleEl.textContent = role.slice(0, charIdx++);
            if (charIdx > role.length) {
                deleting = true;
                setTimeout(typeRole, 2200);
                return;
            }
        } else {
            roleEl.textContent = role.slice(0, charIdx--);
            if (charIdx < 0) {
                deleting = false;
                rIdx = (rIdx + 1) % roles.length;
                setTimeout(typeRole, 400);
                return;
            }
        }
        setTimeout(typeRole, deleting ? 35 : 70);
    }
    typeRole();

    /* --------------------------------------------------
       7. THREE.JS PARTICLE CONSTELLATION
    -------------------------------------------------- */
    if (typeof THREE !== 'undefined') {
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Shapes
        const COUNT = 1500;
        const positions = new Float32Array(COUNT * 3);
        const targets = new Float32Array(COUNT * 3);

        function setShapeTargets(shape) {
            for (let i = 0; i < COUNT; i++) {
                const i3 = i * 3;
                let x, y, z;
                if (shape === 'brain') {
                    const t = (i / COUNT) * Math.PI * 20;
                    const r = 1.5 + 0.5 * Math.sin(t * 0.3);
                    x = r * Math.cos(t) + (Math.random() - 0.5) * 0.8;
                    y = r * Math.sin(t * 0.7) + (Math.random() - 0.5) * 0.8;
                    z = (Math.random() - 0.5) * 2;
                } else if (shape === 'helix') {
                    const t = (i / COUNT) * Math.PI * 12;
                    const strand = i % 2 === 0 ? 0 : Math.PI;
                    x = Math.cos(t + strand) * 1.5;
                    y = (t / (Math.PI * 12)) * 6 - 3;
                    z = Math.sin(t + strand) * 1.5;
                } else if (shape === 'sphere') {
                    const phi = Math.acos(1 - 2 * (i / COUNT));
                    const theta = Math.sqrt(COUNT * Math.PI) * phi;
                    x = 2.5 * Math.sin(phi) * Math.cos(theta);
                    y = 2.5 * Math.sin(phi) * Math.sin(theta);
                    z = 2.5 * Math.cos(phi);
                } else if (shape === 'matrix') {
                    const col = (i % 30) - 15;
                    const row = Math.floor(i / 30);
                    x = col * 0.2;
                    y = 2 - (row / (COUNT / 30)) * 4;
                    z = (Math.random() - 0.5) * 1.5;
                } else { // torus
                    const u = (i / COUNT) * Math.PI * 2;
                    const v = ((i * 7) % COUNT / COUNT) * Math.PI * 2;
                    const R = 2, r_ = 0.8;
                    x = (R + r_ * Math.cos(v)) * Math.cos(u);
                    y = (R + r_ * Math.cos(v)) * Math.sin(u);
                    z = r_ * Math.sin(v);
                }
                targets[i3] = x; targets[i3 + 1] = y; targets[i3 + 2] = z;
            }
        }

        // Init positions randomly
        for (let i = 0; i < COUNT * 3; i++) positions[i] = (Math.random() - 0.5) * 8;
        setShapeTargets('brain');

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.025,
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.75,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Scroll-based shape morphing
        const shapeMap = { home: 'brain', about: 'helix', experience: 'sphere', skills: 'matrix', projects: 'sphere', certifications: 'torus', contact: 'torus' };
        let currentShape = 'brain';

        const shapeObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const shape = shapeMap[e.target.id] || 'sphere';
                    if (shape !== currentShape) {
                        currentShape = shape;
                        setShapeTargets(shape);
                        const colors = { brain: 0x3b82f6, helix: 0xa855f7, sphere: 0x22d3ee, matrix: 0x10b981, torus: 0xec4899 };
                        material.color.setHex(colors[shape] || 0x3b82f6);
                    }
                }
            });
        }, { threshold: 0.3 });
        sections.forEach(s => shapeObserver.observe(s));

        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.003;
            const pos = geometry.attributes.position.array;
            for (let i = 0; i < COUNT * 3; i++) {
                pos[i] += (targets[i] - pos[i]) * 0.02;
            }
            geometry.attributes.position.needsUpdate = true;
            particles.rotation.y = time * 0.3;
            particles.rotation.x = Math.sin(time * 0.2) * 0.15;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /* --------------------------------------------------
       8. MATRIX RAIN CANVAS
    -------------------------------------------------- */
    const matCanvas = document.getElementById('matrix-canvas');
    const matCtx = matCanvas.getContext('2d');
    matCanvas.width = window.innerWidth;
    matCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        matCanvas.width = window.innerWidth;
        matCanvas.height = window.innerHeight;
    });

    const chars = '01アイウエオカキクケコ█▓░←→↑↓∞∑∫◆◇'.split('');
    const cols = Math.floor(matCanvas.width / 14);
    const drops = Array(cols).fill(1);

    setInterval(() => {
        matCtx.fillStyle = 'rgba(3,7,18,0.07)';
        matCtx.fillRect(0, 0, matCanvas.width, matCanvas.height);
        matCtx.fillStyle = 'rgba(34, 211, 238, 0.7)';
        matCtx.font = '11px JetBrains Mono, monospace';
        drops.forEach((y, x) => {
            const c = chars[Math.floor(Math.random() * chars.length)];
            matCtx.fillText(c, x * 14, y * 14);
            if (y * 14 > matCanvas.height && Math.random() > 0.975) drops[x] = 0;
            drops[x]++;
        });
    }, 60);

    /* --------------------------------------------------
       9. DEVELOPER TERMINAL
    -------------------------------------------------- */
    const termOutput = document.getElementById('terminal-output');
    const termInput = document.getElementById('terminal-input');
    const history = [];
    let hIndex = -1;

    const commands = {
        help() {
            return [
                '  <span class="t-cmd">whoami</span>      → Darshanikanta Behera — Gen AI Engineer',
                '  <span class="t-cmd">skills</span>      → Core technical skill set',
                '  <span class="t-cmd">projects</span>    → Featured projects list',
                '  <span class="t-cmd">experience</span>  → Work history',
                '  <span class="t-cmd">contact</span>     → Contact information',
                '  <span class="t-cmd">clear</span>       → Clear terminal',
                '  <span class="t-cmd">status</span>      → System / career status',
                '  <span class="t-cmd">hire</span>        → Scroll to contact form',
            ];
        },
        whoami: () => ['Darshanikanta Behera', 'Gen AI Engineer @ Clinion, Hyderabad', 'B.Sc. IT & Management · Fakir Mohan University'],
        skills: () => ['[ AI/ML ] OpenAI SDK · LangChain · RAG · FAISS · Multi-Agent', '[ Data  ] Pandas · NumPy · Scikit-Learn · Power BI', '[ Code  ] Python · FastAPI · MySQL · Docker · Streamlit'],
        projects: () => ['→ Multi-Agent QA Bot (Clinion)', '→ Clinical Protocol Intelligence (Clinion)', '→ Mental Health Detection NLP (GitHub)', '→ RAG Q&A System — LangChain + Gemini', '→ CSV Chat Assistant — Streamlit Live'],
        experience: () => ['Dec 2025–Present · Generative AI Intern @ Clinion', 'Mar–Dec 2025   · Data Science Mentor @ Naresh iT', 'Jul–Sep 2025   · AI Trainee @ Infosys'],
        contact: () => ['Email:    darshanikanta@gmail.com', 'Phone:    +91 7894191488', 'LinkedIn: linkedin.com/in/darshanikanta', 'GitHub:   github.com/Darshanikant'],
        status: () => [
            '┌─ CAREER STATUS ───────────────────────────────────┐',
            '│  Role    : Generative AI Intern @ Clinion          │',
            '│  Open To : Senior AI Eng / MLE roles              │',
            '│  Focus   : RAG, Agents, Clinical AI               │',
            '└───────────────────────────────────────────────────┘',
        ],
        clear: () => { termOutput.innerHTML = '<div class="t-line t-system">Terminal cleared.</div>'; return null; },
        hire: () => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            return ['Scrolling to contact form...'];
        },
    };

    function addLine(html, cls = '') {
        const d = document.createElement('div');
        d.className = 't-line' + (cls ? ' ' + cls : '');
        d.innerHTML = html;
        termOutput.appendChild(d);
        termOutput.scrollTop = termOutput.scrollHeight;
    }

    function runCommand(raw) {
        const cmd = raw.trim().toLowerCase();
        addLine(`<span class="tp-user">darshani</span><span class="tp-sep">@</span><span class="tp-host">ai</span><span class="tp-path"> ~</span><span class="tp-arrow"> ❯</span> ${raw}`);
        if (!cmd) return;

        if (commands[cmd]) {
            const out = commands[cmd]();
            if (out) out.forEach(l => addLine(l, 't-out'));
        } else {
            addLine(`bash: ${cmd}: command not found. Type <span class="t-cmd">help</span>`, 't-err');
        }
    }

    if (termInput) {
        termInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const val = termInput.value;
                history.unshift(val);
                hIndex = -1;
                termInput.value = '';
                runCommand(val);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                hIndex = Math.min(hIndex + 1, history.length - 1);
                termInput.value = history[hIndex] || '';
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                hIndex = Math.max(hIndex - 1, -1);
                termInput.value = hIndex >= 0 ? history[hIndex] : '';
            }
        });
    }

    /* --------------------------------------------------
       10. ML SIMULATOR
    -------------------------------------------------- */
    const simCanvas = document.getElementById('sim-canvas');
    const simLog = document.getElementById('sim-console');
    const btnTrain = document.getElementById('btn-train');
    const btnReset = document.getElementById('btn-reset');
    const metricLoss = document.getElementById('metric-loss');
    const metricAcc = document.getElementById('metric-accuracy');
    const lrSlider = document.getElementById('lr-slider');
    const lrVal = document.getElementById('lr-val');
    const epochsSlider = document.getElementById('epochs-slider');
    const epochsVal = document.getElementById('epochs-val');
    const modelSelect = document.getElementById('model-select');

    if (simCanvas) {
        const ctx = simCanvas.getContext('2d');
        const W = simCanvas.width, H = simCanvas.height;
        let animFrame = null;
        let points = [];
        let epoch = 0;
        let training = false;

        if (lrSlider) lrSlider.addEventListener('input', () => { lrVal.textContent = lrSlider.value; });
        if (epochsSlider) epochsSlider.addEventListener('input', () => { epochsVal.textContent = epochsSlider.value; });

        function genPoints(n = 60) {
            points = [];
            for (let i = 0; i < n; i++) {
                const cls = i < n / 2 ? 0 : 1;
                const cx_ = cls === 0 ? 0.28 : 0.72;
                const cy_ = 0.5 + (Math.random() - 0.5) * 0.3;
                const r = 0.1 + Math.random() * 0.12;
                const a = Math.random() * Math.PI * 2;
                points.push({ x: cx_ + r * Math.cos(a), y: cy_ + r * Math.sin(a), cls });
            }
        }

        function drawDecisionBoundary(loss) {
            const imageData = ctx.createImageData(W, H);
            const data = imageData.data;
            const noise = Math.max(0, loss) * 60;
            const boundary = 0.5 + (Math.random() - 0.5) * noise * 0.01;

            for (let py = 0; py < H; py++) {
                for (let px = 0; px < W; px++) {
                    const nx = px / W;
                    const ny = py / H;
                    const jitter = (Math.random() - 0.5) * noise * 0.005;
                    const inClass0 = nx < boundary + jitter + ny * 0.05 - 0.025;
                    const alpha = 22;
                    const idx = (py * W + px) * 4;
                    if (inClass0) {
                        data[idx] = 59; data[idx + 1] = 130; data[idx + 2] = 246; data[idx + 3] = alpha;
                    } else {
                        data[idx] = 168; data[idx + 1] = 85; data[idx + 2] = 247; data[idx + 3] = alpha;
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }

        function drawPoints() {
            points.forEach(p => {
                const px = p.x * W, py = p.y * H;
                ctx.beginPath();
                ctx.arc(px, py, 5, 0, Math.PI * 2);
                ctx.fillStyle = p.cls === 0 ? '#3b82f6' : '#a855f7';
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.cls === 0 ? '#3b82f6' : '#a855f7';
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 1.2;
                ctx.stroke();
            });
        }

        function drawAxes() {
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 1;
            for (let i = 1; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(i * W / 4, 0); ctx.lineTo(i * W / 4, H);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * H / 4); ctx.lineTo(W, i * H / 4);
                ctx.stroke();
            }
        }

        function logSim(text, cls = '') {
            const d = document.createElement('div');
            d.className = 'log-line' + (cls ? ' ' + cls : '');
            d.textContent = text;
            simLog.appendChild(d);
            simLog.scrollTop = simLog.scrollHeight;
        }

        function drawFrame(loss) {
            ctx.clearRect(0, 0, W, H);
            drawDecisionBoundary(loss);
            drawAxes();
            drawPoints();
        }

        function startTraining() {
            if (training) return;
            training = true;
            epoch = 0;
            cancelAnimationFrame(animFrame);
            genPoints(70);

            const maxEpochs = parseInt(epochsSlider ? epochsSlider.value : 100);
            const lr = parseFloat(lrSlider ? lrSlider.value : 0.05);
            const model = modelSelect ? modelSelect.value : 'neural-net';

            simLog.innerHTML = '';
            logSim(`// Training ${model} — lr=${lr} epochs=${maxEpochs}`);

            const startLoss = 2.8 + Math.random() * 0.5;
            const minLoss = 0.04 + Math.random() * 0.08;

            function step() {
                if (epoch >= maxEpochs) {
                    training = false;
                    const finalLoss = minLoss.toFixed(4);
                    const finalAcc = (94 + Math.random() * 4).toFixed(1);
                    logSim(`✓ Training complete — loss: ${finalLoss} acc: ${finalAcc}%`, 'log-success');
                    if (metricLoss) metricLoss.textContent = finalLoss;
                    if (metricAcc) metricAcc.textContent = finalAcc + '%';
                    return;
                }

                const progress = epoch / maxEpochs;
                const decay = Math.pow(1 - progress, 1.8);
                const loss = minLoss + (startLoss - minLoss) * decay + (Math.random() - 0.5) * 0.05 * (1 - progress);
                const acc = (50 + (50 - 8) * (1 - decay) + (Math.random() - 0.5) * 2 * (1 - progress)).toFixed(1);

                drawFrame(loss * 5);
                if (metricLoss) metricLoss.textContent = loss.toFixed(4);
                if (metricAcc) metricAcc.textContent = acc + '%';

                if (epoch % 20 === 0) logSim(`epoch ${epoch} — loss: ${loss.toFixed(4)} acc: ${acc}%`);
                epoch++;
                animFrame = requestAnimationFrame(step);
            }
            step();
        }

        function resetSim() {
            training = false;
            cancelAnimationFrame(animFrame);
            epoch = 0;
            genPoints(60);
            drawFrame(999);
            if (metricLoss) metricLoss.textContent = '—';
            if (metricAcc) metricAcc.textContent = '—';
            simLog.innerHTML = '<div class="log-line">// reset — ready to train</div>';
        }

        if (btnTrain) btnTrain.addEventListener('click', startTraining);
        if (btnReset) btnReset.addEventListener('click', resetSim);

        genPoints(60);
        drawFrame(999);
    }

    /* --------------------------------------------------
       11. PROJECT FILTER
    -------------------------------------------------- */
    const pfBtns = document.querySelectorAll('.pf-btn');
    const projCards = document.querySelectorAll('.proj-card');

    pfBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pfBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projCards.forEach(card => {
                const cat = card.dataset.category;
                const show = filter === 'all' || cat === filter;
                card.style.opacity = show ? '1' : '0.25';
                card.style.pointerEvents = show ? 'auto' : 'none';
                card.style.transform = show ? '' : 'scale(0.97)';
            });
        });
    });

    /* --------------------------------------------------
       12. AI CHATBOT
    -------------------------------------------------- */
    const chatTrigger = document.getElementById('chat-trigger');
    const chatContainer = document.getElementById('chat-container');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chipBtns = document.querySelectorAll('.chip');

    const KB = {
        greeting: ['Hi! I\'m Darshani\'s AI clone. Ask me about skills, projects, experience.'],
        name: ['I\'m Darshanikanta Behera — a Generative AI Engineer & Data Scientist based in Hyderabad, India.'],
        experience: ['I\'m currently a Gen AI Intern at Clinion, building multi-agent QA systems and RAG pipelines for clinical documents. I also worked as a Data Science Mentor at Naresh iTechnologies, mentoring 50+ students, and as an AI Trainee at Infosys.'],
        clinion: ['At Clinion, I\'m building a multi-agent QA platform using OpenAI Agents SDK. The system handles clinical document ingestion, semantic retrieval via vector stores, and automated eCRF extraction from trial protocols.'],
        skills: ['My core stack: OpenAI Agents SDK, LangChain, RAG pipelines, FAISS vector databases, Multi-Agent Systems, Python, Scikit-Learn, TensorFlow, Power BI, Streamlit, FastAPI, MySQL.'],
        projects: ['Key projects: ① Multi-Agent QA Bot (Clinion) ② Clinical Protocol Intelligence (RAG-based) ③ Mental Health Detection NLP (86% accuracy) ④ RAG Q&A System with Gemini+LangChain ⑤ CSV Chat Assistant (live on Streamlit)'],
        rag: ['I\'ve built RAG systems using LangChain + FAISS + Gemini API. The pipeline handles PDF ingestion, recursive text splitting, embedding generation, vector store indexing, and semantic retrieval for QA over documents.'],
        agents: ['I use the OpenAI Agents SDK to build multi-agent workflows with tool calling, file search, and autonomous decision-making for clinical document processing at Clinion.'],
        education: ['B.Sc. in Information Technology & Management from Fakir Mohan University, Balasore (2021–2024). I also hold certifications from Oracle (Gen AI), Infosys (NLP, Prompt Engineering), and Microsoft (Data Science).'],
        contact: ['📧 Email: darshanikanta@gmail.com\n📱 Phone: +91 7894191488\n🔗 LinkedIn: linkedin.com/in/darshanikanta\n🐙 GitHub: github.com/Darshanikant'],
        resume: ['Sure! Triggering resume download now...', '__download__'],
        hire: ['I\'m open to Gen AI Engineering and ML Engineer roles. Let me scroll you to the contact form!', '__contact__'],
    };

    function matchKB(q) {
        const lq = q.toLowerCase();
        if (/\b(hi|hello|hey|hiya)\b/.test(lq)) return KB.greeting;
        if (/\b(name|who|introduce)\b/.test(lq)) return KB.name;
        if (/clinion/i.test(lq)) return KB.clinion;
        if (/\b(rag|retrieval|langchain|faiss|vector)\b/i.test(lq)) return KB.rag;
        if (/\b(agent|multi.?agent|sdk)\b/i.test(lq)) return KB.agents;
        if (/\b(skill|stack|tech|know|use|tool)\b/.test(lq)) return KB.skills;
        if (/\b(project|work|build|made|created)\b/.test(lq)) return KB.projects;
        if (/\b(experience|history|role|job|intern)\b/.test(lq)) return KB.experience;
        if (/\b(edu|degree|study|university|college|cert)\b/.test(lq)) return KB.education;
        if (/\b(contact|email|phone|reach|linkedin|github)\b/.test(lq)) return KB.contact;
        if (/\b(resume|cv|download)\b/.test(lq)) return KB.resume;
        if (/\b(hire|recruit|available|opportunity|job)\b/.test(lq)) return KB.hire;
        return ['I can answer questions about skills, projects, experience, contact info, or you can say "download resume". Try one of the quick chips below!'];
    }

    function addChatMsg(text, type) {
        const div = document.createElement('div');
        div.className = 'chat-msg ' + (type === 'user' ? 'user-msg' : 'bot-msg');
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (type === 'bot') {
            let idx = 0;
            const interval = setInterval(() => {
                div.textContent = text.slice(0, idx++);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                if (idx > text.length) clearInterval(interval);
            }, 18);
        } else {
            div.textContent = text;
        }
    }

    function handleChat(query) {
        addChatMsg(query, 'user');
        setTimeout(() => {
            const responses = matchKB(query);
            const text = responses[0];
            addChatMsg(text, 'bot');
            if (responses.includes('__download__')) {
                setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = "Darshanikanta's Resume.pdf";
                    a.download = "Darshanikanta_Resume.pdf";
                    a.click();
                }, 1000);
            }
            if (responses.includes('__contact__')) {
                setTimeout(() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }), 1000);
            }
        }, 350);
    }

    if (chatTrigger) {
        chatTrigger.addEventListener('click', () => {
            chatContainer.classList.toggle('open');
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', () => chatContainer.classList.remove('open'));
    }

    if (chatForm) {
        chatForm.addEventListener('submit', e => {
            e.preventDefault();
            const val = chatInput.value.trim();
            if (!val) return;
            chatInput.value = '';
            handleChat(val);
        });
    }

    chipBtns.forEach(chip => {
        chip.addEventListener('click', () => {
            handleChat(chip.dataset.query);
            chip.closest('.chat-chips').style.display = 'none';
        });
    });

    /* --------------------------------------------------
       13. SMOOTH ANCHOR SCROLL
    -------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* --------------------------------------------------
       14. CONTACT FORM SUBMIT FEEDBACK
    -------------------------------------------------- */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<span>Sending…</span><i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = '<span>Sent!</span><i class="fa-solid fa-check"></i>';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            }, 1800);
        });
    }

})();
