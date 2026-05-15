# Right rail Import Doctor Stage 4 V13

- Rebuilt import headers for Leads.tsx and Clients.tsx from trusted module ownership.
- Kept guards active instead of deleting tests.
- Stale clients lead-linking rail markers are scanned without keeping exact forbidden strings inside guards.
- package.json is parsed with UTF-8 BOM stripped before JSON.parse.
- No commit or push is performed by this package.
