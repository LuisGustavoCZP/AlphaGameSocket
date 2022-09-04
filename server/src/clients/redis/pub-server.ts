import redis from "ioredis";

const pubServer = new redis();

export { pubServer };