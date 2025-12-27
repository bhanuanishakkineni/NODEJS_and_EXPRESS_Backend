import { connectDB, disconnectDB } from '../src/config/db.js';

(async () => {
  try {
    await connectDB();
    console.log('Test: connected successfully');
  } catch (err) {
    console.error('Test: connection failed', err);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
})();
