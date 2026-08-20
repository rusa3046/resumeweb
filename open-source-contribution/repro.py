"""Minimal reproduction: deepeval CSV loader cannot parse delimiter-separated
tools columns, even though add_goldens_from_csv_file exposes
tools_called_col_delimiter / expected_tools_col_delimiter for exactly that.

    pip install deepeval pandas && python repro.py
"""

import deepeval
from deepeval.dataset import EvaluationDataset

print("deepeval", deepeval.__version__)

CASES = {
    "JSON cell (the form save_as writes)": '[{"name": "get_weather"}]',
    "delimiter-separated names (documented ';')": "get_weather;get_location",
    "single bare tool name": "get_weather",
}

for label, cell in CASES.items():
    with open("repro.csv", "w", newline="", encoding="utf-8") as f:
        f.write("input,actual_output,tools_called\n")
        f.write('question,answer,"%s"\n' % cell.replace('"', '""'))

    dataset = EvaluationDataset()
    try:
        dataset.add_goldens_from_csv_file(file_path="repro.csv")
        print(f"{label}\n  -> OK: {dataset.goldens[0].tools_called}\n")
    except Exception as e:
        first_line = str(e).splitlines()[0]
        print(f"{label}\n  -> {type(e).__name__}: {first_line}\n")
