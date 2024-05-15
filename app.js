require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require('path');
const { multerError, urlNotFound } = require("./routes/middlewares/errorHandler");

const app = express();
const connectDB = require("./config/database");

const API_BASE_NAME = "/api";
const port = process.env.PORT | 5000;
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use('/public/csv', express.static(__dirname + '/public/csv'));

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (req.originalUrl === "/api/webhook/stripe" || req.originalUrl === "/api/webhook/stripe-stagging") {
    next();
  } else {

    app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

    bodyParser.json({ limit: "50mb", "Content-Type": "application/json" })(req, res, next)
  }
});

app.get("/hook", (req, res) => {
  const { initiateCall, sendMessage } = require("./utils/twilio");
  initiateCall("", "", "");
  // sendMessage("","","");
});

// role routes
app.use(`${API_BASE_NAME}/role`, require("./routes/role"));
// user routes
app.use(`${API_BASE_NAME}/user`, require("./routes/user"));
app.use(`${API_BASE_NAME}/userschedule`, require("./routes/userSchedule"));
app.use(`${API_BASE_NAME}/userdayoff`, require("./routes/userDayOff"));
// team routes
app.use(`${API_BASE_NAME}/team`, require("./routes/team"));
app.use(`${API_BASE_NAME}/teamuser`, require("./routes/teamUser"));
app.use(`${API_BASE_NAME}/team-setting`, require("./routes/teamSetting"));
app.use(`${API_BASE_NAME}/teamschedule`, require("./routes/teamSchedule"));
// company routes
app.use(`${API_BASE_NAME}/company`, require("./routes/company"));
app.use(`${API_BASE_NAME}/company-field-setting`, require("./routes/companyFieldSetting"));
// lead routes
app.use(`${API_BASE_NAME}/lead`, require("./routes/lead"));
app.use(`${API_BASE_NAME}/lead-extra-info`, require("./routes/leadExtraInfo"));
app.use(`${API_BASE_NAME}/lead-history`, require("./routes/leadHistory"));
app.use(`${API_BASE_NAME}/lead-meeting`, require("./routes/leadMeeting"));
//calls
app.use(`${API_BASE_NAME}/scheduled-call`, require("./routes/scheduledCalls"));

app.use(`${API_BASE_NAME}/holiday`, require("./routes/holiday"));
app.use(`${API_BASE_NAME}/country`, require("./routes/country"));
app.use(`${API_BASE_NAME}/meeting`, require("./routes/meeting"));
app.use(`${API_BASE_NAME}/tags-and-stages`, require("./routes/tagsAndStages"));
app.use(`${API_BASE_NAME}/twilio-number`, require("./routes/twilioNumber"));
app.use(`${API_BASE_NAME}/twilio-number-setting`, require("./routes/twilioNumberSetting"));

app.use(`${API_BASE_NAME}/admin/user`, require("./routes/admin/user"));

app.use(`${API_BASE_NAME}/hook`, require("./routes/admin/user"));

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// })

app.use(multerError);
app.use(urlNotFound);

if (cluster.isMaster) {
  console.log(`Number of CPUs: ${totalCPUs} Master Cluster having ProcessId ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) cluster.fork();

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Fork new child worker!");
    cluster.fork();
  });
} else {
  connectDB();  // Database connection
  app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on http://localhost:${port}`);
  });
}
