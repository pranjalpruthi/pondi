import streamlit as st
import requests
import re
import json

# --- Configuration and Data ---
CONFIG = {
    "BASE_URL": "https://db.vrindavanam.org.in",
    "API_TOKEN": "9jHtkGNXkbXht64VikGqy5CFVVctjxOFxrBxH8yz",
    "PROJECT_NAME": "ISKMP"
}

DEVOTEES_DATA = [
    {"name": "Prahlad Bhakta dasa"}, {"name": "Syama Govinda dasa"}, {"name": "Patita Pavan dasa"},
    {"name": "Devadatta dasa"}, {"name": "Divya Krishna dasa"}, {"name": "Ajay Gauranga dasa"},
    {"name": "Rajahamsa dasa"}, {"name": "Bhaja Hari dasa"}, {"name": "Pradyumna dasa"},
    {"name": "Subuddhi dasa"}, {"name": "Ananta Krishna dasa"}, {"name": "Pyari Mohan dasa"},
    {"name": "Bhakta Ashok"}, {"name": "Revati devi dasi"}, {"name": "Hari Priya Gopi devi dasi"},
    {"name": "Nanda Gopi devi dasi"}, {"name": "Shri Vidya devi dasi"}
]

BOOKS_DATA = [
    {"title": "Ramayan", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "Path of Perfection", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "topmost_yoga", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "science_of_self_realization", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "krishna_book", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "srimad_bhagavatam_first_canto", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "coming_back", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "isopanisad", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "rajavidya", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "path_of_yoga", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "life_comes_from_life", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "rasaraj", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "perfect_questions_perfect_answers", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "elevation_to_krishna_consciouness", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "transcendental_civilization", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "beyond_birth_death", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "on_the_way_to_krishna", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "teachings_of_queen_kunti", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "pocket_size_bhagavad_gita", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "dharma", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "brahma_samhita", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "teachings_of_lord_chaitanya", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "nectar_of_instruction", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "bhagavad_gita", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "easy_journey_to_other_planets", "author": "A.C. Bhaktivedanta Swami Prabhupada"},
    {"title": "why_worship_only_krishna", "author": "ISKM"}, {"title": "ia77", "author": "ISKM"}
]

PRODUCTS_DATA = [
    {'sku': 'RM-EN-01', 'language': 'English', 'book': 'Ramayan', 'cost_price': 70, 'selling_price': 120, 'stock_quantity': 1, 'min_stock': 5},
    {'sku': 'RM-TA-01', 'language': 'Tamil', 'book': 'Ramayan', 'cost_price': 70, 'selling_price': 120, 'stock_quantity': 11, 'min_stock': 5},
    {'sku': 'POP-EN-01', 'language': 'English', 'book': 'Path of Perfection', 'cost_price': 40, 'selling_price': 70, 'stock_quantity': 4, 'min_stock': 5},
    {'sku': 'TY-HI-01', 'language': 'Hindi', 'book': 'Topmost Yoga', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 10, 'min_stock': 10},
    {'sku': 'TY-EN-01', 'language': 'English', 'book': 'Topmost Yoga', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 8, 'min_stock': 10},
    {'sku': 'TY-TA-01', 'language': 'Tamil', 'book': 'Topmost Yoga', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 1, 'min_stock': 10},
    {'sku': 'SSR-EN-01', 'language': 'English', 'book': 'Science of Self Realization', 'cost_price': 70, 'selling_price': 120, 'stock_quantity': 11, 'min_stock': 10},
    {'sku': 'KB-HI-01', 'language': 'Hindi', 'book': 'Krishna Book', 'cost_price': 210, 'selling_price': 350, 'stock_quantity': 1, 'min_stock': 5},
    {'sku': 'KB-EN-01', 'language': 'English', 'book': 'Krishna Book', 'cost_price': 210, 'selling_price': 350, 'stock_quantity': 9, 'min_stock': 5},
    {'sku': 'KB-TA-01', 'language': 'Tamil', 'book': 'Krishna Book', 'cost_price': 210, 'selling_price': 350, 'stock_quantity': 9, 'min_stock': 5},
    {'sku': 'SB1-EN-01', 'language': 'English', 'book': 'Srimad Bhagavatam First Canto', 'cost_price': 420, 'selling_price': 700, 'stock_quantity': 6, 'min_stock': 3},
    {'sku': 'CB-HI-01', 'language': 'Hindi', 'book': 'Coming Back', 'cost_price': 30, 'selling_price': 50, 'stock_quantity': 38, 'min_stock': 10},
    {'sku': 'CB-EN-01', 'language': 'English', 'book': 'Coming Back', 'cost_price': 30, 'selling_price': 50, 'stock_quantity': 22, 'min_stock': 10},
    {'sku': 'CB-TA-01', 'language': 'Tamil', 'book': 'Coming Back', 'cost_price': 30, 'selling_price': 50, 'stock_quantity': 7, 'min_stock': 10},
    {'sku': 'ISO-EN-01', 'language': 'English', 'book': 'Isopanisad', 'cost_price': 30, 'selling_price': 50, 'stock_quantity': 4, 'min_stock': 5},
    {'sku': 'ISO-TA-01', 'language': 'Tamil', 'book': 'Isopanisad', 'cost_price': 30, 'selling_price': 50, 'stock_quantity': 7, 'min_stock': 5},
    {'sku': 'RV-EN-01', 'language': 'English', 'book': 'Rajavidya', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 12, 'min_stock': 10},
    {'sku': 'RV-TA-01', 'language': 'Tamil', 'book': 'Rajavidya', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 8, 'min_stock': 10},
    {'sku': 'POY-HI-01', 'language': 'Hindi', 'book': 'Path of Yoga', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 2, 'min_stock': 10},
    {'sku': 'POY-EN-01', 'language': 'English', 'book': 'Path of Yoga', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 22, 'min_stock': 10},
    {'sku': 'POY-TA-01', 'language': 'Tamil', 'book': 'Path of Yoga', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 10, 'min_stock': 10},
    {'sku': 'LCL-TA-01', 'language': 'Tamil', 'book': 'Life comes from Life', 'cost_price': 30, 'selling_price': 50, 'stock_quantity': 5, 'min_stock': 5},
    {'sku': 'RR-HI-01', 'language': 'Hindi', 'book': 'Rasaraj', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 8, 'min_stock': 10},
    {'sku': 'RR-EN-01', 'language': 'English', 'book': 'Rasaraj', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 47, 'min_stock': 10},
    {'sku': 'RR-TA-01', 'language': 'Tamil', 'book': 'Rasaraj', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 17, 'min_stock': 10},
    {'sku': 'PQPA-HI-01', 'language': 'Hindi', 'book': 'Perfect Questions Perfect Answers', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 26, 'min_stock': 10},
    {'sku': 'PQPA-EN-01', 'language': 'English', 'book': 'Perfect Questions Perfect Answers', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 13, 'min_stock': 10},
    {'sku': 'PQPA-TA-01', 'language': 'Tamil', 'book': 'Perfect Questions Perfect Answers', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 6, 'min_stock': 10},
    {'sku': 'EKC-EN-01', 'language': 'English', 'book': 'Elevation to Krishna Consciouness', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 8, 'min_stock': 10},
    {'sku': 'EKC-TA-01', 'language': 'Tamil', 'book': 'Elevation to Krishna Consciouness', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 9, 'min_stock': 10},
    {'sku': 'TC-EN-01', 'language': 'English', 'book': 'Transcendental Civilization', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 20, 'min_stock': 10},
    {'sku': 'TC-TA-01', 'language': 'Tamil', 'book': 'Transcendental Civilization', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 16, 'min_stock': 10},
    {'sku': 'BBD-EN-01', 'language': 'English', 'book': 'Beyond birth & death', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 26, 'min_stock': 10},
    {'sku': 'OWK-HI-01', 'language': 'Hindi', 'book': 'On the way to Krishna', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 10, 'min_stock': 10},
    {'sku': 'OWK-EN-01', 'language': 'English', 'book': 'On the way to Krishna', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 13, 'min_stock': 10},
    {'sku': 'OWK-TA-01', 'language': 'Tamil', 'book': 'On the way to Krishna', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 12, 'min_stock': 10},
    {'sku': 'TQK-EN-01', 'language': 'English', 'book': 'Teachings of Queen Kunti', 'cost_price': 70, 'selling_price': 120, 'stock_quantity': 3, 'min_stock': 5},
    {'sku': 'BG-PK-EN-01', 'language': 'English', 'book': 'Pocket Size Bhagavad Gita', 'cost_price': 120, 'selling_price': 200, 'stock_quantity': 6, 'min_stock': 5},
    {'sku': 'DH-EN-01', 'language': 'English', 'book': 'Dharma', 'cost_price': 30, 'selling_price': 50, 'stock_quantity': 14, 'min_stock': 5},
    {'sku': 'DH-TA-01', 'language': 'Tamil', 'book': 'Dharma', 'cost_price': 30, 'selling_price': 50, 'stock_quantity': 10, 'min_stock': 5},
    {'sku': 'BS-EN-01', 'language': 'English', 'book': 'Brahma Samhita', 'cost_price': 30, 'selling_price': 50, 'stock_quantity': 3, 'min_stock': 5},
    {'sku': 'TLC-EN-01', 'language': 'English', 'book': 'Teachings of Lord Chaitanya', 'cost_price': 70, 'selling_price': 120, 'stock_quantity': 5, 'min_stock': 5},
    {'sku': 'NOI-EN-01', 'language': 'English', 'book': 'Nectar of Instruction', 'cost_price': 30, 'selling_price': 50, 'stock_quantity': 2, 'min_stock': 5},
    {'sku': 'BG-HI-01', 'language': 'Hindi', 'book': 'Bhagavad Gita', 'cost_price': 150, 'selling_price': 250, 'stock_quantity': 31, 'min_stock': 10},
    {'sku': 'BG-TA-01', 'language': 'Tamil', 'book': 'Bhagavad Gita', 'cost_price': 210, 'selling_price': 350, 'stock_quantity': 20, 'min_stock': 10},
    {'sku': 'EJ-HI-01', 'language': 'Hindi', 'book': 'Easy Journey to Other Planets', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 5, 'min_stock': 10},
    {'sku': 'EJ-EN-01', 'language': 'English', 'book': 'Easy Journey to Other Planets', 'cost_price': 15, 'selling_price': 30, 'stock_quantity': 4, 'min_stock': 10},
]

# --- NocoDB API Functions ---

def get_headers():
    return {
        "xc-token": CONFIG["API_TOKEN"],
        "Content-Type": "application/json"
    }

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

def create_table(base_id, table_name, columns):
    url = f"{CONFIG['BASE_URL']}/api/v2/meta/bases/{base_id}/tables"
    payload = {
        "table_name": table_name,
        "title": table_name,
        "columns": columns
    }
    response = requests.post(url, headers=get_headers(), data=json.dumps(payload))
    return response

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

def insert_data(table_id, data):
    url = f"{CONFIG['BASE_URL']}/api/v2/tables/{table_id}/records"
    # No longer need to transform keys here as PRODUCTS_DATA is already snake_case
    payload = data
    response = requests.post(url, headers=get_headers(), data=json.dumps(payload))
    return response

# --- Streamlit UI ---

st.title("Setup and Populate Database")

base_id = get_base_id(CONFIG["PROJECT_NAME"])

if not base_id:
    st.error(f"Could not find Base ID for project: {CONFIG['PROJECT_NAME']}. Please check your project name and API token.")
else:
    st.success(f"Successfully connected to project '{CONFIG['PROJECT_NAME']}' with Base ID: {base_id}")

    st.header("1. Create Tables")
    if st.button("Create All Tables"):
        st.info("Creating tables... please wait.")

        devotees_columns = [{"column_name": "name", "title": "Name", "uidt": "SingleLineText"}]
        books_columns = [
            {"column_name": "title", "title": "Title", "uidt": "SingleLineText"},
            {"column_name": "author", "title": "Author", "uidt": "SingleLineText"}
        ]
        products_columns = [
            {"column_name": "sku", "title": "SKU", "uidt": "SingleLineText"},
            {"column_name": "language", "title": "Language", "uidt": "SingleLineText"},
            {"column_name": "book", "title": "Book", "uidt": "SingleLineText"},
            {"column_name": "cost_price", "title": "Cost Price", "uidt": "Number"},
            {"column_name": "selling_price", "title": "Selling Price", "uidt": "Number"},
            {"column_name": "stock_quantity", "title": "Stock Quantity", "uidt": "Number"},
            {"column_name": "min_stock", "title": "Min Stock", "uidt": "Number"}
        ]
        distribution_log_columns = [
            {"column_name": "devotee", "title": "Devotee", "uidt": "SingleLineText"},
            {"column_name": "product", "title": "Product", "uidt": "SingleLineText"},
            {"column_name": "quantity", "title": "Quantity", "uidt": "Number"},
            {"column_name": "distribution_date", "title": "Distribution Date", "uidt": "Date"}
        ]

        tables_to_create = {
            "Devotees": devotees_columns,
            "Books": books_columns,
            "Products": products_columns,
            "DistributionLog": distribution_log_columns
        }

        for name, cols in tables_to_create.items():
            with st.spinner(f"Creating {name} table..."):
                response = create_table(base_id, name, cols)
                if response.status_code in [200, 201]:
                    st.success(f"{name} table created successfully.")
                else:
                    st.error(f"Error creating {name} table: {response.text}")

    st.header("2. Populate Tables")
    if st.button("Populate All Tables"):
        st.info("Populating tables with sample data... please wait.")

        data_to_populate = {
            "Devotees": DEVOTEES_DATA,
            "Books": BOOKS_DATA,
            "Products": PRODUCTS_DATA
        }

        for table_name, data in data_to_populate.items():
            table_id = get_table_id(base_id, table_name)
            if table_id:
                with st.spinner(f"Populating {table_name} table..."):
                    response = insert_data(table_id, data)
                    if response.status_code in [200, 201]:
                        st.success(f"{table_name} table populated successfully.")
                    else:
                        st.error(f"Error populating {table_name} table: {response.text}")
            else:
                st.error(f"Could not find Table ID for {table_name}. Please create the table first.")
