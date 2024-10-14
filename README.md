# CoffeeTrackerWebApp

This is a web application that allows users to track their coffee consumption. The application uses a .NET Web API for the backend and an Angular application for the frontend. Users can view, create, edit, and delete coffee consumption records, providing a seamless single-page application (SPA) experience.
<https://www.thecsharpacademy.com/project/32/Coffee%20Tracker>

## Features

- Contains a single 'Records' table to store coffee consumption data.
- Uses Entity Framework Core to interact with the database and create the necessary schema.
- Implements a minimal API to connect the front-end and the database.
- Uses Angular for the front-end to call the minimal API in the backend.
- Displays a list of coffee consumption records with options to add, edit, and delete entries.
- Provides a user-friendly interface for managing coffee consumption records.
- Presents confirmation messages for delete operations and success messages for updates.
- Can filter the records.

## Getting Started

To run the application, follow these steps:

1. Clone the repository to your local machine.
2. Open the solution in Visual Studio.
3. Build the solution to restore NuGet packages and compile the code.
4. Run the `CoffeeTrackerWebApp` project to start the web application.

## Dependencies

- Microsoft.EntityFrameworkCore: The application uses this package to manage the database context and entity relationships.
- Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore: The application uses this package for error handling related to the database.
- Angular CLI: The application uses this package to manage the Angular frontend.

## Usage

1. The application will display a list of coffee consumption records with options to add, edit, and delete entries.
2. Use the input form to add new records.
3. Click on the edit button to modify existing records.
4. Click on the delete button to remove records from the list. A confirmation message will be presented before deletion.
5. Use the filter options on any column.

## License

This project is licensed under the MIT License.

## Resources Used

- [The C# Academy](https://www.thecsharpacademy.com/)
- GitHub Copilot to generate code snippets.
