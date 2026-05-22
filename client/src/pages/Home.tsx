// Home redirects to /dashboard — handled in App.tsx Router
import { Redirect } from "wouter";
export default function Home() {
  return <Redirect to="/dashboard" />;
}
