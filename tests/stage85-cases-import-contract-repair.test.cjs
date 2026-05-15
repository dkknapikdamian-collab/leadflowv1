const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Cases.tsx keeps canonical import lines required by quiet release gate', () => {
  const repo = path.resolve(__dirname, '..');
  const source = fs.readFileSync(path.join(repo, 'src', 'pages', 'Cases.tsx'), 'utf8').replace(/^\uFEFF/, '');
  const required = [
    "import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';",
    "import { Link, useSearchParams } from 'react-router-dom';",
    "import { AlertTriangle, CheckCircle2, ChevronRight, Clock, ExternalLink, FileText, Loader2, Plus, Search, Trash2, X } from 'lucide-react';",
    "import { format } from 'date-fns';",
    "import { pl } from 'date-fns/locale';",
    "import { EntityIcon } from '../components/ui-system/EntityIcon';",
  ];
  for (const line of required) {
    assert.ok(source.includes(line), 'Missing canonical import line: ' + line);
  }
});
