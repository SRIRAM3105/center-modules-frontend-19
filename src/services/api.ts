
// API service for handling Spring Boot backend requests

/**
 * Base URL for API requests - replace with your actual Spring Boot API endpoint
 */
const API_BASE_URL = 'http://localhost:8080/api'; // Replace with your actual Spring Boot API URL

/**
 * Function to fetch community members distribution data from the Spring Boot API
 * @returns Promise with the distribution data
 */
export const fetchDistributionData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/distribution/members`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch distribution data:', error);
    // Return null if API fails so UI can handle fallback
    return null;
  }
};

/**
 * Function to generate and download PDF report from Spring Boot backend
 * @param reportData The data to include in the PDF report
 * @returns Promise with the PDF file URL
 */
export const generatePdfReport = async (reportData: any) => {
  try {
    // Send request to Spring Boot endpoint to generate PDF
    const response = await fetch(`${API_BASE_URL}/reports/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // For Spring Boot, typically we'd get the PDF as a blob
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Trigger download programmatically
    const link = document.createElement('a');
    link.href = url;
    link.download = 'community-solar-distribution-report.pdf';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return url;
  } catch (error) {
    console.error('Failed to generate PDF report:', error);
    return null;
  }
};

/**
 * Function to download a PDF file that's already been generated on the server
 * @param pdfId The ID or filename of the PDF to download
 * @returns Promise with success status
 */
export const downloadExistingPdf = async (pdfId: string) => {
  try {
    // Request the existing PDF file from the server
    const response = await fetch(`${API_BASE_URL}/reports/download/${pdfId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Get the file as a blob
    const blob = await response.blob();
    
    // Create a temporary URL to the blob
    const url = URL.createObjectURL(blob);
    
    // Create an invisible link to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${pdfId}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Failed to download existing PDF:', error);
    return false;
  }
};

/**
 * Function to submit user energy data to the Spring Boot backend
 * @param energyData The user energy consumption data
 * @returns Promise with the processed data or calculation results
 */
export const submitEnergyData = async (energyData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/energy/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(energyData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to submit energy data:', error);
    throw error;
  }
};

/**
 * Function to process payment for community solar project
 * @param paymentData Payment details including amount, method, etc.
 * @returns Promise with payment confirmation details
 */
export const processPayment = async (paymentData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to process payment:', error);
    throw error;
  }
};

/**
 * Function to register a new community member
 * @param userData User registration data
 * @returns Promise with the registered user details
 */
export const registerUser = async (userData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to register user:', error);
    throw error;
  }
};
