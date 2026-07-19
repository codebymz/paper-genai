// Punjab Board paper templates — header & section wording per board.
// Sourced from publicly circulated past papers (BISE Lahore, Faisalabad, Sahiwal,
// Multan, Gujranwala, Rawalpindi, DG Khan, Sargodha, Bahawalpur, FBISE).
// Wording is kept close to authentic papers so the AI mimics the real format.

const lahore = {
  id: "BISE Lahore",
  displayName: "BISE Lahore",
  headerLines: [
    "BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, LAHORE",
    "{SUBJECT} ({CLASS})    GROUP-{GROUP}    SESSION ({SESSION})",
    "Paper Code: {PAPER_CODE}",
  ],
  rollNoBlock: "Roll No. (in figures): __________   Roll No. (in words): __________",
  objectiveSection: {
    title: "OBJECTIVE TYPE",
    instruction:
      "Time Allowed: {TIME_OBJ}   Maximum Marks: {MARKS_OBJ}\nNote: Four possible answers A, B, C and D to each question are given. Mark the correct answer with a Pen on the answer sheet provided.",
    omrNote: "Cutting, erasing, overwriting and use of lead pencil will result in loss of marks.",
  },
  subjectiveSection: {
    title: "SUBJECTIVE TYPE",
    shortQ: {
      heading: "SECTION – I",
      instruction:
        "Time Allowed: {TIME_SUB}   Maximum Marks: {MARKS_SUB}\nQ.2  Write short answers to any FIVE (5) of the following questions.",
    },
    longQ: {
      heading: "SECTION – II",
      instruction:
        "Note: Attempt any TWO (2) questions. Each question carries equal marks.",
    },
  },
};

const faisalabad = {
  id: "BISE Faisalabad",
  displayName: "BISE Faisalabad",
  headerLines: [
    "BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, FAISALABAD",
    "{SUBJECT} — {CLASS}    GROUP-{GROUP}    ({SESSION})",
    "Paper Code: {PAPER_CODE}",
  ],
  rollNoBlock: "Roll No. ____________________________  (To be filled in by the candidate)",
  objectiveSection: {
    title: "OBJECTIVE",
    instruction:
      "Time: {TIME_OBJ}   Marks: {MARKS_OBJ}\nNote: You have four choices for each objective type question as A, B, C and D. The choice which you think is correct, fill that circle in front of that question with marker or pen ink on the bubble sheet.",
  },
  subjectiveSection: {
    title: "SUBJECTIVE",
    shortQ: {
      heading: "SECTION – I",
      instruction:
        "Time: {TIME_SUB}   Marks: {MARKS_SUB}\nQ.2  Attempt any FIVE parts of the following short questions.\nQ.3  Attempt any FIVE parts of the following short questions.",
    },
    longQ: {
      heading: "SECTION – II",
      instruction: "Note: Attempt any TWO questions. (Each question carries equal marks)",
    },
  },
};

const sahiwal = {
  id: "BISE Sahiwal",
  displayName: "BISE Sahiwal",
  headerLines: [
    "BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, SAHIWAL",
    "{SUBJECT}  ({CLASS})  GROUP-{GROUP}  ({SESSION})",
    "Paper Code: {PAPER_CODE}",
  ],
  rollNoBlock: "Roll No. _____________________ (in figures)        ____________________ (in words)",
  objectiveSection: {
    title: "OBJECTIVE TYPE",
    instruction:
      "Time: {TIME_OBJ}   Marks: {MARKS_OBJ}\nNote: Four possible answers A, B, C and D are given. Mark the correct answer on the bubble sheet with marker or pen.",
  },
  subjectiveSection: {
    title: "SUBJECTIVE TYPE",
    shortQ: {
      heading: "SECTION – I",
      instruction:
        "Time: {TIME_SUB}   Marks: {MARKS_SUB}\nQ.2  Write short answers to any FIVE (5) of the following questions.",
    },
    longQ: {
      heading: "SECTION – II",
      instruction: "Note: Attempt any TWO (2) questions.",
    },
  },
};

const multan = {
  id: "BISE Multan",
  displayName: "BISE Multan",
  headerLines: [
    "BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, MULTAN",
    "{SUBJECT} ({CLASS})  GROUP-{GROUP}   ({SESSION})",
    "Paper Code: {PAPER_CODE}",
  ],
  rollNoBlock: "Roll No. ___________________________________",
  objectiveSection: {
    title: "OBJECTIVE",
    instruction:
      "Time Allowed: {TIME_OBJ}   Maximum Marks: {MARKS_OBJ}\nNote: You have four choices for each objective type question. Fill the relevant bubble against each question on bubble sheet according to your choice.",
  },
  subjectiveSection: {
    title: "SUBJECTIVE",
    shortQ: {
      heading: "SECTION – I",
      instruction:
        "Time Allowed: {TIME_SUB}   Maximum Marks: {MARKS_SUB}\nQ.2  Attempt any FIVE (5) parts.\nQ.3  Attempt any FIVE (5) parts.",
    },
    longQ: {
      heading: "SECTION – II",
      instruction: "Note: Attempt any TWO (2) questions. Each question carries equal marks.",
    },
  },
};

const gujranwala = {
  id: "BISE Gujranwala",
  displayName: "BISE Gujranwala",
  headerLines: [
    "BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, GUJRANWALA",
    "{SUBJECT}  ({CLASS})   GROUP-{GROUP}   ({SESSION})",
    "Paper Code: {PAPER_CODE}",
  ],
  rollNoBlock: "Roll No. _________________ (in figures)   _________________ (in words)",
  objectiveSection: {
    title: "OBJECTIVE",
    instruction:
      "Time: {TIME_OBJ}   Marks: {MARKS_OBJ}\nNote: Four possible answers A, B, C, D to each question are given. Encircle the correct option on the bubble sheet.",
  },
  subjectiveSection: {
    title: "SUBJECTIVE",
    shortQ: {
      heading: "SECTION – I",
      instruction:
        "Time: {TIME_SUB}   Marks: {MARKS_SUB}\nQ.2  Write short answers to any FIVE (5) parts.",
    },
    longQ: {
      heading: "SECTION – II",
      instruction: "Note: Attempt any TWO questions.",
    },
  },
};

const rawalpindi = {
  id: "BISE Rawalpindi",
  displayName: "BISE Rawalpindi",
  headerLines: [
    "BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, RAWALPINDI",
    "{SUBJECT}  ({CLASS})   GROUP-{GROUP}   ({SESSION})",
    "Paper Code: {PAPER_CODE}",
  ],
  rollNoBlock: "Roll No. ____________________________",
  objectiveSection: {
    title: "OBJECTIVE TYPE",
    instruction:
      "Time: {TIME_OBJ}   Marks: {MARKS_OBJ}\nNote: Four possible answers A, B, C and D are given. Mark the correct answer with a marker or pen on the answer sheet.",
  },
  subjectiveSection: {
    title: "SUBJECTIVE TYPE",
    shortQ: {
      heading: "SECTION – I",
      instruction:
        "Time: {TIME_SUB}   Marks: {MARKS_SUB}\nQ.2  Write short answers to any FIVE (5) of the following.",
    },
    longQ: {
      heading: "SECTION – II",
      instruction: "Note: Attempt any TWO (2) questions.",
    },
  },
};

const dgkhan = {
  id: "BISE DG Khan",
  displayName: "BISE Dera Ghazi Khan",
  headerLines: [
    "BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, DERA GHAZI KHAN",
    "{SUBJECT} ({CLASS})  GROUP-{GROUP}  ({SESSION})",
    "Paper Code: {PAPER_CODE}",
  ],
  rollNoBlock: "Roll No. ____________________________",
  objectiveSection: {
    title: "OBJECTIVE",
    instruction:
      "Time: {TIME_OBJ}   Marks: {MARKS_OBJ}\nNote: Four possible answers A, B, C, D to each question are given. Mark the correct answer on the bubble sheet.",
  },
  subjectiveSection: {
    title: "SUBJECTIVE",
    shortQ: {
      heading: "SECTION – I",
      instruction:
        "Time: {TIME_SUB}   Marks: {MARKS_SUB}\nQ.2  Write short answers to any FIVE (5) parts.",
    },
    longQ: {
      heading: "SECTION – II",
      instruction: "Note: Attempt any TWO (2) questions.",
    },
  },
};

const sargodha = {
  id: "BISE Sargodha",
  displayName: "BISE Sargodha",
  headerLines: [
    "BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, SARGODHA",
    "{SUBJECT} ({CLASS})   GROUP-{GROUP}   ({SESSION})",
    "Paper Code: {PAPER_CODE}",
  ],
  rollNoBlock: "Roll No. _____________________ (in figures)   _____________________ (in words)",
  objectiveSection: {
    title: "OBJECTIVE TYPE",
    instruction:
      "Time: {TIME_OBJ}   Marks: {MARKS_OBJ}\nNote: Four possible answers A, B, C, D are given. Tick the correct option on the bubble sheet.",
  },
  subjectiveSection: {
    title: "SUBJECTIVE TYPE",
    shortQ: {
      heading: "SECTION – I",
      instruction:
        "Time: {TIME_SUB}   Marks: {MARKS_SUB}\nQ.2  Attempt any FIVE (5) parts of the following.",
    },
    longQ: {
      heading: "SECTION – II",
      instruction: "Note: Attempt any TWO (2) questions.",
    },
  },
};

const bahawalpur = {
  id: "BISE Bahawalpur",
  displayName: "BISE Bahawalpur",
  headerLines: [
    "BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, BAHAWALPUR",
    "{SUBJECT} ({CLASS})  GROUP-{GROUP}   ({SESSION})",
    "Paper Code: {PAPER_CODE}",
  ],
  rollNoBlock: "Roll No. ____________________________",
  objectiveSection: {
    title: "OBJECTIVE",
    instruction:
      "Time: {TIME_OBJ}   Marks: {MARKS_OBJ}\nNote: Four possible answers A, B, C, D are given. Mark the correct option on the bubble sheet.",
  },
  subjectiveSection: {
    title: "SUBJECTIVE",
    shortQ: {
      heading: "SECTION – I",
      instruction:
        "Time: {TIME_SUB}   Marks: {MARKS_SUB}\nQ.2  Write short answers to any FIVE (5) parts.",
    },
    longQ: {
      heading: "SECTION – II",
      instruction: "Note: Attempt any TWO (2) questions.",
    },
  },
};

const fbise = {
  id: "FBISE (Federal)",
  displayName: "Federal Board (FBISE)",
  headerLines: [
    "FEDERAL BOARD OF INTERMEDIATE AND SECONDARY EDUCATION, ISLAMABAD",
    "{SUBJECT}  HSSC/SSC – {CLASS}   ({SESSION})",
    "Paper Code: {PAPER_CODE}",
  ],
  rollNoBlock: "Roll No: _________________________  Answer Sheet No: __________________",
  objectiveSection: {
    title: "SECTION – A (Marks {MARKS_OBJ})",
    instruction:
      "Time allowed: {TIME_OBJ}\nNote: Section-A is compulsory. All parts of this section are to be answered on this page and handed over to the Centre Superintendent. Deleting/overwriting is not allowed. Do NOT use lead pencil.",
  },
  subjectiveSection: {
    title: "",
    shortQ: {
      heading: "SECTION – B (Marks {MARKS_SUB})",
      instruction:
        "Time allowed: {TIME_SUB}\nQ.2  Attempt any ELEVEN parts. All parts carry equal marks.",
    },
    longQ: {
      heading: "SECTION – C (Marks 15)",
      instruction:
        "Note: Attempt any THREE questions. All questions carry equal marks.",
    },
  },
};

const BOARD_TEMPLATES = {
  [lahore.id]: lahore,
  [faisalabad.id]: faisalabad,
  [sahiwal.id]: sahiwal,
  [multan.id]: multan,
  [gujranwala.id]: gujranwala,
  [rawalpindi.id]: rawalpindi,
  [dgkhan.id]: dgkhan,
  [sargodha.id]: sargodha,
  [bahawalpur.id]: bahawalpur,
  [fbise.id]: fbise,
};

function renderTemplateBlueprint(boardId, paperType) {
  const t = BOARD_TEMPLATES[boardId] || lahore;
  const obj = t.objectiveSection;
  const sub = t.subjectiveSection;

  const type = paperType || "Full Paper (MCQs + Short + Long)";
  const showMCQ = type.includes("Full") || type.includes("MCQ");
  const showSubj = type.includes("Full") || type.includes("Short") || type.includes("Long");

  const cleanObjInstruction = obj.instruction.replace(/Time Allowed:.*Marks:.*\n?/gi, '').replace(/Time:.*Marks:.*\n?/gi, '').trim();
  const cleanSubInstruction = sub.shortQ.instruction.replace(/Time Allowed:.*Marks:.*\n?/gi, '').replace(/Time:.*Marks:.*\n?/gi, '').trim();

  const rollNoBlockHtml = `
<table class="roll-no-table" style="display: inline-table; border-collapse: collapse; margin-left: 8px; vertical-align: middle;">
  <tr>
    <td style="width: 16px; height: 18px; border: 1px solid #000; padding: 0; text-align: center;"></td>
    <td style="width: 16px; height: 18px; border: 1px solid #000; padding: 0; text-align: center;"></td>
    <td style="width: 16px; height: 18px; border: 1px solid #000; padding: 0; text-align: center;"></td>
    <td style="width: 16px; height: 18px; border: 1px solid #000; padding: 0; text-align: center;"></td>
    <td style="width: 16px; height: 18px; border: 1px solid #000; padding: 0; text-align: center;"></td>
    <td style="width: 16px; height: 18px; border: 1px solid #000; padding: 0; text-align: center;"></td>
  </tr>
</table>
`;

  const objHeader = `
<div class="paper-header objective-header">
  <div class="board-name">${t.headerLines[0] || t.displayName.toUpperCase()}</div>
  <div class="paper-type-title">${obj.title || 'OBJECTIVE TYPE'}</div>
  <table class="header-info-table">
    <tr>
      <td style="width: 40%;"><strong>Roll No:</strong> ${rollNoBlockHtml}</td>
      <td style="text-align: center; font-weight: bold; font-size: 11pt;">{SUBJECT} ({CLASS})</td>
      <td style="width: 25%; text-align: right;"><strong>Group:</strong> {GROUP}</td>
    </tr>
    <tr>
      <td><strong>Paper Code:</strong> {PAPER_CODE}</td>
      <td style="text-align: center;"><strong>Session:</strong> {SESSION}</td>
      <td style="text-align: right;"><strong>Time Allowed:</strong> {TIME_OBJ}</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Note:</strong> ${cleanObjInstruction} ${obj.omrNote ? '(' + obj.omrNote + ')' : ''}</td>
      <td style="text-align: right;"><strong>Max Marks:</strong> {MARKS_OBJ}</td>
    </tr>
  </table>
</div>
`;

  const subHeader = `
<div class="paper-header subjective-header">
  <div class="board-name">${t.headerLines[0] || t.displayName.toUpperCase()}</div>
  <div class="paper-type-title">${sub.title || 'SUBJECTIVE TYPE'}</div>
  <table class="header-info-table">
    <tr>
      <td style="width: 40%;"><strong>Roll No:</strong> ${rollNoBlockHtml}</td>
      <td style="text-align: center; font-weight: bold; font-size: 11pt;">{SUBJECT} ({CLASS})</td>
      <td style="width: 25%; text-align: right;"><strong>Group:</strong> {GROUP}</td>
    </tr>
    <tr>
      <td><strong>Session:</strong> {SESSION}</td>
      <td style="text-align: center;"><strong>Time Allowed:</strong> {TIME_SUB}</td>
      <td style="text-align: right;"><strong>Max Marks:</strong> {MARKS_SUB}</td>
    </tr>
  </table>
</div>
`;

  const sections = [];
  if (showMCQ) {
    sections.push(`
<!-- OBJECTIVE_START -->
${objHeader}

Q.1  (MCQs go here — exactly the requested count)

<!-- OBJECTIVE_END -->
`);
  }

  if (showSubj) {
    let subjContent = `
<!-- SUBJECTIVE_START -->
${subHeader}

### ${sub.shortQ.heading}
${cleanSubInstruction}
`;

    if (type.includes("Full") || type.includes("Long")) {
      subjContent += `
### ${sub.longQ.heading}
${sub.longQ.instruction}
`;
    }
    
    subjContent += `\n<!-- SUBJECTIVE_END -->`;
    sections.push(subjContent);
  }

  return sections.join("\n\n---PAGE_BREAK---\n\n");
}

module.exports = {
  BOARD_TEMPLATES,
  renderTemplateBlueprint
};
