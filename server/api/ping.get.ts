export default defineEventHandler(async () => {
  return {
    alive: true,
    timestamp: Date.now(),
    date: new Date().toISOString(),
  };
});
