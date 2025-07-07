export async function fetchProtectedData(url) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found. User might not be logged in.");
    return null;
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const error = await res.text();
      console.warn("Failed to fetch protected data:", error);
      return null;
    }
  } catch (err) {
    console.error("Error fetching protected data:", err);
    return null;
  }
}
