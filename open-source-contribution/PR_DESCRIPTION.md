# fix(dataset): parse delimiter-separated tools columns in `add_goldens_from_csv_file`

## Problem

`add_goldens_from_csv_file` accepts `tools_called_col_delimiter` (default `";"`)
and `expected_tools_col_delimiter` (default `";"`), and its `parse_tools` helper
has an explicit fallback branch for them:

```python
except (ValueError, json.JSONDecodeError):
    # Fallback to simple split on delimiter
    return value.split(delimiter)
```

That branch returns `list[str]`, but `Golden.tools_called` and
`Golden.expected_tools` are typed `Optional[List[ToolCall]]`. Every value the
fallback produces therefore fails Pydantic validation, so the fallback can never
succeed and the two delimiter arguments have no reachable effect.

Any CSV whose tools column is not a JSON array raises:

```
pydantic_core._pydantic_core.ValidationError: 2 validation errors for Golden
tools_called.0
  Input should be a valid dictionary or instance of ToolCall
  [type=model_type, input_value='get_weather', input_type=str]
```

The error names a Pydantic field rather than the CSV file, row, or column, so it
does not point back at the input that caused it.

This is separate from #2564 / #2565, which fixed the JSON path that `save_as`
writes. That path still works and is covered by a test here.

## Reproduction

`deepeval 4.1.8` on macOS/Python 3.10 and Linux/Python 3.11, and current `main`.

```csv
input,actual_output,tools_called
What is the weather?,It is sunny,get_weather;get_location
```

```python
from deepeval.dataset import EvaluationDataset

dataset = EvaluationDataset()
dataset.add_goldens_from_csv_file(file_path="repro.csv")  # ValidationError
```

| tools column | before | after |
| --- | --- | --- |
| `[{"name": "get_weather"}]` | parses | parses (unchanged) |
| `get_weather;get_location` | `ValidationError` | two `ToolCall`s |
| `get_weather` | `ValidationError` | one `ToolCall` |
| `[{"name": "get_weather"}` (malformed) | Pydantic type error | `ValueError: Error processing tools_called: ...` |

## Change

`parse_tools` now builds a `ToolCall` per delimited entry, since `ToolCall`
requires only `name`. A cell that opens with `[` or `{` but fails to parse is
treated as malformed JSON and raises an error naming the column, matching how
the sibling `add_test_cases_from_csv_file` already reports the same failure,
rather than being silently turned into a tool named `[{"name":`.

## Tests

Six tests in `TestCsvToolsParsing` covering both delimiter columns, a custom
delimiter with surrounding whitespace, the JSON form, the malformed-JSON error,
and empty cells. Four fail before this change and all pass after.

```
$ pytest tests/test_core/test_datasets/test_dataset.py -q
27 passed
```

(21 pre-existing tests in that file plus the 6 new ones. `black --line-length 80`
applied.)
