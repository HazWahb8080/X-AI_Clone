"use server";
export const sendToOpenAI = async (input) => {
  const prompt = `write me a high-quality viral tweet about this input ${input}`;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`, // Use the API key variable
      },
    });
    const data = await response.json();
    // Check if the response contains choices and extract the content if available
    if (
      data.choices &&
      data.choices.length > 0 &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      const completion = data.choices[0].message.content;
      return completion;
    } else {
      throw new Error(
        "Unable to extract completion content from the response."
      );
    }
  } catch (error) {
    console.error(error);
    // Handle the error
    throw new Error("An error occurred while sending the request to OpenAI");
  }
};
