import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { Route, Router } from "wouter";
import SessionDetail from "./components/SessionDetail";

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/">
          <App />
        </Route>
        <Route path="/session/:id">
          {(params) => <SessionDetail sessionId={params.id} />}
        </Route>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default Root;
