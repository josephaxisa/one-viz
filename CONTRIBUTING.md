# Contributing to One-viz

Thank you for your interest in contributing to One-viz! We welcome contributions from everyone, whether you're a seasoned developer or just getting started. This document outlines how you can contribute to the project and help us make data visualization more accessible and powerful.

## Ways to Contribute

There are many ways to contribute to One-viz, including:

*   **Code Contributions:**
    *   Developing new web components (chart types, interactive features).
    *   Improving existing components (bug fixes, performance optimizations, new features).
    *   Working on the GenAI-powered conversational engine (future development).
    *   Improving the build process, tooling, or testing infrastructure.
*   **Documentation:**
    *   Improving the README and other documentation.
    *   Writing tutorials and examples.
    *   Translating documentation into other languages.
*   **Testing:**
    *   Testing existing components and reporting bugs.
    *   Writing unit tests and integration tests.
*   **Feedback and Feature Requests:**
    *   Providing feedback on existing features.
    *   Suggesting new features and improvements.
    *   Participating in discussions on GitHub.
*   **Community Engagement:**
    *   Helping other users with questions.
    *   Sharing One-viz with your network.
    *   Participating in community events (e.g., hackathons).

## Getting Started

1.  **Fork the Repository:** Fork the One-viz repository on GitHub to your own account.
2.  **Clone the Repository:** Clone your forked repository to your local machine:

    ```bash
    git clone [https://github.com/](https://github.com/)<your-username>/one-viz.git
    cd one-viz
    ```
3.  **Install Dependencies:** Install the project's dependencies using npm:

    ```bash
    npm install
    ```

4.  **Create a Branch:** Create a new branch for your contribution:

    ```bash
    git checkout -b my-feature-branch
    ```

5. **Make Changes:** Make your changes to the codebase, documentation, or other relevant files. Follow the coding style and conventions used in the project.
6.  **Test Your Changes:**  Ensure that your changes work as expected and do not introduce any new bugs. Run existing tests (if available) and add new tests for your changes.  For now, run locally using `npm run dev` and `npm start`.
7.  **Commit Your Changes:** Commit your changes with clear and descriptive commit messages:

    ```bash
    git commit -m "Add: Implement support for tooltips in OneVizBarChart"
    ```

8.  **Push Your Changes:** Push your branch to your forked repository:

    ```bash
    git push origin my-feature-branch
    ```

9.  **Create a Pull Request:** Create a pull request from your branch to the `main` branch of the main One-viz repository.  Provide a clear and detailed description of your changes, including the motivation for the change, the approach you took, and any relevant screenshots or examples.

## Code Style and Conventions

*   We use [TypeScript](https://www.typescriptlang.org/) for all component development.
*   We use [Lit](https://lit.dev/) for building web components.
*   We use [Highcharts](https://www.highcharts.com/) for the initial charting implementation (this may change in the future).
*   Follow the existing code style and conventions.
*   Write clear and concise commit messages.
*   Include unit tests for any new code or changes to existing code.

## Issue Tracker

Please use the GitHub issue tracker to report bugs, request features, or ask questions: [Issues](https://github.com/josephaxisa/one-viz/issues)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Pull Request Guidelines

*   Keep pull requests focused on a single feature or bug fix.
*   Provide a clear and detailed description of your changes.
*   Ensure your code is well-documented and tested.
*   Be responsive to feedback from reviewers.

## License

By contributing to One-viz, you agree that your contributions will be licensed under the MIT License.

We appreciate your contributions and look forward to working with you!