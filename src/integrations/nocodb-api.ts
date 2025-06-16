import axios from 'axios';

const CONFIG = {
  BASE_URL: import.meta.env.VITE_NOCODB_BASE_URL || "https://db.vrindavanam.org.in",
  API_TOKEN: import.meta.env.VITE_NOCODB_API_TOKEN || "",
  PROJECT_NAME: "ISKMP",
  BASE_ID: "plb5ivo4io22uv8"
};

const apiClient = axios.create({
  baseURL: `${CONFIG.BASE_URL}/api/v2`,
  headers: {
    'xc-token': CONFIG.API_TOKEN,
    'Content-Type': 'application/json'
  }
});

// Cache for table IDs
const tableIdCache: { [key: string]: string } = {};

// Function to fetch table ID by name
async function getTableId(tableName: string): Promise<string> {
  if (tableIdCache[tableName]) {
    return tableIdCache[tableName];
  }

  try {
    const response = await apiClient.get(`/meta/bases/${CONFIG.BASE_ID}/tables`);
    const tables = response.data.list;
    const table = tables.find((t: any) => t.title === tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found`);
    }
    tableIdCache[tableName] = table.id;
    return table.id;
  } catch (error) {
    console.error(`Error fetching table ID for ${tableName}:`, error);
    throw error;
  }
}

export async function getDevotees(limit?: number, offset = 0) {
  try {
    const tableId = await getTableId('Devotees');
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
    const tableId = await getTableId('Books');
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
    const tableId = await getTableId('Products');
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
    const tableId = await getTableId('DistributionLog');
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
    const tableId = await getTableId('DistributionLog');
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
    const tableId = await getTableId('Products');
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
