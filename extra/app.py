import streamlit as st

st.set_page_config(
    page_title="ISKMP Inventory Management",
    page_icon="🙏",
    layout="wide",
)

st.title("ISKMP Inventory Management")

st.sidebar.success("Select a page above.")

st.markdown(
    """
    Welcome to the ISKMP Inventory Management application.
    This application is designed to help manage the distribution of books.

    **👈 Select a page from the sidebar** to get started.

    ### Pages:
    - **Setup and Populate**: Use this page to set up the database tables and populate them with initial data.
    - **Distribution and Dashboard**: Use this page to log book distributions and view the inventory dashboard.
    """
)
