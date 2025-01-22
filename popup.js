$(document).ready(function () {
  let chatHistory = [];
  $('#input').focus();
  console.log("test");
  

  function sendMessage() {
    const input = $("#input").val();
    const formattedInput = input.replace(/\n/g, "<br>");
    const chatDiv = $("#chat-div");

    if ($.trim(input) !== "") {
      chatDiv.append(`<div class="user-chat">${formattedInput}</div>`);
      chatHistory.push({role: "user", content: input});

      $.post(
        "http://localhost/commandL.ai/openai-proxy.php", // For testing on local: 'openai-proxy.php'. Eventually to Apache on a server to render php script?
        JSON.stringify({
          messages: chatHistory,
        })
      )
        .then((response) => {
          const parsedResponse = JSON.parse(response.response);
          console.log(parsedResponse);
          /* Example of what parsedResponse looks like:
            {
              id: "chatcmpl-AfwLeBronJamesF3x",
              object: "chat.completion",
              created: 1736311967,
              model: "gpt-4o-mini-2024-07-18",
              choices: Array(1), ... // Meaning there's one object. 
              // -> Inside the one object (accessed by choices[0]), is:
              {
                "finish_reason": "stop",
                "index": 0,
                "logprobs": null,
                "message": {
                  "content": "LeBron Stats: 100PPG. He's the Goat!",
                  "refusal": null,
                  "role": "assistant"
                }
              }
            }
          */
          let messageContent = parsedResponse.choices[0].message.content;

          // OpenAI API returns response in markdown-style. Convert it to HTML to render line breaks & headings
          messageContent = messageContent.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
          messageContent = messageContent.replace(/### (.*?)\n/g, '<h3>$1</h3>');

          // Convert code blocks from markdown to HTML
          messageContent = messageContent.replace(/```([^`]+)```/g, '<div class="code-block"><code>$1</code></div>');

          chatDiv.append(`<div class="ai-chat">${messageContent}</div>`);

          chatHistory.push({role: "assistant", content: messageContent});
          console.log(chatHistory);
        })
        .catch((error) => {
          console.error("Error: ", error);
          chatDiv.append("<div>Error: Unable to get a response.</div>");
        });

      $("#input").val("");
    }
  }

  $("#send").click(function () {
    sendMessage();
  });

  $("#input").keypress(function (e) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault(); // Prevents a line break being left in chat input area after pressing 'enter'
      sendMessage();
    }
  });
});


