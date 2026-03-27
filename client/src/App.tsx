import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import Category from "./pages/Category";
import StartHere from "./pages/StartHere";
import About from "./pages/About";
import Compare from "./pages/Compare";
import Quizzes from "./pages/Quizzes";
import QuizPage from "./pages/QuizPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/articles" component={Articles} />
      <Route path="/articles/:slug" component={ArticlePage} />
      <Route path="/category/:slug" component={Category} />
      <Route path="/start-here" component={StartHere} />
      <Route path="/about" component={About} />
      <Route path="/compare" component={Compare} />
      <Route path="/quizzes" component={Quizzes} />
      <Route path="/quiz/:slug" component={QuizPage} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
