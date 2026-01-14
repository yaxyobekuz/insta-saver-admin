// Components
import App from "./app.jsx";

// Styles
import "./styles/index.styles.css";

// Store (Redux)
import store from "./store";
import { Provider } from "react-redux";

// React
import { createRoot } from "react-dom/client";

// Router
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
