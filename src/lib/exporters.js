function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportJSON(responses) {
  const blob = new Blob([JSON.stringify(responses, null, 2)], {
    type: "application/json",
  });
  download(blob, `kiosk-survey-${Date.now()}.json`);
}

export function exportCSV(responses) {
  const headers = ["id", "timestamp", "top", "bottom", "sleeve", "age"];
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    return s.includes(",") || s.includes('"')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const rows = responses.map((r) =>
    headers.map((h) => escape(r[h])).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  download(blob, `kiosk-survey-${Date.now()}.csv`);
}