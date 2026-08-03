# Practice-question PDF import format

Practice-question uploads are structured import files. The backend rejects the entire PDF when any question is incomplete, out of order, assigned to an unknown category, or assigned to a category in the wrong section. This prevents a partial or incorrectly classified batch from reaching the question bank.

## Create the PDF

1. In Admin → Test & Question Uploads → Practice Question Uploads, download the sample PDF or open the printable builder.
2. Edit the sample block and add one block for every question.
3. Start at `QUESTION 1` and number every block consecutively.
4. Use a category name exactly as it appears in Admin → Questions → Categories.
5. Print or export the document as a PDF with browser headers and footers disabled.
6. Confirm that text in the PDF can be selected. Image-only/scanned PDFs are not supported.

## Exact block format

```text
QUESTION 1
SECTION: MATH
CATEGORY: Algebra
DIFFICULTY: MEDIUM
PROMPT: If 3x + 7 = 22, what is the value of x?
A: 3
B: 5
C: 7
D: 15
ANSWER: B
EXPLANATION: Subtract 7 from both sides, then divide by 3.
END QUESTION
```

Repeat the same block as `QUESTION 2`, `QUESTION 3`, and so on. Keep every label on its own line and in the order shown. A prompt, option, or explanation may continue onto additional lines.

## Allowed values

| Field | Allowed value |
| --- | --- |
| `SECTION` | `MATH` or `READING_WRITING` |
| `CATEGORY` | Exact name of an existing question-bank category in that section |
| `DIFFICULTY` | `EASY`, `MEDIUM`, or `HARD` |
| `ANSWER` | `A`, `B`, `C`, or `D` |

All ten fields plus `END QUESTION` are required. Do not use tables, columns, headers, footers, answer bubbles, scanned pages, or choices without the `A:` through `D:` labels.

## Import workflow

Upload the PDF, select **Extract**, review every extracted question, approve the desired questions, and select **Publish**. Publishing revalidates the four choices, answer, difficulty, section, and live question-bank category before inserting anything.
