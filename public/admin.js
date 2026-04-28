async function api(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  if (res.status === 401) { location.href = "/login.html"; throw new Error("unauth"); }
  if (res.status === 403) { alert("Admin access only."); location.href = "/"; throw new Error("forbidden"); }
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
  return res.json();
}

function toast(msg, kind = "ok") {
  const t = document.createElement("div");
  t.className = `toast ${kind}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function fmtTime(ms) {
  if (!ms) return "—";
  const d = new Date(ms);
  return d.toLocaleString();
}

// --- Tabs ---
document.querySelectorAll(".tab").forEach((t) => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    const which = t.dataset.tab;
    document.querySelectorAll("[data-section]").forEach(s => {
      s.style.display = s.dataset.section === which ? "" : "none";
    });
    if (which === "users") loadUsers();
    if (which === "knowledge") loadDocs();
  });
});

// --- Knowledge / docs ---

async function loadDocs() {
  const docs = await api("/api/admin/documents");
  const tbody = document.querySelector("#docs-table tbody");
  tbody.innerHTML = "";
  if (!docs.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:var(--muted)">No documents yet — upload one above.</td></tr>`;
    return;
  }
  for (const d of docs) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escape(d.title)}</td>
      <td><code>${escape(d.source)}</code></td>
      <td>${d.chunk_count}</td>
      <td>${(d.char_count / 1024).toFixed(1)} KB</td>
      <td>${fmtTime(d.updated_at)}</td>
      <td><button class="ghost danger" data-id="${d.id}">Delete</button></td>
    `;
    tr.querySelector("button").addEventListener("click", async () => {
      if (!confirm(`Delete "${d.title}"?`)) return;
      await api(`/api/admin/documents/${d.id}`, { method: "DELETE" });
      toast("Deleted");
      loadDocs();
    });
    tbody.appendChild(tr);
  }
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", () => uploadFiles(fileInput.files));
["dragenter", "dragover"].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add("dragging"); }));
["dragleave", "drop"].forEach(ev => dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove("dragging"); }));
dropzone.addEventListener("drop", e => uploadFiles(e.dataTransfer.files));

async function uploadFiles(filelist) {
  const files = Array.from(filelist || []);
  if (!files.length) return;
  const fd = new FormData();
  for (const f of files) fd.append("files", f);
  const out = document.getElementById("upload-results");
  out.textContent = `Uploading & embedding ${files.length} file(s)…`;
  try {
    const res = await fetch("/api/admin/documents/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    const j = await res.json();
    out.innerHTML = j.results.map(r =>
      r.ok
        ? `<div style="color:var(--ok)">✓ ${escape(r.filename)} — ${r.chunks} chunks ${r.changed ? "" : "(unchanged)"}</div>`
        : `<div style="color:var(--error)">✗ ${escape(r.filename)} — ${escape(r.error)}</div>`
    ).join("");
    loadDocs();
  } catch (e) {
    out.innerHTML = `<div style="color:var(--error)">${escape(e.message)}</div>`;
  }
}

document.getElementById("note-submit").addEventListener("click", async () => {
  const title = document.getElementById("note-title").value.trim();
  const content = document.getElementById("note-content").value.trim();
  if (!title || !content) { toast("Title and content required", "err"); return; }
  try {
    await api("/api/admin/documents/text", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
    document.getElementById("note-title").value = "";
    document.getElementById("note-content").value = "";
    toast("Saved");
    loadDocs();
  } catch (e) {
    toast(e.message, "err");
  }
});

// --- Users / invites ---

async function loadUsers() {
  const [users, invites] = await Promise.all([
    api("/api/admin/users"),
    api("/api/admin/invites"),
  ]);
  const ut = document.querySelector("#users-table tbody");
  ut.innerHTML = users.map(u => `
    <tr>
      <td>${escape(u.email)}</td>
      <td>${escape(u.display_name || "")}</td>
      <td>${u.is_admin ? "✓" : ""}</td>
      <td>${fmtTime(u.created_at)}</td>
    </tr>
  `).join("");
  const it = document.querySelector("#invites-table tbody");
  it.innerHTML = invites.map(i => `
    <tr>
      <td>${escape(i.email || "(any)")}</td>
      <td>${i.is_admin ? "✓" : ""}</td>
      <td>${i.used_at ? fmtTime(i.used_at) : "—"}</td>
      <td>${fmtTime(i.created_at)}</td>
      <td>${i.used_at ? "" : `<a href="${location.origin}/signup.html?invite=${i.token}">copy link</a>`}</td>
    </tr>
  `).join("");
}

document.getElementById("invite-create").addEventListener("click", async () => {
  const email = document.getElementById("invite-email").value.trim();
  const is_admin = document.getElementById("invite-admin").checked;
  try {
    const inv = await api("/api/admin/invites", {
      method: "POST",
      body: JSON.stringify({ email: email || undefined, is_admin }),
    });
    const link = document.getElementById("invite-link");
    link.innerHTML = `Invite link: <a href="${inv.url}">${inv.url}</a>`;
    document.getElementById("invite-email").value = "";
    loadUsers();
  } catch (e) {
    toast(e.message, "err");
  }
});

// --- Boot ---
loadDocs();
