export default defineEventHandler(async (event) => {

  const body = await readBody(event);
  if (!body) return {error: 1, message: "Sorry, no data received."};

  const {messages}   = body;


  //return data.
  return {
    role   : "assistant",
    message: `You said: ${messages}`
  }

})
