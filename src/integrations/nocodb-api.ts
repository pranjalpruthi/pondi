import axios from 'axios';

const CONFIG = {
  BASE_URL: import.meta.env.VITE_NOCODB_BASE_URL || "https://db.vrindavanam.org.in",
  API_TOKEN: import.meta.env.VITE_NOCODB_API_TOKEN || "",
  PROJECTS: {
    ISKMP: {
      NAME: "ISKMP",
      BASE_ID: "plb5ivo4io22uv8"
    },
    ISKMGlobal: {
      NAME: "ISKMGlobal",
      BASE_ID: "poa6cyjf7bwcokm"
    }
  }
};

const apiClient = axios.create({
  baseURL: `${CONFIG.BASE_URL}/api/v2`,
  headers: {
    'xc-token': CONFIG.API_TOKEN,
    'Content-Type': 'application/json'
  }
});

// Cache for table IDs per base
const tableIdCache: { [baseId: string]: { [key: string]: string } } = {};

// Function to fetch table ID by name for a specific base
async function getTableId(tableName: string, baseId: string): Promise<string> {
  if (!tableIdCache[baseId]) {
    tableIdCache[baseId] = {};
  }
  
  if (tableIdCache[baseId][tableName]) {
    return tableIdCache[baseId][tableName];
  }

  try {
    const response = await apiClient.get(`/meta/bases/${baseId}/tables`);
    const tables = response.data.list;
    const table = tables.find((t: any) => t.title === tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found in base ${baseId}`);
    }
    tableIdCache[baseId][tableName] = table.id;
    return table.id;
  } catch (error) {
    console.error(`Error fetching table ID for ${tableName} in base ${baseId}:`, error);
    throw error;
  }
}

export async function getDevotees(limit?: number, offset = 0) {
  try {
    const tableId = await getTableId('Devotees', CONFIG.PROJECTS.ISKMP.BASE_ID);
    const query = limit !== undefined ? `limit=${limit}&` : '';
    const response = await apiClient.get(`/tables/${tableId}/records?${query}offset=${offset}`);
    return {
      list: response.data.list,
      pageInfo: response.data.pageInfo
    };
  } catch (error) {
    console.error('Error fetching devotees:', error);
    throw error;
  }
}

export async function getBooks(limit?: number, offset = 0) {
  try {
    const tableId = await getTableId('Books', CONFIG.PROJECTS.ISKMP.BASE_ID);
    const query = limit !== undefined ? `limit=${limit}&` : '';
    const response = await apiClient.get(`/tables/${tableId}/records?${query}offset=${offset}`);
    return {
      list: response.data.list,
      pageInfo: response.data.pageInfo
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

export async function getProducts(limit?: number, offset = 0) {
  try {
    const tableId = await getTableId('Products', CONFIG.PROJECTS.ISKMP.BASE_ID);
    const query = limit !== undefined ? `limit=${limit}&` : '';
    const response = await apiClient.get(`/tables/${tableId}/records?${query}offset=${offset}`);
    return {
      list: response.data.list,
      pageInfo: response.data.pageInfo
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getDistributionLog(limit?: number, offset = 0) {
  try {
    const tableId = await getTableId('DistributionLog', CONFIG.PROJECTS.ISKMP.BASE_ID);
    const query = limit !== undefined ? `limit=${limit}&` : '';
    const response = await apiClient.get(`/tables/${tableId}/records?${query}offset=${offset}`);
    return {
      list: response.data.list,
      pageInfo: response.data.pageInfo
    };
  } catch (error) {
    console.error('Error fetching distribution log:', error);
    throw error;
  }
}

export async function submitDistributionLog(data: { devoteeName: string, bookEntries: Array<{ book: string, quantity: number }> }) {
  try {
    const tableId = await getTableId('DistributionLog', CONFIG.PROJECTS.ISKMP.BASE_ID);
    const entries = data.bookEntries.map(entry => ({
      devotee: data.devoteeName,
      product: entry.book,
      quantity: entry.quantity,
      distribution_date: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
    }));
    
    const response = await apiClient.post(`/tables/${tableId}/records`, {
      data: entries
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting distribution log:', error);
    throw error;
  }
}

export async function updateBookInventory(bookTitle: string, quantity: number) {
  try {
    const tableId = await getTableId('Products', CONFIG.PROJECTS.ISKMP.BASE_ID);
    // First, get the current stock for the book
    const getResponse = await apiClient.get(`/tables/${tableId}/records`, {
      params: {
        where: `(BookTitle,eq,${bookTitle})`
      }
    });
    
    const bookRecord = getResponse.data.list[0];
    if (!bookRecord) {
      throw new Error(`Book titled ${bookTitle} not found in inventory.`);
    }
    
    const newStock = Math.max(0, bookRecord.Stock - quantity);
    const updateResponse = await apiClient.patch(`/tables/${tableId}/records/${bookRecord.Id}`, {
      Stock: newStock
    });
    return updateResponse.data;
  } catch (error) {
    console.error('Error updating book inventory:', error);
    throw error;
  }
}

/**
 * Fetches centers data from ISKMGlobal base.
 * @param limit - Maximum number of records to return.
 * @param offset - Number of records to skip from the beginning.
 * @returns An object containing the list of centers and pagination information.
 */
export async function getCenters(limit?: number, offset = 0) {
  try {
    const tableId = await getTableId('Centers', CONFIG.PROJECTS.ISKMGlobal.BASE_ID);
    const query = limit !== undefined ? `limit=${limit}&` : '';
    const response = await apiClient.get(`/tables/${tableId}/records?${query}offset=${offset}`);
    return {
      list: response.data.list,
      pageInfo: response.data.pageInfo
    };
  } catch (error) {
    console.error('Error fetching centers:', error);
    throw error;
  }
}

/**
 * Fetches hero images from the NocoDB ISKMP base.
 * @returns An object containing the list of hero images.
 */
export async function getHeroImages() {
  try {
    const tableId = await getTableId('hero_images', CONFIG.PROJECTS.ISKMP.BASE_ID);
    const response = await apiClient.get(`/tables/${tableId}/records`);
    
    // The 'image' field in NocoDB is an array of attachments. We need to construct the full URL.
    const formattedList = response.data.list.map((record: any) => {
      const imageUrl = record.image && record.image.length > 0 
        ? `${CONFIG.BASE_URL}${record.image[0].path}` 
        : null;

      return {
        ...record,
        image_url: imageUrl,
      };
    });

    return {
      list: formattedList,
      pageInfo: response.data.pageInfo
    };
  } catch (error) {
    console.error('Error fetching hero images:', error);
    throw error;
  }
}

/**
 * Fetches shlokas data from ISKMP base.
 * @param limit - Maximum number of records to return. Set to a high number to fetch all records.
 * @param offset - Number of records to skip from the beginning.
 * @returns An object containing the list of shlokas and pagination information.
 */
export async function getShlokas(limit: number = 1000, offset = 0) {
  try {
    const tableId = await getTableId('Shlokas', CONFIG.PROJECTS.ISKMP.BASE_ID);
    const query = limit !== undefined ? `limit=${limit}&` : '';
    const response = await apiClient.get(`/tables/${tableId}/records?${query}offset=${offset}`);
    return {
      list: response.data.list,
      pageInfo: response.data.pageInfo
    };
  } catch (error) {
    console.error('Error fetching shlokas:', error);
    throw error;
  }
}

/**
 * Interface for lead data submission.
 */
interface LeadData {
  Name?: string;
  Email?: string;
  Phone?: string;
  Source: 'Newsletter' | 'Shop Waitlist' | 'Magazine Subscription' | 'AI Bot';
  Status?: 'New' | 'Contacted' | 'Converted';
  Notes?: string;
}

/**
 * Submits a new lead to the Leads table in NocoDB.
 * @param leadData - The lead data to submit.
 * @returns The response data from the API.
 */
export async function addLead(leadData: LeadData) {
  try {
    const tableId = await getTableId('Leads', CONFIG.PROJECTS.ISKMP.BASE_ID);
    
    const response = await apiClient.post(`/tables/${tableId}/records`, {
        ...leadData,
        SubscribedAt: new Date().toISOString(),
        Status: leadData.Status || 'New',
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error submitting lead:', error.response?.data || error.message);
    // Re-throwing the error so the calling function (e.g., a React component) can handle it.
    throw error;
  }
}
