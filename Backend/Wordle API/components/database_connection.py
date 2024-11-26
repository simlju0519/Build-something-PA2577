import mysql.connector
from mysql.connector import Error
import os

class DatabaseConnection:
    _instance = None

    def __new__(cls, *args, **kwargs):
        # Singleton pattern: Ensure only one instance is created
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        # Initialize connection and cursor as None
        if not hasattr(self, 'connection') or self.connection is None:
            self.connection = None
        if not hasattr(self, 'cursor') or self.cursor is None:
            self.cursor = None

    def connect(self):
        # Establish the connection if it doesn't exist
        if self.connection is None:
            try:
                self.connection = mysql.connector.connect(
                    host=os.getenv('MYSQL_HOST'),
                    user=os.getenv('MYSQL_USER'),
                    password=os.getenv('MYSQL_PASSWORD'),
                    database=os.getenv('MYSQL_DB')  # This will use JSBMain from the .env file
                )
                self.cursor = self.connection.cursor(dictionary=True)  # Create a cursor object
                print("Database connection established")
            except Error as e:
                print(f"Error connecting to the database: {e}")
                self.connection = None
                self.cursor = None
        return self.connection, self.cursor

    def close(self):
        # Close the cursor and connection if they exist
        if self.cursor is not None:
            self.cursor.close()
        if self.connection is not None:
            self.connection.close()
            print("Database connection closed")
        self.connection = None
        self.cursor = None

    def execute_query(self, query, params=None):
        """
        Execute a query on the database.

        :param query: The query to execute
        :param params: The parameters to pass to the query
           Example: db.execute_query("SELECT * FROM table WHERE id = %s", (id,))
        
        :return: The response from the query
        """
        connection, cursor = self.connect()

        if connection is None:
            raise Exception("Failed to connect to the database")

        response = None  # Placeholder for the response

        try:
            # Execute the query
            cursor.execute(query, params)

            # Only attempt to fetch results if it's a SELECT query
            if query.strip().lower().startswith("select"):
                response = cursor.fetchall()  # Fetch all rows from the SELECT query
            else:
                connection.commit()  # For non-SELECT queries, commit the transaction

        except mysql.connector.Error as e:
            print(f"Error executing query: {e}")
            raise

        finally:
            # Always ensure that unread results are handled
            if cursor.with_rows:  # Check if there are unread rows
                cursor.fetchall()  # Fetch and discard any unread rows
            
            self.close()  # Close the connection and cursor

        return response

    def execute_many(self, query, params):
        """
        Execute a query on the database with multiple sets of parameters.

        :param query: The query to execute
        :param params: A list of tuples containing the parameters
           Example: db.execute_many("INSERT INTO table (col1, col2) VALUES (%s, %s)", [(val1, val2), (val3, val4)])
        
        :return: The number of rows affected
        """
        connection, cursor = self.connect()

        if connection is None:
            raise Exception("Failed to connect to the database")

        response = None

        try:
            # Execute the query with multiple sets of parameters
            response = cursor.executemany(query, params)
            connection.commit()

        except mysql.connector.Error as e:
            print(f"Error executing query: {e}")
            raise # Re-raise the exception

        finally:
            self.close()

        return response