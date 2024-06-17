# Run the Streamlit app with `streamlit run your_script.py`

import streamlit as st
import random

questions = {
    'M': ["A particle of mass $m$ moves in a circular orbit of radius $r$ in the $x y$ plane with angular frequency $\omega$. Find the total mechanical energy of the particle.", "A force of 100 N acting on a 10 kg mass produces an acceleration of 10 $\mathrm{ms}^{-2}$.", "Find the moment of inertia of the disc about a diameter if the mass is $0.4 \mathrm{~kg}$ and the radius is $0.2 \mathrm{~m}$."],
    'A': ["The quantity of an ideal gas is $0.20 \mathrm{~mol}$ and the slope of an isobar on a $V-T$ diagram for the gas is $8.3 \mathrm{~m}^{3} \mathrm{~K}^{-1}$. Find the pressure of the gas.", "A balloon containing 3 moles of oxygen and 5 moles of helium has a pressure of $160 \mathrm{kPa}$. How many moles of nitrogen must be pumped into the balloon so as to increase the total pressure to $200 \mathrm{kPa}$ ?", "The uncertainty in the $y{\text {-coordinate of a particle of mass }} 1.67 \times 10^{-27} \mathrm{~kg}$ is $20.0 \mathrm{pm}$. What is the least uncertainty the y-component of its linear momentum can have?"]
}

# Flatten the questions dictionary into a list of tuples (label, question)
question_list = [('M', q) for q in questions['M']] + [('A', q) for q in questions['A']]
random.shuffle(question_list)

if 'index' not in st.session_state:
    st.session_state.index = 0
if 'choices' not in st.session_state:
    st.session_state.choices = []

def record_choice(chosen_label):
    actual_label, question_text = question_list[st.session_state.index]
    st.session_state.choices.append({
        'question': question_text,
        'chosen': chosen_label,
        'true': actual_label
    })
    st.session_state.index += 1

st.markdown("""
    <style>
    .question-box {
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 20px;
        background-color: #f9f9f9;
        margin-bottom: 20px;
        text-align: center;
    }
    .centered {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .button-container {
        display: flex;
        justify-content: center;
        gap: 10px;
    }
    .stButton button {
        width: 100px;
        padding: 5px;
    }
    .instructions {
        font-size: 0.9em;
        color: gray;
        text-align: center;
        margin-bottom: 20px;
    }
    </style>
    """, unsafe_allow_html=True)

st.title("Question Quality Comparison")
st.markdown('<div class="instructions">Please choose whether the displayed question is machine-generated or an actual question.</div>', unsafe_allow_html=True)

# Display the current question
if st.session_state.index < len(question_list):
    actual_label, question_text = question_list[st.session_state.index]
    st.markdown(f'<div class="question-box centered">{question_text}</div>', unsafe_allow_html=True)

    st.markdown('<div class="button-container">', unsafe_allow_html=True)
    if st.button('Machine'):
        record_choice('M')
    if st.button('Actual'):
        record_choice('A')
    st.markdown('</div>', unsafe_allow_html=True)
else:
    st.write("Results:")
    correct_count = 0
    for i, choice in enumerate(st.session_state.choices):
        st.write(f"Question {i+1}: {choice['question']}")
        st.write(f"Chosen: {'Machine' if choice['chosen'] == 'M' else 'Actual'}")
        st.write(f"True: {'Machine' if choice['true'] == 'M' else 'Actual'}")
        st.write("---")
        if choice['chosen'] == choice['true']:
            correct_count += 1

    accuracy = correct_count / len(st.session_state.choices)
    st.write(f"Accuracy: {accuracy:.2f}")

    machine_confused_as_actual = sum(1 for choice in st.session_state.choices if choice['chosen'] == 'A' and choice['true'] == 'M')
    total_machine_questions = sum(1 for choice in st.session_state.choices if choice['true'] == 'M')
    machine_quality = (machine_confused_as_actual / total_machine_questions) * 100 if total_machine_questions > 0 else 0

    st.write(f"Machine Questions Quality (confused as actual): {machine_quality:.2f}%")

    quality_threshold = 75

    if machine_quality >= quality_threshold:
        st.success(f"The machine-generated questions are of high quality (>= {quality_threshold}%). They can be combined with actual questions.")
    else:
        st.warning(f"The machine-generated questions are not of high quality (< {quality_threshold}%). They should not be combined with actual questions.")

    st.balloons()
