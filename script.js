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
const tabs = {
    inicio: document.getElementById('tabInicio'),
    estudos: document.getElementById('tabEstudos'),
    galeria: document.getElementById('tabGaleria')
};

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const tab = link.dataset.tab;
        Object.values(tabs).forEach(content => content.classList.remove('active'));

        if (tabs[tab]) {
            tabs[tab].classList.add('active');
        }

        if (tab === 'estudos') {
            renderStudies();
        }

        if (tab === 'galeria') {
            renderGallery();
        }
    });
});

// ===== GALERIA =====
// Adicione novas fotos aqui quando colocar novos arquivos na pasta /galeria.
const galleryPhotos = [
    {
        file: 'primeira foto.jpeg',
        title: 'O comecinho que eu guardo com carinho',
        description: 'Tem foto que vira lembranca, e essa aqui sempre me lembra como tudo com voce ficou mais especial.'
    },
    {
        file: 'foto zoio e lingua.jpeg',
        title: 'Seu jeitinho mais impossivel de nao amar',
        description: 'Ate nas caretas voce consegue ser a pessoa mais linda e mais divertida do meu mundo.'
    },
    {
        file: 'foto zoada de cima.jpeg',
        title: 'A baguncinha mais perfeita',
        description: 'Até de cima meu mo é perfeita.'
    },
    {
        file: 'foto tremida.jpeg',
        title: 'Ate tremida fica linda',
        description: 'Nem a foto precisando de foco consegue esconder o quanto voce deixa tudo bonito.'
    },
    {
        file: 'foto sla aonde.jpeg',
        title: 'Em qualquer lugar com voce',
        description: 'Nao importa muito onde foi, porque quando era voce ali, o momento ja ficou especial.'
    },
    {
        file: 'foto no sol.jpeg',
        title: 'Voce brilhando mais que o sol',
        description: 'Essa aqui parece ate injusta com o céu, porque quem realmente chama atencao e voce.'
    },
    {
        file: 'foto no carro desconfiado.jpeg',
        title: 'Sua carinha desconfiada',
        description: 'Eu olho para essa foto e so consigo rir e pensar em como eu amo cada expressao sua.'
    },
    {
        file: 'foto na vo.jpeg',
        title: 'Momento simples',
        description: 'As lembrancas mais gostosas sao assim, tranquilas, verdadeiras e com voce do meu lado.'
    },
    {
        file: 'foto mola.jpeg',
        title: 'Toda engraçadinha e linda',
        description: 'Voce consegue ser fofa, engraçada e perfeita tudo ao mesmo tempo, e eu amo isso.'
    },
    {
        file: 'foto mogs.jpeg',
        title: 'Minha favorita em qualquer versao',
        description: 'Nao existe fase, pose ou humor em que voce nao seja a minha pessoa favorita.'
    },
    {
        file: 'foto minions.jpeg',
        title: 'Meu minions preferido',
        description: 'Até a gente no universo dos minions combina.'
    },
    {
        file: 'foto maquiagem.jpeg',
        title: 'Minha maquiadora nanica',
        description: 'A melhor maquiadora desse mundo todo.'
    },
    {
        file: 'foto mao na cara dnv.jpeg',
        title: 'Seu charme ate escondidinha',
        description: 'Mesmo quando voce tenta se esconder, continua sendo a menina mais linda dos meus olhos.'
    },
    {
        file: 'foto fofa.jpeg',
        title: 'A definicao de fofura',
        description: 'Se eu tivesse que escolher uma foto para resumir o quanto voce e encantadora, essa ajudaria muito.'
    },
    {
        file: 'foto eu corcunda.jpeg',
        title: 'Nosso lado mais espontaneo',
        description: 'Eu amo quando a gente simplesmente existe junto e cria lembrancas bobinhas assim.'
    },
    {
        file: 'foto eu co zoio ruim.jpeg',
        title: 'Do nosso jeitinho',
        description: 'Até eu com o olho ruim, você sempre está ao meu lado.'
    },
    {
        file: 'foto espelho.jpeg',
        title: 'Reflexo da minha pessoa favorita',
        description: 'Nem o espelho consegue mostrar tudo o que eu vejo de lindo em voce.'
    },
    {
        file: 'foto emo.jpeg',
        title: 'Bonita ate quando sai da piscina',
        description: 'Voce consegue ficar maravilhosa de todos os jeitos possiveis'
    },
    {
        file: 'foto efeito.jpeg',
        title: 'Nosso começo',
        description: 'Tem foto nossa que fica com cara de lembranca feliz, e essa é uma delas.'
    },
    {
        file: 'foto deitados na grama.jpeg',
        title: 'Paz e voce no mesmo quadro',
        description: 'Essa foto tem um tipo de calma que so aparece quando eu estou pertinho de voce.'
    },
    {
        file: 'foto deitada.jpeg',
        title: 'Toda tranquila, toda linda',
        description: 'Eu amo esses momentos em que voce so existe sendo linda sem nem tentar.'
    },
    {
        file: 'foto criança.jpeg',
        title: 'Seu jeitinho doce de sempre',
        description: 'Tem uma delicadeza em voce que aparece ate nas fotos mais simples.'
    },
    {
        file: 'foto carro mae na cara.jpeg',
        title: 'Mais uma carinha que eu amo',
        description: 'Cada expressão sua parece ter sido feita so para eu me apaixonar um pouquinho mais.'
    },
    {
        file: 'foto canguta.jpeg',
        title: 'Toda boba e perfeita',
        description: 'Voce brincando e sendo voce mesma e uma das minhas visoes favoritas no mundo.'
    },
    {
        file: 'foto caneta na cara.jpeg',
        title: 'Seu lado mais divertido',
        description: 'Essa foto me lembra como voce consegue transformar qualquer instante numa lembranca boa.'
    },
    {
        file: 'foto ca isa.jpeg',
        title: 'Voce e a cunhada',
        description: 'Não é só eu que te amo, a minha família inteira te ama.'
    }
];

function buildGalleryPath(fileName) {
    return encodeURI(`galeria/${fileName}`);
}

function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryEmptyMsg = document.getElementById('galleryEmptyMsg');

    if (!galleryGrid || !galleryEmptyMsg) return;

    if (galleryPhotos.length === 0) {
        galleryGrid.innerHTML = '';
        galleryEmptyMsg.style.display = 'block';
        return;
    }

    galleryEmptyMsg.style.display = 'none';
    galleryGrid.innerHTML = galleryPhotos.map(photo => `
        <article class="gallery-card">
            <div class="gallery-image-wrap">
                <img
                    class="gallery-image"
                    src="${buildGalleryPath(photo.file)}"
                    alt="${escapeHtml(photo.title)}"
                    loading="lazy">
            </div>
            <div class="gallery-caption">
                <h3>${escapeHtml(photo.title)}</h3>
                <p>${escapeHtml(photo.description)}</p>
            </div>
        </article>
    `).join('');
}

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
renderGallery();
renderStudies();
