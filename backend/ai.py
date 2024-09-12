from transformers import pipeline

# Load a conversational model
generator = pipeline('text-generation', model='gpt2')

def generate_welcome_message(user_details, request_sender_name):
    prompt = (
        f"Hi! I'm {request_sender_name}. I just sent you a connection request because "
        f"I'm really interested in {user_details['interests']}. "
        f"I would love to chat and learn more about you and your work. Looking forward to connecting!"
    )
    response = generator(prompt, max_length=100, num_return_sequences=1)
    return response[0]['generated_text']
