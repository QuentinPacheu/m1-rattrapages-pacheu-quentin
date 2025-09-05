    const API_URL = "https://api.groq.com/openai/v1/chat/completions";

    async function testAPI() {
        const GROQ_API_KEY = CONFIG.GROQ_API_KEY;
        console.clear();
        console.log("=== TEST API GROQ ===");
        console.log("🔄 Test en cours...");
        
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
                
            } else {
                const errorText = await response.text();
                console.error("❌ Erreur:", response.status);
                console.error("Détails:", errorText);
            }
            
        } catch (error) {
            console.error("❌ Erreur réseau:", error);
        }
    }
