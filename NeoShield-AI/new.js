const urlToOpen = "chrome://extensions/";
async function authenticateUser() {
    let e = prompt("Enter the password to activate the extension:");
    try {
        let t = await fetch("https://localhost:6524/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: e }) });
        if (!t.ok) throw Error(`Server responded with status: ${t.status}`);
        let n = await t.json();
        1
            ? chrome.storage.local.set({ isLoggedIn: !0 }, () => {
                  alert("Login successful!"), solveQuestion();
              })
            : alert("Incorrect password. Access denied.");
    } catch (a) {}
}
function isJSONParsable(e) {
    try {
        return JSON.parse(e), !0;
    } catch (t) {
        return !1;
    }
}
function sendMessageToWebsite(e) {
    removeInjectedElement();
    let t = document.createElement("span");
    (t.id = `x-template-base-${e.currentKey}`), document.body.appendChild(t), window.postMessage(e.enabledExtensionCount, e.url);
}
function sendVerifyMessage(e) {
    window.postMessage(e, e.url);
}
function removeInjectedElement() {
    let e = document.querySelector('[id^="x-template-base-"]');
    e && e.remove();
}
function setExtensionActiveTime() {
    localStorage.setItem("extensionActiveTime", Date.now());
}
function waitForElement(e, t) {
    let n = setInterval(() => {
        let a = document.querySelector(e);
        a && (clearInterval(n), t(a));
    }, 100);
}
function delay(e) {
    return new Promise((t) => setTimeout(t, e));
}
let isPaused = false;

function togglePauseResume(event) {
    if (
        (event.key === "0" && event.ctrlKey && event.shiftKey) || 
        (event.key === "0" && event.metaKey && event.shiftKey)
    ) {
        isPaused = !isPaused;
    }
}

document.addEventListener("keydown", togglePauseResume);

async function solveQuestion() {
    let e = document.querySelector("div[aria-labelledby='each-type-question']");
    if (!e) return;
    var t = e.innerText.trim() + "in cpp do not write any comments or any explanation of code";
    let n = isPresent();
    var a = document.querySelector("textarea") || document.activeElement;
    if (a) {
        let o = document.querySelectorAll(".ace_layer.ace_text-layer"),
            r = "",
            s = [];
        if (((r += o[0].textContent.trim() + "\n"), o.length > 2)) {
            r += o[1].textContent.trim() + "\n";
            let i = 0,
                l = setInterval(() => {
                    if (i >= 600) {
                        clearInterval(l);
                        return;
                    }
                    let e = o[2]?.textContent;
                    e &&
                        e.split("\n").forEach((e) => {
                            e.split("    ").forEach((e) => {
                                "" === e.trim() || s.includes(e.trim()) || s.push(e.trim());
                            });
                        }),
                        i++;
                }, 100);
        }
        -1 != n &&
            (await delay(62e3),
            s.forEach((e) => {
                r += e + "\n";
            })),
            (t = t + " " + r);
    }
    try {
        let response = await fetch("https://localhost:6524/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: t })
        });
        if (!response.ok) throw Error(`Server responded with status: ${response.status}`);
        let data = await response.json();
        let serverResponse = data.response; 
        let textareas = document.querySelectorAll("textarea");
        let textarea = textareas.length > 2 ? textareas[1] : textareas[0];
        if (!textarea) return;
        let words = serverResponse.split(" ");
        for (let word of words) {
            while (isPaused) {
                await delay(100);
            }
            textarea.value += word + " ";
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
            await delay(500);
        }
    } catch (error) {
    }
}
function isPresent() {
    var e = [1, 2, 3, 4, 5];
    for (let t = 0; t < e.length; t++) if (document.getElementById(`tt-answer-0${e[t]}-ttAnswerEditor1`)) return t;
    return -1;
}
window.addEventListener("message", (e) => {
    if (e.source === window) {
        let { msg: t, currentKey: n } = e.data;
        if (isJSONParsable(t))
            try {
                let a = JSON.parse(t);
                if (a?.connectionId) return void chrome.runtime.sendMessage({ action: "setConnectionId", connectionId: a.connectionId });
            } catch (o) {}
        if ("pageReloaded" === t || "openNewTab" === t || "windowFocus" === t) {
            let r = "pageReloaded" === t ? "pageReloaded" : "openNewTab" === t ? "openNewTab" : "windowFocus",
                s = { action: r, key: n };
            "openNewTab" === r && (s.url = "chrome://extensions/"), chrome.runtime.sendMessage(s);
        }
    }
}),
    window.addEventListener("beforeunload", () => {
        removeInjectedElement();
    }),
    chrome.runtime.onMessage.addListener((e) => {
        "getUrlAndExtensionData" === e.action ? e.url && sendMessageToWebsite(e) : "removeInjectedElement" === e.action ? removeInjectedElement() : "invalid" === e.action && sendVerifyMessage(e);
    }),
    setInterval(() => {
        setExtensionActiveTime();
    }, 1e3),
    waitForElement('[aria-labelledby="output-format-title"]', (e) => {
        e.addEventListener("click", () => {
            chrome.storage.local.get(["isLoggedIn"], (e) => {
                if (1) {
                    let t = document.querySelectorAll("textarea");
                    if (t.length > 2) var n = t[1];
                    else var n = t[0];
                    n && ((n.value += "q"), n.dispatchEvent(new Event("input", { bubbles: !0 }))), solveQuestion();
                } else authenticateUser();
            });
        });
    });