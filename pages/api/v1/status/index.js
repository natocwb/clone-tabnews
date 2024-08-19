import database from "infra/database.js";
async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const dataBaseVersionResult = await database.query("SHOW server_version;");
  const dataBaseVersionValue = dataBaseVersionResult.rows[0].server_version;

  const dataBaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const dataBaseMaxConnectionsValue =
    dataBaseMaxConnectionsResult.rows[0].max_connections;

  const dataBaseName = process.env.POSTGRES_DB;
  const dataBaseOpenConnectionsResult = await database.query({
    text: "select count(*)::int used from pg_stat_activity where datname =$1;",
    values: [dataBaseName],
  });
  const dataBaseOpenConnectionsValue =
    dataBaseOpenConnectionsResult.rows[0].used;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dataBaseVersionValue,
        max_connections: parseInt(dataBaseMaxConnectionsValue),
        opened_connections: dataBaseOpenConnectionsValue,
      },
    },
  });
}

export default status;
