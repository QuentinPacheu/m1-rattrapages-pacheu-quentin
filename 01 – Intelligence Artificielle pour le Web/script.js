const API_URL = "https://api.groq.com/openai/v1/chat/completions";

let quizConfig = {
    domain: '',
    questionCount: 10,
    isValid: false
};

// Test API
async function testAPI() {
    const GROQ_API_KEY = CONFIG.GROQ_API_KEY;
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

// Validation de la configuration
function validateConfig() {
    console.log("=== VALIDATION CONFIGURATION ===");
    
    // Récupérer les valeurs (SANS difficulty)
    const domain = document.getElementById('domain').value.trim();
    const questionCount = parseInt(document.getElementById('question-count').value);
    
    console.log("Valeurs saisies:", { domain, questionCount });
    
    // Validation du domaine
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
    
    // Met à jour la configuration (SANS difficulty)
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

// Met à jour l'affichage des informations de configuration
function updateConfigDisplay() {
    const infoElement = document.getElementById('config-info');
    
    if (quizConfig.isValid) {
        infoElement.innerHTML = `
            <h4>Configuration actuelle :</h4>
            <strong>Domaine :</strong> ${quizConfig.domain}<br>
            <strong>Questions :</strong> ${quizConfig.questionCount}<br>
            <span style="color: green;">✅ Prêt pour génération</span>
        `;
    } else {
        infoElement.innerHTML = '<em>Configurez votre quiz ci-dessus...</em>';
    }
}

// Génération de quiz
function generateQuiz() {
    console.log("=== GÉNÉRATION QUIZ ===");
    
    if (!quizConfig.isValid) {
        alert("Validez d'abord la configuration");
        return;
    }
    
    console.log("Configuration pour génération:", quizConfig);
    console.log("🚧 Génération sera implémentée en version 3");
    
    alert(`Quiz prêt à générer !\nDomaine: ${quizConfig.domain}\nQuestions: ${quizConfig.questionCount}\n`);
}

// Réinitialise la configuration
function resetConfig() {
    document.getElementById('domain').value = '';
    document.getElementById('question-count').value = '10';
    
    quizConfig.isValid = false;
    document.getElementById('generate-btn').disabled = true;
    
    updateConfigDisplay();
    console.log("🔄 Configuration réinitialisée");
}

function setupListeners() {
    const inputs = ['domain', 'question-count'];
    
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                if (quizConfig.isValid) {
                    console.log("⚠️ Configuration modifiée");
                    quizConfig.isValid = false;
                    document.getElementById('generate-btn').disabled = true;
                    updateConfigDisplay();
                }
            });
        }
    });
    
    // Validation dans le champ domaine
    const domainInput = document.getElementById('domain');
    if (domainInput) {
        domainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                validateConfig();
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', function() {
    console.log("✨ Nouvelles fonctionnalités:");
    console.log("- Configuration de quiz");
    console.log("- Validation des entrées");
    console.log("- Interface utilisateur étendue");
    
    setupListeners();
    updateConfigDisplay();
    
    // bouton reset
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