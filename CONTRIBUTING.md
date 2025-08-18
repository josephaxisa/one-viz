# Contributing to One-viz

Thank you for your interest in contributing! We welcome contributions from everyone. This document provides the guidelines you need to get started with the project.

## How to Contribute

*   **Reporting Bugs:** If you find a bug, please open an issue on our GitHub page. Include a clear title, a description of the issue, and steps to reproduce it.
*   **Suggesting Enhancements:** If you have an idea for a new feature or an improvement, open an issue to discuss it.
*   **Pull Requests:** We welcome pull requests for bug fixes, new features, and documentation improvements.

## Development Setup

To get started with the code, follow these steps:

1.  **Fork & Clone:** Fork the repository on GitHub, then clone it to your local machine.
    ```bash
    git clone https://github.com/<your-username>/one-viz.git
    cd one-viz
    ```

2.  **Install Dependencies:** Install the project's dependencies using npm.
    ```bash
    npm install
    ```

3.  **Start the Development Server:** This command will build the library and watch for changes, automatically rebuilding as you edit the source files.
    ```bash
    npm run dev
    ```

4.  **View the Demo:** In a separate terminal, you can run a simple server to view the `demo/index.html` file. This is the best way to see your changes live.
    ```bash
    npm start
    ```
    Now you can open `http://localhost:8000/demo/` in your browser.

## Pull Request Process

1.  **Create a Branch:** Create a new branch for your contribution. Please use a descriptive name (e.g., `feat/add-tooltips` or `fix/chart-rendering-bug`).
    ```bash
    git checkout -b feat/my-awesome-feature
    ```

2.  **Make Your Changes:** Write your code and add your tests. Ensure you follow the existing code style.

3.  **Commit Your Changes:** Use clear and descriptive commit messages. We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
    ```bash
    git commit -m "feat: Add tooltip support to the bar chart"
    ```

4.  **Push to Your Fork:**
    ```bash
    git push origin feat/my-awesome-feature
    ```

5.  **Open a Pull Request:** Open a pull request from your branch to the `main` branch of the main One-viz repository. Provide a clear description of your changes.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

By contributing to One-viz, you agree that your contributions will be licensed under the MIT License.
