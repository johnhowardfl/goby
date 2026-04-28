// Single-page chat client. Vanilla JS, no framework.

const root = document.getElementById("root");

const state = {
  user: null,
  conversations: [],
  activeId: null,
  messages: [],
  context: null,
  streaming: false,
  searchQuery: "",
  searchResults: null, // null = not searching; [] = searched but no hits
};

async function api(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  if (res.status === 401) { location.href = "/login.html"; throw new Error("unauth"); }
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
  return res.json();
}

async function loadMe() {
  const me = await fetch("/api/auth/me").then(r => r.json());
  if (!me.user) {
    if (me.needs_bootstrap) { location.href = "/signup.html"; return false; }
    location.href = "/login.html";
    return false;
  }
  state.user = me.user;
  return true;
}

async function loadConversations() {
  state.conversations = await api("/api/chat/conversations");
}

async function selectConversation(id) {
  state.activeId = id;
  state.context = null;
  const data = await api(`/api/chat/conversations/${id}`);
  state.messages = data.messages;
  render();
  scrollMessagesToBottom();
}

async function newConversation() {
  const conv = await api("/api/chat/conversations", { method: "POST", body: "{}" });
  state.conversations.unshift(conv);
  state.messages = [];
  state.activeId = conv.id;
  state.context = null;
  render();
}

async function deleteConversation(id) {
  if (!confirm("Delete this conversation?")) return;
  await api(`/api/chat/conversations/${id}`, { method: "DELETE" });
  state.conversations = state.conversations.filter(c => c.id !== id);
  if (state.activeId === id) {
    state.activeId = null;
    state.messages = [];
  }
  render();
}

async function sendMessage(text) {
  if (!state.activeId) await newConversation();
  state.messages.push({ role: "user", content: text });
  state.messages.push({ role: "assistant", content: "", _streaming: true });
  state.streaming = true;
  state.context = null;
  render();
  scrollMessagesToBottom();

  // Use fetch with manual SSE parsing (browsers' EventSource doesn't support POST).
  const res = await fetch(`/api/chat/conversations/${state.activeId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text }),
  });
  if (!res.ok || !res.body) {
    state.messages[state.messages.length - 1].content = "Failed to send.";
    state.streaming = false;
    render();
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const block = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const lines = block.split("\n");
      let event = "message", data = "";
      for (const line of lines) {
        if (line.startsWith("event: ")) event = line.slice(7).trim();
        else if (line.startsWith("data: ")) data += line.slice(6);
      }
      let parsed;
      try { parsed = JSON.parse(data); } catch { parsed = data; }
      handleEvent(event, parsed);
    }
  }
  state.streaming = false;
  // Refresh sidebar so updated_at sorts the active conversation to the top.
  loadConversations().then(render).catch(() => {});
}

function handleEvent(event, data) {
  const last = state.messages[state.messages.length - 1];
  if (event === "context") {
    state.context = data;
    render();
  } else if (event === "delta") {
    last.content += data;
    renderMessages();
    scrollMessagesToBottom();
  } else if (event === "done") {
    last._streaming = false;
    last.citations = JSON.stringify(data.citations || []);
    render();
  } else if (event === "error") {
    last.content += `\n\n[error: ${data}]`;
    last._streaming = false;
    render();
  }
}

function scrollMessagesToBottom() {
  requestAnimationFrame(() => {
    const m = document.querySelector(".messages");
    if (m) m.scrollTop = m.scrollHeight;
  });
}

// --- Rendering ---

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k === "onClick") e.addEventListener("click", v);
    else if (k === "html") e.innerHTML = v;
    else if (v !== undefined && v !== null) e.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null || c === false) continue;
    if (Array.isArray(c)) c.forEach(x => x && e.appendChild(typeof x === "string" ? document.createTextNode(x) : x));
    else e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return e;
}

function render() {
  root.innerHTML = "";
  root.appendChild(renderShell());
}

function renderShell() {
  const sidebar = el("aside", { class: "sidebar" },
    el("div", { class: "sidebar-header" },
      el("img", { src: "/goby-icon.png", alt: "Goby", class: "brand-icon" }),
      el("div", { class: "brand" }, "Goby ", el("small", {}, "LeadSpeed")),
    ),
    el("button", { class: "new-btn", onClick: () => newConversation() }, "+ New chat"),
    renderSearch(),
    renderConvList(),
    renderUserFooter(),
  );

  const main = el("main", { class: "main" },
    el("div", { class: "mobile-bar" },
      el("button", { class: "menu-btn", onClick: () => document.querySelector(".sidebar").classList.toggle("open") }, "☰"),
      el("img", { src: "/goby-icon.png", alt: "Goby", class: "brand-icon" }),
      el("div", { class: "brand" }, "Goby"),
    ),
    renderMessagesContainer(),
    renderComposer(),
  );

  return el("div", { class: "app" }, sidebar, main);
}

function renderSearch() {
  const input = el("input", {
    type: "search",
    class: "conv-search",
    placeholder: "Search history…",
    value: state.searchQuery,
  });
  input.addEventListener("input", (e) => debouncedSearch(e.target.value));
  return el("div", { class: "conv-search-wrap" }, input);
}

let searchTimer;
function debouncedSearch(q) {
  state.searchQuery = q;
  clearTimeout(searchTimer);
  if (!q.trim()) {
    state.searchResults = null;
    refreshConvList();
    return;
  }
  searchTimer = setTimeout(async () => {
    try {
      state.searchResults = await api(`/api/chat/search?q=${encodeURIComponent(q.trim())}`);
    } catch {
      state.searchResults = [];
    }
    refreshConvList();
  }, 200);
}

function refreshConvList() {
  const old = document.querySelector(".conv-list");
  if (old) old.replaceWith(renderConvList());
}

function renderConvList() {
  const list = el("div", { class: "conv-list" });
  const searching = state.searchResults !== null;
  const items = searching ? state.searchResults : state.conversations;

  if (items.length === 0) {
    const msg = searching
      ? `No matches for "${state.searchQuery}".`
      : "No conversations yet.";
    list.appendChild(el("div", { class: "empty-list" }, msg));
    return list;
  }

  for (const c of items) {
    const title = c.title || (state.activeId === c.id && state.messages[0]?.content?.slice(0, 40)) || `Conversation #${c.id}`;
    const children = [el("div", { class: "conv-title" }, title)];
    if (searching && c.snippet) {
      children.push(el("div", { class: "conv-snippet" },
        c.match_role === "assistant" ? "Goby: " : "",
        c.snippet,
      ));
    }
    const item = el("div", {
      class: "conv-item" + (state.activeId === c.id ? " active" : ""),
      onClick: () => selectConversation(c.id),
    }, ...children);
    item.title = "Click to open. Right-click to delete.";
    item.addEventListener("contextmenu", (e) => { e.preventDefault(); deleteConversation(c.id); });
    list.appendChild(item);
  }
  return list;
}

function renderUserFooter() {
  const u = state.user;
  return el("div", { class: "sidebar-footer" },
    el("div", { class: "who" }, u.display_name || u.email),
    el("div", { class: "row" },
      el("div", {},
        u.is_admin ? el("a", { href: "/admin.html" }, "Admin") : "",
      ),
      el("a", { href: "#", onClick: async (e) => { e.preventDefault(); await fetch("/api/auth/logout", { method: "POST" }); location.href = "/login.html"; } }, "Sign out"),
    ),
  );
}

function renderMessagesContainer() {
  const container = el("div", { class: "messages" });
  if (state.messages.length === 0) {
    container.appendChild(
      el("div", { class: "empty" },
        el("h2", {}, "Ask me about LeadSpeed"),
        el("div", {}, "I have access to internal docs and tribal knowledge that admins have loaded."),
      ),
    );
    return container;
  }
  const inner = el("div", { class: "messages-inner" });
  for (const m of state.messages) {
    const body = el("div", { class: "body" }, m.content || (m._streaming ? "…" : ""));
    const cits = m.citations ? JSON.parse(m.citations) : [];
    const citEl = cits.length
      ? el("div", { class: "citations" }, "Sources: ", ...cits.map(c => el("code", {}, c)))
      : null;
    const isGoby = m.role === "assistant";
    const roleEl = el("div", { class: "role" },
      isGoby ? el("img", { src: "/goby-icon.png", alt: "", class: "role-avatar" }) : null,
      isGoby ? "Goby" : (state.user.display_name || state.user.email),
    );
    inner.appendChild(el("div", { class: `msg ${m.role}` },
      roleEl,
      body,
      citEl,
    ));
  }
  if (state.context && state.streaming) {
    const ctx = el("div", { class: "context" },
      "Retrieved: ",
      ...state.context.map((c, i) => el("span", {}, (i ? ", " : ""), el("span", { class: "src" }, c.title), ` (${c.score})`)),
    );
    inner.appendChild(ctx);
  }
  container.appendChild(inner);
  return container;
}

function renderMessages() {
  // Re-render only the messages container during streaming for performance.
  const old = document.querySelector(".messages");
  if (!old) return;
  const fresh = renderMessagesContainer();
  old.replaceWith(fresh);
}

function renderComposer() {
  const ta = el("textarea", { placeholder: "Ask Goby anything about LeadSpeed…", rows: 1 });
  ta.addEventListener("input", () => {
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  });
  ta.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });
  const btn = el("button", { onClick: submit }, "Send");
  function submit() {
    const text = ta.value.trim();
    if (!text || state.streaming) return;
    ta.value = "";
    ta.style.height = "auto";
    sendMessage(text);
  }
  return el("div", { class: "composer" },
    el("div", { class: "composer-inner" }, ta, btn),
  );
}

// --- Boot ---
(async () => {
  if (!(await loadMe())) return;
  await loadConversations();
  if (state.conversations.length > 0) {
    await selectConversation(state.conversations[0].id);
  } else {
    render();
  }
})();
