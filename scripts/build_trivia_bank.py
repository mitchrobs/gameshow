import pathlib
import re
import random
from typing import List, Dict

BASE = pathlib.Path('/Users/mitchellmacmini/Documents/New project/gameshow')
SOURCE = BASE / 'tmp/opentriviaqa/OpenTriviaQA-master/categories'
OUT = BASE / 'src/data/triviaPuzzles.ts'

CATEGORY_MAP = {
    'world': {
        'name': 'World & Places',
        'description': 'Geography, landmarks, and cultures.',
        'sources': ['world', 'geography'],
    },
    'science': {
        'name': 'Science & Nature',
        'description': 'Space, biology, and the natural world.',
        'sources': ['science-technology', 'animals', 'brain-teasers'],
    },
    'arts': {
        'name': 'Arts & Pop',
        'description': 'Movies, music, books, and culture.',
        'sources': ['movies', 'music', 'television', 'literature', 'entertainment', 'celebrities'],
    },
    'history': {
        'name': 'History & Society',
        'description': 'History, people, and cultural milestones.',
        'sources': ['history', 'people', 'humanities', 'religion-faith', 'general'],
    },
}

MAX_PER_CATEGORY = 2400
SEED = 742091


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def parse_file(path: pathlib.Path):
    lines = path.read_text(errors='ignore').splitlines()
    questions = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if line.startswith('#Q '):
            prompt = normalize(line[3:])
            if i + 1 >= len(lines):
                break
            corr_line = lines[i + 1].strip()
            if not corr_line.startswith('^ '):
                i += 1
                continue
            correct = normalize(corr_line[2:])
            options = []
            j = i + 2
            while j < len(lines):
                opt_line = lines[j].strip()
                if opt_line == '':
                    break
                if re.match(r'^[A-D] ', opt_line):
                    options.append(normalize(opt_line[2:]))
                    j += 1
                    continue
                if opt_line.startswith('#Q '):
                    break
                j += 1
            if prompt and correct and options:
                questions.append((prompt, correct, options))
            i = j
            continue
        i += 1
    return questions


def difficulty_for(prompt: str, options: List[str]) -> int:
    words = re.findall(r"[A-Za-z']+", prompt)
    word_count = len(words)
    option_words = sum(len(re.findall(r"[A-Za-z']+", opt)) for opt in options) / max(len(options), 1)
    score = word_count + option_words * 1.2
    if score < 12:
        return 1
    if score < 18:
        return 2
    return 3


source_questions: Dict[str, List[dict]] = {}
for file in SOURCE.iterdir():
    if not file.is_file():
        continue
    source_questions[file.name] = parse_file(file)


categories = []
rand = random.Random(SEED)

for cat_id, meta in CATEGORY_MAP.items():
    raw = []
    for src in meta['sources']:
        raw.extend(source_questions.get(src, []))

    seen = set()
    cleaned = []
    for prompt, correct, options in raw:
        key = prompt.lower()
        if key in seen:
            continue
        seen.add(key)

        unique_opts = []
        for opt in options:
            if opt not in unique_opts:
                unique_opts.append(opt)
        if correct not in unique_opts:
            unique_opts.append(correct)
        if len(unique_opts) < 4:
            continue
        if len(unique_opts) > 4:
            filtered = [correct]
            for opt in unique_opts:
                if opt == correct:
                    continue
                filtered.append(opt)
                if len(filtered) == 4:
                    break
            unique_opts = filtered
        if correct not in unique_opts or len(unique_opts) != 4:
            continue

        opt_rand = random.Random(hash(prompt) & 0xFFFFFFFF)
        opt_rand.shuffle(unique_opts)
        answer_index = unique_opts.index(correct)

        cleaned.append({
            'prompt': prompt,
            'options': unique_opts,
            'answerIndex': answer_index,
            'difficulty': difficulty_for(prompt, unique_opts),
        })

    rand.shuffle(cleaned)
    if len(cleaned) < MAX_PER_CATEGORY:
        raise SystemExit(f"Category {cat_id} only has {len(cleaned)} usable questions")
    selected = cleaned[:MAX_PER_CATEGORY]

    categories.append({
        'id': cat_id,
        'name': meta['name'],
        'description': meta['description'],
        'questions': selected,
    })

header = """export type TriviaDifficulty = 1 | 2 | 3;

export interface TriviaQuestion {
  prompt: string;
  options: string[];
  answerIndex: number;
  difficulty: TriviaDifficulty;
}

export interface TriviaCategory {
  id: string;
  name: string;
  description: string;
  questions: TriviaQuestion[];
}

"""

with OUT.open('w') as f:
    f.write("// Generated from OpenTriviaQA (CC BY-SA 4.0)\n")
    f.write(header)
    f.write('const CATEGORIES: TriviaCategory[] = [\n')
    for cat in categories:
        f.write('  {\n')
        f.write(f"    id: '{cat['id']}',\n")
        f.write(f"    name: '{cat['name']}',\n")
        f.write(f"    description: '{cat['description']}',\n")
        f.write('    questions: [\n')
        for q in cat['questions']:
            prompt = q['prompt'].replace('\\', '\\\\').replace("'", "\\'")
            f.write('      {\n')
            f.write(f"        prompt: '{prompt}',\n")
            f.write('        options: [\n')
            for opt in q['options']:
                opt_clean = opt.replace('\\', '\\\\').replace("'", "\\'")
                f.write(f"          '{opt_clean}',\n")
            f.write('        ],\n')
            f.write(f"        answerIndex: {q['answerIndex']},\n")
            f.write(f"        difficulty: {q['difficulty']},\n")
            f.write('      },\n')
        f.write('    ],\n')
        f.write('  },\n')
    f.write('];\n\n')

    f.write('const DAY_MS = 1000 * 60 * 60 * 24;\n')
    f.write('const DAILY_SEED = 773401;\n')
    f.write('const BANK_VERSION = 3;\n\n')

    f.write('function mulberry32(seed: number) {\n')
    f.write('  let t = seed + 0x6d2b79f5;\n')
    f.write('  return function () {\n')
    f.write('    t = Math.imul(t ^ (t >>> 15), t | 1);\n')
    f.write('    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);\n')
    f.write('    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;\n')
    f.write('  };\n')
    f.write('}\n\n')

    f.write('function seededShuffle<T>(arr: T[], rand: () => number): T[] {\n')
    f.write('  const copy = [...arr];\n')
    f.write('  for (let i = copy.length - 1; i > 0; i--) {\n')
    f.write('    const j = Math.floor(rand() * (i + 1));\n')
    f.write('    [copy[i], copy[j]] = [copy[j], copy[i]];\n')
    f.write('  }\n')
    f.write('  return copy;\n')
    f.write('}\n\n')

    f.write('function getLocalDayIndex(date: Date): number {\n')
    f.write('  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());\n')
    f.write('  return Math.floor(localMidnight.getTime() / DAY_MS);\n')
    f.write('}\n\n')

    f.write('function getDailySeed(date: Date): number {\n')
    f.write('  const y = date.getFullYear();\n')
    f.write('  const m = date.getMonth() + 1;\n')
    f.write('  const d = date.getDate();\n')
    f.write('  return y * 10000 + m * 100 + d;\n')
    f.write('}\n\n')

    f.write('function getCategorySlice(questions: TriviaQuestion[], date: Date): TriviaQuestion[] {\n')
    f.write('  const dayIndex = getLocalDayIndex(date);\n')
    f.write('  const cycle = Math.floor(questions.length / 8);\n')
    f.write('  const slot = dayIndex % cycle;\n')
    f.write('  const start = slot * 8;\n')
    f.write('  return questions.slice(start, start + 8);\n')
    f.write('}\n\n')

    f.write('export function getDailyTriviaCategories(date: Date = new Date()): TriviaCategory[] {\n')
    f.write('  const rand = mulberry32(getDailySeed(date) + DAILY_SEED + BANK_VERSION * 101);\n')
    f.write('  const shuffled = seededShuffle(CATEGORIES, rand);\n')
    f.write('  return shuffled.slice(0, 2);\n')
    f.write('}\n\n')

    f.write('export function getTriviaQuestions(categoryId: string, date: Date = new Date()): TriviaQuestion[] {\n')
    f.write('  const category = CATEGORIES.find((c) => c.id === categoryId);\n')
    f.write('  if (!category) return [];\n')
    f.write('  return getCategorySlice(category.questions, date);\n')
    f.write('}\n\n')

    f.write('export function getTriviaQuestionPools(\n')
    f.write('  categoryId: string,\n')
    f.write('  date: Date = new Date()\n')
    f.write('): Record<TriviaDifficulty, TriviaQuestion[]> {\n')
    f.write('  const category = CATEGORIES.find((c) => c.id === categoryId);\n')
    f.write('  if (!category) return { 1: [], 2: [], 3: [] };\n')
    f.write('  const slice = getCategorySlice(category.questions, date);\n')
    f.write('  const pools: Record<TriviaDifficulty, TriviaQuestion[]> = { 1: [], 2: [], 3: [] };\n')
    f.write('  for (const question of slice) {\n')
    f.write('    pools[question.difficulty].push(question);\n')
    f.write('  }\n')
    f.write('  return pools;\n')
    f.write('}\n\n')

    f.write('export function getTriviaCategory(id: string): TriviaCategory | undefined {\n')
    f.write('  return CATEGORIES.find((c) => c.id === id);\n')
    f.write('}\n\n')

    f.write('export default CATEGORIES;\n')

print('Wrote', OUT)
