# ETAP 0 - HARD RULES

## Core rules
- one email = one user account
- Google is only a login method
- access must depend on database state, not on Google itself
- source of truth = online database
- localStorage can be only cache / draft / helper backup
- every business record must belong to workspace
- access status must be centralized
- critical operations must be idempotent
- do not reveal publicly whether email already exists
- every new user gets 1 workspace
- data is not deleted immediately after trial or payment end
- referral and promo limits must be enforced in database/backend

## Email normalization
Before every save and compare:
- trim
- lowercase
- format validation

## Centralization
- one central place for access decisions
- one central place for billing and webhooks
- one central place for system emails
- one central place for promo / affiliate validation

## Honest status
These rules are now committed as architectural contract.
They are not all active in runtime yet, because full auth + online data + billing are implemented in later stages.
