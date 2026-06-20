let memories = [];

function saveMemory(text) {
    memories.push(text);
    localStorage.setItem("memories", JSON.stringify(memories));
}

function loadMemory() {
    let data = localStorage.getItem("memories");
    if (data) {
        memories = JSON.parse(data);
    }
}

function getMemoryText() {
    return memories.join("\n");
}

loadMemory();