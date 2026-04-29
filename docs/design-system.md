# MindDiary Design System

## Tokens

- **Colors** are defined in `styles/tokens.css` (`--color-*`).
- **Radii**: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill`.
- **Spacing**: `--space-1`..`--space-16`.
- **Shadows**: `--shadow-card`, `--shadow-card-hover`, `--shadow-modal`.
- **Typography**: `--fs-*`, `--fw-*`, `--lh-*`.
- **Motion**: `--ease-standard`, `--duration-fast`, `--duration-base`.

## Primitives (`components/ui`)

- **Button**: brand pill action button with variants and sizes.  
  Example: `<Button variant="primary" size="md">Новая запись</Button>`

- **Card**: consistent surface container for sections/cards.  
  Example: `<Card tone="default" padding="md">...</Card>`

- **Input**: single-line text input with unified border/focus ring.  
  Example: `<Input placeholder="PIN" />`

- **Textarea**: multiline input with unified border/focus ring.  
  Example: `<Textarea placeholder="Опишите день..." />`

- **Select**: styled select control.  
  Example: `<Select><option>...</option></Select>`

- **Slider**: accessible custom slider for numeric ranges.  
  Example: `<Slider value={3} min={1} max={5} onChange={setValue} />`

- **Chip**: neutral/primary/muted info chips.  
  Example: `<Chip tone="primary">Быстрое действие</Chip>`

- **Tag**: pill labels for entry tags/mood meta.  
  Example: `<Tag tone="primary-soft">Размышления</Tag>`

- **NavPill**: top navigation route pill with active state.  
  Example: `<NavPill href="/diary" active>Дневник</NavPill>`

## Preview

- Dev showcase route: `/dev/ui`
