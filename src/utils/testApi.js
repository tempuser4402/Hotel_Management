const API_BASE_URL = "http://localhost:5000/api";

// Save paragraph
export const saveParagraph = async (content) => {
  try {
    const response = await fetch(`${API_BASE_URL}/test/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save paragraph");
    }

    return result;
  } catch (error) {
    console.error("Save API Error:", error);
    throw error;
  }
};

// Fetch paragraphs
export const fetchParagraphs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test/get`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch paragraphs");
    }

    return result;
  } catch (error) {
    console.error("Fetch API Error:", error);
    throw error;
  }
};