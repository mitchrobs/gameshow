# Ballpark Content Bible

Ballpark is estimation trivia. A good question gives the player a sane first guess from a recognizable anchor, then makes the reveal feel fair, surprising, and worth talking about.

## Pack Shape

- Each pack has one clear theme, three core questions, and optional Friday or reserve Extra Innings.
- Each core pack needs at least one macro-scale question. The macro can be Q2 or Q3, but the day must widen by the end.
- The three core questions should use distinct moves: familiar anchor, physical estimate, iconic exact, production scale, object anatomy, or famous macro.
- Extra Innings must be harder because first guesses spread wider, not because the prompt is longer, fussier, or a Q3 multiplier.

## What Passes

- Named standards: `standard backyard swimming pool`, `full-size school bus`, `five-gallon bucket`, `major-league baseball`, `Olympic pool`.
- Famous-scale anchors: `Macy's fireworks`, `Times Square`, `Niagara Falls`, `U.S. Mint`, `Yellowstone`, `Library of Congress`.
- Iconic exact facts when they are recognizable and satisfying: `piano keys`, `baseball stitches`, `flag stars`, `golf ball dimples`, `standard deck cards`.
- Plain macro estimates tied naturally to the theme: annual visitors, famous event attendance, national production, natural distances, landmark capacity.

## What Fails

- Arbitrary containers: `fit in a rack`, `fit in a tub`, `fill a wall`, `cover a table`, unless the container is itself a recognizable standard.
- Generic throughput: `a busy shop can sell in one day`, `a major place can handle in one season`, unless the entity is famous and the fact is naturally guessable.
- Clue-contained math: prompts that hand the player two numbers and ask them to multiply.
- Artificial units: `viewer-minutes`, `rise-feet`, `passenger-miles`, `audience-seconds`.
- Vague macro: `major festival`, `big public event`, `large city system` without a named anchor.
- Internal reveal copy: references to players, the game, spreadsheets, audits, first guesses, or generated scaffolding.

## Answer Facts

- Format: `Answer: 12,345. Short factual sentence.`
- The sentence after the answer should usually be under 90 characters.
- Prefer plain facts over color commentary.
- Do not hide a weak question behind clever copy.

## Batch Gate

1. Write source-first prompts and answer notes.
2. Run resolved-output QA.
3. Rewrite until automated content blockers are zero.
4. Run the eight player-agent roles.
5. Only mark `launch_ready` when there are zero automated blockers and zero P1/P2 findings.

