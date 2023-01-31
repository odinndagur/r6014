import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

async function load() {
  const worker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: "/dist/r6014.sqlite3",
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );


  const result = await worker.db.query(`
  SELECT band.name AS band,
  album.title AS album,
  album.released as year
  FROM band
  JOIN album ON album.band_id = band.id
  ORDER BY band.name, album.title`);
  window['db'] = worker.db

  // document.body.textContent = JSON.stringify(result);
  document.getElementById('json')!.innerHTML = `
  <input oninput="myFunction()" type="text" id="myInput">
  <table id="myTable">
  <tr>
  <th onclick="sortTable(0)">Band</th>
  <th onclick="sortTable(1)">Album</th>
  <th onclick="sortTable(2)">Year</th>
  </tr>
  ${result.map(el => { return '<tr><td>' + el['band'] + '</td>' + '<td>' + el['album'] + '</td>' + '</td>' + '<td>' + el['year'] + '</td>' + '</tr>'; }).join('\n')}</table>`
}

load();
