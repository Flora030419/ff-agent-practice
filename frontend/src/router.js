export const routes = [
  { path: '/login', component: () => import('./pages/Login.vue') },
  { path: '/dashboard', component: () => import('./pages/Dashboard.vue') },
  { path: '/', redirect: '/dashboard' }
];

export function useRouter() {
  return {
    push: (path) => {
      window.location.href = path;
    }
  };
}
