const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onTaskDispatched } = require("firebase-functions/v2/tasks");
const { getFirestore } = require("firebase-admin/firestore");
const { getFunctions } = require("firebase-admin/functions");
const { getApp } = require("firebase-admin/app");
const axios = require("axios");
const cors = require('cors')({ origin: true });



const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const OpenAI = require('openai');
dotenv.config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./mailex-cfa6e-firebase-adminsdk-h3a3t-f15ecb3558.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.ORG_ID, // This is the default and can be omitted
});



  

exports.getProspects = onRequest(async (request, response) => {
  cors(request, response, async () => {
    const { keywords, positions, locations } = request.body;

    if (!keywords || !positions || !locations) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    if (!Array.isArray(keywords) || !Array.isArray(positions) || !Array.isArray(locations)) {
      return response.status(400).json({
        error: 'Keywords, positions, and locations must be arrays',
      });
    }

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'x-api-key': 'JSqrgvwAWntLIDmLjb5Y6w',
      },
    };

    let peopleUrl = 'https://api.apollo.io/api/v1/mixed_people/search?contact_email_status[]=verified&contact_email_status[]=likely%20to%20engage&';

    for (let i = 0; i < positions.length; i++) {
      peopleUrl += `person_titles[]=${encodeURIComponent(positions[i])}&`;
    }
    for (let i = 0; i < locations.length; i++) {
      peopleUrl += `organization_locations[]=${encodeURIComponent(locations[i])}&`;
    }

    try {
      const peopleResult = await axios(peopleUrl, options);

      if (peopleResult.data.people.length === 0) {
        return response.status(404).json({ error: 'No people found' });
      }

      const people = peopleResult.data.people.map((person) => ({
        name: person.name,
        linkedin_url: person.linkedin_url,
        email: person.email,
        country: person.country,
        city: person.city,
        organization_name: person.organization.name,
        title: person.title,
      }));

      return response.json(people);
    } catch (error) {
      console.error('Getting prospects', { error });
      response.status(500).json({ error: 'Failed to fetch data' });
    }
  });
});

exports.getLinkedinData = onRequest(async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  console.log("LinkedIn profile fetch started");

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/get-profile-data-by-url",
    params: { url },
    headers: {
      "x-rapidapi-key": "78d9ef7540msha9b93eee54e1f13p152c24jsnd2aa3f7566c1",
      "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const data = response.data;
    res.json({
      username: data.username,
      name: `${data.firstName} ${data.lastName}`,
      position: {
        title: data.fullPositions[0]?.title || "",
        company: data.fullPositions[0]?.companyName || "",
      },
      summary: data.summary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch LinkedIn profile data" });
  }
});

exports.getFirstPost = onRequest(async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Missing username parameter" });
  }

  console.log("LinkedIn post fetch started");

  const options = {
    method: "GET",
    url: "https://linkedin-api8.p.rapidapi.com/get-profile-posts",
    params: { username },
    headers: {
      "x-rapidapi-key": "78d9ef7540msha9b93eee54e1f13p152c24jsnd2aa3f7566c1",
      "x-rapidapi-host": "linkedin-api8.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const posts = response.data.data;
    res.json(posts.length > 0 ? posts[0] : { message: "No posts found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch LinkedIn posts" });
  }
});

exports.generateMailbody = onRequest(async (req, res) => {
  const { firstPost, name, job, summary, sender_name, sender_details } = req.body;
  if (!firstPost || !name || !job || !sender_name || !sender_details) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  console.log("Email body generation started");

  const email_prompt = `
###Role
You are writing as ${sender_name}, ${sender_details} contacting ${name},
who holds the position ${job.title} at ${job.company} with a summary: ${summary}.

#Task
Create a short, personal outreach email that:
Maintains a conversational, professional, and approachable tone.
Starts with a friendly comment about the recipient's work or company.
Refer to their latest LinkedIn post ${firstPost} with a positive comment.
End with a warm, open invitation to connect and ask for a short response.

###Sample Email
Hi Jenny,
I have to say that I am very impressed with the work you do at SMS Smart Media Solutions...

Kind regards,
${sender_name}
${sender_details}

###Notes
Do not include a subject line in the final result.
Keep the tone warm and non-salesy.
Avoid specific statistics or percentages.
Focus on connection and shared interests.
`;

  try {
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: email_prompt }],
      model: "gpt-4",
    });
    res.json({ email_body: response.choices[0].message.content });
  } catch (error) {
    console.error("Error in API call:", error);
    res.status(500).json({ error: "Failed to generate email body" });
  }
});

exports.subejctGen = onRequest(async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Missing name parameter" });
  }

  console.log("Email subject generation started");

  const prompt = `
###Role
You are an email marketing expert specializing in engaging subject lines.

###Task
Create a short, engaging subject line that grabs attention and increases open rates.
Use the recipient's name (${name}) to make it personal.

Sample subject lines:
- Regarding your latest LinkedIn post - had to share this with you, ${name}
- ${name}, your latest LinkedIn post made me think of this
- ${name}, I saw what you wrote on LinkedIn and want to follow up

###Note
- Keep it concise and engaging.
- Avoid "Subject:" at the beginning.
- Avoid quotation marks.
`;

  try {
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
    });
    res.json({ subject: response.choices[0].message.content });
  } catch (error) {
    console.error("Error in API call:", error);
    res.status(500).json({ error: "Failed to generate email subject" });
  }
});


exports.convertHtml = onRequest(async (req, res) => {
  const { email_body } = req.body;
  if (!email_body) {
    return res.status(400).json({ error: "Missing email_body parameter" });
  }

  console.log("Email HTML conversion started");

  const prompt = ` 
      Here is the mail body: ${email_body}
      Your task is to:
      Add line breaks where appropriate using <br>.
      Replace any instance of **text** with <b>text</b>.
      Ensure the final output preserves structure and formatting for improved readability in HTML.
      Do not add any pretext or post text.
      Do not enclose the answer in quotes.
  `;

  try {
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
    });
    res.json({ html_body: response.choices[0].message.content });
  } catch (error) {
    console.error("Error in API call:", error);
    res.status(500).json({ error: "Failed to convert email body to HTML" });
  }
});


exports.generateMail = onRequest(async (req, res) => {
  try {
    const { linkedinURL, sender_name, sender_details } = req.body;

    const linkedinData = await axios.get("http://127.0.0.1:5001/mailex-cfa6e/us-central1/getLinkedinData", {
      params: { url: linkedinURL },
    });
    console.log(linkedinData.data);

    const firstPost = await axios.get("http://127.0.0.1:5001/mailex-cfa6e/us-central1/getFirstPost", {
      params: { username: linkedinData.data.username },
    });
    console.log(firstPost.data);

    const mailBodyResponse = await axios.post("http://127.0.0.1:5001/mailex-cfa6e/us-central1/generateMailbody", {
      firstPost: firstPost.data,
      name: linkedinData.data.name,
      job: linkedinData.data.position,
      summary: linkedinData.data.summary,
      sender_name,
      sender_details,
    });
    console.log(mailBodyResponse.data.email_body);

    const subjectResponse = await axios.get("http://127.0.0.1:5001/mailex-cfa6e/us-central1/subejctGen", {
      params: { name: linkedinData.data.name },
    });
    console.log(subjectResponse.data.subject);

    const htmlBodyResponse = await axios.post("http://127.0.0.1:5001/mailex-cfa6e/us-central1/convertHtml", {
      email_body: mailBodyResponse.data.email_body,
    });
    console.log(htmlBodyResponse.data.html_body);

    res.json({
      body: htmlBodyResponse.data.html_body,
      subject: subjectResponse.data.subject,
    });
  } catch (error) {
    console.error("Error in generating email:", error);
    res.status(500).json({ error: error.message });
  }
});


exports.createcampaign = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(400).send("Only POST requests are allowed.");
      }
      console.log(req.body)
      const { campaignName, mailboxes, leadIds, userId } = req.body;
      if (!campaignName || !mailboxes || !leadIds || !userId) {
        return res.status(400).send("Missing required fields.");
      }
  
      // Format mailboxes
      const formattedMailboxes = mailboxes.map((mailbox, ind) => ({
        mailbox_id: "mail_box" + ind,
        mailbox_address: mailbox.sender_email,
        mailbox_password: mailbox.password,
      }));
  
      // Fetch Leads from Firestore
      let leads = [];
  
      for (const id of leadIds) {
        try {
          const docRef = db.collection("marketings").doc(id);
          const docSnap = await docRef.get();
  
          if (docSnap.exists) {
            const data = docSnap.data();
  
            console.log("Fetched data:", JSON.stringify(data, null, 2)); // Debugging
  
            if (!Array.isArray(data.leads)) {
              console.error("Error: leads is not an array", data.leads);
              continue;  // Skip this document instead of returning
            }
  
            // Create a new leads array with additional fields
            const updatedLeads = data.leads.map(lead => ({
              ...lead,
              generated_mail_body: "",
              generated_mail_subject: ""
            }));
  
            console.log("Updated leads data:", JSON.stringify(updatedLeads, null, 2));
  
            // Push objects directly into the `leads` array (flattening it)
            leads.push(...updatedLeads);
          }
        } catch (error) {
          console.error("Error fetching lead:", error);
        }
      }
  
      console.log("Final Leads Array:", leads); // Check the final structure
  
  
      const batchSize = 50;
      const totalBatches = Math.ceil(leads.length / batchSize);
      let batches = [];
      let generateQueue = {};
      let sendQueue = {};
  
      for (let i = 0; i < totalBatches; i++) {
        const mailboxIndex = i % formattedMailboxes.length;
        const assignedMailboxId = formattedMailboxes[mailboxIndex].mailbox_id;
  
        const batch = {
          batch_id: "batch" + i,
          assigned_mailbox_id: assignedMailboxId,
          leads: leads.slice(i * batchSize, (i + 1) * batchSize),
        };
  
        batches.push(batch);
  
        // Organize generateQueue by mailbox_id
        if (!generateQueue[assignedMailboxId]) {
          generateQueue[assignedMailboxId] = [];
        }
        generateQueue[assignedMailboxId].push(batch);
  
        // Organize sendQueue similarly
        if (!sendQueue[assignedMailboxId]) {
          sendQueue[assignedMailboxId] = [];
        }
        sendQueue[assignedMailboxId].push(batch);
      }
  
  
  
      // Store the campaign in Firestore
      const campaignRef = await db.collection("campaigns").add({
        campaignName,
        mailBoxes: formattedMailboxes,
        sendQueue: {},
        generateQueue,
        sentBatches: {},
        countBatches: batches.length,
        userId,
  
      });
  
      return res.status(200).json({
        success: true,
        campaignId: campaignRef.id,
        message: "Campaign created successfully",
      });
  
    } catch (error) {
      console.error("Error creating campaign:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    
  });
  
  
});


exports.generateWeeklyEmails = onSchedule("every Saturday Sunday 00:00", async () => {
  
  const queue = getFunctions(getApp(), {
    serviceAccountId: "firebase-adminsdk-h3a3t@mailex-cfa6e.iam.gserviceaccount.com",
    region: "us-central1"
  }).taskQueue("processsEmailGeneration"); // ✅ Fixed queue name

  const campaigns = await db.collection("campaigns").get();

  for (const campaignDoc of campaigns.docs) {
    const campaignId = campaignDoc.id;
    const campaign = campaignDoc.data();
    const { generateQueue, mailBoxes } = campaign;

    if (!mailBoxes || mailBoxes.length === 0) continue;

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + ((1 + 7 - currentDate.getDay()) % 7)); // Move to next Monday

    for (let i = 0; i < mailBoxes.length; i++) {
      const mailboxname = `mail_box${i}`;
      if (!generateQueue[mailboxname] || generateQueue[mailboxname].length === 0) continue;

      console.log("done");
      const batches = generateQueue[mailboxname].slice(0, 5);
      generateQueue[mailboxname] = generateQueue[mailboxname].slice(batches.length);

      for (const batch of batches) {
        console.log("done");
        const batchDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);

        for (const lead of batch.leads) {
          try {
            await queue.enqueue(
              {
                mailbox_id: mailboxname,
                batch_id: batch.batch_id || "unknown_batch",
                lead,
                campaign_id: campaignId,
                send_date: batchDate.toISOString().substring(0, 10),
              },
              {
                // ✅ Add authentication for Cloud Tasks
                oidcToken: {
                  serviceAccountEmail: "mailex-cfa6e@appspot.gserviceaccount.com",
                },
              }
            );

          } catch (error) {
            console.error(`❌ Failed to enqueue task for ${lead.email}:`, error.message);
          }
        }
      }
    }

    await campaignDoc.ref.update({ generateQueue });
    console.log(`✅ Emails enqueued for campaign: ${campaign.campaignName}`);
  }
});

exports.sendMail = onRequest(async (req, res) => {
  const { email, subject, user_email, receiver_email, appPassword } = req.body;
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: user_email,
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: user_email,
    to: receiver_email,
    subject: subject,
    html: email,  // Use 'html' to send HTML content
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Email failed to send', error });
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.json({ message: 'Email sent successfully', status: 200 });
  });
});

exports.processsEmailGeneration = onTaskDispatched(
  {
    retryConfig: { maxRetries: 3 },
    rateLimits: { maxConcurrentDispatches: 6 },
  },
  async (task) => {
    console.log("📩 Incoming task data:", JSON.stringify(task, null, 2));

    if (!task || !task.data) {
      console.error("❌ Request body is missing data.");
      throw new Error("Invalid request, missing data.");
    }

    const { mailbox_id, lead, batch_id, campaign_id, send_date } = task.data;

    if (!mailbox_id || !lead || !lead.email || !batch_id || !campaign_id || !send_date) {
      console.error("❌ Missing required fields:", JSON.stringify(task.data, null, 2));
      throw new Error("Invalid request, missing required fields.");
    }

    try {
      console.log(`📌 Processing email for ${lead.email} (Campaign: ${campaign_id})`);

      const data = {
        linkedinURL: lead.linkedin_url || "",
        sender_name: "John Cron",
        sender_details: "CEO at Mailex, expertise in digital marketing",
      };

      let generatedEmail = null;
      let subject = null;

      try {
        const response = await axios.post(
          "https://us-central1-mailex-cfa6e.cloudfunctions.net/generateMail",
          data
        );
        generatedEmail = response.data.body;
        subject = response.data.subject;
        console.log(`✅ Email generated for ${lead.email}`);
      } catch (error) {
        console.error(`❌ Error generating mail for ${lead.email}:`, error.response?.data || error.message);
        throw new Error("Email generation failed");
      }

      const campaignRef = db.collection("campaigns").doc(campaign_id);
      const campaignSnapshot = await campaignRef.get();

      if (!campaignSnapshot.exists) {
        console.error(`❌ Campaign not found: ${campaign_id}`);
        return;
      }

      let sendQueue = campaignSnapshot.data().sendQueue || {};
      if (!sendQueue[batch_id]) {
        sendQueue[batch_id] = { send_date, leads: [] };
      }

      sendQueue[batch_id].leads.push({
        batch_id: batch_id,
        mailbox_id,
        lead,
        subject,
        body: generatedEmail,
      });

      await campaignRef.update({ sendQueue });
      console.log(`✅ Email stored in batch ${batch_id} for ${lead.email}`);

    } catch (error) {
      console.error("❌ Error processing task:", error.message);
      throw new Error("Task processing failed");
    }
  }
);
// ✅ Scheduled function to enqueue emails
exports.schedulesendEmail = onSchedule("every 24 hours", async () => {
  const queue = getFunctions(getApp(), {
    serviceAccountId: "firebase-adminsdk-h3a3t@mailex-cfa6e.iam.gserviceaccount.com",
    region: "us-central1",
  }).taskQueue("processEmailsending"); // ✅ Fixed queue name

  const campaigns = await db.collection("campaigns").get();

  for (const campaignDoc of campaigns.docs) {
    const campaignId = campaignDoc.id;
    const campaign = campaignDoc.data();
    let { sendQueue, mailBoxes } = campaign;

    // ✅ Ensure sendQueue is an object
    if (!sendQueue || typeof sendQueue !== "object") {
      sendQueue = {};
    }

   

    let updatedSendQueue = { ...sendQueue }; // Clone sendQueue for safe modifications

    for (const batchId in sendQueue) {
      const batch = sendQueue[batchId];
      const today = new Date().toISOString().split("T")[0];

      // ✅ Ensure batch.send_date is correctly formatted
      const batchDate =
        typeof batch.send_date === "string"
          ? batch.send_date // Already a string, use directly
          : batch.send_date instanceof Date
            ? batch.send_date.toISOString().split("T")[0]
            : batch.send_date?.toDate instanceof Function
              ? batch.send_date.toDate().toISOString().split("T")[0]
              : null; // If it's not valid, set to null

      console.log(today)
      if (batchDate === today) {
        for (const info of batch.leads) {
          // ✅ Correct mailbox lookup
          let sender_email="";
          let pass="";

          for(let i=0;i<mailBoxes.length;i++){
            if(mailBoxes[i].mailbox_id===info.mailbox_id){
              sender_email=mailBoxes[i].mailbox_address;
              pass=mailBoxes[i].mailbox_password;

            }
          }
          const mailbox = mailBoxes.find((m) => m.mailbox_id === info.mailbox_id);

          if (!mailbox) {
            console.error(`❌ Mailbox not found for ID: ${info.mailbox_id}`);
            continue;
          }

          const { body, subject, lead } = info;
          const email = lead.email;

          try {
            await queue.enqueue(
              {
                mailbox_id: info.mailbox_id,
                body,
                subject,
                email,
                sender_email,
                appPassword: pass,
                batch_id: batchId,
                campaign_id: campaignId,
              },
              {
                oidcToken: {
                  serviceAccountEmail: "mailex-cfa6e@appspot.gserviceaccount.com",
                },
              }
            );
          } catch (error) {
            console.error("❌ Error processing task:", error.message);
          }
        }

        // ✅ Remove processed batch from sendQueue
        //delete updatedSendQueue[batchId];
      }
    }

    // ✅ Update Firestore with the modified sendQueue
    await db.collection("campaigns").doc(campaignId).update({ sendQueue: updatedSendQueue });
  }
});

// ✅ Task function to process sending emails
exports.processEmailsending = onTaskDispatched(
  {
    retryConfig: { maxRetries: 3 },
    rateLimits: { maxConcurrentDispatches: 6 },
  },
  async (task) => {
    try {
      // ✅ Extract task data
      const { body, subject, email, sender_email, appPassword, batch_id, campaign_id } = task.data;

      const data = {
        email: body,
        user_email: sender_email,
        subject: subject,
        appPassword,
        receiver_email: email,
      };

      const url = "https://us-central1-mailex-cfa6e.cloudfunctions.net/sendMail";
      const response = await axios.post(url, data);

      if (response.data.status === 200) {
        const campaignRef = db.collection("campaigns").doc(campaign_id);
        const campaignSnapshot = await campaignRef.get();

        if (!campaignSnapshot.exists) {
          console.error(`❌ Campaign not found: ${campaign_id}`);
          return;
        }

        let sentBatches = campaignSnapshot.data().sentBatches || {};

        if (!sentBatches[batch_id]) {
          sentBatches[batch_id] = { send_date: new Date().toISOString(), leads: [] };
        }

        sentBatches[batch_id].leads.push({
          email: body,
          user_email: sender_email,
          subject,
          appPassword,
          receiver_email: email,
          time: new Date().toISOString(),
        });

        await campaignRef.update({ sentBatches });
        console.log(`✅ Email stored in batch ${batch_id} for ${email}`);
      } else {
        console.error("❌ Error sending email");
      }
    } catch (error) {
      console.error("❌ Error processing email sending task:", error);
    }
  }
);
