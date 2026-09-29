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