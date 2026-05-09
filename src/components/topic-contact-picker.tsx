import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { CancelActionIcon, SearchActionIcon } from './ui-system';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { filterTopicContactOptions, type TopicContactOption } from '../lib/topic-contact';

type TopicContactPickerProps = {
  options: TopicContactOption[];
  selectedOption: TopicContactOption | null;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (option: TopicContactOption | null) => void;
  label?: string;
  placeholder?: string;
  emptyLabel?: string;
};

function getBadgeClass(type: TopicContactOption['type']) {
  if (type === 'case') return 'border-sky-200 bg-sky-50 text-sky-700';
  if (type === 'client') return 'border-amber-200 bg-amber-50 text-amber-700';
  return 'border-emerald-200 bg-emerald-50 text-emerald-700';
}

export function TopicContactPicker({
  options,
  selectedOption,
  query,
  onQueryChange,
  onSelect,
  label = 'Powiąż z tematem lub kontaktem',
  placeholder = 'Wpisz lead, klienta, sprawę, e-mail lub telefon',
  emptyLabel = 'Brak dopasowanych tematów lub kontaktów',
}: TopicContactPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => filterTopicContactOptions(options, query), [options, query]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <SearchActionIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {selectedOption ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-lg"
            onClick={() => {
              onSelect(null);
              onQueryChange('');
            }}
            aria-label="Usuń powiązanie"
          >
            <CancelActionIcon className="h-4 w-4" />
          </Button>
        ) : null}

        {isOpen ? (
          <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border bg-white p-1 shadow-xl">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedOption?.id === option.id;
                const isDisabled = Boolean(option.disabled);
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      isDisabled ? 'cursor-not-allowed opacity-70' : 'hover:bg-slate-50'
                    }`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      if (isDisabled) return;
                      onSelect(option);
                      onQueryChange(option.label);
                      setIsOpen(false);
                    }}
                    disabled={isDisabled}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900">{option.label}</span>
                        <span className={`inline-flex h-5 items-center rounded-full border px-2 text-[10px] font-semibold uppercase ${getBadgeClass(option.type)}`}>
                          {option.metaLabel}
                        </span>
                      </div>
                      <div className="mt-1 truncate text-xs text-slate-500">{option.subLabel}</div>
                      <div className="mt-1 text-[11px] text-slate-400">{option.resolutionLabel}</div>
                    </div>
                    {isSelected ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : null}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-slate-500">{emptyLabel}</div>
            )}
          </div>
        ) : null}
      </div>
      {selectedOption ? (
        <p className="text-xs text-slate-500">{selectedOption.resolutionLabel}</p>
      ) : null}
    </div>
  );
}
