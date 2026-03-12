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

        const messageId = appendMessage("", "tecuit", false);
        const tecuitDiv = document.getElementById(messageId);

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

                try {

                    const json = JSON.parse(data);
                    const token = json.choices?.[0]?.delta?.content || "";

                    fullReply += token;

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

    } catch (err) {

        console.error(err);

        appendMessage(
            "⚠️ Impossible de contacter le serveur IA.",
            "tecuit"
        );

    }

    isGenerating = false;
    stopButtonContainer.classList.add("hidden");

}
