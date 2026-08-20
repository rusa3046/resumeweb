# deepeval contribution — CSV tools column fix

Everything here is verified against `deepeval 4.1.8` and `confident-ai/deepeval`
`main` @ `62e26aa`.

## The bug

`EvaluationDataset.add_goldens_from_csv_file` exposes
`tools_called_col_delimiter` / `expected_tools_col_delimiter`, but the code path
behind them returns plain strings into a field typed `List[ToolCall]`. Every
non-JSON tools column raises a Pydantic `ValidationError`, so both arguments are
unreachable in practice.

Distinct from #2564 / #2565, which fixed the JSON round-trip path only.

## Files

| file | what it is |
| --- | --- |
| `repro.py` | standalone reproduction, no API key or LLM call |
| `repro_output.txt` | its verbatim output on 4.1.8 |
| `deepeval-csv-tools-fix.patch` | the fix plus 6 regression tests |
| `PR_DESCRIPTION.md` | ready-to-paste PR body |

## Submitting

The fix is committed on top of `62e26aa`. To open the PR:

```bash
# 1. Fork confident-ai/deepeval on GitHub, then:
git clone https://github.com/<your-username>/deepeval
cd deepeval
git checkout -b fix/csv-tools-delimiter

# 2. Apply the patch (preserves the commit message)
git am /path/to/deepeval-csv-tools-fix.patch

# 3. Verify before pushing
pip install -e . && pip install pandas pytest
pytest tests/test_core/test_datasets/test_dataset.py -q   # expect 27 passed

# 4. Push and open the PR against confident-ai/deepeval:main
git push -u origin fix/csv-tools-delimiter
```

Paste `PR_DESCRIPTION.md` as the PR body.

`CONTRIBUTING.md` uses a fork-and-PR workflow and does not require filing an
issue first, so this can go straight to a PR.
