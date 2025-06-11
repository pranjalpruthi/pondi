import streamlit as st
import requests
import pandas as pd
import re
import json
from datetime import datetime

# --- Configuration ---
CONFIG = {
    "BASE_URL": "https://db.vrindavanam.org.in",
    "API_TOKEN": "9jHtkGNXkbXht64VikGqy5CFVVctjxOFxrBxH8yz",
    "PROJECT_NAME": "ISKMP"
}

# --- NocoDB API Functions ---

def _to_camel_case(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def get_headers():
    return {
        "xc-token": CONFIG["API_TOKEN"],
        "Content-Type": "application/json"
    }

# Using st.cache_data for better caching
@st.cache_data(ttl=3600)
def get_base_id(project_name):
    """Get the base ID for a given project name."""
    url = f"{CONFIG['BASE_URL']}/api/v2/meta/bases"
    headers = get_headers()
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        projects = response.json().get('list', [])
        for project in projects:
            if project.get('title') == project_name:
                return project.get('id')
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching base ID: {e}")
    return None

@st.cache_data(ttl=60)
def get_table_id(base_id, table_name):
    """Get the table ID for a given table name."""
    url = f"{CONFIG['BASE_URL']}/api/v2/meta/bases/{base_id}/tables"
    headers = get_headers()
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        tables = response.json().get('list', [])
        for table in tables:
            if table.get('title') == table_name:
                return table.get('id')
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching table ID for {table_name}: {e}")
    return None

def get_table_data(table_id):
    if not table_id:
        return []
    url = f"{CONFIG['BASE_URL']}/api/v2/tables/{table_id}/records"
    response = requests.get(url, headers=get_headers())
    if response.status_code == 200:
        data_list = response.json().get('list', [])
        
        # Transform keys from snake_case to camelCase for display in Streamlit
        transformed_data = []
        for item in data_list:
            transformed_item = {_to_camel_case(k): v for k, v in item.items()}
            transformed_data.append(transformed_item)
        return transformed_data
    else:
        st.error(f"Error fetching data from table ID {table_id}: {response.text}")
        return []

def update_stock(table_id, product_id, new_stock_qty):
    url = f"{CONFIG['BASE_URL']}/api/v2/tables/{table_id}/records"
    # FIX: The record identifier key must be 'Id' (capital I) for NocoDB patch operations.
    payload = [{
        "Id": product_id,
        "stock_qty": new_stock_qty
    }]
    response = requests.patch(url, headers=get_headers(), data=json.dumps(payload))
    return response

def log_distribution(table_id, log_data):
    url = f"{CONFIG['BASE_URL']}/api/v2/tables/{table_id}/records"
    response = requests.post(url, headers=get_headers(), data=json.dumps([log_data]))
    return response

# --- Streamlit UI ---

st.title("Distribution and Dashboard")

with st.expander("Connection Status", expanded=False):
    base_id = get_base_id(CONFIG["PROJECT_NAME"])

if not base_id:
    st.error(f"Could not find Base ID for project: {CONFIG['PROJECT_NAME']}. Please check your project name and API token.")
else:
    # --- Data Loading ---
    devotees_table_id = get_table_id(base_id, "Devotees")
    products_table_id = get_table_id(base_id, "Products")
    log_table_id = get_table_id(base_id, "DistributionLog")

    devotees = get_table_data(devotees_table_id)
    products = get_table_data(products_table_id)

    if not devotees or not products:
        st.warning("Could not load initial data (Devotees or Products). Please run the Setup script on the 'Setup' page.")
    else:
        devotee_names = [d['name'] for d in devotees] if devotees else []
        product_skus = [p['sku'] for p in products] if products else []

        # --- Distribution Form ---
        st.header("Log Book Distribution")

        selected_devotee = st.selectbox("Select Devotee", devotee_names)
        
        if 'books' not in st.session_state:
            st.session_state.books = [{"product_sku": product_skus[0] if product_skus else "", "quantity": 1}]

        def add_book():
            st.session_state.books.append({"product_sku": product_skus[0] if product_skus else "", "quantity": 1})

        def remove_book(index):
            st.session_state.books.pop(index)

        for i, book in enumerate(st.session_state.books):
            cols = st.columns([3, 1, 1])
            st.session_state.books[i]['product_sku'] = cols[0].selectbox(f"Select Product (Book {i+1})", product_skus, index=product_skus.index(book['product_sku']) if book.get('product_sku') in product_skus else 0, key=f"product_{i}")
            st.session_state.books[i]['quantity'] = cols[1].number_input(f"Quantity", min_value=1, value=book.get('quantity', 1), key=f"qty_{i}")
            if cols[2].button("🗑️", key=f"del_{i}"):
                remove_book(i)
                st.rerun()

        st.button("Add Another Book", on_click=add_book)
        
        if st.button("Submit Distribution"):
            if not log_table_id:
                st.error("DistributionLog table not found. Please run the Setup script on the 'Setup' page.")
            else:
                st.info("Processing distribution... please wait.")
                success_count = 0
                error_count = 0

                for book in st.session_state.books:
                    if book.get('product_sku') and book.get('quantity', 0) > 0:
                        product_details = next((p for p in products if p['sku'] == book['product_sku']), None)
                        
                        if product_details:
                            # Use 'stockQuantity' (camelCase) for consistency with transformed data.
                            new_stock = product_details['stockQuantity'] - book['quantity']
                            if new_stock >= 0:
                                # Use 'id' (camelCase) to get the record's unique ID.
                                update_response = update_stock(products_table_id, product_details['id'], new_stock)
                                
                                if update_response.status_code in [200, 201]:
                                    # Use snake_case for log entry keys to match the DistributionLog table schema.
                                    log_entry = {
                                        "devotee": selected_devotee,
                                        "product": book['product_sku'],
                                        "quantity": book['quantity'],
                                        "distribution_date": datetime.now().strftime('%Y-%m-%d')
                                    }
                                    log_response = log_distribution(log_table_id, log_entry)
                                    
                                    if log_response.status_code in [200, 201]:
                                        success_count += 1
                                    else:
                                        error_count += 1
                                        st.error(f"Failed to log distribution for {book['product_sku']}: {log_response.text}")
                                        # Revert stock on failure. Use 'id' and 'stockQuantity'.
                                        update_stock(products_table_id, product_details['id'], product_details['stockQuantity'])
                                else:
                                    error_count += 1
                                    st.error(f"Failed to update stock for {book['product_sku']}: {update_response.text}")
                            else:
                                error_count += 1
                                # Use 'stockQuantity' for the warning message.
                                st.warning(f"Not enough stock for {book['product_sku']}. Available: {product_details['stockQuantity']}, Tried to distribute: {book['quantity']}")
                        else:
                            error_count += 1
                            st.error(f"Product with SKU {book['product_sku']} not found.")

                if success_count > 0:
                    st.success(f"Successfully logged {success_count} distribution(s).")
                    st.cache_data.clear()
                if error_count > 0:
                    st.error(f"Encountered {error_count} error(s). Please check messages.")
                
                st.session_state.books = [{"product_sku": product_skus[0] if product_skus else "", "quantity": 1}]
                st.rerun()

        # --- Inventory Dashboard ---
        st.header("Inventory Dashboard")

        if products:
            df = pd.DataFrame(products)
            # Use camelCase column names for the dataframe display.
            display_columns = ['sku', 'book', 'language', 'stockQuantity', 'minStock', 'costPrice', 'sellingPrice']
            st.dataframe(df[display_columns])

            st.subheader("Low Stock Alert")
            # Use camelCase column names for filtering.
            low_stock_df = df[df['stockQuantity'] <= df['minStock']]
            if not low_stock_df.empty:
                st.warning("The following items are low on stock:")
                # Use camelCase column names for the low stock dataframe display.
                st.dataframe(low_stock_df[['sku', 'book', 'stockQuantity', 'minStock']])
            else:
                st.success("All items are sufficiently stocked.")
        else:
            st.warning("No product data found. Please populate the Products table on the 'Setup' page.")
