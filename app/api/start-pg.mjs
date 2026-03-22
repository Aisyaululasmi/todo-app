import EmbeddedPostgres from 'embedded-postgres';

const pg = new EmbeddedPostgres({
  databaseDir: 'C:/Users/T480s/AppData/Local/Temp/todo-pg-data',
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  persistent: true,
});

async function main() {
  try {
    await pg.initialise();
    await pg.start();
    console.log('PostgreSQL started successfully');

    try {
      await pg.createDatabase('todo_platform');
      console.log('Database todo_platform created');
    } catch (dbErr) {
      console.log('Database may already exist:', dbErr.message);
    }

    console.log('Ready on port 5432');
    // Keep running indefinitely
    setInterval(() => {}, 60000);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
