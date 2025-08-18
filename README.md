# One-viz

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A next-generation data visualization library using AI-powered, interactive, framework-agnostic web components.

One-viz bridges the gap between complex data analytics and practical business use. It's built on modern web standards to be:

*   **Framework-Agnostic:** Works seamlessly with React, Angular, Vue, Svelte, or no framework at all.
*   **Easy to Use:** Simple, declarative HTML for powerful visualizations.
*   **AI-Powered:** A future-proof path to conversational analytics using natural language.
*   **Zero-Config:** Automatically manages dependencies from a CDN.

---

## Getting Started

1.  **Install from npm:**
    ```bash
    npm install one-viz
    ```

2.  **Import the components:**
    ```javascript
    // Import all components at once
    import 'one-viz';

    // Or import individually
    import 'one-viz/dist/components/BarChart/OneVizBarChart';
    ```

3.  **Use in your HTML:**
    ```html
    <oneviz-barchart
      title="Monthly Revenue"
      x-field="month"
      y-field="revenue"
    ></oneviz-barchart>

    <script>
      const chart = document.querySelector('oneviz-barchart');
      chart.data = [
        { "month": "Jan", "revenue": 15000 },
        { "month": "Feb", "revenue": 18000 },
        { "month": "Mar", "revenue": 22000 }
      ];
    </script>
    ```

For framework-specific examples (like React), please see our [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## API Reference

All chart components inherit from a base class and share a common set of properties, attributes, and theming variables.

### Common Properties & Attributes

| Property | Attribute | Type    | Description                                             |
| :------- | :-------- | :------ | :------------------------------------------------------ |
| `title`  | `title`   | String  | The main title displayed above the chart.               |
| `data`   | N/A       | Array   | The array of data objects to plot.                      |
| `xField` | `x-field` | String  | The field in the data objects for the x-axis/categories. |
| `yField` | `y-field` | String  | The field in the data objects for the y-axis/values.    |

### Common Theming (CSS Custom Properties)

You can style all charts by setting these CSS variables on the component or a parent element.

| Variable                      | Description                                    | Default   |
| :---------------------------- | :--------------------------------------------- | :-------- |
| `--oneviz-background-color`   | The background color of the chart.             | `#ffffff` |
| `--oneviz-title-color`        | The color of the chart's title text.           | `#333333` |
| `--oneviz-axis-label-color`   | The color of the axis labels and legend text.  | `#666666` |
| `--oneviz-font-family`        | The font family used throughout the chart.     | `sans-serif`|

---

### Component-Specific APIs

#### `<oneviz-barchart>`

*   **Event:** `oneviz-bar-click`
    *   Fired when a bar is clicked.
    *   `event.detail`: `{ category: string, value: number, originalEvent: object }`

#### `<oneviz-piechart>`

*   **Event:** `oneviz-pie-click`
    *   Fired when a pie slice is clicked.
    *   `event.detail`: `{ name: string, value: number, originalEvent: object }`

#### `<oneviz-linechart>`

*   **Event:** `oneviz-line-click`
    *   Fired when a point on the line is clicked.
    *   `event.detail`: `{ category: string, value: number, originalEvent: object }`
*   **Theming:**
    *   `--oneviz-line-color`: The color of the line. (Default: `#007bff`)

#### `<oneviz-scatterchart>`

*   **Event:** `oneviz-scatter-click`
    *   Fired when a point is clicked.
    *   `event.detail`: `{ x: number, y: number, originalEvent: object }`

---

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to set up the project, run the demo, and submit your work.

## License

One-viz is released under the MIT License. See [LICENSE](./LICENSE) for details.
