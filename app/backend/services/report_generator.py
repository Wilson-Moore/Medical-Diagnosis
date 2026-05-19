from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model = AutoModelForSeq2SeqLM.from_pretrained(
    "AmineABAI/flan-t5-chexnet"
)

tokenizer = AutoTokenizer.from_pretrained(
    "AmineABAI/flan-t5-chexnet"
)

def generate_report(predictions):

    findings = []

    for p in predictions:
        if p["probability"] > 0.5:
            findings.append(
                f"{p['disease']} {p['probability']:.2f}"
            )

    if len(findings) == 0:
        findings = ["No Finding"]

    prompt = " ".join(findings)

    inputs = tokenizer(
        prompt,
        return_tensors="pt"
    )

    outputs = model.generate(
        **inputs,
        max_length=128
    )

    report = tokenizer.decode(
        outputs[0],
        skip_special_tokens=True
    )

    return report