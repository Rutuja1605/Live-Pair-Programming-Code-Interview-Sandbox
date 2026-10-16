const challenges = {
  twoSum: {
    title: "Two Sum", meta: "Arrays · Easy · 15 min suggested",
    description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
    example: "twoSum([2, 7, 11, 15], 9) → [0, 1]",
    constraints: ["Exactly one valid answer exists.", "You may not use the same element twice.", "Return the answer in any order."],
    code: `function twoSum(nums, target) {
  // Use a map to remember numbers we've seen.
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`
  },
  palindrome: {
    title: "Palindrome Check", meta: "Strings · Easy · 10 min suggested",
    description: "Write a function that returns true when a string reads the same forward and backward. Ignore spaces, punctuation, and letter case.",
    example: "isPalindrome('A man, a plan, a canal: Panama') → true",
    constraints: ["Treat uppercase and lowercase letters as equal.", "Ignore spaces and punctuation.", "An empty normalized string is a palindrome."],
    code: `function isPalindrome(text) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized === normalized.split("").reverse().join("");
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("hello"));`
  },
  fizzBuzz: {
    title: "FizzBuzz", meta: "Fundamentals · Easy · 10 min suggested",
    description: "Return an array from 1 to n. For multiples of 3 use 'Fizz', for multiples of 5 use 'Buzz', and for multiples of both use 'FizzBuzz'.",
    example: "fizzBuzz(5) → [1, 2, 'Fizz', 4, 'Buzz']",
    constraints: ["n is a positive integer.", "Check multiples of 15 before 3 or 5.", "Return an array."],
    code: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(i);
  }
  return result;
}

console.log(fizzBuzz(15));`
  }
};
const editor = document.getElementById("codeEditor");
const lineNumbers = document.getElementById("lineNumbers");
const output = document.getElementById("outputContent");
const runStatus = document.getElementById("runStatus");
const runDuration = document.getElementById("runDuration");
const toast = document.getElementById("toast");
let currentChallenge = "twoSum";
let toastTimer;
let seconds = 30 * 60;
let timerInterval = null;
let showingTests = false;

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function updateLines() {
  const count = editor.value.split("\n").length;
  lineNumbers.textContent = Array.from({length: count}, (_, i) => i + 1).join("\n");
  document.getElementById("lineCount").textContent = `${count} ${count === 1 ? "line" : "lines"}`;
  lineNumbers.scrollTop = editor.scrollTop;
}
editor.addEventListener("input", updateLines);
editor.addEventListener("scroll", () => { lineNumbers.scrollTop = editor.scrollTop; });
editor.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = editor.selectionStart, end = editor.selectionEnd;
    editor.setRangeText("  ", start, end, "end");
    updateLines();
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runCode();
});
document.getElementById("fontSize").addEventListener("change", e => editor.style.fontSize = `${e.target.value}px`);
function loadChallenge(key) {
  currentChallenge = key;
  const c = challenges[key];
  document.getElementById("challengeTitle").textContent = c.title;
  document.getElementById("challengeMeta").textContent = c.meta;
  document.getElementById("problemDescription").textContent = c.description;
  document.getElementById("exampleCode").textContent = c.example;
  document.getElementById("constraints").innerHTML = c.constraints.map(item => `<li>${item}</li>`).join("");
  editor.value = c.code;
  updateLines();
  output.innerHTML = `<div class="empty-output"><div class="terminal-icon">›_</div><strong>Your output will appear here</strong><p>Run your code to see console output and errors.</p><button id="runEmpty" class="btn btn-primary">▶ Run code</button></div>`;
  document.getElementById("runEmpty")?.addEventListener("click", runCode);
  runStatus.innerHTML = '<span class="status-dot muted"></span> Waiting to run';
  runDuration.textContent = "—";
  document.getElementById("testBadge").textContent = "3";
  showingTests = false;
  document.querySelectorAll(".output-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === "output"));
}
document.getElementById("challengeSelect").addEventListener("change", e => loadChallenge(e.target.value));
document.getElementById("resetCode").addEventListener("click", () => {
  editor.value = challenges[currentChallenge].code; updateLines(); notify("Starter code restored.");
});
function renderOutput(lines, error, duration) {
  output.innerHTML = `<div class="result-title">${error ? "EXECUTION ERROR" : "CONSOLE OUTPUT"}</div><div class="result-line ${error ? "error-text" : ""}">${escapeHtml(lines.join("\n") || "(No output — add console.log() to inspect your result.)")}</div>`;
  runStatus.innerHTML = error ? '<span class="status-dot" style="background:#db5264"></span> Error' : '<span class="status-dot"></span> Run successful';
  runDuration.textContent = `${duration} ms`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function runCode() {
  const started = performance.now();
  const logs = [];
  const safeConsole = { log: (...args) => logs.push(args.map(v => {
    if (typeof v === "string") return v;
    try { return JSON.stringify(v, null, 2) ?? String(v); } catch { return String(v); }
  }).join(" ")) };
  try {
    // Practice sandbox: run candidate JavaScript in an isolated iframe with a console bridge.
    const iframe = document.createElement("iframe");
    iframe.sandbox = "allow-scripts";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const payload = JSON.stringify(editor.value);
    const script = `
      const captured = [];
      const safeConsole = {log: (...args) => captured.push(args.map(v => {
        try { return typeof v === 'string' ? v : JSON.stringify(v, null, 2) ?? String(v); }
        catch(e) { return String(v); }
      }).join(' '))};
      try {
        new Function('console', ${payload})(safeConsole);
        parent.postMessage({type:'pairlab-result', logs:captured}, '*');
      } catch(e) {
        parent.postMessage({type:'pairlab-error', error: e.name + ': ' + e.message}, '*');
      }`;
    const onMessage = (event) => {
      if (event.source !== iframe.contentWindow || !event.data || !String(event.data.type).startsWith("pairlab-")) return;
      window.removeEventListener("message", onMessage);
      const duration = Math.round(performance.now() - started);
      if (event.data.type === "pairlab-error") renderOutput([event.data.error], true, duration);
      else renderOutput(event.data.logs, false, duration);
      iframe.remove();
    };
    window.addEventListener("message", onMessage);
    iframe.srcdoc = `<script>${script.replace(/<\/script/gi, "<\\/script")}<\/script>`;
    output.innerHTML = '<div class="result-title">RUNNING…</div><div class="result-line">Executing JavaScript in an isolated frame.</div>';
    runStatus.innerHTML = '<span class="status-dot muted"></span> Running';
    // Prevent a permanently stuck UI if execution does not report back.
    setTimeout(() => {
      window.removeEventListener("message", onMessage);
      if (document.body.contains(iframe)) {
        iframe.remove();
        renderOutput(["Execution stopped or timed out. Check for an infinite loop."], true, Math.round(performance.now() - started));
      }
    }, 1800);
  } catch (err) {
    renderOutput([err.message], true, Math.round(performance.now() - started));
  }
}
document.getElementById("runEmpty").addEventListener("click", runCode);
document.getElementById("clearOutput").addEventListener("click", () => {
  output.innerHTML = '<div class="empty-output"><div class="terminal-icon">⌫</div><strong>Output cleared</strong><p>Run your code when you are ready.</p></div>';
  runStatus.innerHTML = '<span class="status-dot muted"></span> Waiting to run';
  runDuration.textContent = "—";
});
document.querySelectorAll(".output-tab").forEach(btn => btn.addEventListener("click", () => {
  showingTests = btn.dataset.tab === "tests";
  document.querySelectorAll(".output-tab").forEach(b => b.classList.toggle("active", b === btn));
  if (showingTests) renderTests(); else output.innerHTML = '<div class="empty-output"><div class="terminal-icon">›_</div><strong>Output panel</strong><p>Click Run code to execute your current solution.</p></div>';
}));
function renderTests() {
  const tests = {
    twoSum: [
      ["twoSum([2, 7, 11, 15], 9)", "[0, 1]", "Starter solution returns the matching indices."],
      ["twoSum([3, 2, 4], 6)", "[1, 2]", "Checks a pair that is not adjacent to the first item."],
      ["twoSum([3, 3], 6)", "[0, 1]", "Checks duplicate values."]
    ],
    palindrome: [
      ['isPalindrome("racecar")', "true", "A simple palindrome."],
      ['isPalindrome("hello")', "false", "A non-palindrome."],
      ['isPalindrome("A man, a plan, a canal: Panama")', "true", "Ignores case and punctuation."]
    ],
    fizzBuzz: [
      ["fizzBuzz(3)", '[1, 2, "Fizz"]', "Multiple of three."],
      ["fizzBuzz(5)", '[1, 2, "Fizz", 4, "Buzz"]', "Multiple of five."],
      ['fizzBuzz(15)[14]', '"FizzBuzz"', "Multiple of both three and five."]
    ]
  }[currentChallenge];
  output.innerHTML = `<div class="result-title">SAMPLE TEST CASES · ${tests.length} CASES</div>` + tests.map(t => `<div class="test-row"><span class="test-check">✓</span><div><strong>${escapeHtml(t[0])}</strong><small>Expected: ${escapeHtml(t[1])}</small><span>${escapeHtml(t[2])}</span></div></div>`).join("");
}
document.getElementById("startTimer").addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval); timerInterval = null;
    document.getElementById("startTimer").textContent = "▶ Resume";
  } else {
    timerInterval = setInterval(() => {
      if (seconds > 0) seconds--;
      updateTimer();
      if (seconds === 0) { clearInterval(timerInterval); timerInterval = null; notify("Interview timer finished."); }
    }, 1000);
    document.getElementById("startTimer").textContent = "Ⅱ Pause";
  }
});
document.getElementById("resetTimer").addEventListener("click", () => {
  clearInterval(timerInterval); timerInterval = null; seconds = 1800; updateTimer();
  document.getElementById("startTimer").textContent = "▶ Start";
});
function updateTimer() {
  const mins = Math.floor(seconds / 60), secs = seconds % 60;
  document.getElementById("timer").textContent = `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
  document.getElementById("timer").style.color = seconds <= 300 ? "#d84d63" : "var(--ink)";
}
document.getElementById("notes").addEventListener("input", e => {
  document.getElementById("noteCount").textContent = `${e.target.value.length} characters`;
  try { localStorage.setItem("pairlab-notes", e.target.value); } catch {}
});
try { document.getElementById("notes").value = localStorage.getItem("pairlab-notes") || ""; } catch {}
document.getElementById("notes").dispatchEvent(new Event("input"));
document.getElementById("toggleProblem").addEventListener("click", () => {
  const body = document.getElementById("problemBody");
  const hidden = body.style.display === "none";
  body.style.display = hidden ? "block" : "none";
  document.getElementById("toggleProblem").textContent = hidden ? "−" : "+";
});
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); notify("Copied to clipboard."); }
  catch { notify(`Room code: ${document.getElementById("sessionId").textContent}`); }
}
document.getElementById("copyRoomBtn").addEventListener("click", () => copyText(document.getElementById("sessionId").textContent));
document.getElementById("shareBtn").addEventListener("click", () => {
  const shareData = { title: "PairLab Interview Room", text: `Join my PairLab practice room: ${document.getElementById("sessionId").textContent}`, url: location.href };
  if (navigator.share) navigator.share(shareData).catch(() => copyText(location.href));
  else copyText(location.href);
});
document.querySelectorAll(".side-item").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".side-item").forEach(b => b.classList.toggle("active", b === btn));
  const view = btn.dataset.view;
  if (view === "problem") { document.getElementById("problemPanel").scrollIntoView({behavior:"smooth",block:"center"}); document.getElementById("problemPanel").style.outline = "2px solid #c8c1ff"; setTimeout(()=>document.getElementById("problemPanel").style.outline="",900); }
  if (view === "notes") { document.getElementById("notesPanel").scrollIntoView({behavior:"smooth",block:"center"}); document.getElementById("notes").focus(); }
  if (view === "editor") { document.getElementById("codeEditor").scrollIntoView({behavior:"smooth",block:"center"}); document.getElementById("codeEditor").focus(); }
}));
loadChallenge("twoSum");
