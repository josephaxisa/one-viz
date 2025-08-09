[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Bridging the gap between complex data analytics and practical business use with AI-powered, interactive web components.

**One-viz is a next-generation data visualization library built on modern web standards (Web Components) and designed to be:**

*   **Framework-Agnostic:** Works seamlessly with React, Angular, Vue, Svelte, or no framework at all.
*   **Easy to Use:** Simple, declarative syntax for integrating powerful visualizations into your web applications.
*   **Interactive:** Provides built-in support for common interactions (tooltips, zooming, etc.) with a focus on extensibility.
*   **AI-Powered:** Incorporates a Generative AI engine for conversational analytics, enabling users to explore data using natural language ( *under development* ).
*   **Open Source:**  MIT licensed, fostering community contributions and collaboration.
*   **CDN Management:** Built-in CDN management for underlying libraries

**Vision:**

One-viz aims to democratize data visualization, making it accessible to everyone, regardless of their technical expertise.  By combining the flexibility of web components with the power of AI, One-viz will empower users to gain deeper insights from their data and make better decisions.

**Why One-viz?**

While powerful libraries like Highcharts or D3.js provide the rendering engine for our charts, One-viz is not just a wrapper. It's an abstraction layer designed to provide a superior developer experience and a more powerful, future-proof feature set.

| Feature                       | Using Highcharts Directly                                   | Using One-viz                                                              |
| ----------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Simplicity**                | Requires complex JavaScript configuration objects.          | Simple, declarative HTML tags (`<oneviz-barchart>`).                        |
| **Framework Integration**     | Requires framework-specific wrappers (e.g., `highcharts-react`). | Works natively in any framework (React, Vue, etc.) or no framework at all. |
| **Dependency Management**     | Developer must install, import, and bundle the library.     | Zero-configuration. Automatically loads dependencies from a CDN.           |
| **API**                       | Vast and complex API, can be overwhelming.                  | Simplified, consistent, and opinionated API across all chart types.        |
| **AI-Powered Analytics**      | Not available.                                              | **Core future feature.** Enables natural language interaction with data.   |

In short, **One-viz offers ease of use, standardization, and a future-proof path to AI-powered analytics, not just chart rendering.** It allows developers to work at a higher level of abstraction so they can build data-driven applications faster and more consistently.

**Current Status:**

This project is currently under active development.  The initial phase focuses on building a core set of framework-agnostic web components for common chart types (bar, line, pie, scatter, etc.).

**You can find:**

*   **Working examples of basic components:** (See the "Getting Started" section below).
*   **A clear project structure:** Following best practices for web component development using Lit.
*   **Ongoing development activity:** Regular commits and updates in the [GitHub repository](<your-github-repo-link>).

**Getting Started (Example with Bar Chart):**

1.  **Install:**

    ```bash
    npm install one-viz
    ```

2.  **Import (in your JavaScript/TypeScript file):**

    ```javascript
    import 'one-viz'; // Import all components.  Or import individually:
    // import 'one-viz/dist/components/OneVizBarChart';
    ```
Note: For CDN usage please refer to the documentation.

3.  **Use in HTML (Plain JavaScript/No Framework):**

    ```html
    <oneviz-barchart
      data-url="path/to/your/data.json"
      x-field="category"
      y-field="value"
      title="My Awesome Bar Chart"
    ></oneviz-barchart>
    ```

    **`data.json` example:**

    ```json
    [
      { "category": "A", "value": 10 },
      { "category": "B", "value": 15 },
      { "category": "C", "value": 7 },
      { "category": "D", "value": 12 }
    ]
    ```

4. **Use in React:**
   Since One-viz components are standard web components, you can use them directly in your React JSX.  You may need a small wrapper component to handle data updates efficiently.

    ```jsx
    // MyReactComponent.jsx (or .tsx)
    import React, { useState, useEffect, useRef } from 'react';
    import 'one-viz'; // Import the One-viz components

    function MyReactComponent() {
      const [chartData, setChartData] = useState([]);
      const chartRef = useRef(null);

      useEffect(() => {
        // Fetch or generate your data here
        const data = [
          { category: 'A', value: 10 },
          { category: 'B', value: 15 },
          { category: 'C', value: 7 },
          { category: 'D', value: 12 }
        ];
        setChartData(data);
      }, []);

        useEffect(() => {
            if (chartRef.current) {
                chartRef.current.data = chartData;
            }
        }, [chartData]);

      return (
        <oneviz-barchart
          ref={chartRef}
          x-field="category"
          y-field="value"
          title="My Awesome Bar Chart (React)"
        ></oneviz-barchart>
      );
    }

    export default MyReactComponent;

    ```

<details>
<summary><b>Click to see a comparison with a direct Highcharts implementation</b></summary>

The example above is simple and declarative. To achieve the same result using the standard `highcharts-react-official` library, you would need significantly more boilerplate code to manually construct the complex Highcharts options object.

This is the equivalent code using the Highcharts React wrapper:

```jsx
// The Highcharts Equivalent
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_bar from 'highcharts/modules/bar';

// Initialize the bar module
HC_bar(Highcharts);

function MyHighchartsComponent() {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'bar'
    },
    title: {
      text: 'My Awesome Bar Chart (Highcharts)'
    },
    xAxis: {
      categories: [],
      title: {
        text: 'category'
      }
    },
    yAxis: {
      title: {
        text: 'value'
      }
    },
    series: [{
      name: 'value',
      data: []
    }]
  });

  useEffect(() => {
    // Fetch or generate your data here
    const data = [
      { category: 'A', value: 10 },
      { category: 'B', value: 15 },
      { category: 'C', value: 7 },
      { category: 'D', value: 12 }
    ];

    // Manually transform data and update the complex options object
    setChartOptions({
      xAxis: {
        categories: data.map(item => item.category)
      },
      series: [{
        name: 'value',
        data: data.map(item => item.value)
      }]
    });
  }, []);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
}

export default MyHighchartsComponent;
```

As you can see, One-viz handles the data transformation and chart configuration for you, allowing you to focus on your application logic instead of the intricacies of a specific charting library.

</details>

**Roadmap:**

*   **Phase 1 (Current):**
    *   Core web components (bar chart, line chart, pie chart, scatter plot).
    *   Basic interactivity (tooltips, hover effects).
    *   Data loading (from URL, inline data).
    *   Basic styling options.
*   **Phase 2:**
    *   Advanced chart types (heatmap, treemap, network graph).
    *   Enhanced interactivity (drill-down, filtering, brushing).
    *   Accessibility features (ARIA attributes, keyboard navigation).
*   **Phase 3:**
    *   GenAI-powered conversational analytics engine.
    *   Natural language querying and data exploration.
    *   Automated insight generation.

**Contributing:**

We welcome contributions from the community! Whether you're a developer, designer, data scientist, or just passionate about data visualization, there are many ways to get involved:

*   **Code Contributions:**  Help us build new components, improve existing ones, or fix bugs.
*   **Documentation:**  Improve our documentation, tutorials, and examples.
*   **Testing:**  Help us test the library and report any issues you find.
*   **Feedback:**  Share your ideas and suggestions for new features.
*   **Spread the Word:**  Tell your friends and colleagues about One-viz!

Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

**License:**

One-viz is released under the MIT License. See [LICENSE](LICENSE) for details.

**Maintainer:**

Joseph Axisa ([Github](http://github.com/josephaxisa/))

---
**Acknowledgements:**

*   This project builds upon the excellent work of the [Lit](https://lit.dev/) and [Highcharts](https://www.highcharts.com/) teams.