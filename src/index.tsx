import ReactDOM from "react-dom/client"
import "src/index.css"
import { App } from "./App"
import { AppContextProvider } from "./components/AppContextProvider"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
)
