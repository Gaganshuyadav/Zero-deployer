
const shutdownSignals = [
  'SIGTERM',   // Docker / K8s / prod
  'SIGINT',    // Ctrl+C
  'SIGUSR2',   // nodemon / PM2
  'SIGHUP',    // terminal close / reload
  'SIGQUIT',   // force quit
];

export { shutdownSignals};