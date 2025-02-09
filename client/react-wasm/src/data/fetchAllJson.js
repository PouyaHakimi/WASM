export const fetchJsonData = async (jsonPath) => {
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${jsonPath}`);
      }
      const data = await response.json();
      console.log(`Data from ${jsonPath}:`, data); // Log the actual data
      return data;
    } catch (error) {
      console.error(`Error fetching ${jsonPath}:`, error);
      return null;
    }
  };