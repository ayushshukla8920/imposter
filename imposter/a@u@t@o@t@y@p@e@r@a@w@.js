function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let isPaused = false;
let isTyping = false;
let generatedAnswer = "";
async function solveQuestion() {
    if (isTyping) return;
    let questionDiv = document.querySelector("div[aria-labelledby='each-type-question']");
    if (!questionDiv) return;
    let query = questionDiv.innerText.trim() + " in cpp do not write any comments or any explanation of code";
    let editorLayers = document.querySelectorAll(".ace_layer.ace_text-layer");
    let context = "";
    if (editorLayers.length > 0) {
        context += editorLayers[0].textContent.trim() + "\n";
        if (editorLayers.length > 1) context += editorLayers[1].textContent.trim() + "\n";
    }
    query += "\n\nContext:\n" + context;
    try {
        const apiKey = "X-api-key";
        let res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }]
            }),
        });
        if (!res.ok) throw Error(`Gemini API error: ${res.status}`);
        let data = await res.json();
        let answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!answer) {
            console.error("No answer generated");
            return;
        }
        answer = answer.substring(6, answer.length - 4);
        generatedAnswer = answer.split('\n');
        let textAreas = document.querySelectorAll("textarea");
        let target = textAreas.length > 2 ? textAreas[1] : textAreas[0];
        if (!target) return;
        isTyping = true;
        target.value = "";
        for (let i of generatedAnswer){
            while (isPaused) await delay(100);
            target.value += i+"\n";
            target.dispatchEvent(new Event("input", { bubbles: true }));
            await delay(2000);
        }
        isTyping = false;
    } catch (err) {
        console.error("Error solving question:", err);
        isTyping = false;
    }
}
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && !event.altKey) {
        console.log("Ctrl+Shift pressed → Triggering solveQuestion()");
        solveQuestion();
    }
    if (event.ctrlKey && event.key === ".") {
        isPaused = !isPaused;
        console.log(isPaused ? "⏸️ Paused" : "▶️ Resumed");
    }
});
console.log("#flash2o#");
