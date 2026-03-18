import { redirect } from 'next/navigation';

export default function RootPage() {
  // In W1, always redirect to the dashboard
  // In W2, this will check if the user is logged in
  redirect('/login');
}
