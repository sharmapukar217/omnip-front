type PromptArgs = { file: File; prompt: string };

// export const prompt = (key: string) => {
//   return `Do you find "${key}" ? Answer me only with true or false`;
// };

export const promptChatPDF = async ({
  file,
  prompt
}: PromptArgs): Promise<string | undefined> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const firstResponse = await fetch("https://api.chatpdf.com/v1/sources/add-file", {
      method: "post",
      body: formData,
      headers: { "x-api-key": import.meta.env.NUXT_PUBLIC_CHAT_PDF_KEY }
    });

    const chatPdfSource = await firstResponse.json();
    console.debug("[CHATPDF]:", chatPdfSource);

    const secondResponse = await fetch("https://api.chatpdf.com/v1/chats/message", {
      method: "post",
      body: JSON.stringify({
        sourceId: chatPdfSource.sourceId,
        messages: [{ role: "user", content: prompt }]
      }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.NUXT_PUBLIC_CHAT_PDF_KEY
      }
    });

    const json = await secondResponse.json();

    console.debug("[CHATPDF]:", { content: json?.content });
    return json?.content as string | undefined;
  } catch {
    return undefined;
  }
};

//
