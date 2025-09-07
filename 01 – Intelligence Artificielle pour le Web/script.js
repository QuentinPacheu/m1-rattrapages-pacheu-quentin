const API_URL = "https://api.groq.com/openai/v1/chat/completions";

let quizConfig = {
    domain: '',
    questionCount: 10,
    isValid: false
};

let currentQuizData = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;

// Test API
async function testAPI() {
    const GROQ_API_KEY = process.env.GROQ_API_KEY || CONFIG.GROQ_API_KEY || "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";
    console.clear();
    console.log("=== TEST API GROQ ===");
    console.log("🔄 Test en cours...");
    
    const statusElement = document.getElementById('api-status');
    if (statusElement) {
        statusElement.textContent = "Test...";
        statusElement.style.color = "orange";
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: 'user', content: 'Réponds juste "OK"' }
                ],
                max_tokens: 5
            })
        });
        
        console.log(`Status: ${response.status}`);
        
        if (response.ok) {
            const data = await response.json();
            const reply = data.choices[0]?.message?.content;
            
            console.log("✅ API fonctionne !");
            console.log(`Réponse: "${reply}"`);
            console.log("Données complètes:", data);
            
            if (statusElement) {
                statusElement.textContent = "✅ Connecté";
                statusElement.style.color = "green";
            }
            
        } else {
            const errorText = await response.text();
            console.error("❌ Erreur:", response.status);
            console.error("Détails:", errorText);
            
            if (statusElement) {
                statusElement.textContent = `❌ Erreur ${response.status}`;
                statusElement.style.color = "red";
            }
        }
        
    } catch (error) {
        console.error("❌ Erreur réseau:", error);
        
        if (statusElement) {
            statusElement.textContent = "❌ Erreur réseau";
            statusElement.style.color = "red";
        }
    }
}

// Validation 
function validateConfig() {
    console.log("=== VALIDATION CONFIGURATION ===");
    
    const domain = document.getElementById('domain').value.trim();
    const questionCount = parseInt(document.getElementById('question-count').value);
    
    console.log("Valeurs saisies:", { domain, questionCount });
    
    if (!domain) {
        alert("Veuillez entrer un domaine");
        document.getElementById('domain').focus();
        return;
    }
    
    if (domain.length < 3) {
        alert("Le domaine doit avoir au moins 3 caractères");
        document.getElementById('domain').focus();
        return;
    }
    
    quizConfig = {
        domain: domain,
        questionCount: questionCount,
        isValid: true
    };
    
    console.log("✅ Configuration validée:", quizConfig);
    
    updateConfigDisplay();
    document.getElementById('generate-btn').disabled = false;
    
    alert("Configuration validée !");
}

// Génération quiz 
async function generateQuiz() {
    
    const domain = document.getElementById('domain').value.trim();
    const questionCount = parseInt(document.getElementById('question-count').value);
    
    console.log("=== GÉNÉRATION QUIZ DIRECTE ===");
    console.log("Valeurs saisies:", { domain, questionCount });
    
    if (!domain) {
        alert("Veuillez entrer un domaine pour le quiz");
        document.getElementById('domain').focus();
        return;
    }
    
    if (domain.length < 3) {
        alert("Le domaine doit avoir au moins 3 caractères");
        document.getElementById('domain').focus();
        return;
    }
    
    
    quizConfig = {
        domain: domain,
        questionCount: questionCount,
        isValid: true
    };
    
    console.log("✅ Configuration validée automatiquement:", quizConfig);
    
    showSection('loading');
    
    try {
        const prompt = `Crée un quiz de ${quizConfig.questionCount} questions à choix multiples sur "${quizConfig.domain}".
        Format JSON: {"questions": [{"question": "...", "options": ["A","B","C","D"], "correct": 0, "explanation": "..."}]}
        Réponds UNIQUEMENT avec le JSON.`;
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: 'Tu réponds uniquement en JSON valide.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 2000,
                temperature: 0.7
            })
        });
        
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        
        const data = await response.json();
        let content = data.choices[0].message.content;
        
        // Nettoyage du JSON
        content = content.replace(/```json|```/g, '').trim();
        // Extraction sécurisée du contenu JSON
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
            content = content.substring(jsonStart, jsonEnd);
        }
        
        const quizData = JSON.parse(content);
        
        if (!quizData.questions || quizData.questions.length === 0) {
            throw new Error('Pas de questions générées');
        }
        
        // Démarrage du quiz
        currentQuizData = quizData.questions.slice(0, quizConfig.questionCount);
        currentQuestionIndex = 0;
        userAnswers = [];
        score = 0;
        
        document.getElementById('quizTitle').textContent = quizConfig.domain;
        document.getElementById('totalQuestions').textContent = currentQuizData.length;
        document.getElementById('totalScore').textContent = currentQuizData.length;
        
        startQuiz();
        
    } catch (error) {
        console.error('Erreur:', error);
        showSection('setup');
        alert('Erreur: ' + error.message);
    }
}

function startQuiz() {
    showSection('quiz');
    showQuestion();
}

function showQuestion() {
    const question = currentQuizData[currentQuestionIndex];
    
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('questionText').textContent = question.question;
    
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.setAttribute('data-letter', String.fromCharCode(65 + index));
        label.innerHTML = `
            <input type="radio" name="answer" value="${index}" onchange="selectAnswer(this)">
            <span>${option}</span>
        `;
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        container.appendChild(label);
    });
    
    document.getElementById('nextButton').disabled = true;
}

function enableNext() {
    document.getElementById('nextButton').disabled = false;
}

function nextQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');
    
    if (!selected) {
        alert('Sélectionnez une réponse');
        return;
    }
    
    const answerIndex = parseInt(selected.value);
    const isCorrect = answerIndex === currentQuizData[currentQuestionIndex].correct;
    
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        selectedAnswer: answerIndex,
        isCorrect: isCorrect
    });
    
    if (isCorrect) score++;
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuizData.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    showSection('results');
    
    document.getElementById('finalScore').textContent = score;
    
    const percentage = (score / currentQuizData.length) * 100;
    let message = '';
    if (percentage >= 90) message = '🏆 Excellent !';
    else if (percentage >= 70) message = '🎉 Très bien !';
    else if (percentage >= 50) message = '👍 Pas mal !';
    else message = '⚠️ À réviser !';
    
    document.getElementById('scoreMessage').textContent = message;
    
    // Récapitulatif
    const container = document.getElementById('reviewContainer');
    container.innerHTML = '';
    
    userAnswers.forEach((answer, index) => {
        const question = currentQuizData[answer.questionIndex];
        const div = document.createElement('div');
        div.style.marginBottom = '15px';
        div.style.padding = '10px';
        div.style.border = answer.isCorrect ? '2px solid green' : '2px solid red';
        
        div.innerHTML = `
            <strong>Q${index + 1}:</strong> ${question.question}<br>
            <strong>Votre réponse:</strong> ${String.fromCharCode(65 + answer.selectedAnswer)}. ${question.options[answer.selectedAnswer]}<br>
            <strong>Correcte:</strong> ${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}<br>
            <strong>Explication:</strong> ${question.explanation}
        `;
        
        container.appendChild(div);
    });
}

function restartQuiz() {
    showSection('setup');
    document.getElementById('domain').value = '';
    updateConfigDisplay();
}

function showSection(name) {
    ['setup', 'loading', 'quiz', 'results'].forEach(section => {
        const el = document.getElementById(section);
        if (el) el.style.display = section === name ? 'block' : 'none';
    });
}

function updateConfigDisplay() {
    const infoElement = document.getElementById('config-info');
    
    if (!infoElement) {
        return;
    }
    
    const domain = document.getElementById('domain').value.trim();
    const questionCount = document.getElementById('question-count').value;
    
    if (domain) {
        infoElement.innerHTML = `
            <h4>Configuration actuelle :</h4>
            <strong>Domaine :</strong> ${domain}<br>
            <strong>Questions :</strong> ${questionCount}<br>
            <span style="color: green;">✅ Prêt à générer</span>
        `;
    } else {
        infoElement.innerHTML = '<em>Entrez un domaine et cliquez sur "Générer Quiz"</em>';
    }
}

// Reset 
function resetConfig() {
    document.getElementById('domain').value = '';
    document.getElementById('question-count').value = '10';
    
    updateConfigDisplay();
    console.log("🔄 Configuration réinitialisée");
}

// Listeners 
function setupListeners() {
    const inputs = ['domain', 'question-count'];
    
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateConfigDisplay);
        }
    });
    
    // Génération avec Enter dans le champ domaine
    const domainInput = document.getElementById('domain');
    if (domainInput) {
        domainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                generateQuiz();
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', function() {
    
    setupListeners();
    updateConfigDisplay();
    
    // Bouton reset
    const configSection = document.querySelector('div:nth-of-type(2)');
    if (configSection && !document.getElementById('reset-btn')) {
        const resetBtn = document.createElement('button');
        resetBtn.id = 'reset-btn';
        resetBtn.textContent = 'Reset';
        resetBtn.onclick = resetConfig;
        resetBtn.style.marginLeft = '10px';
        
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.parentNode.insertBefore(resetBtn, generateBtn.nextSibling);
        }
    }
});


function selectAnswer(radioInput) {
    // Retirer la classe selected de tous les labels
    const allLabels = document.querySelectorAll('#answersContainer label');
    allLabels.forEach(label => {
        label.classList.remove('selected');
    });
    
    // Ajouter la classe selected au label parent du radio sélectionné
    radioInput.parentElement.classList.add('selected');
    
    // Activer le bouton suivant
    enableNext();
}