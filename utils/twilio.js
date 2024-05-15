const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require("twilio")(accountSid, authToken);
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const sendMessage = async (to, from, lead) => {
    try {
        const defaultMessage = `Hi thanks for contacting us. We will get back to you soon.`;
        // Send SMS to the lead using Twilio
        // const message = `Hi ${lead.firstName} ${lead.lastName}, thanks for contacting us. We will get back to you soon.`;
        await twilio.messages.create({
            body: "Hi! This is a test message from twilio.",
            from: "+12762925752",
            //   to: lead.phone,
            to: "+923415603673",
        });
        console.log('SMS sent');
    } catch (error) {
        console.error('Twilio error:', error);
    }
};

const initiateCall = async (from, to, url="") => {
    try {
        // await twilio.calls.create({
            // twiml: `<Response>
            //   <Say>Connecting you to a new lead. Press 1 to dial to that number</Say>
            //   <Dial>+923415603673</Dial>
            // </Response>`,
        //     from: "+13203616359",
        //     to: "+923555979060",
        //   });

        const callerNumber = "+13203616359";
        const maskedNumber = twilio.utils.mask(callerNumber);
        await twilio.calls.create({
            // url: "http://demo.twilio.com/docs/voice.xml",
            twiml: `<Response>
              <Say>Connecting you to a new lead. Press 1 to dial to that number</Say>
              <Dial>+923555979060</Dial>
            </Response>`,
            // to: "+358456744040",
            // from: "+13203616260",
            to : "+923555979060",
            from : "+13203616359"
          })
          console.log('Call initiated');
    } catch (error) {
        console.error('Twilio error:', error);
    }
};

module.exports = {
    sendMessage,
    initiateCall,
};