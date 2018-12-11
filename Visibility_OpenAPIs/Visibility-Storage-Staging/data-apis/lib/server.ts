// lib/server.ts
import app from "./app";
const PORT = 3020;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})
