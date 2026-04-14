import test from "node:test"
import assert from "node:assert/strict"
import { createDemoSnapshot } from "../lib/seed"
import { applyAppDataAction } from "../lib/data/actions"

test("toggleItemDone chowa zakonczony task z aktywnej listy", () => {
  const snapshot = createDemoSnapshot()
  const task = snapshot.items.find((item) => item.recordType === "task" && item.showInTasks)!

  const doneSnapshot = applyAppDataAction(snapshot, {
    type: "toggleItemDone",
    itemId: task.id,
  })

  const doneTask = doneSnapshot.items.find((item) => item.id === task.id)!
  assert.equal(doneTask.status, "done")
  assert.equal(doneTask.showInTasks, false)
})

test("toggleItemDone przy przywroceniu znow pokazuje task na aktywnej liscie", () => {
  const snapshot = createDemoSnapshot()
  const task = snapshot.items.find((item) => item.recordType === "task" && item.showInTasks)!

  const doneSnapshot = applyAppDataAction(snapshot, {
    type: "toggleItemDone",
    itemId: task.id,
  })
  const restoredSnapshot = applyAppDataAction(doneSnapshot, {
    type: "toggleItemDone",
    itemId: task.id,
  })

  const restoredTask = restoredSnapshot.items.find((item) => item.id === task.id)!
  assert.equal(restoredTask.status, "todo")
  assert.equal(restoredTask.showInTasks, true)
})
