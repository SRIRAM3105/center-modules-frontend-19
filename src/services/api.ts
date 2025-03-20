
// API service for handling backend requests

/**
 * Base URL for API requests - replace with your actual API endpoint
 */
const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API URL

/**
 * Function to fetch community members distribution data from the API
 * @returns Promise with the distribution data
 */
export const fetchDistributionData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/distribution-report`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch distribution data:', error);
    // Return fallback data if API fails
    return null;
  }
};

/**
 * Function to generate and download PDF report
 * @param reportData The data to include in the PDF report
 * @returns Promise with the PDF file URL
 */
export const generatePdfReport = async (reportData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // If your API returns the PDF as a blob
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to generate PDF report:', error);
    return null;
  }
};
