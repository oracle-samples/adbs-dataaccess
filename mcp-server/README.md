# Autonomous AI Database MCP Server Tools

A collection of user-defined tools designed to streamline common database management and exploration tasks via a Model Context Protocol (MCP) server.

## Overview

This repository provides the configuration and logic for four core database tools. These tools utilize database functions to interact with your schema, providing structured metadata and query execution capabilities.

### Key Features
*   **Schema Exploration:** Quickly identify available database structures.
*   **Object Inspection:** List and drill down into specific table or view details.
*   **Built-in Pagination:** Tools handling large datasets include `limit` and `offset` parameters to manage memory and performance.
    *   `limit`: The maximum number of records to return (page size).
    *   `offset`: The number of records to skip (page number/starting point).

## Available Tools

### 1. LIST_SCHEMA
Retrieves a comprehensive list of all schemas within the database that the current user has permission to access.
*   **Use Case:** Finding where specific data might live.

### 2. LIST_OBJECTS
Returns a list of database objects (tables, views, etc.) for a specified schema.
*   **Parameters:** `schema_name`, `limit`, `offset`.
*   **Use Case:** Browsing the contents of a known schema.

### 3. GET_OBJECT_DETAILS
Provides detailed metadata for a specific database object within a given schema, including column types and constraints.
*   **Parameters:** `schema_name`, `object_name`.
*   **Use Case:** Understanding the structure of a table before writing queries.

### 4. EXECUTE_SQL
Executes a raw SQL statement against the database.
*   **Parameters:** `sql_query` (Note: Ensure the statement does **not** include a trailing semicolon).
*   **Use Case:** Performing custom data retrieval or manipulation.

## Setup
1. Run the accompanying SQL script in your database environment to register the necessary backend functions.
2. Configure your MCP server to point to these functions using the tool definitions provided in your server config.
