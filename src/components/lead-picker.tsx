import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { CancelActionIcon, SearchActionIcon } from './ui-system';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { matchesNormalizedQuery } from '../lib/search-normalization';

export type LeadPickerOption = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
};

type LeadPickerProps = {
  leads: LeadPickerOption[];
  selectedLeadId?: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (lead: LeadPickerOption | null) => void;
  label?: string;
  placeholder?: string;
  emptyLabel?: string;
};

export function LeadPicker({
  leads,
  selectedLeadId,
  query,
  onQueryChange,
  onSelect,
  label = 'Powiązany lead',
  placeholder = 'Wpisz imię, nazwisko, firmę, mail lub telefon',
  emptyLabel = 'Brak dopasowanych leadów',
}: LeadPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => matchesNormalizedQuery([lead.name, lead.company, lead.email, lead.phone], query))
      .slice(0, 8);
  }, [leads, query]);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) || null,
    [leads, selectedLeadId]
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <SearchActionIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 app-muted" />
        <Input
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 150);
          }}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {selectedLead ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-lg"
            onClick={() => {
              onSelect(null);
              onQueryChange('');
            }}
            aria-label="Usuń powiązanie z leadem"
          >
            <CancelActionIcon className="h-4 w-4" />
          </Button>
        ) : null}

        {isOpen ? (
          <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border bg-white p-1 shadow-xl">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => {
                const isSelected = lead.id === selectedLeadId;
                return (
                  <button
                    key={lead.id}
                    type="button"
                    className="flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onSelect(lead);
                      onQueryChange(lead.name);
                      setIsOpen(false);
                    }}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{lead.name}</div>
                      <div className="truncate text-xs text-slate-500">
                        {[lead.company, lead.email, lead.phone].filter(Boolean).join(' • ') || 'Bez dodatkowych danych'}
                      </div>
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
    </div>
  );
}
