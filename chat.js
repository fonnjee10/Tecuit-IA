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
        }
    },

    // Modèle actuel
    currentModel: 'Hermes 4B',

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

        const previousModel = this.currentModel;
        this.currentModel = modelName;

        // Sauvegarder dans localStorage
        localStorage.setItem('tecuit_current_model', modelName);

        console.log('[ModelManager] Modèle changé:', previousModel, '->', modelName);
        console.log('[ModelManager] API Model:', this.models[modelName].apiModel);

        // Callback si défini
        if (this.onModelChange) {
            this.onModelChange(modelName, this.models[modelName]);
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
    }
};

// ==================== Intégration avec TecuitChat ====================

@@ -283,3 +168,4 @@ TecuitChat.sendMessage('Bonjour', {
   model: 'Hermes 7B'
});
*/
