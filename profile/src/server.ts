import 'reflect-metadata';
import { createApp } from './app';

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    const app = await createApp();
    
    app.listen(PORT, () => {
      console.log(` Profile Service running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/health`);
      console.log(` API Base: http://localhost:${PORT}/api/profiles`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();