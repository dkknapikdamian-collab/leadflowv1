import { type ComponentType } from 'react';
import { Building2, Copy, Mail, Phone } from 'lucide-react';
import { EventEntityIcon } from './ui-system';
import '../styles/entity-contact-card.css';

type ContactIcon = ComponentType<{ className?: string }>;

type EntityContactInfoListProps = {
  phone?: string | null;
  email?: string | null;
  company?: string | null;
  lastContact?: string | null;
  onCopy?: (label: string, value: string) => void | Promise<void>;
};

type EntityContactCardProps = EntityContactInfoListProps & {
  entity: 'client' | 'lead';
  name: string;
  subtitle: string;
  initialsSource?: string;
  note?: string | null;
  className?: string;
  dataStage?: string;
};

function asDisplayValue(value?: string | null, fallback = '-') {
  const clean = String(value || '').trim();
  return clean || fallback;
}

function canCopy(value: string) {
  const clean = String(value || '').trim();
  return Boolean(clean && clean !== '-' && clean.toLowerCase() !== 'brak firmy');
}

function getInitials(value: string, fallback: string) {
  const initials = String(value || fallback)
    .split(/s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return initials || fallback;
}

function EntityContactInfoRow({
  icon: Icon,
  label,
  value,
  onCopy,
}: {
  icon: ContactIcon;
  label: string;
  value: string;
  onCopy?: (label: string, value: string) => void | Promise<void>;
}) {
  const copyLabel = label === 'Telefon' ? 'Kopiuj telefon' : label === 'E-mail' ? 'Kopiuj email' : `Kopiuj ${label}`;
  return (
    <div className="client-detail-info-row cf-entity-contact-info-row">
      <span className="client-detail-info-icon cf-entity-contact-info-icon">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <small>{label}</small>
        <strong>{value || '-'}</strong>
      </span>
      {onCopy && canCopy(value) ? (
        <button
          type="button"
          className="client-detail-icon-button cf-entity-contact-copy-button"
          onClick={() => onCopy(label, value)}
          aria-label={copyLabel}
          title={copyLabel}
        >
          <Copy className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export function EntityContactInfoList({ phone, email, company, lastContact, onCopy }: EntityContactInfoListProps) {
  return (
    <div className="client-detail-contact-list cf-entity-contact-list" data-entity-contact-info-list="true">
      <EntityContactInfoRow icon={Phone} label="Telefon" value={asDisplayValue(phone)} onCopy={onCopy} />
      <EntityContactInfoRow icon={Mail} label="E-mail" value={asDisplayValue(email)} onCopy={onCopy} />
      <EntityContactInfoRow icon={Building2} label="Firma" value={asDisplayValue(company, 'Brak firmy')} />
      <EntityContactInfoRow icon={EventEntityIcon} label="Ostatni kontakt" value={asDisplayValue(lastContact)} />
    </div>
  );
}

export default function EntityContactCard({
  entity,
  name,
  subtitle,
  initialsSource,
  phone,
  email,
  company,
  lastContact,
  note,
  onCopy,
  className,
  dataStage,
}: EntityContactCardProps) {
  const fallbackInitial = entity === 'client' ? 'K' : 'L';
  const cleanNote = String(note || '').trim();

  return (
    <section
      className={['client-detail-profile-card', 'client-detail-side-card', 'cf-entity-contact-card', className].filter(Boolean).join(' ')}
      data-entity-contact-card={entity}
      data-stage={dataStage}
    >
      <div className="client-detail-avatar-row cf-entity-contact-avatar-row">
        <div className="client-detail-avatar cf-entity-contact-avatar">{getInitials(initialsSource || name, fallbackInitial)}</div>
        <div>
          <h2>{name}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <EntityContactInfoList
        phone={phone}
        email={email}
        company={company}
        lastContact={lastContact}
        onCopy={onCopy}
      />

      {cleanNote ? (
        <div className="cf-entity-contact-note" data-entity-contact-note="true">
          <small>Notatka</small>
          <p lang="pl-PL">{cleanNote}</p>
        </div>
      ) : null}
    </section>
  );
}
