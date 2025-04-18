document.addEventListener("keydown", async (event) => {
    if (event.ctrlKey && event.shiftKey) {
        const question = document.querySelector(".col-md-9.col-sm-9.col-xs-12");
        const mcq = document.querySelector("#optionCol");
        if (question && mcq) {
            let questionText = question.innerText.trim();
            questionText = questionText.slice(13, questionText.length);
            const optionsArray = mcq.innerText.trim().split("\n");
            const optionsWithSerialNumbers = optionsArray.map((option, index) => {
                const serialNumber = (index + 1) + ". ";
                return serialNumber + option;
            });
            const formattedOptions = optionsWithSerialNumbers.join("\n");
            const prompt = questionText + "\n\nOptions : \n\n" + formattedOptions + "\n\nPlease provide the correct option in one letter like A,B,C or D No need Explaination.";
            let answer = '';
            console.log(prompt);
            const apiKey = "AIzaSyD_mf53Ooc6BsKDJ1deVXBxkq-q06ehLdA";
            try {
                const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    }),
                });
                if (!res.ok) throw Error(`Gemini API error: ${res.status}`);
                const data = await res.json();
                console.log(data);
                answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                console.log(answer);
                if (answer === 'A') {
                    document.querySelector('#optionCol input[type="radio"]').click();
                } else if (answer === 'B') {
                    document.querySelectorAll('#optionCol input[type="radio"]')[1].click();
                } else if (answer === 'C') {
                    document.querySelectorAll('#optionCol input[type="radio"]')[2].click();
                } else if (answer === 'D') {
                    document.querySelectorAll('#optionCol input[type="radio"]')[3].click();
                }
            } catch (error) {
                console.error("Error during fetch or clipboard operation:", error);
            }
        } else {
            console.error("Question or options not found.");
        }
    }
});
console.log("#flash2o#");
