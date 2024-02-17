from typing import Optional, List, Dict
import os
from dotenv import load_dotenv
from openai import OpenAI
# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client with API key from environment variables
# openai.api_key = os.getenv("OPENAI_API_KEY")

class ChatGPT:
    def __init__(self, model: str = "gpt-3.5-turbo", system_message: Optional[str] = "You are a helpful assistant."):
        self.model = model
        self.messages = [{"role": "system", "content": system_message}] if system_message else []
        self.client = OpenAI(
            # This is the default and can be omitted
            api_key=os.getenv("OPENAI_API_KEY"),
        )

    def send_message(self, message: str, role: str = "user") -> str:
        self.messages.append({"role": role, "content": message})
        response = self.client.chat.completions.create(
            messages=self.messages,
            model="gpt-3.5-turbo",
        )
        completion_message = response.choices[0].message.content
        # Optionally, append the completion to the messages to maintain context
        self.messages.append({"role": "assistant", "content": completion_message})
        return completion_message

# if __name__ == "__main__":
#     chat = ChatGPT()
#     response = chat.send_message("Hello")
#     print(response)
#     response = chat.send_message("How are you?")
#     print(response)
