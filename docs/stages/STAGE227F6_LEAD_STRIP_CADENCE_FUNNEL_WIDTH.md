# STAGE227F6 - Lead Strip Removal + Compact Cadence + Funnel Width

Status: local-only patch prepared.

Scope:
- remove LeadDetail Dzialania/Braki/Historia top shortcut strip after F5 visual check failed;
- keep LeadDetail hash cleanup for old URLs but do not render the shortcut row;
- compress Contact Cadence Grid on Leads and Clients into a direct pill strip without helper copy;
- widen SalesFunnel to shared full-width canvas, avoiding centered narrow max-width and scroll gutters.

Not touched: SQL, Supabase, missing item runtime persistence, finance, calendar.
