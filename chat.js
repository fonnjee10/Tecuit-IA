// ==================== Model Switching Function ====================
// Tecuit Chat - Gestion des modèles Hermes 4B et 7B

const ModelManager = {
    // Configuration des modèles
    models: {
        'Hermes 4B': {
            name: 'Hermes 4B',
            apiModel: 'Izhanjafry/Nous-Hermes-2-Mistral-7B-DPO-Q4_0-GGUF',
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

function setupModelSwitching() {
    // Initialiser le gestionnaire de modèles
    ModelManager.init();

    // Fonction pour changer de modèle dans l'interface
    window.switchToModel = function(modelName) {
        const success = ModelManager.setModel(modelName);
        if (success) {
            // Mettre à jour l'affichage
            const modelDisplay = document.getElementById('current-model-display');
            if (modelDisplay) {
                modelDisplay.textContent = modelName;
            }

            // Afficher une notification
            showToast('Modèle changé: ' + modelName);

            // Sauvegarder dans la conversation actuelle
            if (typeof TecuitChat !== 'undefined') {
                TecuitChat.setModel(modelName);
            }
        }
        return success;
    };

    // Fonction pour basculer entre 4B et 7B
    window.toggleModel = function() {
        const newModel = ModelManager.toggleModel();
        const modelDisplay = document.getElementById('current-model-display');
        if (modelDisplay) {
            modelDisplay.textContent = ModelManager.getModel();
        }
        showToast('Modèle: ' + ModelManager.getModel());
        return newModel;
    };

    // Fonction pour afficher les détails du modèle
    window.showModelDetails = function(modelName) {
        const details = ModelManager.getModelDetails(modelName);
        if (!details) return null;

        return {
            name: details.name,
            description: details.description,
            speed: details.speed,
            power: details.power,
            temperature: details.temperature,
            maxTokens: details.maxTokens,
            apiModel: details.apiModel
        };
    };

    console.log('[Tecuit] Model Switching activé');
    console.log('[Tecuit] Modèles disponibles:', ModelManager.getAvailableModels());

    return ModelManager;
}

// ==================== Fonctions Utilitaires ====================

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.remove('opacity-0', 'pointer-events-none');
        toast.classList.add('opacity-100');

        setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0', 'pointer-events-none');
        }, duration);
    } else {
        console.log('[Toast]', message);
    }
}

// ==================== Configuration API avec le modèle ====================

async function sendRequestWithModel(message, options = {}) {
    const modelName = options.model || ModelManager.getModel();
    const modelConfig = ModelManager.getModelConfig(modelName);
    const apiModel = ModelManager.getApiModel(modelName);

    if (!apiModel) {
        throw new Error('Modèle non configuré: ' + modelName);
    }

    console.log('[API] Envoi avec modèle:', {
        displayName: modelName,
        apiModel: apiModel,
        temperature: modelConfig.temperature,
        maxTokens: modelConfig.maxTokens
    });

    const response = await fetch('https://zenkaritecuitai.ngrok.app/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
            model: apiModel,
            messages: options.messages || [],
            stream: options.stream !== false,
            temperature: options.temperature || modelConfig.temperature,
            max_tokens: options.maxTokens || modelConfig.maxTokens
        })
    });

    return response;
}

// ==================== Export ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ModelManager,
        setupModelSwitching,
        sendRequestWithModel
    };
}

if (typeof window !== 'undefined') {
    window.ModelManager = ModelManager;
    window.setupModelSwitching = setupModelSwitching;
    window.sendRequestWithModel = sendRequestWithModel;
}

// ==================== Exemple d'utilisation ====================

/*
// Initialisation
ModelManager.init();

// Changer de modèle
ModelManager.setModel('Hermes 7B');

// Obtenir le modèle actuel
const current = ModelManager.getModel(); // 'Hermes 7B'

// Obtenir les détails
const details = ModelManager.getModelDetails('Hermes 4B');
console.log(details); // { name: 'Hermes 4B', speed: 'Rapide', ... }

// Basculer entre les modèles
ModelManager.toggleModel();

// Callback
ModelManager.setOnModelChange(function(modelName, modelDetails) {
    console.log('Nouveau modèle:', modelName);
    console.log('Détails:', modelDetails);
});

// Avec TecuitChat
TecuitChat.init({
    onModelChange: function(modelName, details) {
        console.log('Modèle changé:', modelName);
    }
});

// Envoyer un message avec un modèle spécifique
TecuitChat.sendMessage('Bonjour', {
    model: 'Hermes 7B'
});

*/
