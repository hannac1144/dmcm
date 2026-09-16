import { defineConfig } from 'vite';

const OTHER_VALUES = new Set(['other', 'other-drug', 'other-legal']);
const OTHER_LABELS = {
  en: { label: 'Please specify what the other option is', placeholder: 'Type your answer here…', continue: 'Continue →', summary: 'Other selections' },
  es: { label: 'Especifique qué otra opción describe su situación', placeholder: 'Escriba aquí…', continue: 'Continuar →', summary: 'Otras opciones seleccionadas' },
  ar: { label: 'يرجى تحديد الخيار الآخر الذي يصف وضعك', placeholder: 'اكتب هنا…', continue: 'متابعة ←', summary: 'الخيارات الأخرى المحددة' },
  zh: { label: '请说明其他哪一项最符合您的情况', placeholder: '请在此输入…', continue: '继续 →', summary: '其他选项' }
};

function otherFlowPlugin() {
  return {
    name: 'healthtech-other-answer-flow',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;

      let out = code;
      const helpers = `\nconst OTHER_VALUES = new Set(['other', 'other-drug', 'other-legal']);\nconst otherCopy = { en: { label: 'Please specify what the other option is', placeholder: 'Type your answer here…', continue: 'Continue →', summary: 'Other selections' }, es: { label: 'Especifique qué otra opción describe su situación', placeholder: 'Escriba aquí…', continue: 'Continuar →', summary: 'Otras opciones seleccionadas' }, ar: { label: 'يرجى تحديد الخيار الآخر الذي يصف وضعك', placeholder: 'اكتب هنا…', continue: 'متابعة ←', summary: 'الخيارات الأخرى المحددة' }, zh: { label: '请说明其他哪一项最符合您的情况', placeholder: '请在此输入…', continue: '继续 →', summary: '其他选项' } };\nconst currentLanguage = () => localStorage.getItem('healthtech-language') || 'en';\nconst getOtherEntries = answers => Object.entries(answers.__other || {}).filter(([, value]) => value && value.trim());\nconst getOtherLabel = () => otherCopy[currentLanguage()] || otherCopy.en;\n`;
      out = out.replace("import './styles.css';", "import './styles.css';" + helpers);

      out = out.replace(
        "  const [answers, setAnswers] = useState({});\n  const currentQuestions",
        "  const [answers, setAnswers] = useState({});\n  const [otherDraft, setOtherDraft] = useState('');\n  const currentQuestions"
      );

      out = out.replace(
        "  const choosePathway = value => { setPathway(value); setAnswers({}); setStep(0); setScreen('questions'); };\n  const choose = value => { setAnswers(prev => ({ ...prev, [current.id]: value })); setStep(s => s + 1); setScreen(step === currentQuestions.length - 1 ? 'funding' : 'questions'); };",
        `  const choosePathway = value => { setPathway(value); setAnswers({}); setOtherDraft(''); setStep(0); setScreen('questions'); };\n  const advanceCurrent = () => { setStep(s => s + 1); setScreen(step === currentQuestions.length - 1 ? 'funding' : 'questions'); setOtherDraft(''); };\n  const choose = value => {\n    if (OTHER_VALUES.has(value)) {\n      const saved = answers.__other?.[current.id] || '';\n      setAnswers(prev => ({ ...prev, [current.id]: value }));\n      setOtherDraft(saved);\n      if (!saved.trim()) return;\n    }\n    setAnswers(prev => ({ ...prev, [current.id]: value }));\n    advanceCurrent();\n  };\n  const saveOtherDraft = value => {\n    setOtherDraft(value);\n    setAnswers(prev => ({ ...prev, __other: { ...(prev.__other || {}), [current.id]: value } }));\n  };\n  const continueOther = () => { if (otherDraft.trim()) advanceCurrent(); };`
      );

      out = out.replace(
        "  const start = () => { setPathway(null); setAnswers({}); setStep(0); setScreen('intro'); };",
        "  const start = () => { setPathway(null); setAnswers({}); setOtherDraft(''); setStep(0); setScreen('intro'); };"
      );

      out = out.replace(
        "  });\n\n  ['funding','license','terms'].forEach(type => {",
        "  });\n  getOtherEntries(answers).forEach(([questionId, detail]) => {\n    const question = pathways[pathway].questions.find(q => q.id === questionId);\n    if (question) addText(`${question.title} — Other description: ${detail}`, 10, false, 4);\n  });\n\n  ['funding','license','terms'].forEach(type => {",
        1
      );

      const oldQuestion = "{current.id === 'state' ? <select className=\"state-select\" value={answers.state || ''} onChange={e => e.target.value && choose(e.target.value)}><option value=\"\">Select a state…</option>{states.map(state => <option key={state} value={state}>{state}</option>)}</select> : <div className=\"choices\">{current.options.map(([label, value]) => <button className=\"choice\" key={value} onClick={() => choose(value)}><span>{label}</span><b>→</b></button>)}</div>}<button className=\"text-button\" onClick={backQuestion}>← Back</button>";
      const newQuestion = `{current.id === 'state' ? <select className=\"state-select\" value={answers.state || ''} onChange={e => e.target.value && choose(e.target.value)}><option value=\"\">Select a state…</option>{states.map(state => <option key={state} value={state}>{state}</option>)}</select> : <><div className=\"choices\">{current.options.map(([label, value]) => <button className=\"choice\" key={value} onClick={() => choose(value)}><span>{label}</span><b>→</b></button>)}</div>{OTHER_VALUES.has(answers[current.id]) && <div className=\"other-answer-field\"><label className=\"other-answer-label\">{getOtherLabel().label}<input className=\"other-answer-input\" value={otherDraft} onChange={e => saveOtherDraft(e.target.value)} placeholder={getOtherLabel().placeholder} autoFocus /></label><button className=\"primary\" disabled={!otherDraft.trim()} onClick={continueOther}>{getOtherLabel().continue}</button></div>}</>}<button className=\"text-button\" onClick={backQuestion}>← Back</button>`;
      if (!out.includes(oldQuestion)) throw new Error('Expected questionnaire markup was not found');
      out = out.replace(oldQuestion, newQuestion);

      out = out.replace(
        "<div className=\"decision-header\"><span className=\"eyebrow\">{data.eyebrow}</span><h1>{data.title}</h1><p>{data.intro}</p></div>",
        "<div className=\"decision-header\"><span className=\"eyebrow\">{data.eyebrow}</span><h1>{data.title}</h1><p>{data.intro}</p>{getOtherEntries(answers).length > 0 && <div className=\"consider\"><strong>{getOtherLabel().summary}:</strong> {getOtherEntries(answers).map(([questionId, detail]) => `${pathways[pathway]?.questions.find(q => q.id === questionId)?.title}: ${detail}`).join(' · ')}</div>}</div>"
      );

      out = out.replace(
        "<div className=\"state-summary\"><span className=\"eyebrow\">State-law issue spotting</span>",
        "{getOtherEntries(answers).length > 0 && <div className=\"state-summary\"><span className=\"eyebrow\">{getOtherLabel().summary}</span><ul>{getOtherEntries(answers).map(([questionId, detail]) => <li key={questionId}><strong>{pathways[pathway].questions.find(q => q.id === questionId)?.title}:</strong> {detail}</li>)}</ul></div>}<div className=\"state-summary\"><span className=\"eyebrow\">State-law issue spotting</span>"
      );

      return { code: out, map: null };
    }
  };
}

export default defineConfig({ plugins: [otherFlowPlugin()] });
