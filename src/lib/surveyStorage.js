const STORAGE_KEY = "kiosk_survey_responses";

export function getAllResponses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveResponse(response) {
  const all = getAllResponses();
  const entry = {
    ...response,
    timestamp: new Date().toISOString(),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  all.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // Fire-and-forget sync to Google Sheet — never blocks or delays the UI.
  fetch(
    "https://script.google.com/macros/s/AKfycbynPq2r8-9QXT-lexKPe98DJ416cWtilMSgkS5XKPVXadqBPRRWAMc0j93FiyHfYLkgbA/exec",
    {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        id: entry.id,
        timestamp: entry.timestamp,
        top: entry.top,
        bottom: entry.bottom,
        sleeve: entry.sleeve,
        age: entry.age,
      }),
    }
  ).catch(() => {});

  return entry;
}

export function clearAllResponses() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getTallies() {
  const all = getAllResponses();
  const tally = (key) => {
    const counts = {};
    all.forEach((r) => {
      const v = r[key];
      if (v) counts[v] = (counts[v] || 0) + 1;
    });
    return counts;
  };
  return {
    total: all.length,
    top: tally("top"),
    bottom: tally("bottom"),
    sleeve: tally("sleeve"),
    age: tally("age"),
  };
}