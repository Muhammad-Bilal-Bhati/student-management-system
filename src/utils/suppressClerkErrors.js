// Suppress Clerk telemetry errors in development
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    // Filter out Clerk telemetry errors
    const message = args[0];
    if (typeof message === 'string' && message.includes('clerk-telemetry.com')) {
      return; // Suppress this error
    }
    if (typeof message === 'string' && message.includes('Bad Request') && args.some(arg => 
      typeof arg === 'string' && arg.includes('clerk-telemetry.com')
    )) {
      return; // Suppress this error
    }
    // Show all other errors normally
    originalError.apply(console, args);
  };
}

export default {};
