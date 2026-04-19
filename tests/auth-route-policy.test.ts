import test from "node:test"
import assert from "node:assert/strict"
import { shouldReturnNeutralEmailActionSuccess } from "../lib/auth/supabase-errors"

test("shouldReturnNeutralEmailActionSuccess ukrywa błąd istniejącego konta", () => {
  assert.equal(shouldReturnNeutralEmailActionSuccess(400, "User already registered"), true)
})

test("shouldReturnNeutralEmailActionSuccess ukrywa błąd braku użytkownika przy akcjach mailowych", () => {
  assert.equal(shouldReturnNeutralEmailActionSuccess(404, "User not found"), true)
})

test("shouldReturnNeutralEmailActionSuccess nie ukrywa błędów serwera", () => {
  assert.equal(shouldReturnNeutralEmailActionSuccess(500, "Internal server error"), false)
})

test("shouldReturnNeutralEmailActionSuccess nie ukrywa rate limitów", () => {
  assert.equal(shouldReturnNeutralEmailActionSuccess(429, "Too many requests"), false)
})
