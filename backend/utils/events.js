import EventEmitter from 'events';
const eventBus = new EventEmitter();

// Helpful events:
// 'payment:success' => ({ payment, providerPayload })
// listeners should accept the object and act (booking update, analytics, notifications)

export default eventBus;