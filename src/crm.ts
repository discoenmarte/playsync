// Import necessary modules
const openai = require("../config/open-ai");
const fs = require('fs');
const path = require('path');
const speechFile = path.resolve("./tmp/speech.mp3");
const axios = require('axios');

async function sendMessage(phone, message, assistId) {
  const url = 'https://crm-wp.aitopstaff.com/send-message';
  const data = {
    phone: phone,
    message: message,
    assistId: assistId
  };

  try {
    const response = await axios.post(url, data);
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
}

async function addClient(clientData) {
    const {
        full_name,
        phone,
        email,
        address,
        industry,
        company_size,
        client_needs,
        potential_solution,
        budget,
        authority_level,
        urgency,
        decision_timeline,
        offered_price,
        sales_stage,
        interaction_dates,
        current_status,
        client_feedback
    } = clientData;

    // Construct a new row for the leads.md file
    const newRow = `
| ${full_name} | ${company_size} | ${industry} | ${client_needs} | ${potential_solution} | ${budget} | ${authority_level} | ${urgency} | ${decision_timeline} | ${sales_stage} | ${current_status} | ${client_feedback} | ${address} | ${phone} | Fax | ${email} | Web | ${offered_price} | ${interaction_dates}"
`;

    // Path to the leads.md file
    const leadsFilePath = './leads.md';

    // Read the existing file, append the new row, and write the updated content back to the file
    fs.readFile(leadsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read db:', err.message);
            return;
        }

        // Append the new row to the existing file content
        const updatedData = data.trim() + newRow;
        
        fs.writeFile(leadsFilePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Failed to write to db:', err.message);
            } else {
                console.log('A new client has been added to db!');
            }
        });
    });

    const file = await openai.files.create({
        file: fs.createReadStream(leadsFilePath),
        purpose: "assistants",
      });

      const batch_add = await openai.beta.vectorStores.fileBatches.create(
        "vs_v3uyH1MWOAysbqxJwYGzWFyN",
        {
          file_ids: [file.id]
        }
      );

      await sleep(1000);

      console.log(batch_add.status);

    return 'Client added to db!';
}


// Set your OpenAI API key

/* Function to add a new client entry to the database
 function addClient(clientData) {
    const sql = `INSERT INTO clients (full_name, phone, email, address, industry, company_size, client_needs, potential_solution, budget, authority_level, urgency, decision_timeline, offered_price, sales_stage, interaction_dates, current_status, client_feedback)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const { full_name, phone, email, address, industry, company_size, client_needs, potential_solution, budget, authority_level, urgency, decision_timeline, offered_price, sales_stage, interaction_dates, current_status, client_feedback } = clientData;

    db.run(sql, [full_name, phone, email, address, industry, company_size, client_needs, potential_solution, budget, authority_level, urgency, decision_timeline, offered_price, sales_stage, interaction_dates, current_status, client_feedback], function(err) {
        if (err) {
            console.error('Failed to add client to database:', err.message);
        } else {
            console.log(`A new client has been added with ID: ${this.lastID}`);
        }
    });

    return "Client added to db!";
}

/
async function generateSqlQuery(description) {
    try {
        const assistant = await openai.beta.assistants.retrieve("asst_B15Ixu7mwjjvBJ5nTkv0T9qZ");

        const thread = await openai.beta.threads.create();

        console.log("description:")
        console.log(description.description);
        console.log(thread.id);
        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: description.description,
        });

        let run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: assistant.id,
        });

        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

        console.log("AAAAA")

        while (runStatus.status !== "completed") {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simple delay for polling
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessageForRun = messages.data
          .filter(message => message.run_id === run.id && message.role === "assistant")
          .pop();

        console.log("LAST MSG");
        return lastMessageForRun ? lastMessageForRun.content[0].text.value : null;
    } catch (error) {
        console.error("Failed to generate SQL query:", error);
        return "Failed to generate SQL query";
    }
}

function executeQuery(sqlQuery) {
    console.log("Query:");
    console.log(sqlQuery);
    return new Promise((resolve, reject) => {
        db.all(sqlQuery, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const resultString = rows.map(row => Object.values(row).join(',')).join('\n');
                resolve(resultString);
            }
        });
    });
}


async function handleDescriptionToQuery(description) {
    const sqlQuery = await generateSqlQuery(description);
    if (sqlQuery === null) {
        console.log("Failed to generate SQL query.");
        return null;
    }

    try {
        console.log("QR", sqlQuery);
        const queryObject = JSON.parse(sqlQuery);

        // Access the 'query' property of the object to get just the query string
        const queryString = queryObject.query;
        console.log("Executing SQL Query:", queryString);
        console.log("Consulta");

        const ans = await executeQuery(queryString);
        console.log(ans);
        return "La consulta obtuvo los siguientes resultados: " + ans;
    } catch (error) {
        console.error("Error parsing SQL query response:", error);
        return null;
    }
}

*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function handleDescriptionToQuery(description){
    const assistant = await openai.beta.assistants.retrieve("asst_zOj7gKb6xmFIA7nVVQ68xOol");
    const thread = await openai.beta.threads.create();
    console.log(description);
    await openai.beta.threads.messages.create(
        thread.id,
        { role: "user", content: description.description }
      );
    let run = await openai.beta.threads.runs.create(thread.id, { assistant_id: assistant.id });

    while (run.status != "completed"){
        await sleep(500);
        run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const ans = messages.data[0].content[0].text.value;

    return ans;
}



 const retrieveAssistant = async () => {
    const assis = await openai.beta.assistants.retrieve("asst_Xtt3PfmaUr4GSpuHSF3BtqVk");
    return assis;
}

 const initAssistant = async () => {
    const thr = await openai.beta.threads.create();
    return thr;
}

// Example of a map of function names to function implementations
const availableFunctions = {
    "handleDescriptionToQuery": handleDescriptionToQuery,
    "addClient": addClient
};

async function sendToAssistant(thread, assistant, message, phone_num) {
    async function authenticateAndGetToken() {
        const authUrl = 'https://innova-server.aitopstaff.com/api/login/';
        const credentials = {
            username: "admin",
            password: "12345678"
        };

        try {
            const response = await fetch(authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                throw new Error('Failed to authenticate');
            }

            const responseData = await response.json();
            return responseData.tokens.access;
        } catch (error) {
            console.error('Error during authentication:', error);
            throw error;
        }
    }

    async function getUserInfoByPhoneNumber(num, token) {
        const userInfoUrl = `https://innova-server.aitopstaff.com/api/get-user-by-phone/?phone_number=${num}`;

        try {
            const response = await fetch(userInfoUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }

            const userInfo = await response.json();
            return JSON.stringify(userInfo);
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    }

    try {
        console.log("NUMBER:");
        console.log(phone_num);
        const num = phone_num.slice(2);
        console.log(num);

        // Authenticate and get token
        let token;
        try {
            token = await authenticateAndGetToken();
            console.log("Token obtained:", token);
        } catch (error) {
            console.error('Error obtaining token:', error);
            throw error;
        }

        // Get user JSON string using the phone number
        let userJsonString;
        try {
            userJsonString = await getUserInfoByPhoneNumber(num, token);
            //console.log("User info JSON:", userJsonString);
        } catch (error) {
            console.error('Error obtaining user info:', error);
            throw error;
        }

        // Enviar mensaje inicial
        try {
            await openai.beta.threads.messages.create(thread.id, {
                role: "user",
                content: "MENSAJE:" + message + "\n\nTEN EN CUENTA:\nTu eres un agente de CRM que hace parte de un sistema orientado a ayudar a los emprendedores. Yo soy un usuario de ese sistema. Por acá te dejo mi información de usuario para que respondas mi mensaje teniendo en cuenta mi informacion de usuario" + userJsonString,
            });
        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }

        let run;
        // Crear un nuevo run
        try {
            run = await openai.beta.threads.runs.create(thread.id, {
                assistant_id: assistant.id,
            });
        } catch (error) {
            console.error('Error creating run:', error);
            throw error;
        }

        let runStatus;
        try {
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        } catch (error) {
            console.error('Error retrieving run status:', error);
            throw error;
        }

        while (runStatus.status !== "completed") {
            if (runStatus.status === "requires_action" && runStatus.required_action?.type === "submit_tool_outputs") {
                const toolCalls = runStatus.required_action?.submit_tool_outputs?.tool_calls;

                if (toolCalls && toolCalls.length > 0) {
                    const toolOutputPromises = toolCalls.map(async toolCall => {
                        const functionName = toolCall.function.name;
                        const functionArguments = JSON.parse(toolCall.function.arguments);

                        const functionToCall = availableFunctions[functionName];
                        if (functionToCall) {
                            try {
                                let output = await functionToCall(functionArguments);
                                console.log(output, "out");
                                if (typeof output !== "string") {
                                    console.error(`Output from function ${functionName} is not a string`);
                                    output = "";
                                }
                                return {
                                    tool_call_id: toolCall.id,
                                    output: output,
                                };
                            } catch (error) {
                                console.error(`Error executing function ${functionName}:`, error);
                                return null;
                            }
                        } else {
                            console.error(`Function ${functionName} is not implemented`);
                            return null;
                        }
                    });

                    const toolOutputsTemp = await Promise.all(toolOutputPromises);
                    const toolOutputs = toolOutputsTemp.filter(output => output != null && output.output != null);

                    if (toolOutputs.length > 0) {
                        console.log("AQUIIII", toolOutputs);
                        try {
                            await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, { tool_outputs: toolOutputs });
                        } catch (error) {
                            console.error('Error submitting tool outputs:', error);
                            throw error;
                        }
                    }
                }
            }

            await new Promise(resolve => setTimeout(resolve, 500)); // Simple delay for polling

            try {
                runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
            } catch (error) {
                console.error('Error retrieving run status:', error);
                throw error;
            }
        }

        // Obtener el último mensaje del run
        try {
            const messages = await openai.beta.threads.messages.list(thread.id);
            const lastMessageForRun = messages.data
                .filter(message => message.run_id === run.id && message.role === "assistant")
                .pop();

            return lastMessageForRun ? lastMessageForRun.content[0].text.value : null;
        } catch (error) {
            console.error('Error retrieving messages:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error during assistant interaction:', error);
        // Reintentar si falla
        return await sendToAssistant(thread, assistant, message, phone_num);
    }
}


 const dalleAPI = async (promptIn) => {
    try {
        const prompt = promptIn;

        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });
        return response.data.data[0].url;
    }
    catch (error) {
        console.error(error);
    }
}

 const ttsOpenAI = async (text) => {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
    });
    //console.log(speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    return speechFile;
}

// Export the functions
module.exports = { initAssistant, retrieveAssistant, sendToAssistant, ttsOpenAI, dalleAPI, addClient};