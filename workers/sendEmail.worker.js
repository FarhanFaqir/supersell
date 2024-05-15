const { parentPort } = require('worker_threads');
const sendEmail = require('../utils/mailer');

parentPort.on('message', async (workerData) => {
  try {
    if(workerData.processName==="SEND-EMAIL"){
        await sendEmail(workerData.data.to, workerData.data.subject, workerData.data.html);
        parentPort.postMessage({ status: 'success', info });
    }
  } catch (error) {
    parentPort.postMessage({ status: 'error', error });
  }
});
