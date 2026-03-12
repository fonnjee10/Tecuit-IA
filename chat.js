// ==================== Model Switching Function ====================
// Tecuit Chat - Gestion des modèles Hermes 4B et 7B

const ModelManager = {
    // Configuration des modèles
    models: {
        'Hermes 4B': {
            name: 'Hermes 4B',
            apiModel: 'nousresearch/nous-hermes-2-mistral-7b-dpo',
            description: 'Rapide et efficace pour les tâches quotidiennes',
            temperature: 0.7,
            maxTokens: 2048,
            speed: 'Rapide',
            power: 'Standard'
        },
        'Hermes 7B': {
            name: 'Hermes 7B',
            apiModel: 'nousresearch/nous-hermes-2-mistral-7b-dpo',
            description: 'Puissant pour le raisonnement complexe et le code',
            temperature: 0.5,
            maxTokens: 4096,
            speed: 'Normal',
            power: 'Élevé'
async function sendMessage() {

    const text = input.value.trim();
    if (!text || isGenerating) return;

    appendMessage(text, 'user');
    input.value = '';

    isGenerating = true;
    stopButtonContainer.classList.remove('hidden');

    abortController = new AbortController();

    try {

        const res = await fetch(API_BASE_URL + "/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "nousresearch/nous-hermes-2-mistral-7b-dpo",
                messages: conversationHistory.map(m => ({
                    role: m.role === "tecuit" ? "assistant" : m.role,
                    content: m.content
                })),
                stream: true,
                temperature: 0.7,
                max_tokens: 2048
            }),
            signal: abortController.signal
        });

        if (!res.ok) {
            throw new Error("HTTP " + res.status);
}
    },

    // Modèle actuel
    currentModel: 'Hermes 4B',
        const messageId = appendMessage("", "tecuit", false);
        const tecuitDiv = document.getElementById(messageId);

    // Initialisation
    init: function() {
        // Charger le modèle sauvegardé
        const savedModel = localStorage.getItem('tecuit_current_model');
        if (savedModel && this.models[savedModel]) {
            this.currentModel = savedModel;
        }
        console.log('[ModelManager] Initialisé avec:', this.currentModel);
        return this;
    },

    // Changer de modèle
    setModel: function(modelName) {
        if (!this.models[modelName]) {
            console.error('[ModelManager] Modèle invalide:', modelName);
            console.log('[ModelManager] Modèles disponibles:', Object.keys(this.models));
            return false;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        let fullReply = "";

        while (true) {

            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);

            const lines = chunk.split("\n");

            for (const line of lines) {

                if (!line.startsWith("data:")) continue;

                const data = line.replace("data:", "").trim();

                if (data === "[DONE]") break;

        const previousModel = this.currentModel;
        this.currentModel = modelName;
                try {

        // Sauvegarder dans localStorage
        localStorage.setItem('tecuit_current_model', modelName);
                    const json = JSON.parse(data);
                    const token = json.choices?.[0]?.delta?.content || "";

        console.log('[ModelManager] Modèle changé:', previousModel, '->', modelName);
        console.log('[ModelManager] API Model:', this.models[modelName].apiModel);
                    fullReply += token;

        // Callback si défini
        if (this.onModelChange) {
            this.onModelChange(modelName, this.models[modelName]);
                    if (tecuitDiv) {
                        tecuitDiv.innerHTML = formatMessage(fullReply);
                    }

                    chatContainer.scrollTop = chatContainer.scrollHeight;

                } catch (e) {
                    console.log("JSON parse skip");
                }

            }

        }

        if (fullReply) {
            conversationHistory.push({
                role: "tecuit",
                content: fullReply
            });

            saveToLocalStorage();
            saveCurrentConversation();
}

        return true;
    },

    // Obtenir le modèle actuel
    getModel: function() {
        return this.currentModel;
    },

    // Obtenir les détails du modèle actuel
    getModelDetails: function(modelName) {
        const name = modelName || this.currentModel;
        return this.models[name] || null;
    },

    // Obtenir le nom API du modèle
    getApiModel: function(modelName) {
        const name = modelName || this.currentModel;
        return this.models[name] ? this.models[name].apiModel : null;
    },

    // Obtenir la configuration du modèle
    getModelConfig: function(modelName) {
        const name = modelName || this.currentModel;
        const model = this.models[name];
        if (!model) return null;

        return {
            temperature: model.temperature,
            maxTokens: model.maxTokens
        };
    },

    // Basculer entre les modèles
    toggleModel: function() {
        const models = Object.keys(this.models);
        const currentIndex = models.indexOf(this.currentModel);
        const nextIndex = (currentIndex + 1) % models.length;
        return this.setModel(models[nextIndex]);
    },

    // Liste des modèles disponibles
    getAvailableModels: function() {
        return Object.keys(this.models);
    },

    // Callback pour les changements de modèle
    onModelChange: null,

    // Définir le callback
    setOnModelChange: function(callback) {
        this.onModelChange = callback;
    } catch (err) {

        console.error(err);

        appendMessage(
            "⚠️ Impossible de contacter le serveur IA.",
            "tecuit"
        );

}
};

// ==================== Intégration avec TecuitChat ====================
    isGenerating = false;
    stopButtonContainer.classList.add("hidden");

@@ -283,3 +168,4 @@ TecuitChat.sendMessage('Bonjour', {
   model: 'Hermes 7B'
});
*/
}
