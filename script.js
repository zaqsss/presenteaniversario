// ===== FIREBASE SETUP =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMtQ-Ck-gyWewNa-rOiJsPvCGDl1PxYiY",
    authDomain: "meu-amor-6ab53.firebaseapp.com",
    projectId: "meu-amor-6ab53",
    storageBucket: "meu-amor-6ab53.firebasestorage.app",
    messagingSenderId: "450243566871",
    appId: "1:450243566871:web:045fe54d6136e9b04aeb52",
    measurementId: "G-3XRKV98SD9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const studiesCol = collection(db, "estudos");

// ===== FLOATING HEARTS =====
const heartsBg = document.getElementById('heartsBg');
const heartEmojis = ['💕', '💗', '🩷', '💜', '🤍'];

function spawnHeart() {
    const el = document.createElement('span');
    el.classList.add('floating-heart');
    el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (Math.random() * 10 + 9) + 'px';
    el.style.animationDuration = (Math.random() * 10 + 10) + 's';
    heartsBg.appendChild(el);
    setTimeout(() => el.remove(), 20000);
}

setInterval(spawnHeart, 1500);
for (let i = 0; i < 4; i++) setTimeout(spawnHeart, i * 400);

// ===== PAGE NAVIGATION =====
const pageOutStyle = document.createElement('style');
pageOutStyle.textContent = `@keyframes pageOut { to { opacity: 0; transform: translateY(-10px); } }`;
document.head.appendChild(pageOutStyle);

function showPage(hideId, showId) {
    const hide = document.getElementById(hideId);
    const show = document.getElementById(showId);
    hide.style.animation = 'pageOut 0.3s ease-in forwards';
    setTimeout(() => {
        hide.classList.remove('active');
        hide.style.animation = '';
        show.classList.add('active');
        window.scrollTo(0, 0);
    }, 300);
}

// ===== LOGIN =====
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');
const lockIcon = document.getElementById('lockIcon');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('loginInput').value.trim().toLowerCase();
    const pass = document.getElementById('passwordInput').value.trim().toLowerCase();
    errorMsg.classList.remove('show');

    if (user === 'bensa' && pass === 'infinito') {
        lockIcon.textContent = '🔓';
        setTimeout(() => showPage('loginPage', 'hint1Page'), 400);
    } else {
        errorMsg.classList.add('show');
    }
});

// ===== HINT BUTTONS =====
document.getElementById('hint1Btn').addEventListener('click', () => showPage('hint1Page', 'hint2Page'));
document.getElementById('hint2Btn').addEventListener('click', () => showPage('hint2Page', 'hint3Page'));
document.getElementById('hint3Btn').addEventListener('click', () => showPage('hint3Page', 'appPage'));

// ===== NAVBAR TABS =====
const navLinks = document.querySelectorAll('.nav-link');
const tabInicio = document.getElementById('tabInicio');
const tabEstudos = document.getElementById('tabEstudos');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const tab = link.dataset.tab;
        tabInicio.classList.remove('active');
        tabEstudos.classList.remove('active');

        if (tab === 'inicio') tabInicio.classList.add('active');
        else {
            tabEstudos.classList.add('active');
            renderStudies(); // Refresh when switching to tab
        }
    });
});

// ===== ESTUDOS (Firebase Firestore) =====
const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

async function renderStudies() {
    const tbody = document.getElementById('studyTableBody');
    const emptyMsg = document.getElementById('emptyMsg');

    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#998fad;">Carregando... 💭</td></tr>';

    try {
        const snapshot = await getDocs(studiesCol);
        const studies = [];

        snapshot.forEach(docSnap => {
            studies.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Sort by date
        studies.sort((a, b) => new Date(a.date) - new Date(b.date));

        tbody.innerHTML = '';

        if (studies.length === 0) {
            emptyMsg.style.display = 'block';
            return;
        }

        emptyMsg.style.display = 'none';

        studies.forEach(study => {
            const dateObj = new Date(study.date + 'T00:00:00');
            const day = dateObj.getDate();
            const weekDay = weekDays[dateObj.getDay()];
            const month = months[dateObj.getMonth()];

            const tr = document.createElement('tr');
            if (study.done) tr.classList.add('done');

            tr.innerHTML = `
                <td>${day}</td>
                <td>${weekDay}</td>
                <td>${month}</td>
                <td><span class="content-text">${escapeHtml(study.content)}</span></td>
                <td><span class="status-badge ${study.done ? 'completed' : 'pending'}">${study.done ? 'Feito ✅' : 'Pendente'}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn done-btn" data-id="${study.id}" title="${study.done ? 'Desmarcar' : 'Marcar como feito'}">
                            ${study.done ? '↩️' : '✅'}
                        </button>
                        <button class="action-btn delete-btn" data-id="${study.id}" title="Excluir">
                            🗑️
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Done buttons
        tbody.querySelectorAll('.done-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const study = studies.find(s => s.id === id);
                const docRef = doc(db, "estudos", id);
                await updateDoc(docRef, { done: !study.done });
                renderStudies();
            });
        });

        // Delete buttons
        tbody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const docRef = doc(db, "estudos", id);
                await deleteDoc(docRef);
                renderStudies();
            });
        });

    } catch (error) {
        console.error("Erro ao carregar estudos:", error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#fca5a5;">Erro ao carregar 😢</td></tr>';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add study form
document.getElementById('studyForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const dateInput = document.getElementById('studyDate');
    const contentInput = document.getElementById('studyContent');

    if (!dateInput.value || !contentInput.value.trim()) return;

    try {
        await addDoc(studiesCol, {
            date: dateInput.value,
            content: contentInput.value.trim(),
            done: false
        });

        contentInput.value = '';
        dateInput.value = '';
        dateInput.valueAsDate = new Date();
        renderStudies();
    } catch (error) {
        console.error("Erro ao adicionar:", error);
        alert("Erro ao salvar. Verifique sua conexão! 😢");
    }
});

// Set default date to today
document.getElementById('studyDate').valueAsDate = new Date();

// Initial render
renderStudies();
