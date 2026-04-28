import readline from "node:readline";
import { createUser, userCount, getUserByEmail } from "../auth.js";

function ask(rl: readline.Interface, q: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    if (hidden) {
      const stdin = process.stdin;
      process.stdout.write(q);
      const onData = (char: Buffer) => {
        const c = char.toString();
        if (c === "\n" || c === "\r" || c === "") {
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
        }
      };
      stdin.on("data", onData);
    }
    rl.question(q, (answer) => resolve(answer));
  });
}

async function main() {
  if (userCount() > 0) {
    console.log("Users already exist. Use the admin UI to invite more.");
    process.exit(0);
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const email = await ask(rl, "Admin email: ");
  if (getUserByEmail(email)) {
    console.error("Email already in use");
    process.exit(1);
  }
  const password = await ask(rl, "Password (min 8 chars): ");
  if (password.length < 8) {
    console.error("Password too short");
    process.exit(1);
  }
  const display_name = await ask(rl, "Display name (optional): ");
  rl.close();
  const user = await createUser({
    email,
    password,
    display_name: display_name || undefined,
    is_admin: true,
  });
  console.log(`Created admin user #${user.id} <${user.email}>`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
