declare namespace Express {
  interface Application {
    db: import('lowdb').LowdbSync<import("./db").default>
  }
  interface Request {
    user?: { username: string }
  }
}